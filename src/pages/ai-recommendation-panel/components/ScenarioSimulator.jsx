import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScenarioSimulator = ({ isOpen, onClose, recommendation }) => {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('current');

  const scenarios = [
    { value: 'current', label: 'Current Conditions' },
    { value: 'peak', label: 'Peak Hour Traffic' },
    { value: 'weather', label: 'Adverse Weather' },
    { value: 'maintenance', label: 'Maintenance Window' },
    { value: 'emergency', label: 'Emergency Scenario' }
  ];

  const runSimulation = async () => {
    setSimulationRunning(true);
    setSimulationResults(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock simulation results
    const mockResults = {
      scenario: selectedScenario,
      duration: '2.3 seconds',
      trainMovements: 847,
      conflicts: Math.floor(Math.random() * 5),
      delayReduction: Math.floor(Math.random() * 20) + 5,
      efficiencyGain: Math.floor(Math.random() * 15) + 3,
      riskScore: Math.floor(Math.random() * 30) + 10,
      recommendations: [
        'Adjust signal timing at Junction A by 15 seconds',
        'Reroute Train 4521 via alternate track',
        'Delay departure of Train 7832 by 3 minutes'
      ],
      timeline: [
        { time: '14:00', event: 'Simulation started', status: 'info' },
        { time: '14:02', event: 'Traffic pattern analyzed', status: 'success' },
        { time: '14:05', event: 'Optimization applied', status: 'success' },
        { time: '14:08', event: 'Conflict detected at Junction B', status: 'warning' },
        { time: '14:10', event: 'Alternative route calculated', status: 'success' },
        { time: '14:12', event: 'Simulation completed', status: 'success' }
      ]
    };

    setSimulationResults(mockResults);
    setSimulationRunning(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Info';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Icon name="Play" size={18} color="var(--color-accent-foreground)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Scenario Simulator</h2>
              <p className="text-sm text-muted-foreground">
                Test recommendation impact under different conditions
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Recommendation Summary */}
          <div className="bg-background border border-border rounded-lg p-4 mb-6">
            <h3 className="font-medium text-foreground mb-2">Testing Recommendation</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {recommendation?.title || 'Route Optimization - Central Junction'}
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-success">-12min</div>
                <div className="text-xs text-muted-foreground">Expected Delay Reduction</div>
              </div>
              <div>
                <div className="text-lg font-bold text-success">+8.5%</div>
                <div className="text-xs text-muted-foreground">Efficiency Gain</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">92%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
            </div>
          </div>

          {/* Scenario Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Testing Scenario
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {scenarios?.map((scenario) => (
                <button
                  key={scenario?.value}
                  onClick={() => setSelectedScenario(scenario?.value)}
                  className={`p-3 rounded-lg border text-left transition-control ${
                    selectedScenario === scenario?.value
                      ? 'border-accent bg-accent/10 text-accent' :'border-border bg-background text-foreground hover:border-accent/50'
                  }`}
                >
                  <div className="text-sm font-medium">{scenario?.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="default"
                onClick={runSimulation}
                loading={simulationRunning}
                iconName="Play"
                iconPosition="left"
                disabled={simulationRunning}
              >
                {simulationRunning ? 'Running Simulation...' : 'Run Simulation'}
              </Button>

              {simulationResults && (
                <Button
                  variant="outline"
                  onClick={() => setSimulationResults(null)}
                  iconName="RotateCcw"
                  iconPosition="left"
                >
                  Reset
                </Button>
              )}
            </div>

            {simulationRunning && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Processing scenario...</span>
              </div>
            )}
          </div>

          {/* Simulation Results */}
          {simulationResults && (
            <div className="space-y-6">
              {/* Results Summary */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">Simulation Results</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {simulationResults?.duration}
                    </div>
                    <div className="text-xs text-muted-foreground">Simulation Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground">
                      {simulationResults?.trainMovements}
                    </div>
                    <div className="text-xs text-muted-foreground">Train Movements</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-warning">
                      {simulationResults?.conflicts}
                    </div>
                    <div className="text-xs text-muted-foreground">Conflicts Detected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-success">
                      {simulationResults?.riskScore}%
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="text-lg font-bold text-success">
                      -{simulationResults?.delayReduction}min
                    </div>
                    <div className="text-xs text-muted-foreground">Delay Reduction</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="text-lg font-bold text-success">
                      +{simulationResults?.efficiencyGain}%
                    </div>
                    <div className="text-xs text-muted-foreground">Efficiency Gain</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">Simulation Timeline</h3>
                <div className="space-y-3">
                  {simulationResults?.timeline?.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Icon 
                          name={getStatusIcon(event?.status)} 
                          size={12} 
                          className={getStatusColor(event?.status)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-foreground">{event?.event}</div>
                        <div className="text-xs text-muted-foreground">{event?.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">Generated Recommendations</h3>
                <div className="space-y-2">
                  {simulationResults?.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 bg-card rounded">
                      <Icon name="ArrowRight" size={14} className="text-accent mt-0.5" />
                      <span className="text-sm text-foreground">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSimulator;