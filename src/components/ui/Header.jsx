import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [systemStatus, setSystemStatus] = useState('connected');
  const [alertCount, setAlertCount] = useState(0);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'control',
      label: 'Control Center',
      path: '/main-control-dashboard',
      icon: 'Monitor',
      tooltip: 'Real-time train tracking and operational command'
    },
    {
      id: 'insights',
      label: 'AI Insights',
      path: '/ai-recommendation-panel',
      icon: 'Brain',
      tooltip: 'Machine learning recommendations and predictive analytics'
    },
    {
      id: 'performance',
      label: 'Performance',
      path: '/performance-analytics',
      icon: 'BarChart3',
      tooltip: 'Operational analytics and trend analysis'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      path: '/alert-management-center',
      icon: 'AlertTriangle',
      tooltip: 'Incident management and emergency response'
    },
    {
      id: 'system',
      label: 'System Health',
      path: '/system-status-monitor',
      icon: 'Activity',
      tooltip: 'Infrastructure monitoring and diagnostics'
    }
  ];

  const moreMenuItems = [
    { label: 'Settings', icon: 'Settings', action: () => console.log('Settings') },
    { label: 'Help', icon: 'HelpCircle', action: () => console.log('Help') },
    { label: 'Admin', icon: 'Shield', action: () => console.log('Admin') }
  ];

  useEffect(() => {
    // Simulate WebSocket connection for system status
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'warning', 'error'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setSystemStatus(randomStatus);
    }, 30000);

    // Simulate alert count updates
    const alertInterval = setInterval(() => {
      setAlertCount(Math.floor(Math.random() * 5));
    }, 15000);

    return () => {
      clearInterval(statusInterval);
      clearInterval(alertInterval);
    };
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'connected': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'connected': return 'Wifi';
      case 'warning': return 'WifiOff';
      case 'error': return 'AlertCircle';
      default: return 'Wifi';
    }
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Train" size={20} color="var(--color-primary-foreground)" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground leading-none">
                TrainControl
              </h1>
              <span className="text-xs text-muted-foreground leading-none">
                Analytics
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <div key={item?.id} className="relative">
              <Button
                variant={isActiveRoute(item?.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                className={`
                  relative px-4 py-2 transition-control
                  ${isActiveRoute(item?.path) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} className="mr-2" />
                {item?.label}
              </Button>
              
              {/* Alert Badge */}
              {item?.id === 'alerts' && alertCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground rounded-full flex items-center justify-center text-xs font-medium status-breathing">
                  {alertCount}
                </div>
              )}
            </div>
          ))}

          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-control"
            >
              <Icon name="MoreHorizontal" size={16} />
            </Button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg control-room-shadow animate-fade-in">
                <div className="py-2">
                  {moreMenuItems?.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item?.action();
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted transition-control flex items-center space-x-3"
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* System Status Indicator */}
        <div className="flex items-center space-x-4">
          <div 
            className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-muted ${getStatusColor()} transition-control`}
            title={`System Status: ${systemStatus?.charAt(0)?.toUpperCase() + systemStatus?.slice(1)}`}
          >
            <Icon name={getStatusIcon()} size={14} className="status-breathing" />
            <span className="text-xs font-medium capitalize">
              {systemStatus}
            </span>
          </div>

          <div className="text-xs text-muted-foreground font-mono">
            {new Date()?.toLocaleTimeString('en-US', { 
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>
      {/* Click outside handler for more menu */}
      {isMoreMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;