import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SystemLogs = ({ logs }) => {
  const [filterLevel, setFilterLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLog, setExpandedLog] = useState(null);

  const logLevels = [
    { value: 'all', label: 'All Levels', count: logs?.length },
    { value: 'error', label: 'Error', count: logs?.filter(log => log?.level === 'error')?.length },
    { value: 'warning', label: 'Warning', count: logs?.filter(log => log?.level === 'warning')?.length },
    { value: 'info', label: 'Info', count: logs?.filter(log => log?.level === 'info')?.length },
    { value: 'debug', label: 'Debug', count: logs?.filter(log => log?.level === 'debug')?.length }
  ];

  const filteredLogs = logs?.filter(log => {
    const matchesLevel = filterLevel === 'all' || log?.level === filterLevel;
    const matchesSearch = searchTerm === '' || 
      log?.message?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      log?.source?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      case 'debug': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'error': return 'XCircle';
      case 'warning': return 'AlertTriangle';
      case 'info': return 'Info';
      case 'debug': return 'Bug';
      default: return 'Circle';
    }
  };

  const getLevelBg = (level) => {
    switch (level) {
      case 'error': return 'bg-error/10';
      case 'warning': return 'bg-warning/10';
      case 'info': return 'bg-primary/10';
      case 'debug': return 'bg-muted/10';
      default: return 'bg-muted/10';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">System Logs</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {logLevels?.map((level) => (
            <Button
              key={level?.value}
              variant={filterLevel === level?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterLevel(level?.value)}
              className="flex items-center space-x-2"
            >
              <span>{level?.label}</span>
              <span className="bg-current/20 text-current px-1.5 py-0.5 rounded text-xs">
                {level?.count}
              </span>
            </Button>
          ))}
        </div>
      </div>
      {/* Logs List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLogs?.map((log) => (
          <div key={log?.id} className={`border border-border rounded-lg ${getLevelBg(log?.level)}`}>
            <div 
              className="p-4 cursor-pointer hover:bg-muted/5 transition-control"
              onClick={() => setExpandedLog(expandedLog === log?.id ? null : log?.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getLevelIcon(log?.level)} 
                    size={16} 
                    className={`mt-0.5 ${getLevelColor(log?.level)}`} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs font-medium uppercase px-2 py-1 rounded ${getLevelColor(log?.level)} bg-current/10`}>
                        {log?.level}
                      </span>
                      <span className="text-sm text-muted-foreground">{log?.source}</span>
                      <span className="text-sm text-muted-foreground font-mono">
                        {formatTimestamp(log?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{log?.message}</p>
                  </div>
                </div>
                <Icon 
                  name={expandedLog === log?.id ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground ml-2" 
                />
              </div>
            </div>

            {/* Expanded Details */}
            {expandedLog === log?.id && (
              <div className="border-t border-border p-4 bg-muted/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Thread ID:</span>
                        <span className="text-foreground font-mono">{log?.threadId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User:</span>
                        <span className="text-foreground">{log?.user}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Session:</span>
                        <span className="text-foreground font-mono">{log?.sessionId}</span>
                      </div>
                      {log?.errorCode && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Error Code:</span>
                          <span className="text-error font-mono">{log?.errorCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {log?.stackTrace && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Stack Trace</h4>
                      <div className="bg-muted/10 rounded p-2 text-xs font-mono text-foreground max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{log?.stackTrace}</pre>
                      </div>
                    </div>
                  )}
                </div>
                {log?.relatedLogs && log?.relatedLogs?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-foreground mb-2">Related Logs</h4>
                    <div className="space-y-1">
                      {log?.relatedLogs?.map((relatedLog, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          <span className="font-mono">{formatTimestamp(relatedLog?.timestamp)}</span>
                          <span className="ml-2">{relatedLog?.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {filteredLogs?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No logs found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;