#!/usr/bin/env python3
"""
Train the Train Congestion Prediction Model
Run this script to train and save the ML model
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train_congestion_predictor import TrainCongestionPredictor
import matplotlib.pyplot as plt
import seaborn as sns

def plot_training_results(df, predictions, probabilities):
    """Plot training results and data distribution"""
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    
    # Congestion distribution
    axes[0, 0].pie(df['congestion'].value_counts(), 
                   labels=['No Congestion', 'Congestion'], 
                   autopct='%1.1f%%')
    axes[0, 0].set_title('Congestion Distribution')
    
    # Speed vs Congestion
    sns.boxplot(data=df, x='congestion', y='speed', ax=axes[0, 1])
    axes[0, 1].set_title('Speed vs Congestion')
    
    # Occupancy vs Congestion
    sns.countplot(data=df, x='occupancy', hue='congestion', ax=axes[0, 2])
    axes[0, 2].set_title('Occupancy vs Congestion')
    
    # Delay distribution
    axes[1, 0].hist(df[df['congestion']==0]['delay'], alpha=0.7, label='No Congestion', bins=20)
    axes[1, 0].hist(df[df['congestion']==1]['delay'], alpha=0.7, label='Congestion', bins=20)
    axes[1, 0].set_title('Delay Distribution')
    axes[1, 0].legend()
    
    # Signal status vs Congestion
    sns.countplot(data=df, x='signal_status', hue='congestion', ax=axes[1, 1])
    axes[1, 1].set_title('Signal Status vs Congestion')
    
    # Category vs Congestion
    sns.countplot(data=df, x='category', hue='congestion', ax=axes[1, 2])
    axes[1, 2].set_title('Train Category vs Congestion')
    axes[1, 2].tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    plt.savefig('training_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    """Main training function"""
    print("🚂 Training Train Congestion Prediction Model")
    print("=" * 60)
    
    # Initialize predictor
    predictor = TrainCongestionPredictor()
    
    # Generate training data
    print("\n📊 Generating training data...")
    df = predictor.fetch_simulated_data(20000)  # Generate 20k samples
    
    print(f"Generated {len(df)} training samples")
    print(f"Congestion distribution:")
    print(df['congestion'].value_counts())
    
    # Train model
    print("\n🤖 Training model...")
    model, accuracy = predictor.train_model(df)
    
    # Test with sample data
    print("\n🧪 Testing with sample data...")
    test_data = predictor.fetch_simulated_data(1000)
    predictions, probabilities = predictor.predict_congestion(test_data)
    
    # Plot results (skip if matplotlib issues)
    try:
        print("\n📈 Generating analysis plots...")
        plot_training_results(test_data, predictions, probabilities)
    except Exception as e:
        print(f"⚠️  Skipping plots due to error: {e}")
    
    # Save model
    print("\n💾 Saving model...")
    predictor.save_model('trained_congestion_model.pkl')
    
    # Test optimization
    print("\n🎯 Testing optimization...")
    from train_congestion_predictor import CongestionOptimizer
    optimizer = CongestionOptimizer(predictor)
    suggestions = optimizer.suggest_actions(test_data, predictions)
    
    print(f"Generated {len(suggestions)} optimization suggestions")
    print("\nTop 5 suggestions:")
    for i, suggestion in enumerate(suggestions[:5]):
        print(f"{i+1}. Train {suggestion['train_id']}: {suggestion['action']} "
              f"(Priority: {suggestion['priority']})")
    
    print(f"\n✅ Training complete!")
    print(f"Final accuracy: {accuracy:.4f}")
    print(f"Model saved to: trained_congestion_model.pkl")
    print(f"Analysis plot saved to: training_analysis.png")
    
    # Model validation
    print(f"\n🔍 Model Validation:")
    print(f"✅ Accuracy: {accuracy:.4f}")
    if accuracy >= 0.8:
        print("✅ Excellent performance!")
    elif accuracy >= 0.7:
        print("✅ Good performance!")
    else:
        print("⚠️  Consider more training data or feature engineering")
    
    # Check for overfitting
    train_pred, _ = predictor.predict_congestion(df)
    train_accuracy = sum(train_pred == df['congestion']) / len(df)
    overfitting = train_accuracy - accuracy
    
    print(f"📊 Train accuracy: {train_accuracy:.4f}")
    print(f"📊 Overfitting check: {overfitting:.4f}")
    
    if overfitting > 0.1:
        print("⚠️  Warning: Possible overfitting detected!")
    else:
        print("✅ No significant overfitting detected")

if __name__ == "__main__":
    main()
