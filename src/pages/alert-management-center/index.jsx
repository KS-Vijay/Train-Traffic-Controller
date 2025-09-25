import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import AlertCard from './components/AlertCard';
import AlertFilters from './components/AlertFilters';
import AlertDetails from './components/AlertDetails';
import SystemHealthBanner from './components/SystemHealthBanner';
import IncidentTimeline from './components/IncidentTimeline';
import BulkActions from './components/BulkActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AlertManagementCenter = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    severity: 'all',
    status: 'all',
    type: 'all',
    dateFrom: '',
    dateTo: ''
  });
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const mockAlerts = [
      {
        id: 'ALT-2025-001',
        title: 'Signal Failure at Junction 12A',
        description: 'Primary signal system has failed at Junction 12A causing automatic stop for all approaching trains. Backup systems are operational but manual coordination required.',
        severity: 'critical',
        status: 'unacknowledged',
        type: 'signal',
        location: 'Junction 12A, Main Line',
        timestamp: new Date(Date.now() - 300000),
        affectedTrains: 8,
        estimatedDelay: 25,
        impact: `Critical signal failure affecting 8 trains on the main line. Estimated passenger impact: 2,400 passengers experiencing delays. Revenue impact estimated at $45,000 per hour. Safety protocols activated with manual signal coordination in effect.`,
        recommendedActions: [
          'Dispatch signal maintenance crew immediately',
          'Activate manual signal coordination protocol',
          'Notify affected passengers via PA system',
          'Prepare alternative routing for non-essential trains',
          'Contact backup power systems team'
        ],
        assignedTo: null,
        assignedAt: null,
        notes: []
      },
      {
        id: 'ALT-2025-002',
        title: 'Track Obstruction Detected',
        description: 'Automated sensors have detected debris on Track 3 between Mile Markers 45-46. Visual confirmation pending from field crew.',
        severity: 'high',
        status: 'acknowledged',
        type: 'track',
        location: 'Track 3, Mile 45-46',
        timestamp: new Date(Date.now() - 900000),
        affectedTrains: 3,
        estimatedDelay: 15,
        impact: `Track obstruction affecting 3 freight trains. Minimal passenger impact as this is primarily a freight corridor. Estimated delay of 15 minutes while obstruction is cleared.`,
        recommendedActions: [
          'Dispatch track maintenance crew to location',
          'Verify obstruction type and size',
          'Implement speed restrictions if necessary',
          'Update train schedules accordingly'
        ],
        assignedTo: 'Sarah Mitchell',
        assignedAt: new Date(Date.now() - 600000),
        notes: [
          {
            id: 1,
            author: 'Sarah Mitchell',
            content: 'Field crew dispatched. ETA 10 minutes to location.',
            timestamp: new Date(Date.now() - 480000)
          }
        ]
      },
      {
        id: 'ALT-2025-003',
        title: 'Weather Alert - Heavy Rain',
        description: 'Meteorological services report heavy rainfall expected in the next 2 hours. Speed restrictions may be required on elevated sections.',
        severity: 'medium',
        status: 'in-progress',
        type: 'weather',
        location: 'Elevated Sections 8-12',
        timestamp: new Date(Date.now() - 1800000),
        affectedTrains: 12,
        estimatedDelay: 8,
        impact: `Weather conditions requiring speed restrictions on elevated sections. 12 trains affected with minor delays expected. Passenger safety protocols activated.`,
        recommendedActions: [
          'Monitor weather conditions continuously',
          'Implement speed restrictions on elevated tracks',
          'Increase safety inspections',
          'Prepare for potential service adjustments'
        ],
        assignedTo: 'Mike Rodriguez',
        assignedAt: new Date(Date.now() - 1200000),
        notes: [
          {
            id: 1,
            author: 'Mike Rodriguez',
            content: 'Speed restrictions implemented. Monitoring rainfall intensity.',
            timestamp: new Date(Date.now() - 900000)
          }
        ]
      },
      {
        id: 'ALT-2025-004',
        title: 'Train 847 Mechanical Issue',
        description: 'Train 847 reports minor brake system warning. Conducting diagnostic check at Platform 5.',
        severity: 'low',
        status: 'resolved',
        type: 'train',
        location: 'Platform 5, Central Station',
        timestamp: new Date(Date.now() - 3600000),
        affectedTrains: 1,
        estimatedDelay: 5,
        impact: `Single train mechanical issue resolved. Minimal impact on overall operations. Diagnostic completed successfully.`,
        recommendedActions: [
          'Complete brake system diagnostic',
          'Verify all safety systems operational',
          'Document maintenance actions',
          'Clear train for service'
        ],
        assignedTo: 'James Wilson',
        assignedAt: new Date(Date.now() - 3000000),
        notes: [
          {
            id: 1,
            author: 'James Wilson',
            content: 'Diagnostic completed. False alarm - sensor calibration issue.',
            timestamp: new Date(Date.now() - 2400000)
          },
          {
            id: 2,
            author: 'James Wilson',
            content: 'Train cleared for service. Sensor recalibrated.',
            timestamp: new Date(Date.now() - 1800000)
          }
        ]
      },
      {
        id: 'ALT-2025-005',
        title: 'Power Grid Fluctuation',
        description: 'Electrical grid showing minor fluctuations in Sector 7. Backup power systems on standby.',
        severity: 'medium',
        status: 'acknowledged',
        type: 'system',
        location: 'Sector 7 Power Grid',
        timestamp: new Date(Date.now() - 2400000),
        affectedTrains: 6,
        estimatedDelay: 3,
        impact: `Minor power fluctuations detected. Backup systems operational. No immediate service impact expected.`,
        recommendedActions: [
          'Monitor power grid stability',
          'Verify backup power systems',
          'Contact utility provider',
          'Prepare for potential power switching'
        ],
        assignedTo: 'Lisa Chen',
        assignedAt: new Date(Date.now() - 1800000),
        notes: []
      }
    ];

    const mockSystemHealth = [
      {
        name: 'Signal Control',
        status: 'error',
        lastUpdate: '12:14:23'
      },
      {
        name: 'Track Sensors',
        status: 'connected',
        lastUpdate: '12:16:15'
      },
      {
        name: 'Train Comm',
        status: 'connected',
        lastUpdate: '12:16:30'
      },
      {
        name: 'Weather Data',
        status: 'warning',
        lastUpdate: '12:15:45'
      },
      {
        name: 'Power Grid',
        status: 'connected',
        lastUpdate: '12:16:20'
      }
    ];

    const mockTimelineEvents = [
      {
        id: 1,
        type: 'created',
        title: 'Alert Created',
        description: 'Signal failure detected by automated monitoring system',
        timestamp: new Date(Date.now() - 300000),
        author: 'System',
        details: {
          detection_method: 'Automated',
          confidence_level: '98%',
          affected_signals: '3'
        }
      },
      {
        id: 2,
        type: 'escalated',
        title: 'Alert Escalated',
        description: 'Escalated to critical due to multiple train approach',
        timestamp: new Date(Date.now() - 240000),
        author: 'System',
        details: 'Automatic escalation triggered by proximity sensors'
      },
      {
        id: 3,
        type: 'note_added',
        title: 'Field Report',
        description: 'Visual confirmation of signal failure received',
        timestamp: new Date(Date.now() - 180000),
        author: 'Control Room Operator',
        details: 'Signal lights completely dark. No response to manual override.'
      }
    ];

    setAlerts(mockAlerts);
    setFilteredAlerts(mockAlerts);
    setSystemHealth(mockSystemHealth);
    setTimelineEvents(mockTimelineEvents);
  }, []);

  // Filter alerts based on current filters
  useEffect(() => {
    let filtered = alerts?.filter(alert => {
      const matchesSearch = !filters?.search || 
        alert?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        alert?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        alert?.location?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        alert?.id?.toLowerCase()?.includes(filters?.search?.toLowerCase());

      const matchesSeverity = filters?.severity === 'all' || alert?.severity === filters?.severity;
      const matchesStatus = filters?.status === 'all' || alert?.status === filters?.status;
      const matchesType = filters?.type === 'all' || alert?.type === filters?.type;

      const matchesDateFrom = !filters?.dateFrom || 
        new Date(alert.timestamp) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters?.dateTo || 
        new Date(alert.timestamp) <= new Date(filters.dateTo + 'T23:59:59');

      return matchesSearch && matchesSeverity && matchesStatus && matchesType && 
             matchesDateFrom && matchesDateTo;
    });

    setFilteredAlerts(filtered);
  }, [alerts, filters]);

  // WebSocket simulation for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts occasionally
      if (Math.random() < 0.1) {
        const newAlert = {
          id: `ALT-2025-${String(alerts?.length + 1)?.padStart(3, '0')}`,
          title: 'New System Alert',
          description: 'Automated system has detected a new condition requiring attention.',
          severity: ['low', 'medium', 'high', 'critical']?.[Math.floor(Math.random() * 4)],
          status: 'unacknowledged',
          type: ['signal', 'track', 'train', 'weather', 'system']?.[Math.floor(Math.random() * 5)],
          location: `Sector ${Math.floor(Math.random() * 10) + 1}`,
          timestamp: new Date(),
          affectedTrains: Math.floor(Math.random() * 10) + 1,
          estimatedDelay: Math.floor(Math.random() * 30) + 5,
          impact: 'System-generated alert requiring investigation and response.',
          recommendedActions: ['Investigate alert condition', 'Assess impact', 'Take corrective action'],
          assignedTo: null,
          assignedAt: null,
          notes: []
        };

        setAlerts(prev => [newAlert, ...prev]);

        // Play audio alert for critical alerts
        if (newAlert?.severity === 'critical' && audioEnabled) {
          // In a real app, you'd play an audio file here
          console.log('🔊 Critical alert audio notification');
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [alerts?.length, audioEnabled]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      severity: 'all',
      status: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleSelectAlert = (alertId) => {
    const alert = alerts?.find(a => a?.id === alertId);
    setSelectedAlert(alert);
    
    // Update timeline for selected alert
    if (alert) {
      const alertTimeline = timelineEvents?.filter(event => 
        event?.details?.alert_id === alertId || timelineEvents?.indexOf(event) < 3
      );
      setTimelineEvents(alertTimeline);
    }
  };

  const handleAcknowledgeAlert = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
  };

  const handleAssignAlert = (alertId, assignee) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { 
            ...alert, 
            assignedTo: assignee,
            assignedAt: new Date()
          }
        : alert
    ));
  };

  const handleUpdateStatus = (alertId, newStatus) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { ...alert, status: newStatus }
        : alert
    ));
  };

  const handleAddNote = (alertId, noteContent) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId 
        ? { 
            ...alert, 
            notes: [
              ...alert?.notes,
              {
                id: alert?.notes?.length + 1,
                author: 'Current User',
                content: noteContent,
                timestamp: new Date()
              }
            ]
          }
        : alert
    ));
  };

  const handleBulkAcknowledge = (alertIds) => {
    setAlerts(prev => prev?.map(alert => 
      alertIds?.includes(alert?.id) 
        ? { ...alert, status: 'acknowledged' }
        : alert
    ));
    setSelectedAlerts([]);
  };

  const handleBulkAssign = (alertIds, assignee) => {
    setAlerts(prev => prev?.map(alert => 
      alertIds?.includes(alert?.id) 
        ? { 
            ...alert, 
            assignedTo: assignee,
            assignedAt: new Date()
          }
        : alert
    ));
    setSelectedAlerts([]);
  };

  const handleBulkStatusChange = (alertIds, newStatus) => {
    setAlerts(prev => prev?.map(alert => 
      alertIds?.includes(alert?.id) 
        ? { ...alert, status: newStatus }
        : alert
    ));
    setSelectedAlerts([]);
  };

  const handleToggleSelection = (alertId) => {
    setSelectedAlerts(prev => 
      prev?.includes(alertId) 
        ? prev?.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlerts?.length === filteredAlerts?.length) {
      setSelectedAlerts([]);
    } else {
      setSelectedAlerts(filteredAlerts?.map(alert => alert?.id));
    }
  };

  // Calculate alert counts for filters
  const alertCounts = {
    total: alerts?.length,
    critical: alerts?.filter(a => a?.severity === 'critical')?.length,
    high: alerts?.filter(a => a?.severity === 'high')?.length,
    medium: alerts?.filter(a => a?.severity === 'medium')?.length,
    low: alerts?.filter(a => a?.severity === 'low')?.length,
    unacknowledged: alerts?.filter(a => a?.status === 'unacknowledged')?.length,
    acknowledged: alerts?.filter(a => a?.status === 'acknowledged')?.length,
    inProgress: alerts?.filter(a => a?.status === 'in-progress')?.length,
    resolved: alerts?.filter(a => a?.status === 'resolved')?.length
  };

  const criticalAlertCount = alertCounts?.critical;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Alert Management Center
              </h1>
              <p className="text-muted-foreground">
                Centralized monitoring and response coordination for critical railway operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant={audioEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                <Icon name={audioEnabled ? "Volume2" : "VolumeX"} size={16} className="mr-2" />
                Audio Alerts
              </Button>
              <div className="text-sm text-muted-foreground font-mono">
                Last Update: {new Date()?.toLocaleTimeString('en-US', { 
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* System Health Banner */}
          <SystemHealthBanner 
            systemHealth={systemHealth}
            criticalAlertCount={criticalAlertCount}
          />

          {/* Alert Filters */}
          <AlertFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            alertCounts={alertCounts}
          />

          {/* Bulk Actions */}
          <BulkActions
            selectedAlerts={selectedAlerts}
            onBulkAcknowledge={handleBulkAcknowledge}
            onBulkAssign={handleBulkAssign}
            onBulkStatusChange={handleBulkStatusChange}
            onClearSelection={() => setSelectedAlerts([])}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert List Panel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <Icon name="AlertTriangle" size={20} />
                  <span>Active Alerts ({filteredAlerts?.length})</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    <Icon name="CheckSquare" size={16} className="mr-2" />
                    {selectedAlerts?.length === filteredAlerts?.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>

              <div className="space-y-3 max-h-[800px] overflow-y-auto">
                {filteredAlerts?.length > 0 ? (
                  filteredAlerts?.map(alert => (
                    <div key={alert?.id} className="relative">
                      <div className="absolute left-2 top-2 z-10">
                        <input
                          type="checkbox"
                          checked={selectedAlerts?.includes(alert?.id)}
                          onChange={() => handleToggleSelection(alert?.id)}
                          className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary"
                        />
                      </div>
                      <AlertCard
                        alert={alert}
                        onAcknowledge={handleAcknowledgeAlert}
                        onAssign={handleAssignAlert}
                        onViewDetails={handleSelectAlert}
                        isSelected={selectedAlert?.id === alert?.id}
                        onSelect={handleSelectAlert}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Search" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No alerts match your current filters</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="mt-4"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Alert Details Panel */}
            <div>
              <AlertDetails
                alert={selectedAlert}
                onClose={() => setSelectedAlert(null)}
                onAssign={handleAssignAlert}
                onUpdateStatus={handleUpdateStatus}
                onAddNote={handleAddNote}
              />
            </div>
          </div>

          {/* Incident Timeline */}
          <IncidentTimeline
            selectedAlert={selectedAlert}
            timelineEvents={timelineEvents}
          />
        </div>
      </main>
    </div>
  );
};

export default AlertManagementCenter;