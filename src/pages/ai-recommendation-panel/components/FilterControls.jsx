import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onBatchProcess, selectedCount }) => {
  const urgencyOptions = [
    { value: 'all', label: 'All Urgency' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'routing', label: 'Routing' },
    { value: 'scheduling', label: 'Scheduling' },
    { value: 'traffic', label: 'Traffic Flow' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const routeOptions = [
    { value: 'all', label: 'All Routes' },
    { value: 'main-line', label: 'Main Line' },
    { value: 'express', label: 'Express Routes' },
    { value: 'local', label: 'Local Routes' },
    { value: 'freight', label: 'Freight Lines' }
  ];

  const sortOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'confidence', label: 'Confidence' },
    { value: 'impact', label: 'Impact' },
    { value: 'timestamp', label: 'Time Created' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={18} className="text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filter & Sort Recommendations</h3>
        </div>

        <div className="flex items-center space-x-2">
          {selectedCount > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={onBatchProcess}
              iconName="Zap"
              iconPosition="left"
            >
              Process {selectedCount} Selected
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onFilterChange('reset')}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Urgency Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Urgency Level
          </label>
          <select
            value={filters?.urgency}
            onChange={(e) => onFilterChange('urgency', e?.target?.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {urgencyOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Recommendation Type
          </label>
          <select
            value={filters?.type}
            onChange={(e) => onFilterChange('type', e?.target?.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {typeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Route Filter */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Affected Routes
          </label>
          <select
            value={filters?.route}
            onChange={(e) => onFilterChange('route', e?.target?.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {routeOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Sort By
          </label>
          <select
            value={filters?.sortBy}
            onChange={(e) => onFilterChange('sortBy', e?.target?.value)}
            className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {sortOptions?.map(option => (
              <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            ))}
          </select>
        </div>

        {/* Confidence Range */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Min Confidence
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters?.minConfidence}
              onChange={(e) => onFilterChange('minConfidence', parseInt(e?.target?.value))}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-foreground font-medium w-8">
              {filters?.minConfidence}%
            </span>
          </div>
        </div>
      </div>
      {/* Active Filters Display */}
      {(filters?.urgency !== 'all' || filters?.type !== 'all' || filters?.route !== 'all' || filters?.minConfidence > 0) && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          
          {filters?.urgency !== 'all' && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              {urgencyOptions?.find(o => o?.value === filters?.urgency)?.label}
            </span>
          )}
          
          {filters?.type !== 'all' && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              {typeOptions?.find(o => o?.value === filters?.type)?.label}
            </span>
          )}
          
          {filters?.route !== 'all' && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              {routeOptions?.find(o => o?.value === filters?.route)?.label}
            </span>
          )}
          
          {filters?.minConfidence > 0 && (
            <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              Min {filters?.minConfidence}% confidence
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;