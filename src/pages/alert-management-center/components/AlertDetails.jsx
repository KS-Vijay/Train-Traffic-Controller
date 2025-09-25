import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AlertDetails = ({ alert, onClose, onAssign, onUpdateStatus, onAddNote }) => {
  const [assignee, setAssignee] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showAssignForm, setShowAssignForm] = useState(false);

  if (!alert) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select an alert to view details</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-success';
      case 'in-progress': return 'text-warning';
      case 'acknowledged': return 'text-accent';
      case 'unacknowledged': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const handleAssign = () => {
    if (assignee?.trim()) {
      onAssign(alert?.id, assignee);
      setAssignee('');
      setShowAssignForm(false);
    }
  };

  const handleAddNote = () => {
    if (newNote?.trim()) {
      onAddNote(alert?.id, newNote);
      setNewNote('');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon 
              name={getSeverityIcon(alert?.severity)} 
              size={24} 
              className={`${getSeverityColor(alert?.severity)} status-breathing`}
            />
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {alert?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Alert ID: {alert?.id} • {formatTimestamp(alert?.timestamp)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${getSeverityColor(alert?.severity)} bg-current/10
          `}>
            {alert?.severity?.toUpperCase()}
          </span>
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${getStatusColor(alert?.status)} bg-current/10
          `}>
            {alert?.status?.replace('-', ' ')?.toUpperCase()}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Alert Information */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Info" size={18} />
            <span>Alert Information</span>
          </h3>
          <div className="bg-muted/20 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <p className="text-sm text-foreground">{alert?.location}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <p className="text-sm text-foreground">{alert?.type}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Affected Trains</label>
                <p className="text-sm text-foreground">{alert?.affectedTrains}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Estimated Delay</label>
                <p className="text-sm text-foreground">{alert?.estimatedDelay} minutes</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Description</label>
              <p className="text-sm text-foreground mt-1">{alert?.description}</p>
            </div>
          </div>
        </div>

        {/* Impact Assessment */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="TrendingDown" size={18} />
            <span>Impact Assessment</span>
          </h3>
          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-sm text-foreground">{alert?.impact}</p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="CheckSquare" size={18} />
            <span>Recommended Actions</span>
          </h3>
          <div className="space-y-2">
            {alert?.recommendedActions?.map((action, index) => (
              <div key={index} className="flex items-start space-x-3 bg-muted/20 rounded-lg p-3">
                <Icon name="ArrowRight" size={16} className="text-accent mt-0.5" />
                <p className="text-sm text-foreground">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="User" size={18} />
            <span>Assignment</span>
          </h3>
          {alert?.assignedTo ? (
            <div className="bg-muted/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                Assigned to: <span className="font-medium">{alert?.assignedTo}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Assigned on: {formatTimestamp(alert?.assignedAt)}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {!showAssignForm ? (
                <Button
                  variant="outline"
                  onClick={() => setShowAssignForm(true)}
                  className="w-full"
                >
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Assign to Team Member
                </Button>
              ) : (
                <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                  <Input
                    label="Assign to"
                    placeholder="Enter team member name or ID"
                    value={assignee}
                    onChange={(e) => setAssignee(e?.target?.value)}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={handleAssign} size="sm">
                      Assign
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAssignForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center space-x-2">
            <Icon name="MessageSquare" size={18} />
            <span>Notes & Updates</span>
          </h3>
          <div className="space-y-3">
            {alert?.notes && alert?.notes?.length > 0 ? (
              <div className="space-y-2">
                {alert?.notes?.map((note, index) => (
                  <div key={index} className="bg-muted/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-foreground">{note?.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(note?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{note?.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notes added yet.</p>
            )}
            
            <div className="bg-muted/20 rounded-lg p-4 space-y-3">
              <Input
                label="Add Note"
                placeholder="Enter update or note..."
                value={newNote}
                onChange={(e) => setNewNote(e?.target?.value)}
              />
              <Button onClick={handleAddNote} size="sm" disabled={!newNote?.trim()}>
                <Icon name="Plus" size={16} className="mr-2" />
                Add Note
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="p-6 border-t border-border">
        <div className="flex space-x-3">
          {alert?.status === 'unacknowledged' && (
            <Button
              onClick={() => onUpdateStatus(alert?.id, 'acknowledged')}
              className="flex-1"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Acknowledge
            </Button>
          )}
          {alert?.status === 'acknowledged' && (
            <Button
              onClick={() => onUpdateStatus(alert?.id, 'in-progress')}
              className="flex-1"
            >
              <Icon name="Play" size={16} className="mr-2" />
              Start Progress
            </Button>
          )}
          {alert?.status === 'in-progress' && (
            <Button
              onClick={() => onUpdateStatus(alert?.id, 'resolved')}
              variant="success"
              className="flex-1"
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Mark Resolved
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertDetails;