import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const PredictiveCongestionMap = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('2h');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const timeframes = [
    { value: '1h', label: '1 Hour' },
    { value: '2h', label: '2 Hours' },
    { value: '4h', label: '4 Hours' },
    { value: '6h', label: '6 Hours' }
  ];

  const congestionData = [
    {
      id: 'sector-a',
      name: 'Central Junction A',
      severity: 'high',
      affectedTrains: 12,
      delayMinutes: 15,
      coordinates: { x: 25, y: 30 }
    },
    {
      id: 'sector-b',
      name: 'Eastern Terminal B',
      severity: 'medium',
      affectedTrains: 8,
      delayMinutes: 8,
      coordinates: { x: 70, y: 45 }
    },
    {
      id: 'sector-c',
      name: 'Western Hub C',
      severity: 'low',
      affectedTrains: 3,
      delayMinutes: 3,
      coordinates: { x: 15, y: 70 }
    },
    {
      id: 'sector-d',
      name: 'Northern Station D',
      severity: 'high',
      affectedTrains: 18,
      delayMinutes: 22,
      coordinates: { x: 50, y: 15 }
    },
    {
      id: 'sector-e',
      name: 'Southern Depot E',
      severity: 'medium',
      affectedTrains: 6,
      delayMinutes: 12,
      coordinates: { x: 80, y: 80 }
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-error';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-error-foreground';
      case 'medium': return 'text-warning-foreground';
      case 'low': return 'text-success-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={18} color="var(--color-accent-foreground)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Predictive Congestion Analysis</h2>
            <p className="text-sm text-muted-foreground">
              ML-powered delay forecasting • Updated {lastUpdated?.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e?.target?.value)}
            className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {timeframes?.map(timeframe => (
              <option key={timeframe?.value} value={timeframe?.value}>
                {timeframe?.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-control disabled:opacity-50"
          >
            <Icon 
              name="RefreshCw" 
              size={16} 
              className={isLoading ? 'animate-spin' : ''} 
            />
          </button>
        </div>
      </div>
      {/* Map Visualization */}
      <div className="relative bg-background border border-border rounded-lg h-80 overflow-hidden mb-6">
        {/* Railway Network Background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {/* Railway Lines */}
          <line x1="10" y1="20" x2="90" y2="20" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="10" y1="40" x2="90" y2="40" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="10" y1="60" x2="90" y2="60" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="10" y1="80" x2="90" y2="80" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          
          <line x1="20" y1="10" x2="20" y2="90" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="40" y1="10" x2="40" y2="90" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="60" y1="10" x2="60" y2="90" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="80" y1="10" x2="80" y2="90" stroke="var(--color-muted)" strokeWidth="0.5" strokeDasharray="2,2" />
        </svg>

        {/* Congestion Hotspots */}
        {congestionData?.map((sector) => (
          <div
            key={sector?.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${sector?.coordinates?.x}%`,
              top: `${sector?.coordinates?.y}%`
            }}
          >
            {/* Pulsing Circle */}
            <div className={`w-6 h-6 ${getSeverityColor(sector?.severity)} rounded-full opacity-30 animate-pulse`} />
            <div className={`absolute inset-0 w-6 h-6 ${getSeverityColor(sector?.severity)} rounded-full opacity-60 status-breathing`} />
            <div className={`absolute inset-1 w-4 h-4 ${getSeverityColor(sector?.severity)} rounded-full`} />

            {/* Tooltip */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity z-10 control-room-shadow">
              <div className="text-sm font-medium text-popover-foreground mb-1">
                {sector?.name}
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Affected Trains:</span>
                  <span className="text-foreground font-medium">{sector?.affectedTrains}</span>
                </div>
                <div className="flex justify-between">
                  <span>Predicted Delay:</span>
                  <span className="text-foreground font-medium">{sector?.delayMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Severity:</span>
                  <span className={`font-medium capitalize ${getSeverityTextColor(sector?.severity)}`}>
                    {sector?.severity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-error mb-1">
            {congestionData?.filter(s => s?.severity === 'high')?.length}
          </div>
          <div className="text-xs text-muted-foreground">High Risk Zones</div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning mb-1">
            {congestionData?.filter(s => s?.severity === 'medium')?.length}
          </div>
          <div className="text-xs text-muted-foreground">Medium Risk Zones</div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {congestionData?.reduce((sum, s) => sum + s?.affectedTrains, 0)}
          </div>
          <div className="text-xs text-muted-foreground">Total Affected Trains</div>
        </div>

        <div className="bg-background border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground mb-1">
            {Math.round(congestionData?.reduce((sum, s) => sum + s?.delayMinutes, 0) / congestionData?.length)}
          </div>
          <div className="text-xs text-muted-foreground">Avg Delay (min)</div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveCongestionMap;