import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import MapControls from './components/MapControls';
import InteractiveMap from './components/InteractiveMap';
import TrainTelemetry from './components/TrainTelemetry';
import KPIStrip from './components/KPIStrip';

const MainControlDashboard = () => {
  const [timeRange, setTimeRange] = useState('4h');
  const [selectedFilters, setSelectedFilters] = useState(['passenger', 'freight']);
  const [mapLayers, setMapLayers] = useState({
    signals: true,
    blocks: true,
    stations: true,
    weather: false
  });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    // Simulate CRIS (Centre for Railway Information Systems) connection status
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'reconnecting', 'disconnected'];
      const weights = [0.92, 0.06, 0.02]; // High reliability for Indian Railways
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < statuses?.length; i++) {
        cumulativeWeight += weights?.[i];
        if (random <= cumulativeWeight) {
          setConnectionStatus(statuses?.[i]);
          break;
        }
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(statusInterval);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.3, 4.0)); // Allow more zoom for detailed Indian map view
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.3, 0.4));
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
    setSelectedTrain(null);
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
  };

  const handleAlertAction = (alertId) => {
    console.log('Responding to Indian Railway alert:', alertId);
    // Handle alert response logic for Indian context
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* CRIS Connection Status Banner */}
      {connectionStatus !== 'connected' && (
        <div className={`
          fixed top-16 left-0 right-0 z-40 px-6 py-2 text-center text-sm font-medium
          ${connectionStatus === 'reconnecting' ?'bg-warning text-warning-foreground' :'bg-error text-error-foreground'
          }
        `}>
          {connectionStatus === 'reconnecting' ?'Reconnecting to CRIS (Railway Information System)...' :'CRIS Connection Lost - Operating in offline mode'
          }
        </div>
      )}

      {/* Main Indian Railway Dashboard Layout */}
      <div className={`pt-16 ${connectionStatus !== 'connected' ? 'pt-24' : ''}`}>
        <div className="h-screen flex flex-col">
          {/* Main Content Area - Enhanced for Indian Railway Network */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Enhanced Map Controls (4 columns) */}
            <div className="w-1/6 min-w-[320px] hidden lg:block">
              <MapControls
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                mapLayers={mapLayers}
                setMapLayers={setMapLayers}
                zoomLevel={zoomLevel}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetView={handleResetView}
              />
            </div>

            {/* Central Indian Railway Map Area (16 columns) */}
            <div className="flex-1 lg:w-2/3">
              <InteractiveMap
                selectedFilters={selectedFilters}
                mapLayers={mapLayers}
                zoomLevel={zoomLevel}
                onTrainSelect={handleTrainSelect}
                selectedTrain={selectedTrain}
              />
            </div>

            {/* Right Sidebar - Enhanced Train Telemetry & Indian Railway Alerts (4 columns) */}
            <div className="w-1/6 min-w-[340px] hidden lg:block">
              <TrainTelemetry
                selectedTrain={selectedTrain}
                onAlertAction={handleAlertAction}
                alerts={[]}
              />
            </div>
          </div>

          {/* Bottom Enhanced KPI Strip for Indian Railways */}
          <div className="h-auto">
            <KPIStrip />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Responsive Overlays for Indian Railway App */}
      <div className="lg:hidden">
        {/* Mobile Controls Toggle */}
        <button className="fixed bottom-24 left-4 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center border-2 border-background">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </button>

        {/* Mobile Train Search Toggle */}
        <button className="fixed bottom-24 right-16 z-50 w-12 h-12 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>

        {/* Mobile Telemetry Toggle */}
        <button className="fixed bottom-24 right-4 z-50 w-12 h-12 bg-accent text-accent-foreground rounded-full shadow-lg flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>

        {/* Mobile Status Indicator */}
        <div className="fixed bottom-4 left-4 right-4 z-40 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full status-breathing"></div>
              <span>Indian Railways</span>
            </div>
            <span className="font-mono">{new Date()?.toLocaleTimeString('en-IN', { hour12: false })} IST</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainControlDashboard;