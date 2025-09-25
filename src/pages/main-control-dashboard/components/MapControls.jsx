import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MapControls = ({ 
  timeRange, 
  setTimeRange, 
  selectedFilters, 
  setSelectedFilters, 
  mapLayers, 
  setMapLayers,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetView 
}) => {
  const [trainSearchModal, setTrainSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const timeRanges = [
    { value: '1h', label: '1 Hour' },
    { value: '4h', label: '4 Hours' },
    { value: '12h', label: '12 Hours' },
    { value: '24h', label: '24 Hours' }
  ];

  // Updated with Indian Railway specific filters and real counts
  const filterOptions = [
    { id: 'passenger', label: 'Passenger Trains', icon: 'Users', count: 13152 },
    { id: 'freight', label: 'Freight Trains', icon: 'Package', count: 8956 },
    { id: 'maintenance', label: 'Maintenance Units', icon: 'Wrench', count: 245 },
    { id: 'delayed', label: 'Delayed Trains', icon: 'Clock', count: 1847 }
  ];

  const layerOptions = [
    { id: 'signals', label: 'Signal Status', icon: 'Radio' },
    { id: 'blocks', label: 'Block Sections', icon: 'Square' },
    { id: 'stations', label: 'Railway Stations', icon: 'MapPin' },
    { id: 'weather', label: 'Weather Conditions', icon: 'Cloud' }
  ];

  // Sample Indian train search results
  const sampleTrains = [
    { number: '12002', name: 'New Delhi Shatabdi Express', route: 'NDLS-BPL' },
    { number: '12951', name: 'Mumbai Rajdhani Express', route: 'NDLS-BCT' },
    { number: '16787', name: 'Teb Jammu Express', route: 'TVC-JAT' },
    { number: '22691', name: 'Rajdhani Express', route: 'NDLS-BBS' },
    { number: '18029', name: 'Kurla Express', route: 'LTT-KURLA' },
    { number: '12622', name: 'Tamil Nadu Express', route: 'NDLS-MAS' },
    { number: '12650', name: 'Karnataka Sampark Kranti', route: 'YPR-NZM' },
    { number: '12423', name: 'Dibrugarh Rajdhani', route: 'NDLS-DBRG' }
  ];

  const toggleFilter = (filterId) => {
    setSelectedFilters(prev => 
      prev?.includes(filterId) 
        ? prev?.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  const toggleLayer = (layerId) => {
    setMapLayers(prev => ({
      ...prev,
      [layerId]: !prev?.[layerId]
    }));
  };

  const handleTrainSearch = (query) => {
    setSearchQuery(query);
    if (query?.length >= 2) {
      const filtered = sampleTrains?.filter(train => 
        train?.number?.toLowerCase()?.includes(query?.toLowerCase()) ||
        train?.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
        train?.route?.toLowerCase()?.includes(query?.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const selectTrain = (train) => {
    // This would typically trigger map focus on the selected train
    console.log('Focusing on train:', train);
    setTrainSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="w-full h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Control Panel
        </h2>
        <p className="text-xs text-muted-foreground mt-1">Indian Railway Network</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Time Range Selector */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Time Range</h3>
          <div className="grid grid-cols-2 gap-2">
            {timeRanges?.map((range) => (
              <Button
                key={range?.value}
                variant={timeRange === range?.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range?.value)}
                className="text-xs"
              >
                {range?.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Train Filters with Indian Railway Statistics */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Train Filters</h3>
          <div className="space-y-2">
            {filterOptions?.map((filter) => (
              <div
                key={filter?.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-control
                  ${selectedFilters?.includes(filter?.id)
                    ? 'bg-primary/10 border-primary text-primary' :'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => toggleFilter(filter?.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={filter?.icon} size={16} />
                  <div>
                    <span className="text-sm font-medium block">{filter?.label}</span>
                    {filter?.id === 'passenger' && (
                      <span className="text-xs text-muted-foreground">Mail/Express/Local</span>
                    )}
                  </div>
                </div>
                <span className="text-xs bg-background px-2 py-1 rounded-full font-mono">
                  {filter?.count?.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Layers */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Map Layers</h3>
          <div className="space-y-2">
            {layerOptions?.map((layer) => (
              <div
                key={layer?.id}
                className={`
                  flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-control
                  ${mapLayers?.[layer?.id]
                    ? 'bg-secondary/10 border-secondary text-secondary' :'bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => toggleLayer(layer?.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={layer?.icon} size={16} />
                  <span className="text-sm font-medium">{layer?.label}</span>
                </div>
                <div className={`w-4 h-4 rounded border-2 ${
                  mapLayers?.[layer?.id] ? 'bg-secondary border-secondary' : 'border-muted-foreground'
                }`}>
                  {mapLayers?.[layer?.id] && (
                    <Icon name="Check" size={12} color="var(--color-secondary-foreground)" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Map Navigation</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Zoom Level</span>
              <span className="text-sm font-medium text-foreground">{zoomLevel?.toFixed(1)}x</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onZoomOut}
                className="flex-1"
                iconName="Minus"
              >
                Zoom Out
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onZoomIn}
                className="flex-1"
                iconName="Plus"
              >
                Zoom In
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onResetView}
              className="w-full"
              iconName="RotateCcw"
            >
              Reset View
            </Button>
          </div>
        </div>

        {/* Enhanced Train Search */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Train Search</h3>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type="text"
                placeholder="Enter train number (e.g., 12002)"
                value={searchQuery}
                onChange={(e) => handleTrainSearch(e?.target?.value)}
                className="text-sm pr-10"
              />
              <Icon 
                name="Search" 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
            </div>
            
            {/* Search Results */}
            {searchResults?.length > 0 && (
              <div className="max-h-32 overflow-y-auto bg-background border border-border rounded-lg">
                {searchResults?.map((train) => (
                  <div
                    key={train?.number}
                    className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                    onClick={() => selectTrain(train)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-foreground">{train?.number}</span>
                        <p className="text-xs text-muted-foreground">{train?.name}</p>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono">{train?.route}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              iconName="Navigation"
            >
              Track Live Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              iconName="AlertTriangle"
            >
              Report Issue
            </Button>
          </div>
        </div>

        {/* Indian Railway Quick Stats */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-muted/50 rounded border">
              <div className="font-mono font-bold text-primary">67,956</div>
              <div className="text-muted-foreground">Route KM</div>
            </div>
            <div className="p-2 bg-muted/50 rounded border">
              <div className="font-mono font-bold text-secondary">7,349</div>
              <div className="text-muted-foreground">Stations</div>
            </div>
            <div className="p-2 bg-muted/50 rounded border">
              <div className="font-mono font-bold text-success">13,000+</div>
              <div className="text-muted-foreground">Daily Trains</div>
            </div>
            <div className="p-2 bg-muted/50 rounded border">
              <div className="font-mono font-bold text-warning">23M</div>
              <div className="text-muted-foreground">Daily Passengers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;