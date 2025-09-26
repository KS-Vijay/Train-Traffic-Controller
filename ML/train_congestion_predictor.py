import numpy as np
import pandas as pd
import json
import requests
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import GridSearchCV
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
import joblib
import warnings
warnings.filterwarnings('ignore')

class TrainCongestionPredictor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.model = None
        self.is_trained = False
        self.feature_names = []
        
    def fetch_simulated_data(self, num_samples=10000):
        """Generate realistic train data based on our simulation"""
        np.random.seed(42)
        
        # Station coordinates for Howrah section (200km radius)
        stations = {
            'HWH': {'lat': 22.583, 'lon': 88.342, 'type': 'major'},
            'SDAH': {'lat': 22.576, 'lon': 88.363, 'type': 'major'},
            'SHM': {'lat': 22.543, 'lon': 88.319, 'type': 'yard'},
            'SRC': {'lat': 22.492, 'lon': 88.314, 'type': 'yard'},
            'BWN': {'lat': 23.232, 'lon': 87.861, 'type': 'junction'},
            'BDC': {'lat': 22.664, 'lon': 88.171, 'type': 'junction'},
            'NH': {'lat': 22.894, 'lon': 88.427, 'type': 'suburban'},
            'DKAE': {'lat': 22.680, 'lon': 88.300, 'type': 'freight'},
            'KGP': {'lat': 22.339, 'lon': 87.325, 'type': 'major'}
        }
        
        data = []
        
        for i in range(num_samples):
            # Train characteristics
            train_id = f"T{np.random.randint(10000, 99999)}"
            category = np.random.choice(['passenger', 'express', 'vande', 'freight'], 
                                      p=[0.4, 0.3, 0.1, 0.2])
            
            # Speed based on category
            if category == 'freight':
                speed = np.random.normal(35, 10)
            elif category == 'vande':
                speed = np.random.normal(85, 15)
            elif category == 'express':
                speed = np.random.normal(65, 12)
            else:  # passenger
                speed = np.random.normal(45, 10)
            
            speed = max(0, min(130, speed))  # Clamp speed
            
            # Station selection
            station = np.random.choice(list(stations.keys()))
            station_info = stations[station]
            
            # Distance calculations
            distance_to_next = np.random.exponential(5000)  # Exponential distribution for realistic distances
            distance_to_destination = np.random.exponential(25000)
            
            # Occupancy (number of trains in section)
            if station_info['type'] == 'major':
                occupancy = np.random.poisson(2.5)  # Higher occupancy at major stations
            elif station_info['type'] == 'junction':
                occupancy = np.random.poisson(2.0)
            else:
                occupancy = np.random.poisson(1.0)
            
            occupancy = min(occupancy, 5)  # Max 5 trains in section
            
            # Signal status (0=Red, 1=Yellow, 2=Green)
            signal_status = np.random.choice([0, 1, 2], p=[0.15, 0.25, 0.6])
            
            # Delay calculation (realistic based on multiple factors)
            base_delay = 0
            if speed < 30:
                base_delay += np.random.exponential(10)
            if occupancy >= 3:
                base_delay += np.random.exponential(8)
            if signal_status == 0:
                base_delay += np.random.exponential(5)
            if category == 'freight':
                base_delay += np.random.exponential(3)
            
            delay = max(0, base_delay + np.random.normal(0, 2))
            
            # Time to clear section
            time_to_clear = distance_to_next / (speed + 1) if speed > 0 else 999
            
            # Congestion label (realistic rules)
            congestion = 0
            if (occupancy >= 3 or 
                speed < 25 or 
                signal_status == 0 or 
                delay > 20 or
                time_to_clear > 300):  # More than 5 minutes to clear
                congestion = 1
            
            # Additional features
            hour_of_day = np.random.randint(0, 24)
            day_of_week = np.random.randint(0, 7)
            
            # Peak hour congestion
            if hour_of_day in [7, 8, 9, 17, 18, 19]:  # Peak hours
                if np.random.random() < 0.3:  # 30% chance of additional congestion
                    congestion = 1
            
            data.append({
                'train_id': train_id,
                'category': category,
                'station': station,
                'station_type': station_info['type'],
                'speed': speed,
                'occupancy': occupancy,
                'signal_status': signal_status,
                'delay': delay,
                'distance_to_next': distance_to_next,
                'distance_to_destination': distance_to_destination,
                'time_to_clear': time_to_clear,
                'hour_of_day': hour_of_day,
                'day_of_week': day_of_week,
                'congestion': congestion,
                'lat': station_info['lat'] + np.random.normal(0, 0.01),
                'lon': station_info['lon'] + np.random.normal(0, 0.01)
            })
        
        return pd.DataFrame(data)
    
    def prepare_features(self, df):
        """Prepare features for ML model"""
        # Encode categorical variables
        df_encoded = df.copy()
        df_encoded['category_encoded'] = self.label_encoder.fit_transform(df_encoded['category'])
        
        # Handle missing station_type column
        if 'station_type' not in df_encoded.columns:
            df_encoded['station_type'] = 'major'  # Default station type
        df_encoded['station_type_encoded'] = pd.Categorical(df_encoded['station_type']).codes
        
        # Feature engineering
        df_encoded['speed_occupancy_ratio'] = df_encoded['speed'] / (df_encoded['occupancy'] + 1)
        df_encoded['delay_speed_ratio'] = df_encoded['delay'] / (df_encoded['speed'] + 1)
        df_encoded['is_peak_hour'] = df_encoded['hour_of_day'].isin([7, 8, 9, 17, 18, 19]).astype(int)
        df_encoded['is_weekend'] = df_encoded['day_of_week'].isin([5, 6]).astype(int)
        
        # Select features
        feature_columns = [
            'speed', 'occupancy', 'signal_status', 'delay', 'time_to_clear',
            'distance_to_next', 'distance_to_destination', 'hour_of_day', 'day_of_week',
            'category_encoded', 'station_type_encoded', 'speed_occupancy_ratio',
            'delay_speed_ratio', 'is_peak_hour', 'is_weekend'
        ]
        
        self.feature_names = feature_columns
        return df_encoded[feature_columns], df_encoded['congestion']
    
    def train_model(self, df=None):
        """Train the congestion prediction model"""
        if df is None:
            print("Generating simulated data...")
            df = self.fetch_simulated_data(15000)
        
        print(f"Training with {len(df)} samples")
        print(f"Congestion distribution: {df['congestion'].value_counts().to_dict()}")
        
        # Prepare features
        X, y = self.prepare_features(df)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train multiple models and select best
        models = {
            'Random Forest': RandomForestClassifier(
                n_estimators=100, 
                max_depth=10, 
                min_samples_split=5,
                random_state=42
            ),
            'Gradient Boosting': GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=6,
                random_state=42
            )
        }
        
        best_model = None
        best_score = 0
        best_name = ""
        
        for name, model in models.items():
            # Cross-validation
            cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='accuracy')
            mean_score = cv_scores.mean()
            
            print(f"{name} - CV Accuracy: {mean_score:.4f} (+/- {cv_scores.std() * 2:.4f})")
            
            if mean_score > best_score:
                best_score = mean_score
                best_model = model
                best_name = name
        
        # Train best model
        print(f"\nTraining best model: {best_name}")
        best_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = best_model.predict(X_test_scaled)
        accuracy = accuracy_score(y_test, y_pred)
        
        print(f"\nTest Accuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Check for overfitting
        train_pred = best_model.predict(X_train_scaled)
        train_accuracy = accuracy_score(y_train, train_pred)
        
        print(f"\nTrain Accuracy: {train_accuracy:.4f}")
        print(f"Overfitting Check: {train_accuracy - accuracy:.4f}")
        
        if train_accuracy - accuracy > 0.1:
            print("⚠️  Warning: Model might be overfitting!")
        elif accuracy < 0.7:
            print("⚠️  Warning: Model might be underfitting!")
        else:
            print("✅ Model performance looks good!")
        
        self.model = best_model
        self.is_trained = True
        
        return best_model, accuracy
    
    def predict_congestion(self, train_data):
        """Predict congestion for given train data"""
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        
        # Prepare features
        X, _ = self.prepare_features(train_data)
        X_scaled = self.scaler.transform(X)
        
        # Predict
        predictions = self.model.predict(X_scaled)
        probabilities = self.model.predict_proba(X_scaled)[:, 1]  # Probability of congestion
        
        return predictions, probabilities
    
    def save_model(self, filepath='ML/trained_congestion_model.pkl'):
        """Save the trained model"""
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'label_encoder': self.label_encoder,
            'feature_names': self.feature_names,
            'is_trained': self.is_trained
        }
        
        joblib.dump(model_data, filepath)
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath='ML/trained_congestion_model.pkl'):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.label_encoder = model_data['label_encoder']
        self.feature_names = model_data['feature_names']
        self.is_trained = model_data['is_trained']
        
        print(f"Model loaded from {filepath}")
        return self
    
    def load_trained_model(self, filepath='ML/trained_congestion_model.pkl'):
        """Alias for load_model for backward compatibility"""
        return self.load_model(filepath)

