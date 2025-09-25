import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ filters, onFilterChange, onApplyFilters, onResetFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const routeOptions = [
    { value: 'all', label: 'All Routes' },
    { value: 'main-line', label: 'Main Line' },
    { value: 'branch-a', label: 'Branch A' },
    { value: 'branch-b', label: 'Branch B' },
    { value: 'express', label: 'Express Route' },
    { value: 'local', label: 'Local Route' }
  ];

  const trainTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'passenger', label: 'Passenger' },
    { value: 'freight', label: 'Freight' },
    { value: 'express', label: 'Express' },
    { value: 'local', label: 'Local' }
  ];

  const weatherOptions = [
    { value: 'all', label: 'All Weather' },
    { value: 'clear', label: 'Clear' },
    { value: 'rain', label: 'Rain' },
    { value: 'snow', label: 'Snow' },
    { value: 'fog', label: 'Fog' },
    { value: 'wind', label: 'High Wind' }
  ];

  const presetReports = [
    {
      id: 'daily-ops',
      name: 'Daily Operations',
      description: 'Today\'s performance overview',
      filters: { timeRange: 'today', route: 'all', trainType: 'all' }
    },
    {
      id: 'weekly-summary',
      name: 'Weekly Summary',
      description: 'Week performance trends',
      filters: { timeRange: 'week', route: 'all', trainType: 'all' }
    },
    {
      id: 'freight-analysis',
      name: 'Freight Analysis',
      description: 'Freight train performance',
      filters: { timeRange: 'month', route: 'all', trainType: 'freight' }
    },
    {
      id: 'weather-impact',
      name: 'Weather Impact',
      description: 'Performance during adverse weather',
      filters: { timeRange: 'month', weather: 'rain' }
    }
  ];

  const handlePresetSelect = (preset) => {
    onFilterChange(preset?.filters);
    onApplyFilters();
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={16} />
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="p-4 space-y-6">
          {/* Time Range */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Time Range</label>
            <div className="grid grid-cols-1 gap-2">
              {timeRangeOptions?.map((option) => (
                <label key={option?.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeRange"
                    value={option?.value}
                    checked={filters?.timeRange === option?.value}
                    onChange={(e) => onFilterChange({ timeRange: e?.target?.value })}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{option?.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Date Range */}
          {filters?.timeRange === 'custom' && (
            <div className="space-y-3">
              <Input
                type="date"
                label="Start Date"
                value={filters?.startDate || ''}
                onChange={(e) => onFilterChange({ startDate: e?.target?.value })}
              />
              <Input
                type="date"
                label="End Date"
                value={filters?.endDate || ''}
                onChange={(e) => onFilterChange({ endDate: e?.target?.value })}
              />
            </div>
          )}

          {/* Route Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Route</label>
            <select
              value={filters?.route || 'all'}
              onChange={(e) => onFilterChange({ route: e?.target?.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {routeOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Train Type */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Train Type</label>
            <select
              value={filters?.trainType || 'all'}
              onChange={(e) => onFilterChange({ trainType: e?.target?.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {trainTypeOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weather Conditions */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Weather</label>
            <select
              value={filters?.weather || 'all'}
              onChange={(e) => onFilterChange({ weather: e?.target?.value })}
              className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {weatherOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="default"
              size="sm"
              onClick={onApplyFilters}
              className="flex-1"
            >
              <Icon name="Search" size={14} className="mr-1" />
              Apply
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex-1"
            >
              <Icon name="RotateCcw" size={14} className="mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Preset Reports */}
        <div className="border-t border-border p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Reports</h4>
          <div className="space-y-2">
            {presetReports?.map((preset) => (
              <button
                key={preset?.id}
                onClick={() => handlePresetSelect(preset)}
                className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-control"
              >
                <div className="text-sm font-medium text-foreground">{preset?.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{preset?.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;