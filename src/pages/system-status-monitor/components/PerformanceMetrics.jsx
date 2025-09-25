import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetrics = ({ metrics }) => {
  const getMetricTrend = (current, previous) => {
    if (current > previous) return { icon: 'TrendingUp', color: 'text-success' };
    if (current < previous) return { icon: 'TrendingDown', color: 'text-error' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const formatValue = (value, type) => {
    switch (type) {
      case 'ms': return `${value}ms`;
      case 'percentage': return `${value}%`;
      case 'count': return value?.toLocaleString();
      case 'rate': return `${value}/s`;
      case 'bytes': return `${(value / 1024 / 1024)?.toFixed(1)}MB`;
      default: return value;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Performance Metrics</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Activity" size={16} />
          <span>Real-time monitoring</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics?.map((metric) => {
          const trend = getMetricTrend(metric?.current, metric?.previous);
          const changePercent = ((metric?.current - metric?.previous) / metric?.previous * 100)?.toFixed(1);
          
          return (
            <div key={metric?.id} className="bg-muted/5 border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Icon name={metric?.icon} size={20} className="text-muted-foreground" />
                <div className={`flex items-center space-x-1 ${trend?.color}`}>
                  <Icon name={trend?.icon} size={14} />
                  <span className="text-xs font-medium">{Math.abs(changePercent)}%</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-foreground">
                  {formatValue(metric?.current, metric?.unit)}
                </div>
                <div className="text-sm text-muted-foreground">{metric?.name}</div>
              </div>
              {/* Mini Chart/Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Target: {formatValue(metric?.target, metric?.unit)}</span>
                  <span>{((metric?.current / metric?.target) * 100)?.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric?.current <= metric?.target ? 'bg-success' : 'bg-warning'
                    }`}
                    style={{ width: `${Math.min((metric?.current / metric?.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              {/* Historical Data Points */}
              <div className="mt-3 flex justify-between text-xs">
                {metric?.history?.slice(-5)?.map((point, index) => (
                  <div key={index} className="text-center">
                    <div className="text-muted-foreground">{formatValue(point?.value, metric?.unit)}</div>
                    <div className="text-muted-foreground/60">{point?.time}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* System Resource Utilization */}
      <div className="mt-8 pt-6 border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPU Usage</span>
              <span className="text-foreground font-medium">67%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-warning h-2 rounded-full transition-all duration-300" style={{ width: '67%' }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Memory Usage</span>
              <span className="text-foreground font-medium">82%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-error h-2 rounded-full transition-all duration-300" style={{ width: '82%' }}></div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Disk I/O</span>
              <span className="text-foreground font-medium">34%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-success h-2 rounded-full transition-all duration-300" style={{ width: '34%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;