class CongestionOptimizer:
    """Optimization algorithms for congestion management"""
    
    def __init__(self, predictor):
        self.predictor = predictor
    
    def suggest_actions(self, train_data, congestion_predictions):
        """Suggest optimization actions based on congestion predictions"""
        suggestions = []
        
        for i, (_, train) in enumerate(train_data.iterrows()):
            if i < len(congestion_predictions) and congestion_predictions[i] == 1:  # Congestion predicted
                suggestion = self._get_optimization_suggestion(train)
                suggestions.append({
                    'train_id': train.get('id', train.get('number', f'TRAIN_{i}')),
                    'action': suggestion['action'],
                    'priority': suggestion['priority'],
                    'expected_improvement': suggestion['improvement'],
                    'reason': suggestion['reason']
                })
        
        return suggestions
    
    def _get_optimization_suggestion(self, train):
        """Get specific optimization suggestion for a train"""
        suggestions = []
        
        # Speed-based suggestions
        if train.speed < 30:
            suggestions.append({
                'action': 'increase_speed',
                'priority': 'high',
                'improvement': 0.3,
                'reason': 'Low speed causing congestion'
            })
        
        # Occupancy-based suggestions
        if train.occupancy >= 3:
            suggestions.append({
                'action': 'reroute',
                'priority': 'high',
                'improvement': 0.4,
                'reason': 'High occupancy in section'
            })
        
        # Signal-based suggestions
        if train.signal_status == 0:
            suggestions.append({
                'action': 'wait',
                'priority': 'medium',
                'improvement': 0.2,
                'reason': 'Red signal ahead'
            })
        
        # Delay-based suggestions
        if train.delay > 20:
            suggestions.append({
                'action': 'express_priority',
                'priority': 'high',
                'improvement': 0.35,
                'reason': 'High delay affecting schedule'
            })
        
        # Peak hour suggestions
        if train.hour_of_day in [7, 8, 9, 17, 18, 19]:
            suggestions.append({
                'action': 'schedule_adjustment',
                'priority': 'medium',
                'improvement': 0.25,
                'reason': 'Peak hour congestion'
            })
        
        # Return highest priority suggestion
        if suggestions:
            return max(suggestions, key=lambda x: x['priority'])
        else:
            return {
                'action': 'monitor',
                'priority': 'low',
                'improvement': 0.1,
                'reason': 'Continue monitoring'
            }

