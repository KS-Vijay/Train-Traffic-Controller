import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AIInsights = () => {
  const [mlData, setMLData] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMLData();
    const interval = setInterval(fetchMLData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMLData = async () => {
    try {
      setLoading(true);
      const [predictionsRes, suggestionsRes, heatmapRes] = await Promise.all([
        fetch('http://localhost:5055/api/ml/predictions'),
        fetch('http://localhost:5055/api/ml/suggestions'),
        fetch('http://localhost:5055/api/ml/heatmap')
      ]);

      const [predictions, suggestions, heatmap] = await Promise.all([
        predictionsRes.json(),
        suggestionsRes.json(),
        heatmapRes.json()
      ]);

      if (predictions.ok) {
        setMLData(predictions.predictions);
      }
      if (suggestions.ok) {
        setSuggestions(suggestions.suggestions);
      }
      if (heatmap.ok) {
        setHeatmapData(heatmap.heatmap);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch ML data');
      console.error('ML data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCongestionColor = (rate) => {
    if (rate < 0.3) return 'text-green-600';
    if (rate < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCongestionBg = (rate) => {
    if (rate < 0.3) return 'bg-green-100 dark:bg-green-900/20';
    if (rate < 0.6) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'increase_speed': return 'Zap';
      case 'reroute': return 'Navigation';
      case 'wait': return 'Clock';
      case 'express_priority': return 'Star';
      case 'schedule_adjustment': return 'Calendar';
      default: return 'Activity';
    }
  };

  if (loading && !mlData) {
    return (
      <div className="w-full h-full bg-card border border-border rounded-lg p-6 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading AI Insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-card border border-border rounded-lg p-6 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertTriangle" size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-2">Error Loading AI Insights</p>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button 
            onClick={fetchMLData}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center">
            <Icon name="Brain" size={24} className="mr-3 text-primary" />
            AI Insights
          </h2>
          <p className="text-muted-foreground">Real-time congestion predictions and optimization</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Last Updated</div>
          <div className="text-sm font-medium text-foreground">
            {mlData?.timestamp ? new Date(mlData.timestamp).toLocaleTimeString() : 'Never'}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {mlData?.summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trains</p>
                <p className="text-2xl font-bold text-foreground">{mlData.summary.total_trains}</p>
              </div>
              <Icon name="Train" size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Congested Trains</p>
                <p className="text-2xl font-bold text-red-600">{mlData.summary.congested_trains}</p>
              </div>
              <Icon name="AlertTriangle" size={24} className="text-red-500" />
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Congestion Rate</p>
                <p className={`text-2xl font-bold ${getCongestionColor(parseFloat(mlData.summary.congestion_rate) / 100)}`}>
                  {mlData.summary.congestion_rate}
                </p>
              </div>
              <Icon name="TrendingUp" size={24} className="text-orange-500" />
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Risk</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(mlData.summary.average_risk * 100).toFixed(1)}%
                </p>
              </div>
              <Icon name="Target" size={24} className="text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Congestion Heatmap */}
      {heatmapData.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Map" size={20} className="mr-2" />
            Congestion Heatmap
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {heatmapData.slice(0, 6).map((point, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getCongestionBg(point.congestion)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Lat: {point.lat.toFixed(4)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Lon: {point.lon.toFixed(4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getCongestionColor(point.congestion)}`}>
                      {(point.congestion * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {point.trainCount} trains
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High Risk Trains */}
      {mlData?.high_risk_trains && mlData.high_risk_trains.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="AlertTriangle" size={20} className="mr-2 text-red-500" />
            High Risk Trains ({mlData.high_risk_trains.length})
          </h3>
          <div className="space-y-3">
            {mlData.high_risk_trains.slice(0, 5).map((train, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <Icon name="Train" size={20} className="text-red-500" />
                  <div>
                    <p className="font-medium text-foreground">{train.train_id}</p>
                    <p className="text-sm text-muted-foreground">{train.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    Risk: {(train.congestion_probability * 100).toFixed(1)}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {train.speed} km/h, {train.delay} min delay
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimization Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-background border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Lightbulb" size={20} className="mr-2 text-yellow-500" />
            AI Recommendations ({suggestions.length})
          </h3>
          <div className="space-y-3">
            {suggestions.slice(0, 8).map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name={getActionIcon(suggestion.action)} size={20} className="text-primary" />
                  <div>
                    <p className="font-medium text-foreground">
                      Train {suggestion.train_id}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {suggestion.action.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                    {suggestion.priority}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      +{(suggestion.expected_improvement * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-muted-foreground">improvement</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button 
          onClick={fetchMLData}
          disabled={loading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
        >
          <Icon name={loading ? "Loader2" : "RefreshCw"} size={16} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Updating..." : "Refresh Insights"}</span>
        </button>
      </div>
    </div>
  );
};

export default AIInsights;
