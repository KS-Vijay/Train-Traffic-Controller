import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RecommendationHistory = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const historyData = [
    {
      id: 1,
      title: 'Route Optimization - Track 7A',
      type: 'routing',
      timestamp: new Date(Date.now() - 3600000),
      status: 'accepted',
      outcome: 'success',
      impactRealized: { delayReduction: 12, efficiencyGain: 8.5, costSaving: 2.3 },
      confidence: 92
    },
    {
      id: 2,
      title: 'Schedule Adjustment - Express Line',
      type: 'scheduling',
      timestamp: new Date(Date.now() - 7200000),
      status: 'overridden',
      outcome: 'manual',
      impactRealized: null,
      confidence: 78
    },
    {
      id: 3,
      title: 'Traffic Flow Optimization',
      type: 'traffic',
      timestamp: new Date(Date.now() - 10800000),
      status: 'accepted',
      outcome: 'success',
      impactRealized: { delayReduction: 8, efficiencyGain: 12.3, costSaving: 4.1 },
      confidence: 89
    },
    {
      id: 4,
      title: 'Platform Assignment Change',
      type: 'routing',
      timestamp: new Date(Date.now() - 14400000),
      status: 'accepted',
      outcome: 'partial',
      impactRealized: { delayReduction: 5, efficiencyGain: 3.2, costSaving: 1.8 },
      confidence: 85
    },
    {
      id: 5,
      title: 'Signal Timing Adjustment',
      type: 'traffic',
      timestamp: new Date(Date.now() - 18000000),
      status: 'overridden',
      outcome: 'manual',
      impactRealized: null,
      confidence: 71
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'text-success';
      case 'overridden': return 'text-warning';
      case 'pending': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'success': return 'text-success';
      case 'partial': return 'text-warning';
      case 'failed': return 'text-error';
      case 'manual': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'routing': return 'Route';
      case 'scheduling': return 'Clock';
      case 'traffic': return 'Zap';
      default: return 'Brain';
    }
  };

  const acceptanceRate = Math.round(
    (historyData?.filter(item => item?.status === 'accepted')?.length / historyData?.length) * 100
  );

  const successRate = Math.round(
    (historyData?.filter(item => item?.outcome === 'success')?.length / 
     historyData?.filter(item => item?.status === 'accepted')?.length) * 100
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
            <Icon name="History" size={18} color="var(--color-secondary-foreground)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Recommendation History</h2>
            <p className="text-sm text-muted-foreground">
              Performance tracking and outcome analysis
            </p>
          </div>
        </div>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e?.target?.value)}
          className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {periods?.map(period => (
            <option key={period?.value} value={period?.value}>
              {period?.label}
            </option>
          ))}
        </select>
      </div>
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {acceptanceRate}%
          </div>
          <div className="text-xs text-muted-foreground">Acceptance Rate</div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success mb-1">
            {successRate}%
          </div>
          <div className="text-xs text-muted-foreground">Success Rate</div>
        </div>
      </div>
      {/* History List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {historyData?.map((item) => (
          <div key={item?.id} className="bg-background border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-muted rounded flex items-center justify-center mt-0.5">
                  <Icon name={getTypeIcon(item?.type)} size={14} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {item?.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{item?.timestamp?.toLocaleTimeString()}</span>
                    <span className={`font-medium capitalize ${getStatusColor(item?.status)}`}>
                      {item?.status}
                    </span>
                    {item?.outcome && (
                      <span className={`font-medium capitalize ${getOutcomeColor(item?.outcome)}`}>
                        {item?.outcome}
                      </span>
                    )}
                    <span>Confidence: {item?.confidence}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Realized */}
            {item?.impactRealized && (
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                <div className="text-center">
                  <div className="text-sm font-medium text-success">
                    -{item?.impactRealized?.delayReduction}min
                  </div>
                  <div className="text-xs text-muted-foreground">Delay Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-success">
                    +{item?.impactRealized?.efficiencyGain}%
                  </div>
                  <div className="text-xs text-muted-foreground">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-accent">
                    ${item?.impactRealized?.costSaving}k
                  </div>
                  <div className="text-xs text-muted-foreground">Cost Saved</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* View All Button */}
      <div className="mt-4 text-center">
        <button className="text-sm text-accent hover:text-accent/80 transition-control">
          View Complete History
        </button>
      </div>
    </div>
  );
};

export default RecommendationHistory;