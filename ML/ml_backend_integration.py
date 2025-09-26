import json
import requests
import numpy as np
import pandas as pd
from train_congestion_predictor import TrainCongestionPredictor, CongestionOptimizer
import time
import threading
from datetime import datetime

class MLBackendIntegration:
    """Integrates ML model with the train simulation backend"""
    
    def __init__(self, backend_url="http://localhost:5055"):
        self.backend_url = backend_url
        self.predictor = None
        self.optimizer = None
        self.is_running = False
        
    def load_trained_model(self, model_path="trained_congestion_model.pkl"):
        """Load the pre-trained model"""
        try:
            self.predictor = TrainCongestionPredictor().load_model(model_path)
            self.optimizer = CongestionOptimizer(self.predictor)
            print("✅ ML model loaded successfully")
            return True
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            return False
    
    def fetch_live_trains(self):
        """Fetch live train data from backend"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                trains = data.get('trains', [])
                
                # Handle case where trains might be an integer (count) instead of list
                if isinstance(trains, int):
                    print(f"⚠️  Backend returned train count ({trains}) instead of train data")
                    # Generate sample train data for testing
                    return self._generate_sample_trains(trains)
                
                return trains
            return []
        except Exception as e:
            print(f"❌ Error fetching train data: {e}")
            return []
    
    def _generate_sample_trains(self, count):
        """Generate sample train data for testing when backend doesn't provide full data"""
        import random
        
        sample_trains = []
        categories = ['passenger', 'express', 'vande', 'freight']
        stations = ['HWH', 'SDAH', 'SHM', 'SRC', 'BWN', 'BDC', 'NH', 'DKAE', 'KGP']
        
        for i in range(min(count, 50)):  # Limit to 50 trains max
            category = random.choice(categories)
            
            # Speed based on category
            if category == 'freight':
                speed = random.uniform(20, 55)
            elif category == 'vande':
                speed = random.uniform(60, 110)
            elif category == 'express':
                speed = random.uniform(45, 90)
            else:  # passenger
                speed = random.uniform(20, 60)
            
            train = {
                'id': f'T{random.randint(10000, 99999)}',
                'number': f'T{random.randint(10000, 99999)}',
                'name': f'{category.title()} Train {i+1}',
                'category': category,
                'speed': speed,
                'delay': random.randint(0, 30),
                'lat': random.uniform(20.78, 24.38),  # Howrah section bounds
                'lon': random.uniform(86.41, 90.29),
                'from': random.choice(stations),
                'to': random.choice(stations),
                'status': 'Running'
            }
            sample_trains.append(train)
        
        return sample_trains
    
    def convert_to_ml_format(self, trains):
        """Convert backend train data to ML model format"""
        if not trains:
            return pd.DataFrame()
        
        ml_data = []
        for train in trains:
            # Calculate additional features
            occupancy = self._estimate_occupancy(train)
            signal_status = self._estimate_signal_status(train)
            distance_to_next = self._estimate_distance_to_next(train)
            distance_to_destination = self._estimate_distance_to_destination(train)
            time_to_clear = distance_to_next / (train.get('speed', 1) + 1)
            
            ml_data.append({
                'train_id': train.get('id', train.get('number', 'UNKNOWN')),
                'category': train.get('category', 'passenger'),
                'station': self._get_nearest_station(train),
                'station_type': 'major',  # Simplified for now
                'speed': train.get('speed', 0),
                'occupancy': occupancy,
                'signal_status': signal_status,
                'delay': train.get('delay', 0),
                'distance_to_next': distance_to_next,
                'distance_to_destination': distance_to_destination,
                'time_to_clear': time_to_clear,
                'hour_of_day': datetime.now().hour,
                'day_of_week': datetime.now().weekday(),
                'lat': train.get('lat', 0),
                'lon': train.get('lon', 0)
            })
        
        return pd.DataFrame(ml_data)
    
    def _estimate_occupancy(self, train):
        """Estimate section occupancy based on train data"""
        # Simplified estimation - in real implementation, this would be more sophisticated
        speed = train.get('speed', 0)
        delay = train.get('delay', 0)
        
        if speed < 20:
            return 3  # High occupancy
        elif speed < 40:
            return 2  # Medium occupancy
        else:
            return 1  # Low occupancy
    
    def _estimate_signal_status(self, train):
        """Estimate signal status based on train data"""
        speed = train.get('speed', 0)
        delay = train.get('delay', 0)
        
        if speed < 10 or delay > 20:
            return 0  # Red signal
        elif speed < 30 or delay > 10:
            return 1  # Yellow signal
        else:
            return 2  # Green signal
    
    def _estimate_distance_to_next(self, train):
        """Estimate distance to next station"""
        # Simplified estimation
        speed = train.get('speed', 0)
        if speed > 0:
            return np.random.exponential(5000)  # Random realistic distance
        return 10000  # Large distance if stopped
    
    def _estimate_distance_to_destination(self, train):
        """Estimate distance to final destination"""
        return np.random.exponential(25000)  # Random realistic distance
    
    def _get_nearest_station(self, train):
        """Get nearest station code"""
        # Simplified - return a random station
        stations = ['HWH', 'SDAH', 'SHM', 'SRC', 'BWN', 'BDC', 'NH', 'DKAE', 'KGP']
        return np.random.choice(stations)
    
    def predict_and_optimize(self):
        """Main prediction and optimization loop"""
        if not self.predictor or not self.optimizer:
            print("❌ Model not loaded")
            return None
        
        # Fetch live train data
        trains = self.fetch_live_trains()
        if not trains:
            print("⚠️  No train data available, generating sample data for testing...")
            trains = self._generate_sample_trains(20)  # Generate 20 sample trains
        
        # Convert to ML format
        ml_data = self.convert_to_ml_format(trains)
        if ml_data.empty:
            print("⚠️  No valid train data for prediction")
            return None
        
        # Predict congestion
        predictions, probabilities = self.predictor.predict_congestion(ml_data)
        
        # Get optimization suggestions
        suggestions = self.optimizer.suggest_actions(ml_data, predictions)
        
        # Prepare results
        results = {
            'timestamp': datetime.now().isoformat(),
            'total_trains': len(trains),
            'congestion_predictions': int(np.sum(predictions)),
            'congestion_rate': float(np.mean(predictions)),
            'high_risk_trains': [],
            'optimization_suggestions': suggestions[:10],  # Top 10 suggestions
            'summary': {
                'total_trains': len(trains),
                'congested_trains': int(np.sum(predictions)),
                'congestion_rate': f"{np.mean(predictions) * 100:.1f}%",
                'top_action': suggestions[0]['action'] if suggestions else 'monitor'
            }
        }
        
        # Identify high-risk trains
        for i, (train, pred, prob) in enumerate(zip(trains, predictions, probabilities)):
            if pred == 1 and prob > 0.7:  # High probability of congestion
                results['high_risk_trains'].append({
                    'train_id': train.get('id', train.get('number', 'UNKNOWN')),
                    'name': train.get('name', 'Unknown'),
                    'category': train.get('category', 'passenger'),
                    'speed': train.get('speed', 0),
                    'delay': train.get('delay', 0),
                    'congestion_probability': float(prob),
                    'location': {
                        'lat': train.get('lat', 0),
                        'lon': train.get('lon', 0)
                    }
                })
        
        return results
    
    def start_monitoring(self, interval=30):
        """Start continuous monitoring"""
        if not self.predictor:
            print("❌ Model not loaded. Please load model first.")
            return
        
        self.is_running = True
        print(f"🚀 Starting ML monitoring (interval: {interval}s)")
        
        def monitor_loop():
            while self.is_running:
                try:
                    results = self.predict_and_optimize()
                    if results:
                        self._log_results(results)
                        self._send_to_frontend(results)
                except Exception as e:
                    print(f"❌ Monitoring error: {e}")
                
                time.sleep(interval)
        
        # Start monitoring in separate thread
        monitor_thread = threading.Thread(target=monitor_loop, daemon=True)
        monitor_thread.start()
    
    def stop_monitoring(self):
        """Stop continuous monitoring"""
        self.is_running = False
        print("🛑 ML monitoring stopped")
    
    def _log_results(self, results):
        """Log results to console"""
        print(f"\n📊 ML Analysis Results ({results['timestamp']})")
        print(f"Total Trains: {results['summary']['total_trains']}")
        print(f"Congested Trains: {results['summary']['congested_trains']}")
        print(f"Congestion Rate: {results['summary']['congestion_rate']}")
        print(f"Recommended Action: {results['summary']['top_action']}")
        
        if results['high_risk_trains']:
            print(f"\n🚨 High Risk Trains ({len(results['high_risk_trains'])}):")
            for train in results['high_risk_trains'][:3]:  # Show top 3
                print(f"  • {train['train_id']} ({train['name']}) - "
                      f"Risk: {train['congestion_probability']:.2f}")
    
    def _send_to_frontend(self, results):
        """Send results to frontend (placeholder for WebSocket integration)"""
        # This would integrate with your WebSocket server
        # For now, just log the results
        pass

def main():
    """Main function for ML backend integration"""
    print("🤖 ML Backend Integration")
    print("=" * 40)
    
    # Initialize integration
    ml_integration = MLBackendIntegration()
    
    # Load trained model
    if not ml_integration.load_trained_model():
        print("❌ Failed to load model. Please train the model first.")
        return
    
    # Test prediction
    print("\n🧪 Testing prediction...")
    results = ml_integration.predict_and_optimize()
    
    if results:
        print("✅ Prediction successful!")
        print(f"Results: {json.dumps(results['summary'], indent=2)}")
    else:
        print("❌ Prediction failed")
    
    # Start monitoring (optional)
    print("\n🚀 Starting continuous monitoring...")
    print("Press Ctrl+C to stop")
    
    try:
        ml_integration.start_monitoring(interval=30)
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        ml_integration.stop_monitoring()
        print("\n👋 ML monitoring stopped")

if __name__ == "__main__":
    main()
