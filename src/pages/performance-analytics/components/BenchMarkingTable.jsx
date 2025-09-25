import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BenchmarkingTable = ({ data, onExport }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'variance', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig?.key) {
      sortableData?.sort((a, b) => {
        if (a?.[sortConfig?.key] < b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (a?.[sortConfig?.key] > b?.[sortConfig?.key]) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const getVarianceColor = (variance) => {
    if (variance >= 5) return 'text-success';
    if (variance >= -5) return 'text-warning';
    return 'text-error';
  };

  const getVarianceIcon = (variance) => {
    if (variance > 0) return 'TrendingUp';
    if (variance < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'excellent': { color: 'bg-success text-success-foreground', icon: 'CheckCircle' },
      'good': { color: 'bg-primary text-primary-foreground', icon: 'Circle' },
      'warning': { color: 'bg-warning text-warning-foreground', icon: 'AlertTriangle' },
      'critical': { color: 'bg-error text-error-foreground', icon: 'XCircle' }
    };

    const config = statusConfig?.[status] || statusConfig?.good;

    return (
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{status}</span>
      </div>
    );
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return 'ArrowUpDown';
    }
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Target" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Performance Benchmarking</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Icon name="Download" size={14} className="mr-1" />
            Export
          </Button>
          <Button variant="ghost" size="sm">
            <Icon name="RefreshCw" size={14} className="mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('metric')}
                  className="flex items-center space-x-1 hover:text-primary transition-control"
                >
                  <span>Metric</span>
                  <Icon name={getSortIcon('metric')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('actual')}
                  className="flex items-center space-x-1 hover:text-primary transition-control ml-auto"
                >
                  <span>Actual</span>
                  <Icon name={getSortIcon('actual')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('target')}
                  className="flex items-center space-x-1 hover:text-primary transition-control ml-auto"
                >
                  <span>Target</span>
                  <Icon name={getSortIcon('target')} size={14} />
                </button>
              </th>
              <th className="text-right p-4 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('variance')}
                  className="flex items-center space-x-1 hover:text-primary transition-control ml-auto"
                >
                  <span>Variance</span>
                  <Icon name={getSortIcon('variance')} size={14} />
                </button>
              </th>
              <th className="text-center p-4 text-sm font-medium text-foreground">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 hover:text-primary transition-control mx-auto"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 text-sm font-medium text-foreground">Recommendations</th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((row, index) => (
              <tr key={index} className="border-t border-border hover:bg-muted/20 transition-control">
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={row?.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{row?.metric}</div>
                      <div className="text-xs text-muted-foreground">{row?.description}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="text-sm font-medium text-foreground">
                    {row?.actual}{row?.unit}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="text-sm text-muted-foreground">
                    {row?.target}{row?.unit}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className={`flex items-center justify-end space-x-1 ${getVarianceColor(row?.variance)}`}>
                    <Icon name={getVarianceIcon(row?.variance)} size={14} />
                    <span className="text-sm font-medium">
                      {row?.variance > 0 ? '+' : ''}{row?.variance}%
                    </span>
                  </div>
                </td>
                <td className="p-4 text-center">
                  {getStatusBadge(row?.status)}
                </td>
                <td className="p-4">
                  <div className="text-xs text-muted-foreground max-w-xs">
                    {row?.recommendation}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Summary Footer */}
      <div className="border-t border-border p-4 bg-muted/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground">Metrics Above Target</div>
            <div className="text-lg font-bold text-success">
              {sortedData?.filter(row => row?.variance > 0)?.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Metrics At Target</div>
            <div className="text-lg font-bold text-warning">
              {sortedData?.filter(row => row?.variance === 0)?.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Metrics Below Target</div>
            <div className="text-lg font-bold text-error">
              {sortedData?.filter(row => row?.variance < 0)?.length}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Overall Performance</div>
            <div className="text-lg font-bold text-primary">
              {Math.round(sortedData?.reduce((acc, row) => acc + (row?.actual / row?.target * 100), 0) / sortedData?.length)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkingTable;