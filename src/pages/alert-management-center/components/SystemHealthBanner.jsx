import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemHealthBanner = ({ systemHealth, criticalAlertCount }) => {
  const getConnectionStatus = (status) => {
    switch (status) {
      case 'connected': return { color: 'text-success', icon: 'Wifi', bg: 'bg-success/10' };
      case 'warning': return { color: 'text-warning', icon: 'WifiOff', bg: 'bg-warning/10' };
      case 'error': return { color: 'text-error', icon: 'AlertCircle', bg: 'bg-error/10' };
      default: return { color: 'text-muted-foreground', icon: 'Wifi', bg: 'bg-muted/10' };
    }
  };

  const overallHealth = systemHealth?.reduce((acc, system) => {
    if (system?.status === 'error') return 'error';
    if (system?.status === 'warning' && acc !== 'error') return 'warning';
    return acc === 'error' || acc === 'warning' ? acc : 'connected';
  }, 'connected');

  const overallStatus = getConnectionStatus(overallHealth);

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Overall System Status */}
        <div className="flex items-center space-x-4">
          <div className={`
            flex items-center space-x-3 px-4 py-2 rounded-lg
            ${overallStatus?.bg} ${overallStatus?.color}
          `}>
            <Icon 
              name={overallStatus?.icon} 
              size={20} 
              className="status-breathing" 
            />
            <div>
              <h3 className="font-semibold text-foreground">
                System Health Overview
              </h3>
              <p className="text-sm capitalize">
                {overallHealth === 'connected' ? 'All Systems Operational' : 
                 overallHealth === 'warning'? 'Some Systems Degraded' : 'Critical Systems Down'}
              </p>
            </div>
          </div>

          {/* Critical Alert Indicator */}
          {criticalAlertCount > 0 && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-error/10 text-error rounded-lg">
              <Icon name="AlertTriangle" size={20} className="status-breathing" />
              <div>
                <p className="font-semibold">
                  {criticalAlertCount} Critical Alert{criticalAlertCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs">
                  Requires Immediate Attention
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Individual System Status */}
        <div className="flex items-center space-x-6">
          {systemHealth?.map((system) => {
            const status = getConnectionStatus(system?.status);
            return (
              <div 
                key={system?.name}
                className="flex items-center space-x-2"
                title={`${system?.name}: ${system?.status} - Last updated: ${system?.lastUpdate}`}
              >
                <Icon 
                  name={status?.icon} 
                  size={16} 
                  className={`${status?.color} ${system?.status !== 'connected' ? 'status-breathing' : ''}`}
                />
                <div className="text-sm">
                  <p className="font-medium text-foreground">{system?.name}</p>
                  <p className={`text-xs ${status?.color} capitalize`}>
                    {system?.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Last Update Time */}
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            Last Updated
          </p>
          <p className="text-sm font-mono text-foreground">
            {new Date()?.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {systemHealth?.filter(s => s?.status === 'connected')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Systems Online</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {systemHealth?.filter(s => s?.status === 'warning')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Systems Degraded</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error">
              {systemHealth?.filter(s => s?.status === 'error')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Systems Down</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {criticalAlertCount}
            </p>
            <p className="text-xs text-muted-foreground">Critical Alerts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {Math.round((systemHealth?.filter(s => s?.status === 'connected')?.length / systemHealth?.length) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground">Uptime</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthBanner;