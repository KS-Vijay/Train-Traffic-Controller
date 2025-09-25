import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MetricsStrip from './components/MetricsStrip';
import VisualizationTabs from './components/VisualizationTabs';
import FilterPanel from './components/FilterPanel';
import BenchmarkingTable from './components/BenchmarkingTable';
import MetricDetailModal from './components/MetricDetailModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PerformanceAnalytics = () => {
  const [activeTab, setActiveTab] = useState('delays');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filters, setFilters] = useState({
    timeRange: 'week',
    route: 'all',
    trainType: 'all',
    weather: 'all'
  });

  // Mock data for metrics
  const metricsData = [
    {
      id: 'on-time',
      type: 'onTime',
      title: 'On-Time Performance',
      value: 87.6,
      unit: '%',
      target: 90,
      variance: -2.7,
      trend: 'down',
      trendValue: '2.3%',
      isPositiveTrend: false
    },
    {
      id: 'avg-delays',
      type: 'delays',
      title: 'Average Delays',
      value: 4.2,
      unit: ' min',
      target: 3.5,
      variance: 20,
      trend: 'up',
      trendValue: '0.8min',
      isPositiveTrend: false
    },
    {
      id: 'throughput',
      type: 'throughput',
      title: 'Daily Throughput',
      value: 152,
      unit: ' trains',
      target: 145,
      variance: 4.8,
      trend: 'up',
      trendValue: '7 trains',
      isPositiveTrend: true
    },
    {
      id: 'safety',
      type: 'safety',
      title: 'Safety Incidents',
      value: 0,
      unit: '',
      target: 0,
      variance: 0,
      trend: 'stable',
      trendValue: '0',
      isPositiveTrend: true
    }
  ];

  // Mock data for visualizations
  const visualizationData = {
    delayDistribution: [
      { range: '0-2 min', count: 45 },
      { range: '2-5 min', count: 32 },
      { range: '5-10 min', count: 18 },
      { range: '10-15 min', count: 12 },
      { range: '15-30 min', count: 8 },
      { range: '30+ min', count: 3 }
    ],
    throughputTrends: [
      { time: '06:00', actual: 12, capacity: 20 },
      { time: '08:00', actual: 18, capacity: 20 },
      { time: '10:00', actual: 15, capacity: 20 },
      { time: '12:00', actual: 16, capacity: 20 },
      { time: '14:00', actual: 14, capacity: 20 },
      { time: '16:00', actual: 17, capacity: 20 },
      { time: '18:00', actual: 19, capacity: 20 },
      { time: '20:00', actual: 13, capacity: 20 }
    ],
    routePerformance: [
      { route: 'Main Line', performance: 92.3 },
      { route: 'Express Route', performance: 89.7 },
      { route: 'Branch A', performance: 85.4 },
      { route: 'Branch B', performance: 83.1 },
      { route: 'Local Route', performance: 78.9 }
    ]
  };

  // Mock data for benchmarking table
  const benchmarkingData = [
    {
      metric: 'On-Time Performance',
      description: 'Trains arriving within 5 minutes of schedule',
      icon: 'Clock',
      actual: 87.6,
      target: 90.0,
      variance: -2.7,
      unit: '%',
      status: 'warning',
      recommendation: 'Focus on signal optimization and predictive maintenance to reduce delays'
    },
    {
      metric: 'Average Delay Time',
      description: 'Mean delay across all services',
      icon: 'AlertTriangle',
      actual: 4.2,
      target: 3.5,
      variance: -20.0,
      unit: ' min',
      status: 'critical',
      recommendation: 'Implement dynamic routing and congestion management protocols'
    },
    {
      metric: 'Daily Throughput',
      description: 'Total trains processed per day',
      icon: 'TrendingUp',
      actual: 152,
      target: 145,
      variance: 4.8,
      unit: '',
      status: 'excellent',
      recommendation: 'Maintain current operational efficiency and consider capacity expansion'
    },
    {
      metric: 'Track Utilization',
      description: 'Percentage of track capacity used',
      icon: 'Activity',
      actual: 73.8,
      target: 75.0,
      variance: -1.6,
      unit: '%',
      status: 'good',
      recommendation: 'Optimize scheduling during off-peak hours for better utilization'
    },
    {
      metric: 'Safety Score',
      description: 'Incident-free operation rating',
      icon: 'Shield',
      actual: 99.8,
      target: 100.0,
      variance: -0.2,
      unit: '%',
      status: 'excellent',
      recommendation: 'Continue current safety protocols and enhance crew training'
    },
    {
      metric: 'Customer Satisfaction',
      description: 'Passenger satisfaction rating',
      icon: 'Heart',
      actual: 4.2,
      target: 4.5,
      variance: -6.7,
      unit: '/5',
      status: 'warning',
      recommendation: 'Improve communication during delays and enhance station amenities'
    }
  ];

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
    setIsModalOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    // In a real app, this would trigger data refetch
    console.log('Applying filters:', filters);
    setLastUpdated(new Date());
  };

  const handleResetFilters = () => {
    setFilters({
      timeRange: 'week',
      route: 'all',
      trainType: 'all',
      weather: 'all'
    });
  };

  const handleExport = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting performance report...');
  };

  const handleRefreshData = () => {
    setLastUpdated(new Date());
    // In a real app, this would trigger data refetch
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive operational intelligence and KPI tracking
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString()}
              </div>
              <Button variant="outline" size="sm" onClick={handleRefreshData}>
                <Icon name="RefreshCw" size={14} className="mr-1" />
                Refresh
              </Button>
              <Button variant="default" size="sm" onClick={handleExport}>
                <Icon name="Download" size={14} className="mr-1" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Metrics Strip */}
          <MetricsStrip 
            metrics={metricsData} 
            onMetricClick={handleMetricClick}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Visualization Area (12 cols equivalent) */}
            <div className="lg:col-span-3">
              <VisualizationTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                data={visualizationData}
              />
            </div>

            {/* Filter Panel (4 cols equivalent) */}
            <div className="lg:col-span-1">
              <FilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
            </div>
          </div>

          {/* Benchmarking Table */}
          <BenchmarkingTable
            data={benchmarkingData}
            onExport={handleExport}
          />
        </div>
      </main>
      {/* Metric Detail Modal */}
      <MetricDetailModal
        metric={selectedMetric}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PerformanceAnalytics;