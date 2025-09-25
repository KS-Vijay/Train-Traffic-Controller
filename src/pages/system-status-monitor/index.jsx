import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SystemHealthOverview from './components/SystemHealthOverview';
import DataSourcePanel from './components/DataSourcePanel';
import PerformanceMetrics from './components/PerformanceMetrics';
import AlertThresholds from './components/AlertThreshholds';
import SystemLogs from './components/SystemLogs';

const SystemStatusMonitor = () => {
  const [systemHealth, setSystemHealth] = useState({
    overall: 96.2
  });

  const [uptime, setUptime] = useState({
    current: "15d 7h 23m",
    day: "99.8%",
    week: "99.2%",
    month: "98.7%"
  });

  const [lastUpdate, setLastUpdate] = useState("12:16:25");

  const [dataSources] = useState([
    {
      id: 1,
      name: "GPS/RFID Tracking System",
      description: "Real-time train positioning data",
      icon: "MapPin",
      status: "connected",
      responseTime: 45,
      errorRate: 0.2,
      lastUpdate: new Date(Date.now() - 30000),
      uptime: 99.8,
      endpoint: "tcp://gps.railway.com:8080",
      protocol: "TCP/MQTT",
      failoverActive: false,
      dataRate: "2.3k msgs",
      recentActivity: [
        { timestamp: "12:15:30", message: "Connection established", type: "success" },
        { timestamp: "12:14:45", message: "Data sync completed", type: "success" },
        { timestamp: "12:13:20", message: "Minor latency detected", type: "warning" }
      ]
    },
    {
      id: 2,
      name: "Railway Operations API",
      description: "Train schedules and operational data",
      icon: "Train",
      status: "connected",
      responseTime: 120,
      errorRate: 1.1,
      lastUpdate: new Date(Date.now() - 45000),
      uptime: 98.5,
      endpoint: "https://api.railway.com/v2",
      protocol: "HTTPS/REST",
      failoverActive: false,
      dataRate: "850 req",
      recentActivity: [
        { timestamp: "12:15:45", message: "Schedule data updated", type: "success" },
        { timestamp: "12:14:30", message: "API rate limit warning", type: "warning" },
        { timestamp: "12:13:15", message: "Authentication renewed", type: "success" }
      ]
    },
    {
      id: 3,
      name: "Weather Data Feed",
      description: "Meteorological conditions for impact analysis",
      icon: "Cloud",
      status: "warning",
      responseTime: 340,
      errorRate: 5.2,
      lastUpdate: new Date(Date.now() - 180000),
      uptime: 94.2,
      endpoint: "https://weather.api.com/railway",
      protocol: "HTTPS/JSON",
      failoverActive: true,
      dataRate: "120 req",
      recentActivity: [
        { timestamp: "12:13:00", message: "Switched to backup provider", type: "warning" },
        { timestamp: "12:10:30", message: "Primary service timeout", type: "error" },
        { timestamp: "12:09:15", message: "Weather alert received", type: "info" }
      ]
    },
    {
      id: 4,
      name: "ML Prediction Engine",
      description: "AI-powered congestion and delay forecasting",
      icon: "Brain",
      status: "connected",
      responseTime: 890,
      errorRate: 0.8,
      lastUpdate: new Date(Date.now() - 60000),
      uptime: 97.3,
      endpoint: "grpc://ml.railway.com:9090",
      protocol: "gRPC",
      failoverActive: false,
      dataRate: "45 pred",
      recentActivity: [
        { timestamp: "12:15:00", message: "Model inference completed", type: "success" },
        { timestamp: "12:12:30", message: "Training data updated", type: "info" },
        { timestamp: "12:10:45", message: "Prediction accuracy: 94.2%", type: "success" }
      ]
    },
    {
      id: 5,
      name: "Database Cluster",
      description: "Historical performance and operational data",
      icon: "Database",
      status: "connected",
      responseTime: 25,
      errorRate: 0.1,
      lastUpdate: new Date(Date.now() - 15000),
      uptime: 99.9,
      endpoint: "postgresql://db.railway.com:5432",
      protocol: "PostgreSQL",
      failoverActive: false,
      dataRate: "1.2k ops",
      recentActivity: [
        { timestamp: "12:16:00", message: "Backup completed successfully", type: "success" },
        { timestamp: "12:15:30", message: "Query performance optimized", type: "info" },
        { timestamp: "12:14:15", message: "Connection pool scaled", type: "success" }
      ]
    }
  ]);

  const [performanceMetrics] = useState([
    {
      id: 1,
      name: "API Response Time",
      icon: "Zap",
      current: 145,
      previous: 132,
      target: 200,
      unit: "ms",
      history: [
        { time: "12:12", value: 138 },
        { time: "12:13", value: 142 },
        { time: "12:14", value: 135 },
        { time: "12:15", value: 148 },
        { time: "12:16", value: 145 }
      ]
    },
    {
      id: 2,
      name: "Data Ingestion Rate",
      icon: "Download",
      current: 2847,
      previous: 2654,
      target: 3000,
      unit: "rate",
      history: [
        { time: "12:12", value: 2634 },
        { time: "12:13", value: 2698 },
        { time: "12:14", value: 2756 },
        { time: "12:15", value: 2823 },
        { time: "12:16", value: 2847 }
      ]
    },
    {
      id: 3,
      name: "WebSocket Connections",
      icon: "Wifi",
      current: 1247,
      previous: 1198,
      target: 1500,
      unit: "count",
      history: [
        { time: "12:12", value: 1189 },
        { time: "12:13", value: 1205 },
        { time: "12:14", value: 1223 },
        { time: "12:15", value: 1235 },
        { time: "12:16", value: 1247 }
      ]
    },
    {
      id: 4,
      name: "Error Rate",
      icon: "AlertTriangle",
      current: 0.8,
      previous: 1.2,
      target: 1.0,
      unit: "percentage",
      history: [
        { time: "12:12", value: 1.3 },
        { time: "12:13", value: 1.1 },
        { time: "12:14", value: 0.9 },
        { time: "12:15", value: 0.7 },
        { time: "12:16", value: 0.8 }
      ]
    }
  ]);

  const [alertThresholds, setAlertThresholds] = useState([
    {
      id: 1,
      name: "Response Time Alert",
      description: "API response time monitoring",
      icon: "Clock",
      enabled: true,
      current: 145,
      warning: 200,
      critical: 500,
      recentAlerts: [
        { timestamp: "12:10:30", message: "Response time exceeded warning threshold", severity: "warning" },
        { timestamp: "11:45:15", message: "Response time normalized", severity: "info" }
      ]
    },
    {
      id: 2,
      name: "Error Rate Alert",
      description: "System error rate monitoring",
      icon: "AlertTriangle",
      enabled: true,
      current: 0.8,
      warning: 2.0,
      critical: 5.0,
      recentAlerts: [
        { timestamp: "11:30:45", message: "Error rate spike detected", severity: "warning" }
      ]
    },
    {
      id: 3,
      name: "Data Freshness Alert",
      description: "Data source staleness monitoring",
      icon: "RefreshCw",
      enabled: true,
      current: 30,
      warning: 300,
      critical: 600,
      recentAlerts: []
    },
    {
      id: 4,
      name: "Connection Count Alert",
      description: "WebSocket connection monitoring",
      icon: "Wifi",
      enabled: false,
      current: 1247,
      warning: 1800,
      critical: 2000,
      recentAlerts: []
    }
  ]);

  const [systemLogs] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 120000),
      level: "error",
      source: "WeatherAPI",
      message: "Connection timeout to primary weather service provider",
      threadId: "worker-003",
      user: "system",
      sessionId: "sess_wx_001",
      errorCode: "CONN_TIMEOUT_001",
      stackTrace: `at WeatherService.connect(weather.js:45)\nat APIManager.initialize(api.js:123)\nat SystemBootstrap.start(bootstrap.js:67)`,
      relatedLogs: [
        { timestamp: new Date(Date.now() - 125000), message: "Attempting connection to weather.api.com" },
        { timestamp: new Date(Date.now() - 118000), message: "Switched to backup weather provider" }
      ]
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 180000),
      level: "warning",
      source: "MLEngine",
      message: "Model prediction accuracy below optimal threshold (92.1%)",
      threadId: "ml-worker-001",
      user: "ml-service",
      sessionId: "sess_ml_045",
      stackTrace: null,
      relatedLogs: []
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 240000),
      level: "info",
      source: "DatabaseCluster",
      message: "Automated backup completed successfully - 2.3GB archived",
      threadId: "db-backup-001",
      user: "backup-service",
      sessionId: "sess_backup_012",
      stackTrace: null,
      relatedLogs: []
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 300000),
      level: "debug",
      source: "GPSTracker",
      message: "Train position update received: Train-4521 at coordinates (40.7589, -73.9851)",
      threadId: "gps-worker-002",
      user: "tracking-service",
      sessionId: "sess_gps_089",
      stackTrace: null,
      relatedLogs: []
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 360000),
      level: "warning",
      source: "APIGateway",
      message: "Rate limit approaching for railway operations API (85% of quota used)",
      threadId: "api-monitor-001",
      user: "api-service",
      sessionId: "sess_api_156",
      stackTrace: null,
      relatedLogs: []
    },
    {
      id: 6,
      timestamp: new Date(Date.now() - 420000),
      level: "info",
      source: "SystemMonitor",
      message: "Health check completed - all critical systems operational",
      threadId: "health-check-001",
      user: "monitor-service",
      sessionId: "sess_health_023",
      stackTrace: null,
      relatedLogs: []
    }
  ]);

  // Update timestamp every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date()?.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Simulate system health updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        overall: Math.max(90, Math.min(99, prev?.overall + (Math.random() - 0.5) * 2))
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshDataSources = () => {
    console.log('Refreshing all data sources...');
    // Simulate refresh action
  };

  const handleTestConnection = (sourceId) => {
    console.log(`Testing connection for source ${sourceId}...`);
    // Simulate connection test
  };

  const handleUpdateThreshold = (thresholdId, values) => {
    setAlertThresholds(prev => 
      prev?.map(threshold => 
        threshold?.id === thresholdId 
          ? { ...threshold, ...values }
          : threshold
      )
    );
    console.log(`Updated threshold ${thresholdId}:`, values);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">System Status Monitor</h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive health monitoring and diagnostics for railway control infrastructure
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full status-breathing"></div>
              <span>Real-time monitoring active</span>
            </div>
          </div>

          {/* Top Section - System Health Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <SystemHealthOverview 
                systemHealth={systemHealth}
                uptime={uptime}
                lastUpdate={lastUpdate}
              />
            </div>
            <div className="lg:col-span-1">
              <PerformanceMetrics metrics={performanceMetrics} />
            </div>
          </div>

          {/* Middle Section - Data Sources */}
          <DataSourcePanel 
            dataSources={dataSources}
            onRefresh={handleRefreshDataSources}
            onTestConnection={handleTestConnection}
          />

          {/* Bottom Section - Configuration and Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <AlertThresholds 
                thresholds={alertThresholds}
                onUpdateThreshold={handleUpdateThreshold}
              />
            </div>
            <div className="lg:col-span-1">
              <SystemLogs logs={systemLogs} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemStatusMonitor;