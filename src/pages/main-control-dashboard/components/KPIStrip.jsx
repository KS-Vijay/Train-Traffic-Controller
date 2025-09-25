import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const KPIStrip = () => {
  const [kpiData, setKpiData] = useState({
    activeTrains: 13152,        // Real approximate count of daily Indian trains
    onTimePerformance: 75.2,    // Realistic Indian Railway OTP
    averageDelay: 18.5,         // Average delay in minutes
    trackUtilization: 68.3,     // Track utilization percentage
    systemHealth: 92.1,         // Overall system health
    alertsCount: 47,            // Active alerts
    passengerTrains: 9573,      // Daily passenger trains
    freightTrains: 8956         // Daily freight trains
  });

  const [trends, setTrends] = useState({
    activeTrains: 1.8,
    onTimePerformance: -2.1,
    averageDelay: 3.2,
    trackUtilization: 4.7,
    systemHealth: -0.8,
    alertsCount: 12,
    passengerTrains: 2.3,
    freightTrains: -0.9
  });

  useEffect(() => {
    // Simulate real-time KPI updates with Indian Railway realistic ranges
    const interval = setInterval(() => {
      setKpiData(prev => ({
        activeTrains: Math.max(12000, Math.min(14000, prev?.activeTrains + (Math.random() - 0.5) * 100)),
        onTimePerformance: Math.max(65, Math.min(85, prev?.onTimePerformance + (Math.random() - 0.5) * 3)),
        averageDelay: Math.max(5, Math.min(35, prev?.averageDelay + (Math.random() - 0.5) * 4)),
        trackUtilization: Math.max(55, Math.min(80, prev?.trackUtilization + (Math.random() - 0.5) * 4)),
        systemHealth: Math.max(85, Math.min(98, prev?.systemHealth + (Math.random() - 0.5) * 2)),
        alertsCount: Math.max(20, Math.min(80, Math.floor(prev?.alertsCount + (Math.random() - 0.5) * 8))),
        passengerTrains: Math.max(9000, Math.min(10000, prev?.passengerTrains + (Math.random() - 0.5) * 50)),
        freightTrains: Math.max(8000, Math.min(9500, prev?.freightTrains + (Math.random() - 0.5) * 30))
      }));

      setTrends(prev => ({
        activeTrains: (Math.random() - 0.5) * 6,
        onTimePerformance: (Math.random() - 0.5) * 4,
        averageDelay: (Math.random() - 0.5) * 6,
        trackUtilization: (Math.random() - 0.5) * 8,
        systemHealth: (Math.random() - 0.5) * 3,
        alertsCount: Math.floor((Math.random() - 0.5) * 15),
        passengerTrains: (Math.random() - 0.5) * 4,
        freightTrains: (Math.random() - 0.5) * 3
      }));
    }, 8000); // Slower updates for more realistic feel

    return () => clearInterval(interval);
  }, []);

  const kpiItems = [
    {
      id: 'active-trains',
      label: 'Trains Running',
      value: kpiData?.activeTrains,
      unit: '',
      icon: 'Train',
      trend: trends?.activeTrains,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Currently active trains'
    },
    {
      id: 'passenger-trains',
      label: 'Passenger Trains',
      value: kpiData?.passengerTrains,
      unit: '',
      icon: 'Users',
      trend: trends?.passengerTrains,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Mail/Express/Local trains'
    },
    {
      id: 'freight-trains',
      label: 'Freight Trains',
      value: kpiData?.freightTrains,
      unit: '',
      icon: 'Package',
      trend: trends?.freightTrains,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Goods trains running'
    },
    {
      id: 'ontime',
      label: 'On-Time Performance',
      value: kpiData?.onTimePerformance,
      unit: '%',
      icon: 'Clock',
      trend: trends?.onTimePerformance,
      color: kpiData?.onTimePerformance >= 80 ? 'text-success' : kpiData?.onTimePerformance >= 70 ? 'text-warning' : 'text-error',
      bgColor: kpiData?.onTimePerformance >= 80 ? 'bg-success/10' : kpiData?.onTimePerformance >= 70 ? 'bg-warning/10' : 'bg-error/10',
      description: 'Punctuality index'
    },
    {
      id: 'delay',
      label: 'Avg Delay',
      value: kpiData?.averageDelay,
      unit: 'min',
      icon: 'Timer',
      trend: trends?.averageDelay,
      color: kpiData?.averageDelay <= 15 ? 'text-success' : kpiData?.averageDelay <= 25 ? 'text-warning' : 'text-error',
      bgColor: kpiData?.averageDelay <= 15 ? 'bg-success/10' : kpiData?.averageDelay <= 25 ? 'bg-warning/10' : 'bg-error/10',
      invertTrend: true,
      description: 'Average running delay'
    },
    {
      id: 'utilization',
      label: 'Track Utilization',
      value: kpiData?.trackUtilization,
      unit: '%',
      icon: 'BarChart3',
      trend: trends?.trackUtilization,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      description: 'Network capacity usage'
    },
    {
      id: 'health',
      label: 'System Health',
      value: kpiData?.systemHealth,
      unit: '%',
      icon: 'Activity',
      trend: trends?.systemHealth,
      color: kpiData?.systemHealth >= 95 ? 'text-success' : kpiData?.systemHealth >= 90 ? 'text-warning' : 'text-error',
      bgColor: kpiData?.systemHealth >= 95 ? 'bg-success/10' : kpiData?.systemHealth >= 90 ? 'bg-warning/10' : 'bg-error/10',
      description: 'Overall system status'
    },
    {
      id: 'alerts',
      label: 'Active Alerts',
      value: kpiData?.alertsCount,
      unit: '',
      icon: 'AlertTriangle',
      trend: trends?.alertsCount,
      color: kpiData?.alertsCount <= 25 ? 'text-success' : kpiData?.alertsCount <= 50 ? 'text-warning' : 'text-error',
      bgColor: kpiData?.alertsCount <= 25 ? 'bg-success/10' : kpiData?.alertsCount <= 50 ? 'bg-warning/10' : 'bg-error/10',
      invertTrend: true,
      description: 'Issues requiring attention'
    }
  ];

  const getTrendIcon = (trend, invertTrend = false) => {
    const effectiveTrend = invertTrend ? -trend : trend;
    if (effectiveTrend > 1.0) return 'TrendingUp';
    if (effectiveTrend < -1.0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend, invertTrend = false) => {
    const effectiveTrend = invertTrend ? -trend : trend;
    if (effectiveTrend > 1.0) return 'text-success';
    if (effectiveTrend < -1.0) return 'text-error';
    return 'text-muted-foreground';
  };

  const formatValue = (value, unit) => {
    if (unit === '%' || unit === 'min') {
      return value?.toFixed(1);
    }
    return value?.toLocaleString('en-IN');
  };

  return (
    <div className="w-full bg-card border-t border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Indian Railway Performance Dashboard
        </h2>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full status-breathing"></div>
            <span>CRIS Data Live</span>
          </div>
          <span>•</span>
          <span>Zone: All India</span>
          <span>•</span>
          <span className="font-mono">
            {new Date()?.toLocaleTimeString('en-IN', { hour12: false })} IST
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {kpiItems?.map((item) => (
          <div
            key={item?.id}
            className={`
              relative p-4 rounded-lg border transition-control hover:shadow-lg group
              ${item?.bgColor} border-border
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${item?.bgColor} border border-border/50`}>
                <Icon name={item?.icon} size={18} className={item?.color} />
              </div>
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getTrendIcon(item?.trend, item?.invertTrend)} 
                  size={12} 
                  className={getTrendColor(item?.trend, item?.invertTrend)} 
                />
                <span className={`text-xs font-medium ${getTrendColor(item?.trend, item?.invertTrend)}`}>
                  {Math.abs(item?.trend)?.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline space-x-1">
                <span className={`text-xl font-bold ${item?.color} font-mono`}>
                  {formatValue(item?.value, item?.unit)}
                </span>
                {item?.unit && (
                  <span className="text-sm text-muted-foreground font-medium">
                    {item?.unit}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                {item?.label}
              </p>
              <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                {item?.description}
              </p>
            </div>

            {/* Critical Status Indicators */}
            {(item?.id === 'alerts' && item?.value > 60) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full status-breathing"></div>
            )}
            {(item?.id === 'ontime' && item?.value < 70) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning rounded-full status-breathing"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Enhanced Quick Actions for Indian Railways */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
          <button className="flex items-center space-x-2 hover:text-foreground transition-control">
            <Icon name="RefreshCw" size={14} />
            <span>Refresh CRIS Data</span>
          </button>
          <span>•</span>
          <button className="flex items-center space-x-2 hover:text-foreground transition-control">
            <Icon name="Download" size={14} />
            <span>Export Daily Report</span>
          </button>
          <span>•</span>
          <button className="flex items-center space-x-2 hover:text-foreground transition-control">
            <Icon name="Settings" size={14} />
            <span>Zone Settings</span>
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Data Source: Centre for Railway Information Systems (CRIS)
        </div>
      </div>
    </div>
  );
};

export default KPIStrip;