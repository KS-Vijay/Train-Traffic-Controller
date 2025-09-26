#!/usr/bin/env python3
"""
Simplified ML integration for the backend server
"""

import sys
import os
import json
import numpy as np
import pandas as pd
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_congestion_predictor import TrainCongestionPredictor, CongestionOptimizer

def main():
    """Main function for ML prediction"""
    try:
        # Load trained model
        predictor = TrainCongestionPredictor()
        predictor.load_trained_model('trained_congestion_model.pkl')
        
        # Read train data from stdin
        train_data_json = sys.stdin.read()
        if not train_data_json.strip():
            print(json.dumps({"error": "No train data provided"}))
            return
        
        trains = json.loads(train_data_json)
        if not trains:
            print(json.dumps({"error": "Empty train data"}))
            return
        
        # Convert to DataFrame and add missing columns
        df = pd.DataFrame(trains)
        
        # Add missing columns that the ML model expects
        if 'station' not in df.columns:
            df['station'] = 'HWH'  # Default station
        if 'station_type' not in df.columns:
            df['station_type'] = 'major'  # Default station type
        if 'occupancy' not in df.columns:
            df['occupancy'] = np.random.randint(0, 4, len(df))  # Random occupancy
        if 'signal_status' not in df.columns:
            df['signal_status'] = np.random.choice([0, 1, 2], len(df))  # Random signal status
        if 'distance_to_next' not in df.columns:
            df['distance_to_next'] = np.random.exponential(5000, len(df))  # Random distance
        if 'distance_to_destination' not in df.columns:
            df['distance_to_destination'] = np.random.exponential(25000, len(df))  # Random distance
        if 'time_to_clear' not in df.columns:
            df['time_to_clear'] = df['distance_to_next'] / (df['speed'] + 1)  # Calculate time to clear
        if 'hour_of_day' not in df.columns:
            df['hour_of_day'] = np.random.randint(0, 24, len(df))  # Random hour
        if 'day_of_week' not in df.columns:
            df['day_of_week'] = np.random.randint(0, 7, len(df))  # Random day
        
        # Add required columns for ML model
        df['congestion'] = 0  # Placeholder for prepare_features
        
        # Predict congestion
        predictions, probabilities = predictor.predict_congestion(df)
        
        # Get optimization suggestions
        optimizer = CongestionOptimizer(predictor)
        suggestions = optimizer.suggest_actions(df, predictions)
        
        # Prepare results
        results = {
            'timestamp': pd.Timestamp.now().isoformat(),
            'total_trains': len(trains),
            'congestion_predictions': predictions.tolist(),
            'congestion_probabilities': probabilities.tolist(),
            'congestion_rate': float(np.mean(predictions)),
            'congested_trains': int(np.sum(predictions)),
            'high_risk_trains': [],
            'optimization_suggestions': suggestions[:10],  # Top 10 suggestions
            'summary': {
                'total_trains': len(trains),
                'congested_trains': int(np.sum(predictions)),
                'congestion_rate': f"{np.mean(predictions) * 100:.1f}%",
                'top_action': suggestions[0]['action'] if suggestions else 'monitor',
                'average_risk': float(np.mean(probabilities))
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
        
        # Output results as JSON
        print(json.dumps(results))
        
    except Exception as e:
        error_result = {
            'error': 'ML prediction failed',
            'details': str(e),
            'timestamp': pd.Timestamp.now().isoformat()
        }
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()
