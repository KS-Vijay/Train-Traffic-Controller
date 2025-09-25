import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AlertFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  alertCounts 
}) => {
  const severityOptions = [
    { value: 'all', label: 'All Severities', count: alertCounts?.total },
    { value: 'critical', label: 'Critical', count: alertCounts?.critical },
    { value: 'high', label: 'High', count: alertCounts?.high },
    { value: 'medium', label: 'Medium', count: alertCounts?.medium },
    { value: 'low', label: 'Low', count: alertCounts?.low }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', count: alertCounts?.total },
    { value: 'unacknowledged', label: 'Unacknowledged', count: alertCounts?.unacknowledged },
    { value: 'acknowledged', label: 'Acknowledged', count: alertCounts?.acknowledged },
    { value: 'in-progress', label: 'In Progress', count: alertCounts?.inProgress },
    { value: 'resolved', label: 'Resolved', count: alertCounts?.resolved }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'signal', label: 'Signal Issues' },
    { value: 'track', label: 'Track Problems' },
    { value: 'train', label: 'Train Incidents' },
    { value: 'weather', label: 'Weather Alerts' },
    { value: 'system', label: 'System Errors' }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center space-x-2">
          <Icon name="Filter" size={18} />
          <span>Alert Filters</span>
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={16} className="mr-1" />
          Clear All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search alerts by keyword, location, or train ID..."
            value={filters?.search}
            onChange={(e) => onFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Date Range */}
        <div>
          <Input
            type="date"
            label="From Date"
            value={filters?.dateFrom}
            onChange={(e) => onFilterChange('dateFrom', e?.target?.value)}
          />
        </div>

        <div>
          <Input
            type="date"
            label="To Date"
            value={filters?.dateTo}
            onChange={(e) => onFilterChange('dateTo', e?.target?.value)}
          />
        </div>
      </div>
      {/* Filter Buttons */}
      <div className="space-y-4">
        {/* Severity Filters */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Severity Level
          </label>
          <div className="flex flex-wrap gap-2">
            {severityOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={filters?.severity === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange('severity', option?.value)}
                className={`
                  ${filters?.severity === option?.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                  }
                `}
              >
                <span className={option?.value !== 'all' ? getSeverityColor(option?.value) : ''}>
                  {option?.label}
                </span>
                {option?.count !== undefined && (
                  <span className="ml-2 px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                    {option?.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Alert Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={filters?.status === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange('status', option?.value)}
                className={`
                  ${filters?.status === option?.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                  }
                `}
              >
                {option?.label}
                {option?.count !== undefined && (
                  <span className="ml-2 px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                    {option?.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Type Filters */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Alert Type
          </label>
          <div className="flex flex-wrap gap-2">
            {typeOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={filters?.type === option?.value ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange('type', option?.value)}
                className={`
                  ${filters?.type === option?.value 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                  }
                `}
              >
                {option?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertFilters;