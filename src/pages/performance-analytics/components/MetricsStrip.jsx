import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsStrip = ({ metrics, onMetricClick }) => {
  const getMetricIcon = (type) => {
    switch (type) {
      case 'onTime': return 'Clock';
      case 'delays': return 'AlertTriangle';
      case 'throughput': return 'TrendingUp';
      case 'safety': return 'Shield';
      default: return 'BarChart3';
    }
  };

  const getMetricColor = (metric) => {
    if (metric?.type === 'safety') {
      return metric?.value === 0 ? 'text-success' : 'text-error';
    }
    
    const percentage = (metric?.value / metric?.target) * 100;
    if (percentage >= 95) return 'text-success';
    if (percentage >= 85) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      case 'stable': return 'Minus';
      default: return 'Minus';
    }
  };

  const getTrendColor = (trend, isPositive) => {
    if (trend === 'stable') return 'text-muted-foreground';
    if ((trend === 'up' && isPositive) || (trend === 'down' && !isPositive)) {
      return 'text-success';
    }
    return 'text-error';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          onClick={() => onMetricClick(metric)}
          className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-control"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-primary/10 ${getMetricColor(metric)}`}>
                <Icon name={getMetricIcon(metric?.type)} size={20} />
              </div>
              <h3 className="text-sm font-medium text-foreground">{metric?.title}</h3>
            </div>
            <div className={`flex items-center space-x-1 ${getTrendColor(metric?.trend, metric?.isPositiveTrend)}`}>
              <Icon name={getTrendIcon(metric?.trend)} size={14} />
              <span className="text-xs font-medium">{metric?.trendValue}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl font-bold ${getMetricColor(metric)}`}>
                {metric?.value}
              </span>
              <span className="text-sm text-muted-foreground">{metric?.unit}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Target: {metric?.target}{metric?.unit}
              </span>
              <span className={`font-medium ${getMetricColor(metric)}`}>
                {metric?.variance > 0 ? '+' : ''}{metric?.variance}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  getMetricColor(metric)?.includes('success') ? 'bg-success' :
                  getMetricColor(metric)?.includes('warning') ? 'bg-warning' : 'bg-error'
                }`}
                style={{ width: `${Math.min((metric?.value / metric?.target) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;