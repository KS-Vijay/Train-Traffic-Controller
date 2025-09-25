import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainTelemetry = ({ selectedTrain, alerts, onAlertAction }) => {
  const mockAlerts = [
    {
      id: 'A001',
      type: 'critical',
      title: 'Signal Failure - Block 7',
      message: 'Automatic block signal system failure detected. Manual control required.',
      timestamp: new Date(Date.now() - 300000),
      trainId: 'T002',
      location: 'Mile 45.2'
    },
    {
      id: 'A002',
      type: 'warning',
      title: 'Speed Restriction',
      message: 'Temporary speed limit 45 MPH due to track maintenance ahead.',
      timestamp: new Date(Date.now() - 600000),
      trainId: 'T001',
      location: 'Hartford Junction'
    },
    {
      id: 'A003',
      type: 'info',
      title: 'Schedule Update',
      message: 'Express 2401 running 3 minutes ahead of schedule.',
      timestamp: new Date(Date.now() - 900000),
      trainId: 'T001',
      location: 'Mile 32.1'
    },
    {
      id: 'A004',
      type: 'critical',
      title: 'Track Obstruction',
      message: 'Debris detected on Track 2. Emergency stop protocol activated.',
      timestamp: new Date(Date.now() - 1200000),
      trainId: 'T005',
      location: 'Springfield Yard'
    },
    {
      id: 'A005',
      type: 'warning',
      title: 'Weather Advisory',
      message: 'Heavy rain expected. Reduced visibility conditions likely.',
      timestamp: new Date(Date.now() - 1800000),
      trainId: null,
      location: 'Network Wide'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'text-success';
      case 'delayed': return 'text-warning';
      case 'stopped': return 'text-error';
      case 'working': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date?.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <div className="w-full h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Live Telemetry
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Selected Train Details */}
        {selectedTrain ? (
          <div className="p-4 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium text-foreground">{selectedTrain?.name}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTrain?.status)}`}>
                {selectedTrain?.status?.replace('-', ' ')?.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Gauge" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Speed</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {selectedTrain?.speed} <span className="text-sm font-normal text-muted-foreground">MPH</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Next Station</span>
                </div>
                <div className="text-lg font-semibold text-foreground">{selectedTrain?.nextStation}</div>
                <div className="text-sm text-muted-foreground">ETA: {selectedTrain?.eta}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Icon name="Route" size={16} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Route</span>
              </div>
              <div className="text-sm font-medium text-foreground">{selectedTrain?.route}</div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" iconName="Radio">
                Contact
              </Button>
              <Button variant="outline" size="sm" iconName="Navigation">
                Track
              </Button>
              <Button variant="outline" size="sm" iconName="AlertTriangle">
                Alert
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-border">
            <div className="text-center py-8">
              <Icon name="MousePointer" size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a train on the map to view telemetry data</p>
            </div>
          </div>
        )}

        {/* Critical Alerts Feed */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-foreground">Critical Alerts</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-error rounded-full status-breathing"></div>
              <span className="text-xs text-muted-foreground">Live Feed</span>
            </div>
          </div>

          <div className="space-y-3">
            {mockAlerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`
                  p-3 rounded-lg border transition-control
                  ${alert?.type === 'critical' ?'bg-error/5 border-error/20' 
                    : alert?.type === 'warning' ?'bg-warning/5 border-warning/20' :'bg-muted/30 border-border'
                  }
                `}
              >
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={getAlertIcon(alert?.type)} 
                    size={16} 
                    className={`mt-0.5 ${getAlertColor(alert?.type)}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {alert?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground ml-2">
                        {getTimeAgo(alert?.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {alert?.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {alert?.trainId && (
                          <>
                            <Icon name="Train" size={12} />
                            <span>{alert?.trainId}</span>
                            <span>•</span>
                          </>
                        )}
                        <Icon name="MapPin" size={12} />
                        <span>{alert?.location}</span>
                      </div>
                      {alert?.type === 'critical' && (
                        <Button
                          variant="destructive"
                          size="xs"
                          onClick={() => onAlertAction?.(alert?.id)}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full" iconName="ExternalLink">
              View All Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainTelemetry;