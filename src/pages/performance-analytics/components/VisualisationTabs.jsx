import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VisualizationTabs = ({ activeTab, onTabChange, data }) => {
  const tabs = [
    { id: 'delays', label: 'Delay Analysis', icon: 'Clock' },
    { id: 'throughput', label: 'Throughput Trends', icon: 'TrendingUp' },
    { id: 'routes', label: 'Route Performance', icon: 'Route' }
  ];

  const renderDelayAnalysis = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Delay Distribution Analysis</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Last 30 days</span>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data?.delayDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="range" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Avg Delay</div>
          <div className="text-xl font-bold text-warning">4.2 min</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Max Delay</div>
          <div className="text-xl font-bold text-error">45 min</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground">On-Time %</div>
          <div className="text-xl font-bold text-success">87.3%</div>
        </div>
      </div>
    </div>
  );

  const renderThroughputTrends = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Throughput & Capacity Analysis</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Download" size={14} className="mr-1" />
            Export
          </Button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.throughputTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              name="Actual Throughput"
            />
            <Line 
              type="monotone" 
              dataKey="capacity" 
              stroke="var(--color-warning)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Track Capacity"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Peak Utilization</div>
          <div className="text-xl font-bold text-warning">94.2%</div>
          <div className="text-xs text-muted-foreground mt-1">08:00 - 09:00</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm text-muted-foreground">Avg Utilization</div>
          <div className="text-xl font-bold text-success">73.8%</div>
          <div className="text-xs text-muted-foreground mt-1">Daily average</div>
        </div>
      </div>
    </div>
  );

  const renderRoutePerformance = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Route Performance Comparison</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="MapPin" size={16} />
          <span>All active routes</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data?.routePerformance} 
            layout="horizontal"
            margin={{ left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              type="number" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              type="category" 
              dataKey="route" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              width={80}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
            />
            <Bar 
              dataKey="performance" 
              fill="var(--color-secondary)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Top Performing Routes</h4>
        {data?.routePerformance?.slice(0, 3)?.map((route, index) => (
          <div key={route?.route} className="flex items-center justify-between p-2 bg-muted/30 rounded">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                index === 0 ? 'bg-warning text-warning-foreground' :
                index === 1 ? 'bg-muted text-muted-foreground': 'bg-accent/20 text-accent'
              }`}>
                {index + 1}
              </div>
              <span className="text-sm font-medium text-foreground">{route?.route}</span>
            </div>
            <span className="text-sm font-bold text-success">{route?.performance}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'delays':
        return renderDelayAnalysis();
      case 'throughput':
        return renderThroughputTrends();
      case 'routes':
        return renderRoutePerformance();
      default:
        return renderDelayAnalysis();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => onTabChange(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-control ${
              activeTab === tab?.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default VisualizationTabs;