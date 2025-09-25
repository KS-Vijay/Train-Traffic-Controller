import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PredictiveCongestionMap from './components/PredictiveCongestionMap';
import RecommendationCard from './components/RecommendationCard';
import RecommendationHistory from './components/RecommendationHistory';
import FilterControls from './components/FilterControls';
import ScenarioSimulator from './components/ScenarioSimulator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AIRecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedRecommendations, setSelectedRecommendations] = useState([]);
  const [filters, setFilters] = useState({
    urgency: 'all',
    type: 'all',
    route: 'all',
    sortBy: 'priority',
    minConfidence: 0
  });
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock recommendations data
  const mockRecommendations = [
    {
      id: 1,
      title: 'Route Optimization - Central Junction A',
      description: 'Reroute Express Line 4521 via alternate track to avoid congestion during peak hours',
      type: 'routing',
      priority: 'critical',
      confidence: 92,
      estimatedTime: 8,
      affectedTrains: 12,
      expectedImpact: {
        delayReduction: 15,
        efficiencyGain: 12.5,
        costSaving: 4.2
      },
      logic: `Machine learning analysis of historical traffic patterns indicates that Central Junction A experiences 85% congestion probability between 14:00-16:00. Alternative routing via Track 7B reduces overall network delay by redistributing traffic load across underutilized segments.`,
      steps: [
        'Signal Track 7B for Express Line clearance',
        'Update train 4521 routing parameters',
        'Notify affected stations of schedule adjustment',
        'Monitor junction capacity for 30 minutes'
      ],
      riskLevel: 'low',
      riskDescription: 'Minimal passenger impact, well-tested alternative route',
      timestamp: new Date(Date.now() - 300000),
      status: 'pending'
    },
    {
      id: 2,
      title: 'Schedule Adjustment - Morning Express',
      description: 'Delay departure of Train 7832 by 4 minutes to optimize platform utilization',
      type: 'scheduling',
      priority: 'high',
      confidence: 87,
      estimatedTime: 12,
      affectedTrains: 8,
      expectedImpact: {
        delayReduction: 8,
        efficiencyGain: 9.2,
        costSaving: 2.8
      },
      logic: `Platform utilization analysis shows 94% occupancy at Terminal B during 08:15-08:30 window. Delaying Train 7832 departure creates optimal spacing and reduces downstream bottlenecks.`,
      steps: [
        'Update departure schedule in central system',
        'Broadcast delay announcement to passengers',
        'Coordinate with connecting services',
        'Monitor passenger flow metrics'
      ],
      riskLevel: 'medium',
      riskDescription: 'Minor passenger inconvenience, potential connection impacts',
      timestamp: new Date(Date.now() - 600000),
      status: 'pending'
    },
    {
      id: 3,
      title: 'Traffic Flow Enhancement - Eastern Corridor',
      description: 'Adjust signal timing at Junction B to improve throughput by 18%',
      type: 'traffic',
      priority: 'medium',
      confidence: 78,
      estimatedTime: 15,
      affectedTrains: 24,
      expectedImpact: {
        delayReduction: 12,
        efficiencyGain: 18.3,
        costSaving: 6.1
      },
      logic: `Signal timing optimization using reinforcement learning models suggests 12-second adjustment at Junction B increases throughput while maintaining safety margins. Historical data shows 23% improvement in similar scenarios.`,
      steps: [
        'Calculate optimal signal timing parameters',
        'Test timing adjustment in simulation',
        'Implement gradual timing changes',
        'Monitor traffic flow for 45 minutes'
      ],
      riskLevel: 'low',
      riskDescription: 'Proven optimization technique with safety redundancy',
      timestamp: new Date(Date.now() - 900000),
      status: 'pending'
    },
    {
      id: 4,
      title: 'Platform Assignment Optimization',
      description: 'Reassign Train 9156 to Platform 3 for improved passenger flow',
      type: 'routing',
      priority: 'low',
      confidence: 71,
      estimatedTime: 6,
      affectedTrains: 3,
      expectedImpact: {
        delayReduction: 5,
        efficiencyGain: 7.8,
        costSaving: 1.9
      },
      logic: `Passenger flow analysis indicates Platform 3 has 40% lower congestion during arrival window. Reassignment reduces boarding time and improves overall station efficiency.`,
      steps: [
        'Verify Platform 3 availability',
        'Update passenger information displays',
        'Coordinate with station staff',
        'Monitor boarding efficiency'
      ],
      riskLevel: 'low',
      riskDescription: 'Standard platform reassignment with minimal impact',
      timestamp: new Date(Date.now() - 1200000),
      status: 'pending'
    },
    {
      id: 5,
      title: 'Maintenance Window Coordination',
      description: 'Optimize maintenance scheduling to minimize service disruption',
      type: 'maintenance',
      priority: 'high',
      confidence: 89,
      estimatedTime: 25,
      affectedTrains: 16,
      expectedImpact: {
        delayReduction: 22,
        efficiencyGain: 15.7,
        costSaving: 8.4
      },
      logic: `Predictive maintenance algorithms identify optimal 2-hour window (02:00-04:00) for Track 5 maintenance with minimal service impact. Alternative routing maintains 95% service capacity.`,
      steps: [
        'Schedule maintenance crew deployment',
        'Activate alternative routing protocols',
        'Update service announcements',
        'Monitor system performance during maintenance'
      ],
      riskLevel: 'medium',
      riskDescription: 'Planned maintenance with backup routing available',
      timestamp: new Date(Date.now() - 1500000),
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Simulate loading recommendations
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({
        urgency: 'all',
        type: 'all',
        route: 'all',
        sortBy: 'priority',
        minConfidence: 0
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleRecommendationSelect = (id) => {
    setSelectedRecommendations(prev => 
      prev?.includes(id) 
        ? prev?.filter(recId => recId !== id)
        : [...prev, id]
    );
  };

  const handleAcceptRecommendation = (id) => {
    setRecommendations(prev => 
      prev?.map(rec => 
        rec?.id === id ? { ...rec, status: 'accepted' } : rec
      )
    );
    setSelectedRecommendations(prev => prev?.filter(recId => recId !== id));
  };

  const handleOverrideRecommendation = (id) => {
    setRecommendations(prev => 
      prev?.map(rec => 
        rec?.id === id ? { ...rec, status: 'overridden' } : rec
      )
    );
    setSelectedRecommendations(prev => prev?.filter(recId => recId !== id));
  };

  const handleFeedback = (id) => {
    console.log('Feedback for recommendation:', id);
    // Implement feedback modal/form
  };

  const handleBatchProcess = () => {
    selectedRecommendations?.forEach(id => {
      handleAcceptRecommendation(id);
    });
  };

  const openSimulator = (recommendation) => {
    setSelectedRecommendation(recommendation);
    setIsSimulatorOpen(true);
  };

  const filteredRecommendations = recommendations?.filter(rec => {
    if (filters?.urgency !== 'all' && rec?.priority !== filters?.urgency) return false;
    if (filters?.type !== 'all' && rec?.type !== filters?.type) return false;
    if (rec?.confidence < filters?.minConfidence) return false;
    return true;
  })?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'confidence':
        return b?.confidence - a?.confidence;
      case 'impact':
        return b?.expectedImpact?.delayReduction - a?.expectedImpact?.delayReduction;
      case 'timestamp':
        return b?.timestamp - a?.timestamp;
      default: // priority
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder?.[b?.priority] - priorityOrder?.[a?.priority];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Icon name="Brain" size={24} color="var(--color-accent-foreground)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Recommendations Panel</h1>
                <p className="text-muted-foreground">
                  Machine learning-powered optimization suggestions and predictive analytics
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date()?.toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={() => window.location?.reload()}
              >
                Refresh
              </Button>
            </div>
          </div>

          {/* Predictive Congestion Map */}
          <div className="mb-8">
            <PredictiveCongestionMap />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onBatchProcess={handleBatchProcess}
                selectedCount={selectedRecommendations?.length}
              />

              {/* Recommendations List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">
                    Active Recommendations ({filteredRecommendations?.length})
                  </h2>
                  
                  {filteredRecommendations?.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openSimulator(filteredRecommendations?.[0])}
                      iconName="Play"
                      iconPosition="left"
                    >
                      Test Scenario
                    </Button>
                  )}
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3]?.map(i => (
                      <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-muted rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                            <div className="grid grid-cols-3 gap-4 mt-4">
                              <div className="h-8 bg-muted rounded" />
                              <div className="h-8 bg-muted rounded" />
                              <div className="h-8 bg-muted rounded" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredRecommendations?.length > 0 ? (
                  <div className="space-y-4">
                    {filteredRecommendations?.map((recommendation) => (
                      <div key={recommendation?.id} className="relative">
                        <input
                          type="checkbox"
                          checked={selectedRecommendations?.includes(recommendation?.id)}
                          onChange={() => handleRecommendationSelect(recommendation?.id)}
                          className="absolute top-4 right-4 z-10 w-4 h-4 text-accent bg-input border-border rounded focus:ring-accent focus:ring-2"
                        />
                        <RecommendationCard
                          recommendation={recommendation}
                          onAccept={handleAcceptRecommendation}
                          onOverride={handleOverrideRecommendation}
                          onFeedback={handleFeedback}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-8 text-center">
                    <Icon name="Brain" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Recommendations Available
                    </h3>
                    <p className="text-muted-foreground">
                      AI models are analyzing current network conditions. New recommendations will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <RecommendationHistory />
            </div>
          </div>
        </div>
      </main>
      {/* Scenario Simulator Modal */}
      <ScenarioSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        recommendation={selectedRecommendation}
      />
    </div>
  );
};

export default AIRecommendationsPanel;