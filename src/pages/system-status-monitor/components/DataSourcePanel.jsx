import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DataSourcePanel = ({ dataSources, onRefresh, onTestConnection }) => {
  const [expandedSource, setExpandedSource] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'maintenance': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      case 'maintenance': return 'Settings';
      default: return 'Circle';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'connected': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'error': return 'bg-error/10';
      case 'maintenance': return 'bg-muted/10';
      default: return 'bg-muted/10';
    }
  };

  const formatLastUpdate = (timestamp) => {
    const now = new Date();
    const update = new Date(timestamp);
    const diffMs = now - update;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Data Sources</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          iconName="RefreshCw"
          iconPosition="left"
        >
          Refresh All
        </Button>
      </div>
      <div className="space-y-4">
        {dataSources?.map((source) => (
          <div key={source?.id} className={`border border-border rounded-lg ${getStatusBg(source?.status)}`}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={source?.icon} size={20} className="text-muted-foreground" />
                  <div>
                    <h3 className="font-medium text-foreground">{source?.name}</h3>
                    <p className="text-sm text-muted-foreground">{source?.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={getStatusIcon(source?.status)} size={16} className={getStatusColor(source?.status)} />
                    <span className={`text-sm font-medium capitalize ${getStatusColor(source?.status)}`}>
                      {source?.status}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedSource(expandedSource === source?.id ? null : source?.id)}
                    iconName={expandedSource === source?.id ? "ChevronUp" : "ChevronDown"}
                  >
                  </Button>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{source?.responseTime}ms</div>
                  <div className="text-xs text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{source?.errorRate}%</div>
                  <div className="text-xs text-muted-foreground">Error Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{formatLastUpdate(source?.lastUpdate)}</div>
                  <div className="text-xs text-muted-foreground">Last Update</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-foreground">{source?.uptime}%</div>
                  <div className="text-xs text-muted-foreground">Uptime (24h)</div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedSource === source?.id && (
              <div className="border-t border-border p-4 bg-muted/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Connection Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Endpoint:</span>
                        <span className="text-foreground font-mono">{source?.endpoint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Protocol:</span>
                        <span className="text-foreground">{source?.protocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Failover:</span>
                        <span className={source?.failoverActive ? 'text-warning' : 'text-success'}>
                          {source?.failoverActive ? 'Active' : 'Standby'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data Rate:</span>
                        <span className="text-foreground">{source?.dataRate}/sec</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {source?.recentActivity?.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full ${
                            activity?.type === 'success' ? 'bg-success' :
                            activity?.type === 'warning' ? 'bg-warning' : 'bg-error'
                          }`}></div>
                          <span className="text-muted-foreground">{activity?.timestamp}</span>
                          <span className="text-foreground">{activity?.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTestConnection(source?.id)}
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Test Connection
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Settings"
                    iconPosition="left"
                  >
                    Configure
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSourcePanel;