# 🚂 Train Congestion Prediction & Optimization ML System

This ML system predicts train congestion and provides optimization suggestions for the Howrah section railway network.

## 📁 Files Overview

- **`train_congestion_predictor.py`** - Main ML model with prediction and optimization
- **`train_model.py`** - Script to train and save the model
- **`ml_backend_integration.py`** - Integration with your train simulation backend
- **`analysis.ipynb`** - Your original notebook (enhanced version)
- **`requirements.txt`** - Python dependencies

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ML
pip install -r requirements.txt
```

### 2. Train the Model
```bash
python train_model.py
```

This will:
- Generate 20,000 realistic training samples
- Train multiple ML models (Random Forest, Gradient Boosting)
- Select the best performing model
- Save the trained model to `trained_congestion_model.pkl`
- Generate analysis plots

### 3. Test ML Integration
```bash
python ml_backend_integration.py
```

## 🧠 ML Model Features

### **Input Features (15 features)**
- **Speed** - Current train speed (km/h)
- **Occupancy** - Number of trains in section (0-5)
- **Signal Status** - Red(0), Yellow(1), Green(2)
- **Delay** - Current delay in minutes
- **Time to Clear** - Estimated time to clear section
- **Distance Metrics** - Distance to next station/destination
- **Temporal Features** - Hour of day, day of week
- **Train Category** - Passenger, Express, Vande Bharat, Freight
- **Station Type** - Major, Junction, Yard, Suburban
- **Derived Features** - Speed/occupancy ratio, delay/speed ratio
- **Peak Hour Indicator** - Boolean for peak hours
- **Weekend Indicator** - Boolean for weekends

### **Output**
- **Congestion Prediction** - Binary (0=No Congestion, 1=Congestion)
- **Congestion Probability** - Confidence score (0-1)

## 🎯 Optimization Algorithms

### **Action Types**
1. **Increase Speed** - For trains moving too slowly
2. **Reroute** - For high occupancy sections
3. **Wait** - For red signals ahead
4. **Express Priority** - For high delay trains
5. **Schedule Adjustment** - For peak hour congestion
6. **Monitor** - Continue normal operation

### **Priority Levels**
- **High** - Immediate action required
- **Medium** - Action needed soon
- **Low** - Continue monitoring

## 📊 Model Performance

### **Target Metrics**
- **Accuracy**: ≥ 80%
- **Precision**: ≥ 75% (for congestion class)
- **Recall**: ≥ 70% (for congestion class)
- **F1-Score**: ≥ 72%

### **Overfitting Prevention**
- Cross-validation with 5 folds
- Early stopping
- Regularization
- Feature scaling

## 🔧 Integration with Your System

### **Backend Integration**
The ML system integrates with your train simulation backend:

```python
# In your server/index.js, add ML endpoint
app.get('/api/ml/predict', (req, res) => {
    // Call ML prediction
    const results = mlIntegration.predict_and_optimize();
    res.json(results);
});
```

### **Frontend Integration**
Display ML predictions in your React app:

```jsx
// Add ML insights to your dashboard
const MLInsights = () => {
    const [mlData, setMLData] = useState(null);
    
    useEffect(() => {
        // Fetch ML predictions
        fetch('/api/ml/predict')
            .then(res => res.json())
            .then(setMLData);
    }, []);
    
    return (
        <div className="ml-insights">
            <h3>AI Congestion Predictions</h3>
            <p>Congestion Rate: {mlData?.summary?.congestion_rate}</p>
            <p>Recommended Action: {mlData?.summary?.top_action}</p>
        </div>
    );
};
```

## 📈 Real-time Monitoring

The system provides continuous monitoring:

```python
# Start monitoring
ml_integration = MLBackendIntegration()
ml_integration.load_trained_model()
ml_integration.start_monitoring(interval=30)  # Every 30 seconds
```

## 🎛️ Configuration

### **Model Parameters**
- **Training Samples**: 20,000 (configurable)
- **Test Split**: 20%
- **Cross-validation**: 5 folds
- **Random State**: 42 (for reproducibility)

### **Congestion Rules**
- **High Occupancy**: ≥ 3 trains in section
- **Low Speed**: < 25 km/h
- **Red Signal**: Signal status = 0
- **High Delay**: > 20 minutes
- **Long Clear Time**: > 5 minutes

## 🔍 Model Validation

The system automatically checks for:
- **Overfitting**: Train accuracy - Test accuracy > 0.1
- **Underfitting**: Test accuracy < 0.7
- **Class Imbalance**: Congestion vs No-congestion ratio
- **Feature Importance**: Which features matter most

## 📊 Analysis Outputs

After training, you'll get:
- **Model accuracy** and performance metrics
- **Confusion matrix** and classification report
- **Feature importance** plot
- **Training analysis** plots (saved as PNG)
- **Optimization suggestions** examples

## 🚨 Troubleshooting

### **Common Issues**
1. **Low Accuracy**: Increase training samples or add more features
2. **Overfitting**: Reduce model complexity or add regularization
3. **Underfitting**: Increase model complexity or add features
4. **Class Imbalance**: Use stratified sampling or class weights

### **Performance Tips**
- Use GPU for TensorFlow models (if available)
- Increase training samples for better accuracy
- Add more realistic features from your simulation
- Tune hyperparameters for your specific use case

## 🔮 Future Enhancements

- **Deep Learning**: LSTM/GRU for time series prediction
- **Reinforcement Learning**: For dynamic optimization
- **Real-time Learning**: Online learning from live data
- **Multi-objective Optimization**: Balance multiple goals
- **Weather Integration**: Include weather data
- **Passenger Demand**: Include passenger flow data

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure your backend is running on port 5055
4. Check the generated analysis plots for insights

---

**Happy Training! 🚂🤖**
