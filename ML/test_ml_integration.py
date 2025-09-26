#!/usr/bin/env python3
"""
Test ML integration with sample train data
"""

import sys
import os
import json
import numpy as np
import pandas as pd
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_congestion_predictor import TrainCongestionPredictor, CongestionOptimizer

def test_ml_integration():
    """Test ML integration with sample data"""
    try:
        # Load trained model
        predictor = TrainCongestionPredictor()
        predictor.load_trained_model('trained_congestion_model.pkl')
        
        # Generate sample train data (similar to backend simulation)
        sample_trains = []
        categories = ['passenger', 'express', 'vande', 'freight']
        stations = ['HWH', 'SDAH', 'SHM', 'SRC', 'BWN', 'BDC', 'NH', 'DKAE', 'KGP']
        
        for i in range(20):  # Generate 20 sample trains
            category = categories[i % len(categories)]
            
            # Speed based on category
            if category == 'freight':
                speed = np.random.uniform(20, 55)
            elif category == 'vande':
                speed = np.random.uniform(60, 110)
            elif category == 'express':
                speed = np.random.uniform(45, 90)
            else:  # passenger
                speed = np.random.uniform(20, 60)
            
            train = {
                'id': f'T{np.random.randint(10000, 99999)}',
                'number': f'T{np.random.randint(10000, 99999)}',
                'name': f'{category.title()} Train {i+1}',
                'category': category,
                'station': np.random.choice(stations),
                'station_type': 'major',
                'speed': speed,
                'occupancy': np.random.randint(0, 4),
                'signal_status': np.random.choice([0, 1, 2]),
                'delay': np.random.randint(0, 30),
                'distance_to_next': np.random.exponential(5000),
                'distance_to_destination': np.random.exponential(25000),
                'time_to_clear': np.random.exponential(5000) / (speed + 1),
                'hour_of_day': np.random.randint(0, 24),
                'day_of_week': np.random.randint(0, 7),
                'lat': np.random.uniform(20.78, 24.38),  # Howrah section bounds
                'lon': np.random.uniform(86.41, 90.29),
                'from': np.random.choice(stations),
                'to': np.random.choice(stations),
                'status': 'Running'
            }
            sample_trains.append(train)
        
        print("Generated sample train data:")
        print(f"Number of trains: {len(sample_trains)}")
        
        # Convert to DataFrame
        df = pd.DataFrame(sample_trains)
        df['congestion'] = 0  # Placeholder for prepare_features
        
        # Predict congestion
        predictions, probabilities = predictor.predict_congestion(df)
        
        # Get optimization suggestions
        optimizer = CongestionOptimizer(predictor)
        suggestions = optimizer.suggest_actions(df, predictions)
        
        # Prepare results
        results = {
            'timestamp': pd.Timestamp.now().isoformat(),
            'total_trains': len(sample_trains),
            'congestion_predictions': predictions.tolist(),
            'congestion_probabilities': probabilities.tolist(),
            'congestion_rate': float(np.mean(predictions)),
            'congested_trains': int(np.sum(predictions)),
            'high_risk_trains': [],
            'optimization_suggestions': suggestions[:10],  # Top 10 suggestions
            'summary': {
                'total_trains': len(sample_trains),
                'congested_trains': int(np.sum(predictions)),
                'congestion_rate': f"{np.mean(predictions) * 100:.1f}%",
                'top_action': suggestions[0]['action'] if suggestions else 'monitor',
                'average_risk': float(np.mean(probabilities))
            }
        }
        
        # Identify high-risk trains
        for i, (train, pred, prob) in enumerate(zip(sample_trains, predictions, probabilities)):
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
        
        print("\nML Analysis Results:")
        print(f"Total Trains: {results['summary']['total_trains']}")
        print(f"Congested Trains: {results['summary']['congested_trains']}")
        print(f"Congestion Rate: {results['summary']['congestion_rate']}")
        print(f"Average Risk: {results['summary']['average_risk']:.3f}")
        print(f"High Risk Trains: {len(results['high_risk_trains'])}")
        print(f"Optimization Suggestions: {len(results['optimization_suggestions'])}")
        
        print("\nTop 5 Optimization Suggestions:")
        for i, suggestion in enumerate(results['optimization_suggestions'][:5]):
            print(f"{i+1}. Train {suggestion['train_id']}: {suggestion['action']} "
                  f"(Priority: {suggestion['priority']}, Improvement: {suggestion['expected_improvement']:.2f})")
        
        print("\nHigh Risk Trains:")
        for train in results['high_risk_trains'][:3]:
            print(f"- {train['train_id']} ({train['name']}): Risk {train['congestion_probability']:.3f}")
        
        print("\n✅ ML Integration Test Successful!")
        return results
        
    except Exception as e:
        print(f"❌ ML Integration Test Failed: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    test_ml_integration()
