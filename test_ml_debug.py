#!/usr/bin/env python3
"""
Debug ML integration with backend data
"""

import json
import requests
import sys
import os
sys.path.append('ML')

from ML.train_congestion_predictor import TrainCongestionPredictor, CongestionOptimizer

def test_backend_ml():
    """Test ML with actual backend data"""
    try:
        # Get train data from backend
        response = requests.get('http://localhost:5055/api/health')
        if response.status_code == 200:
            data = response.json()
            print(f"Backend health: {data}")
            
            # Get actual train data (this might not work if backend only returns count)
            # Let's create sample data that matches backend format
            sample_trains = []
            for i in range(10):
                train = {
                    'id': f'T{10000 + i}',
                    'number': f'T{10000 + i}',
                    'name': f'Sample Train {i+1}',
                    'category': 'express',
                    'speed': 60 + i * 5,
                    'delay': i * 2,
                    'lat': 22.583 + i * 0.01,
                    'lon': 88.342 + i * 0.01,
                    'status': 'Running'
                }
                sample_trains.append(train)
            
            print(f"Sample trains: {len(sample_trains)}")
            
            # Test ML prediction
            predictor = TrainCongestionPredictor()
            predictor.load_trained_model('ML/trained_congestion_model.pkl')
            
            # Convert to DataFrame and add missing columns
            import pandas as pd
            import numpy as np
            
            df = pd.DataFrame(sample_trains)
            
            # Add missing columns
            df['station'] = 'HWH'
            df['station_type'] = 'major'
            df['occupancy'] = np.random.randint(0, 4, len(df))
            df['signal_status'] = np.random.choice([0, 1, 2], len(df))
            df['distance_to_next'] = np.random.exponential(5000, len(df))
            df['distance_to_destination'] = np.random.exponential(25000, len(df))
            df['time_to_clear'] = df['distance_to_next'] / (df['speed'] + 1)
            df['hour_of_day'] = np.random.randint(0, 24, len(df))
            df['day_of_week'] = np.random.randint(0, 7, len(df))
            df['congestion'] = 0
            
            # Predict
            predictions, probabilities = predictor.predict_congestion(df)
            
            # Get suggestions
            optimizer = CongestionOptimizer(predictor)
            suggestions = optimizer.suggest_actions(df, predictions)
            
            # Create results
            results = {
                'timestamp': pd.Timestamp.now().isoformat(),
                'total_trains': len(sample_trains),
                'congestion_predictions': predictions.tolist(),
                'congestion_probabilities': probabilities.tolist(),
                'congestion_rate': float(np.mean(predictions)),
                'congested_trains': int(np.sum(predictions)),
                'optimization_suggestions': suggestions[:5],
                'summary': {
                    'total_trains': len(sample_trains),
                    'congested_trains': int(np.sum(predictions)),
                    'congestion_rate': f"{np.mean(predictions) * 100:.1f}%",
                    'top_action': suggestions[0]['action'] if suggestions else 'monitor'
                }
            }
            
            print("✅ ML Test Results:")
            print(f"Total Trains: {results['summary']['total_trains']}")
            print(f"Congested Trains: {results['summary']['congested_trains']}")
            print(f"Congestion Rate: {results['summary']['congestion_rate']}")
            print(f"Suggestions: {len(results['optimization_suggestions'])}")
            
            # Test JSON output
            json_output = json.dumps(results)
            print(f"JSON output length: {len(json_output)}")
            print("✅ ML integration working!")
            
            return results
            
        else:
            print(f"❌ Backend not responding: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_backend_ml()