def main():
    """Main function to train and test the model"""
    print("🚂 Train Congestion Predictor & Optimizer")
    print("=" * 50)
    
    # Initialize predictor
    predictor = TrainCongestionPredictor()
    
    # Train model
    print("\n📊 Training Model...")
    model, accuracy = predictor.train_model()
    
    # Save model
    print("\n💾 Saving Model...")
    predictor.save_model()
    
    # Test with sample data
    print("\n🧪 Testing with Sample Data...")
    test_data = predictor.fetch_simulated_data(100)
    predictions, probabilities = predictor.predict_congestion(test_data)
    
    print(f"Sample predictions: {predictions[:10]}")
    print(f"Sample probabilities: {probabilities[:10]}")
    
    # Initialize optimizer
    optimizer = CongestionOptimizer(predictor)
    
    # Get optimization suggestions
    print("\n🎯 Optimization Suggestions...")
    suggestions = optimizer.suggest_actions(test_data, predictions)
    
    for suggestion in suggestions[:5]:  # Show first 5 suggestions
        print(f"Train {suggestion['train_id']}: {suggestion['action']} "
              f"(Priority: {suggestion['priority']}, "
              f"Improvement: {suggestion['expected_improvement']:.2f})")
    
    print("\n✅ Model training and optimization complete!")
    print(f"Final accuracy: {accuracy:.4f}")

if __name__ == "__main__":
    main()
