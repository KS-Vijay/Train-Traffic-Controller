import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertCard = ({ alert, onAcknowledge, onAssign, onViewDetails, isSelected, onSelect }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'border-l-error bg-error/5';
      case 'high': return 'border-l-warning bg-warning/5';
      case 'medium': return 'border-l-accent bg-accent/5';
      case 'low': return 'border-l-success bg-success/5';
      default: return 'border-l-muted bg-muted/5';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'AlertTriangle';
      case 'high': return 'AlertCircle';
      case 'medium': return 'Info';
      case 'low': return 'CheckCircle';
      default: return 'Bell';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return alertTime?.toLocaleDateString();
  };

  return (
    <div 
      className={`
        border-l-4 bg-card border border-border rounded-lg p-4 cursor-pointer transition-control
        ${getSeverityColor(alert?.severity)}
        ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-muted/10'}
      `}
      onClick={() => onSelect(alert?.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Icon 
            name={getSeverityIcon(alert?.severity)} 
            size={20} 
            className={`${getSeverityTextColor(alert?.severity)} status-breathing`}
          />
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight">
              {alert?.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {alert?.location} • {formatTimestamp(alert?.timestamp)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${getSeverityTextColor(alert?.severity)} bg-current/10
          `}>
            {alert?.severity?.toUpperCase()}
          </span>
          {alert?.status === 'unacknowledged' && (
            <div className="w-2 h-2 bg-error rounded-full status-breathing" />
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {alert?.description}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Icon name="Train" size={12} />
            <span>{alert?.affectedTrains} trains</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Clock" size={12} />
            <span>{alert?.estimatedDelay}min delay</span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {alert?.status === 'unacknowledged' && (
            <Button
              variant="outline"
              size="xs"
              onClick={(e) => {
                e?.stopPropagation();
                onAcknowledge(alert?.id);
              }}
            >
              Acknowledge
            </Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onViewDetails(alert);
            }}
          >
            Details
          </Button>
        </div>
      </div>
      {alert?.assignedTo && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="User" size={12} />
            <span>Assigned to: {alert?.assignedTo}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCard;