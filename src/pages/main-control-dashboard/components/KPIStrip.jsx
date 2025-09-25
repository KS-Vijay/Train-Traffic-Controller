import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const KPIStrip = () => {
  const [kpiData, setKpiData] = useState({
    activeTrains: 0,
    onTimePerformance: 0,
    averageDelay: 0,
    trackUtilization: 0,
    systemHealth: 96.0,
    alertsCount: 0,
    passengerTrains: 0,
    freightTrains: 0
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
    let isMounted = true;
    const wsRef = { current: null };

    const compute = (items = []) => {
      const total = items.length;
      const delayed = items.filter((t) => {
        const d = Number(t?.delay) || Number(t?.delay_mins) || Number(t?.delayInMinutes) || Number(t?.lateMins) || 0;
        return d > 5;
      }).length;
      const onTime = total > 0 ? ((total - delayed) / total) * 100 : 0;
      const avgDelay = (() => {
        const ds = items.map((t) => Number(t?.delay) || Number(t?.delay_mins) || Number(t?.delayInMinutes) || Number(t?.lateMins) || 0);
        if (!ds.length) return 0;
        return ds.reduce((a, b) => a + b, 0) / ds.length;
      })();
      const passenger = items.filter((t) => {
        const name = (t?.name || t?.train_name || '').toLowerCase();
        return /(exp|mail|passenger|shatabdi|rajdhani|duronto|vand|jan shatabdi|garib rath)/.test(name);
      }).length;
      const freight = Math.max(0, total - passenger);
      // crude utilization proxy: normalize active trains vs a cap for the bbox
      const utilization = Math.min(100, Math.round((total / 120) * 100));
      const alerts = delayed;

      return {
        activeTrains: total,
        onTimePerformance: Number(onTime.toFixed(1)),
        averageDelay: Number(avgDelay.toFixed(1)),
        trackUtilization: utilization,
        systemHealth: 96.0,
        alertsCount: alerts,
        passengerTrains: passenger,
        freightTrains: freight
      };
    };

    try {
      const wsProtocol = location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl = `${wsProtocol}://localhost:5055/ws/trains/howrah`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      ws.onmessage = (evt) => {
        if (!isMounted) return;
        try {
          const payload = JSON.parse(evt.data);
          if (payload?.type !== 'trains') return;
          const list = Array.isArray(payload.trains) ? payload.trains : [];
          const stats = compute(list);
          setTrends({
            activeTrains: 0,
            onTimePerformance: 0,
            averageDelay: 0,
            trackUtilization: 0,
            systemHealth: 0,
            alertsCount: 0,
            passengerTrains: 0,
            freightTrains: 0
          });
          setKpiData(stats);
        } catch {}
      };
    } catch {}
    return () => {
      isMounted = false;
      try { wsRef.current && wsRef.current.close(); } catch {}
    };
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
          Howrah Section Performance Dashboard
        </h2>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full status-breathing"></div>
            <span>RapidAPI IRCTC1 Live</span>
          </div>
          <span>•</span>
          <span>Section: Howrah (~200 km)</span>
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
        
        <div className="text-xs text-muted-foreground">Data Source: IRCTC1 via RapidAPI</div>
      </div>
    </div>
  );
};

export default KPIStrip;