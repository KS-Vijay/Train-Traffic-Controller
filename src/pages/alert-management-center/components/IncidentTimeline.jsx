import React from 'react';
import Icon from '../../../components/AppIcon';

const IncidentTimeline = ({ selectedAlert, timelineEvents }) => {
  if (!selectedAlert) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Clock" size={18} />
          <span>Incident Timeline</span>
        </h3>
        <div className="text-center text-muted-foreground py-8">
          <Icon name="Timeline" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select an alert to view incident timeline</p>
        </div>
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'created': return 'Plus';
      case 'acknowledged': return 'Check';
      case 'assigned': return 'User';
      case 'status_change': return 'RefreshCw';
      case 'note_added': return 'MessageSquare';
      case 'resolved': return 'CheckCircle';
      case 'escalated': return 'ArrowUp';
      default: return 'Circle';
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'created': return 'text-accent';
      case 'acknowledged': return 'text-warning';
      case 'assigned': return 'text-primary';
      case 'status_change': return 'text-secondary';
      case 'note_added': return 'text-muted-foreground';
      case 'resolved': return 'text-success';
      case 'escalated': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getTimeDifference = (current, previous) => {
    if (!previous) return null;
    const diff = new Date(current) - new Date(previous);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Clock" size={18} />
          <span>Incident Timeline</span>
        </h3>
        <div className="text-sm text-muted-foreground">
          Alert ID: {selectedAlert?.id}
        </div>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {timelineEvents?.map((event, index) => {
          const timeDiff = getTimeDifference(
            event?.timestamp, 
            timelineEvents?.[index + 1]?.timestamp
          );
          
          return (
            <div key={event?.id} className="relative">
              {/* Timeline Line */}
              {index < timelineEvents?.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-12 bg-border" />
              )}
              <div className="flex items-start space-x-4">
                {/* Event Icon */}
                <div className={`
                  w-8 h-8 rounded-full border-2 border-current flex items-center justify-center
                  bg-card ${getEventColor(event?.type)}
                `}>
                  <Icon name={getEventIcon(event?.type)} size={14} />
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground text-sm">
                      {event?.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {timeDiff && (
                        <span className="px-2 py-1 bg-muted rounded">
                          +{timeDiff}
                        </span>
                      )}
                      <span>{formatTimestamp(event?.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {event?.description}
                  </p>

                  {event?.details && (
                    <div className="bg-muted/20 rounded-lg p-3 text-sm">
                      {typeof event?.details === 'string' ? (
                        <p className="text-foreground">{event?.details}</p>
                      ) : (
                        <div className="space-y-1">
                          {Object.entries(event?.details)?.map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key?.replace('_', ' ')}:
                              </span>
                              <span className="text-foreground font-medium">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {event?.author && (
                    <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                      <Icon name="User" size={12} />
                      <span>by {event?.author}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Timeline Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">
              {timelineEvents?.length}
            </p>
            <p className="text-xs text-muted-foreground">Total Events</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {(() => {
                const created = timelineEvents?.find(e => e?.type === 'created');
                const resolved = timelineEvents?.find(e => e?.type === 'resolved');
                if (!created) return 'N/A';
                if (!resolved) return 'Ongoing';
                const diff = new Date(resolved.timestamp) - new Date(created.timestamp);
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
              })()}
            </p>
            <p className="text-xs text-muted-foreground">Resolution Time</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">
              {timelineEvents?.filter(e => e?.author)?.length}
            </p>
            <p className="text-xs text-muted-foreground">Manual Actions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentTimeline;