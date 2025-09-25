import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthOverview = ({ systemHealth, uptime, lastUpdate }) => {
  const getHealthColor = (score) => {
    if (score >= 95) return 'text-success';
    if (score >= 85) return 'text-warning';
    return 'text-error';
  };

  const getHealthIcon = (score) => {
    if (score >= 95) return 'CheckCircle';
    if (score >= 85) return 'AlertTriangle';
    return 'XCircle';
  };

  const getHealthStatus = (score) => {
    if (score >= 95) return 'Excellent';
    if (score >= 85) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">System Health Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Last updated: {lastUpdate}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Overall Health Score */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${getHealthColor(systemHealth?.overall)} border-current mb-4`}>
            <Icon name={getHealthIcon(systemHealth?.overall)} size={32} className={getHealthColor(systemHealth?.overall)} />
          </div>
          <div className="space-y-1">
            <div className={`text-3xl font-bold ${getHealthColor(systemHealth?.overall)}`}>
              {systemHealth?.overall}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Health</div>
            <div className={`text-sm font-medium ${getHealthColor(systemHealth?.overall)}`}>
              {getHealthStatus(systemHealth?.overall)}
            </div>
          </div>
        </div>

        {/* Uptime Statistics */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">{uptime?.current}</div>
            <div className="text-sm text-muted-foreground">Current Uptime</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">24h Uptime:</span>
              <span className="text-foreground font-medium">{uptime?.day}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">7d Uptime:</span>
              <span className="text-foreground font-medium">{uptime?.week}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">30d Uptime:</span>
              <span className="text-foreground font-medium">{uptime?.month}</span>
            </div>
          </div>
        </div>

        {/* Health Trend */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Icon name="TrendingUp" size={20} className="text-success" />
              <span className="text-lg font-semibold text-success">+2.3%</span>
            </div>
            <div className="text-sm text-muted-foreground">Health Trend (7d)</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Peak Health:</span>
              <span className="text-foreground font-medium">98.7%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Avg Health:</span>
              <span className="text-foreground font-medium">96.2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Min Health:</span>
              <span className="text-foreground font-medium">92.1%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Status Indicators */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full status-breathing"></div>
            <span className="text-sm text-foreground">Data Sources</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full status-breathing"></div>
            <span className="text-sm text-foreground">API Services</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning rounded-full status-breathing"></div>
            <span className="text-sm text-foreground">ML Engines</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success rounded-full status-breathing"></div>
            <span className="text-sm text-foreground">Databases</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthOverview;