import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BulkActions = ({ 
  selectedAlerts, 
  onBulkAcknowledge, 
  onBulkAssign, 
  onBulkStatusChange,
  onClearSelection 
}) => {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [assignee, setAssignee] = useState('');

  if (selectedAlerts?.length === 0) {
    return null;
  }

  const handleBulkAssign = () => {
    if (assignee?.trim()) {
      onBulkAssign(selectedAlerts, assignee);
      setAssignee('');
      setShowAssignForm(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">
            Bulk Actions
          </h3>
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {selectedAlerts?.length} selected
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={16} className="mr-1" />
          Clear Selection
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        {/* Acknowledge All */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkAcknowledge(selectedAlerts)}
        >
          <Icon name="Check" size={16} className="mr-2" />
          Acknowledge All
        </Button>

        {/* Assign All */}
        <div className="relative">
          {!showAssignForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAssignForm(true)}
            >
              <Icon name="UserPlus" size={16} className="mr-2" />
              Assign All
            </Button>
          ) : (
            <div className="flex items-center space-x-2 bg-muted/20 rounded-lg p-2">
              <Input
                placeholder="Enter assignee name"
                value={assignee}
                onChange={(e) => setAssignee(e?.target?.value)}
                className="w-48"
              />
              <Button size="sm" onClick={handleBulkAssign}>
                Assign
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAssignForm(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          )}
        </div>

        {/* Status Changes */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkStatusChange(selectedAlerts, 'in-progress')}
        >
          <Icon name="Play" size={16} className="mr-2" />
          Start Progress
        </Button>

        <Button
          variant="success"
          size="sm"
          onClick={() => onBulkStatusChange(selectedAlerts, 'resolved')}
        >
          <Icon name="CheckCircle" size={16} className="mr-2" />
          Mark Resolved
        </Button>
      </div>
      {/* Selection Summary */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Critical:</span>
            <span className="ml-2 font-medium text-error">
              {selectedAlerts?.filter(id => 
                // This would need to be passed from parent or calculated
                true // placeholder
              )?.length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">High:</span>
            <span className="ml-2 font-medium text-warning">
              {selectedAlerts?.filter(id => 
                // This would need to be passed from parent or calculated
                true // placeholder
              )?.length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Unacknowledged:</span>
            <span className="ml-2 font-medium text-accent">
              {selectedAlerts?.filter(id => 
                // This would need to be passed from parent or calculated
                true // placeholder
              )?.length}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Impact:</span>
            <span className="ml-2 font-medium text-foreground">
              High Priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;