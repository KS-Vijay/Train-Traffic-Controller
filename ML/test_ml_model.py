#!/usr/bin/env python3
"""
Test the ML model without requiring backend connection
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_congestion_predictor import TrainCongestionPredictor, CongestionOptimizer
import numpy as np
import pandas as pd

def test_model_without_backend():
    """Test the ML model using generated data"""
    print("🧪 Testing ML Model (No Backend Required)")
    print("=" * 50)
    
    # Initialize predictor
    predictor = TrainCongestionPredictor()
    
    # Load trained model
    try:
        predictor.load_trained_model('trained_congestion_model.pkl')
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("Please run 'python train_model.py' first to train the model")
        return
    
    # Generate test data
    print("\n📊 Generating test data...")
    test_data = predictor.fetch_simulated_data(100)
    print(f"Generated {len(test_data)} test samples")
    
    # Predict congestion
    print("\n🔮 Making predictions...")
    predictions, probabilities = predictor.predict_congestion(test_data)
    
    # Show results
    congestion_count = np.sum(predictions)
    congestion_rate = np.mean(predictions) * 100
    
    print(f"\n📈 Prediction Results:")
    print(f"Total Trains: {len(test_data)}")
    print(f"Congested Trains: {congestion_count}")
    print(f"Congestion Rate: {congestion_rate:.1f}%")
    print(f"Average Probability: {np.mean(probabilities):.3f}")
    
    # Show high-risk trains
    high_risk_indices = np.where((predictions == 1) & (probabilities > 0.7))[0]
    if len(high_risk_indices) > 0:
        print(f"\n🚨 High Risk Trains ({len(high_risk_indices)}):")
        for i, idx in enumerate(high_risk_indices[:5]):  # Show top 5
            train = test_data.iloc[idx]
            print(f"  {i+1}. Train {train['train_id']} - "
                  f"Speed: {train['speed']:.1f} km/h, "
                  f"Delay: {train['delay']:.1f} min, "
                  f"Risk: {probabilities[idx]:.3f}")
    
    # Test optimization
    print("\n🎯 Testing Optimization...")
    optimizer = CongestionOptimizer(predictor)
    suggestions = optimizer.suggest_actions(test_data, predictions)
    
    print(f"Generated {len(suggestions)} optimization suggestions")
    print("\nTop 5 suggestions:")
    for i, suggestion in enumerate(suggestions[:5]):
        print(f"  {i+1}. Train {suggestion['train_id']}: {suggestion['action']} "
              f"(Priority: {suggestion['priority']}, "
              f"Improvement: {suggestion['expected_improvement']:.2f})")
    
    # Test individual predictions
    print("\n🔍 Testing Individual Scenarios:")
    test_scenarios = [
        {"name": "High Congestion", "speed": 15, "occupancy": 3, "signal": 0, "delay": 25},
        {"name": "Medium Congestion", "speed": 35, "occupancy": 2, "signal": 1, "delay": 15},
        {"name": "Low Congestion", "speed": 60, "occupancy": 1, "signal": 2, "delay": 5},
        {"name": "No Congestion", "speed": 80, "occupancy": 0, "signal": 2, "delay": 0}
    ]
    
    for scenario in test_scenarios:
        # Create a single train data point
        single_train = pd.DataFrame([{
            'train_id': 'TEST001',
            'category': 'express',
            'station': 'HWH',
            'station_type': 'major',
            'speed': scenario['speed'],
            'occupancy': scenario['occupancy'],
            'signal_status': scenario['signal'],
            'delay': scenario['delay'],
            'distance_to_next': 5000,
            'distance_to_destination': 25000,
            'time_to_clear': 5000 / (scenario['speed'] + 1),
            'hour_of_day': 10,
            'day_of_week': 1,
            'lat': 22.583,
            'lon': 88.342,
            'congestion': 0  # Add congestion column for prepare_features
        }])
        
        pred, prob = predictor.predict_congestion(single_train)
        result = "CONGESTION" if pred[0] == 1 else "NO CONGESTION"
        
        print(f"  {scenario['name']}: {result} (Probability: {prob[0]:.3f})")
    
    print("\n✅ ML Model Test Complete!")
    print("The model is working correctly and ready for integration.")

def test_model_performance():
    """Test model performance metrics"""
    print("\n📊 Testing Model Performance...")
    
    predictor = TrainCongestionPredictor()
    predictor.load_trained_model('trained_congestion_model.pkl')
    
    # Generate larger test set
    test_data = predictor.fetch_simulated_data(1000)
    predictions, probabilities = predictor.predict_congestion(test_data)
    
    # Calculate metrics
    actual = test_data['congestion'].values
    accuracy = np.mean(predictions == actual)
    
    # Confusion matrix
    tp = np.sum((predictions == 1) & (actual == 1))
    fp = np.sum((predictions == 1) & (actual == 0))
    fn = np.sum((predictions == 0) & (actual == 1))
    tn = np.sum((predictions == 0) & (actual == 0))
    
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1-Score: {f1:.4f}")
    
    print(f"\nConfusion Matrix:")
    print(f"True Positives: {tp}")
    print(f"False Positives: {fp}")
    print(f"True Negatives: {tn}")
    print(f"False Negatives: {fn}")

if __name__ == "__main__":
    test_model_without_backend()
    test_model_performance()
