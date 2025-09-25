import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AlertThresholds = ({ thresholds, onUpdateThreshold }) => {
  const [editingThreshold, setEditingThreshold] = useState(null);
  const [editValues, setEditValues] = useState({});

  const handleEdit = (threshold) => {
    setEditingThreshold(threshold?.id);
    setEditValues({
      warning: threshold?.warning,
      critical: threshold?.critical
    });
  };

  const handleSave = (thresholdId) => {
    onUpdateThreshold(thresholdId, editValues);
    setEditingThreshold(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingThreshold(null);
    setEditValues({});
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Alert Thresholds</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Settings"
          iconPosition="left"
        >
          Global Settings
        </Button>
      </div>
      <div className="space-y-4">
        {thresholds?.map((threshold) => (
          <div key={threshold?.id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Icon name={threshold?.icon} size={20} className="text-muted-foreground" />
                <div>
                  <h3 className="font-medium text-foreground">{threshold?.name}</h3>
                  <p className="text-sm text-muted-foreground">{threshold?.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                  threshold?.enabled ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${threshold?.enabled ? 'bg-success' : 'bg-muted-foreground'}`}></div>
                  <span>{threshold?.enabled ? 'Active' : 'Disabled'}</span>
                </div>
                {editingThreshold === threshold?.id ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(threshold?.id)}
                      iconName="Check"
                    >
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      iconName="X"
                    >
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(threshold)}
                    iconName="Edit"
                  >
                  </Button>
                )}
              </div>
            </div>

            {editingThreshold === threshold?.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Warning Threshold"
                  type="number"
                  value={editValues?.warning}
                  onChange={(e) => setEditValues({...editValues, warning: e?.target?.value})}
                  placeholder="Enter warning value"
                />
                <Input
                  label="Critical Threshold"
                  type="number"
                  value={editValues?.critical}
                  onChange={(e) => setEditValues({...editValues, critical: e?.target?.value})}
                  placeholder="Enter critical value"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/5 rounded-lg">
                  <div className="text-lg font-semibold text-foreground">{threshold?.current}</div>
                  <div className="text-sm text-muted-foreground">Current Value</div>
                </div>
                <div className="text-center p-3 bg-warning/5 rounded-lg">
                  <div className="text-lg font-semibold text-warning">{threshold?.warning}</div>
                  <div className="text-sm text-muted-foreground">Warning Level</div>
                </div>
                <div className="text-center p-3 bg-error/5 rounded-lg">
                  <div className="text-lg font-semibold text-error">{threshold?.critical}</div>
                  <div className="text-sm text-muted-foreground">Critical Level</div>
                </div>
              </div>
            )}

            {/* Recent Alerts */}
            {threshold?.recentAlerts && threshold?.recentAlerts?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-2">Recent Alerts</h4>
                <div className="space-y-2">
                  {threshold?.recentAlerts?.slice(0, 3)?.map((alert, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <Icon 
                        name={getSeverityIcon(alert?.severity)} 
                        size={14} 
                        className={getSeverityColor(alert?.severity)} 
                      />
                      <span className="text-muted-foreground">{alert?.timestamp}</span>
                      <span className="text-foreground">{alert?.message}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert?.severity)} bg-current/10`}>
                        {alert?.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" iconName="TestTube" iconPosition="left">
            Test All Alerts
          </Button>
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export Config
          </Button>
          <Button variant="outline" size="sm" iconName="Upload" iconPosition="left">
            Import Config
          </Button>
          <Button variant="outline" size="sm" iconName="RotateCcw" iconPosition="left">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertThresholds;