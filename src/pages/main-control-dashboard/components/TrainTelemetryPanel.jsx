import React from 'react';

const TrainTelemetryPanel = ({ selectedTrain, onClose }) => {
  if (!selectedTrain) {
    return (
      <div className="w-80 h-full bg-card border-l border-border p-4">
        <div className="text-center text-muted-foreground mt-8">
          <div className="text-4xl mb-2">🚂</div>
          <p className="text-sm">Click on a train to view live telemetry</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-card border-l border-border p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Live Telemetry</h3>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Train Header */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="text-sm font-medium text-foreground mb-1">{selectedTrain.name}</div>
          <div className="text-xs text-muted-foreground">Train #{selectedTrain.number}</div>
          <div className="text-xs text-muted-foreground capitalize">{selectedTrain.category || 'Express'}</div>
        </div>

        {/* Speed & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(selectedTrain.speed || 0)}</div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className={`text-sm font-medium ${selectedTrain.status === 'Running' ? 'text-green-600' : 'text-yellow-600'}`}>
              {selectedTrain.status || 'Running'}
            </div>
            <div className="text-xs text-muted-foreground">Status</div>
          </div>
        </div>

        {/* Route Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Route Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">From:</span>
              <span className="font-medium text-foreground">{selectedTrain.from || 'Unknown'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">To:</span>
              <span className="font-medium text-foreground">{selectedTrain.to || 'Unknown'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Next Stop:</span>
              <span className="font-medium text-foreground">{selectedTrain.nextStop || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Delay Information */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Delay Information</h4>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Current Delay:</span>
              <span className={`text-sm font-medium ${(selectedTrain.delay || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {selectedTrain.delay || 0} min
              </span>
            </div>
            {selectedTrain.estimatedArrival && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-muted-foreground">ETA:</span>
                <span className="text-xs font-medium text-foreground">
                  {new Date(selectedTrain.estimatedArrival).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Technical Details */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Technical Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Coach Count:</span>
              <span className="font-medium text-foreground">{selectedTrain.coachCount || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Platform:</span>
              <span className="font-medium text-foreground">{selectedTrain.platform || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="font-medium text-foreground">
                {selectedTrain.updatedAt ? new Date(selectedTrain.updatedAt).toLocaleTimeString() : 'Now'}
              </span>
            </div>
          </div>
        </div>

        {/* Location Data */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Location</h4>
          <div className="bg-muted/30 rounded-lg p-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Latitude:</span>
                <span className="font-mono text-xs text-foreground">{selectedTrain.lat?.toFixed(6)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Longitude:</span>
                <span className="font-mono text-xs text-foreground">{selectedTrain.lon?.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Speed Chart Placeholder */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Speed History</h4>
          <div className="bg-muted/30 rounded-lg p-3 h-20 flex items-center justify-center">
            <div className="text-xs text-muted-foreground">Speed chart coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainTelemetryPanel;
