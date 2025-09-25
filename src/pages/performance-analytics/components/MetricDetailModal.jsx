import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MetricDetailModal = ({ metric, isOpen, onClose }) => {
  if (!isOpen || !metric) return null;

  const mockDetailData = {
    onTime: {
      trend: [
        { date: '2025-09-15', value: 89.2 },
        { date: '2025-09-16', value: 91.5 },
        { date: '2025-09-17', value: 87.8 },
        { date: '2025-09-18', value: 93.1 },
        { date: '2025-09-19', value: 88.9 },
        { date: '2025-09-20', value: 90.4 },
        { date: '2025-09-21', value: 92.3 },
        { date: '2025-09-22', value: 87.6 }
      ],
      factors: [
        { factor: 'Signal Delays', impact: 35, color: 'var(--color-error)' },
        { factor: 'Weather', impact: 25, color: 'var(--color-warning)' },
        { factor: 'Maintenance', impact: 20, color: 'var(--color-primary)' },
        { factor: 'Passenger Loading', impact: 15, color: 'var(--color-secondary)' },
        { factor: 'Other', impact: 5, color: 'var(--color-muted)' }
      ]
    },
    delays: {
      trend: [
        { date: '2025-09-15', value: 4.8 },
        { date: '2025-09-16', value: 3.2 },
        { date: '2025-09-17', value: 5.9 },
        { date: '2025-09-18', value: 2.1 },
        { date: '2025-09-19', value: 4.5 },
        { date: '2025-09-20', value: 3.8 },
        { date: '2025-09-21', value: 2.9 },
        { date: '2025-09-22', value: 5.2 }
      ],
      factors: [
        { factor: 'Track Congestion', impact: 40, color: 'var(--color-error)' },
        { factor: 'Equipment Issues', impact: 30, color: 'var(--color-warning)' },
        { factor: 'Weather Conditions', impact: 20, color: 'var(--color-primary)' },
        { factor: 'Crew Changes', impact: 10, color: 'var(--color-secondary)' }
      ]
    },
    throughput: {
      trend: [
        { date: '2025-09-15', value: 142 },
        { date: '2025-09-16', value: 156 },
        { date: '2025-09-17', value: 138 },
        { date: '2025-09-18', value: 164 },
        { date: '2025-09-19', value: 149 },
        { date: '2025-09-20', value: 158 },
        { date: '2025-09-21', value: 167 },
        { date: '2025-09-22', value: 152 }
      ],
      factors: [
        { factor: 'Peak Hour Efficiency', impact: 45, color: 'var(--color-success)' },
        { factor: 'Track Utilization', impact: 35, color: 'var(--color-primary)' },
        { factor: 'Schedule Optimization', impact: 20, color: 'var(--color-secondary)' }
      ]
    },
    safety: {
      trend: [
        { date: '2025-09-15', value: 0 },
        { date: '2025-09-16', value: 1 },
        { date: '2025-09-17', value: 0 },
        { date: '2025-09-18', value: 0 },
        { date: '2025-09-19', value: 2 },
        { date: '2025-09-20', value: 0 },
        { date: '2025-09-21', value: 0 },
        { date: '2025-09-22', value: 1 }
      ],
      factors: [
        { factor: 'Signal Malfunctions', impact: 50, color: 'var(--color-error)' },
        { factor: 'Track Defects', impact: 30, color: 'var(--color-warning)' },
        { factor: 'Human Error', impact: 20, color: 'var(--color-primary)' }
      ]
    }
  };

  const detailData = mockDetailData?.[metric?.type] || mockDetailData?.onTime;

  const recommendations = {
    onTime: [
      "Implement predictive signal maintenance to reduce signal-related delays",
      "Optimize train scheduling during peak weather periods",
      "Increase maintenance windows during low-traffic hours"
    ],
    delays: [
      "Deploy dynamic routing algorithms to avoid congested sections",
      "Implement real-time equipment monitoring for early issue detection",
      "Establish weather-based operational protocols"
    ],
    throughput: [
      "Extend peak hour service frequency on high-demand routes",
      "Optimize track switching algorithms for better utilization",
      "Implement AI-driven schedule optimization"
    ],
    safety: [
      "Increase signal system redundancy and backup protocols",
      "Implement automated track inspection systems",
      "Enhance crew training and certification programs"
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={metric?.type === 'onTime' ? 'Clock' : metric?.type === 'delays' ? 'AlertTriangle' : metric?.type === 'throughput' ? 'TrendingUp' : 'Shield'} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{metric?.title} Analysis</h2>
              <p className="text-sm text-muted-foreground">Detailed performance breakdown and insights</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Current Value</div>
              <div className="text-2xl font-bold text-foreground">
                {metric?.value}{metric?.unit}
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Target</div>
              <div className="text-2xl font-bold text-muted-foreground">
                {metric?.target}{metric?.unit}
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Variance</div>
              <div className={`text-2xl font-bold ${metric?.variance > 0 ? 'text-success' : 'text-error'}`}>
                {metric?.variance > 0 ? '+' : ''}{metric?.variance}%
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">7-Day Trend</h3>
            <div className="h-64 bg-muted/10 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={detailData?.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                    labelFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="var(--color-primary)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Contributing Factors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contributing Factors</h3>
            <div className="h-64 bg-muted/10 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={detailData?.factors} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis 
                    type="category" 
                    dataKey="factor" 
                    stroke="var(--color-muted-foreground)" 
                    fontSize={12}
                    width={120}
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
                    dataKey="impact" 
                    fill="var(--color-secondary)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Improvement Recommendations</h3>
            <div className="space-y-3">
              {recommendations?.[metric?.type]?.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-muted/20 rounded-lg">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                  </div>
                  <p className="text-sm text-foreground">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/10">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date()?.toLocaleString()}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={14} className="mr-1" />
              Export Report
            </Button>
            <Button variant="default" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricDetailModal;