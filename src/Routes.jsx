import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import MainControlDashboard from 'pages/main-control-dashboard';
import AIRecommendationsPanel from 'pages/ai-recommendation-panel';
import PerformanceAnalytics from 'pages/performance-analytics';
import SystemStatusMonitor from 'pages/system-status-monitor';
import AlertManagementCenter from 'pages/alert-management-center';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Default to Control Center */}
        <Route path="/" element={<MainControlDashboard />} />
        <Route path="/main-control-dashboard" element={<MainControlDashboard />} />
        <Route path="/ai-recommendation-panel" element={<AIRecommendationsPanel />} />
        <Route path="/performance-analytics" element={<PerformanceAnalytics />} />
        <Route path="/system-status-monitor" element={<SystemStatusMonitor />} />
        <Route path="/alert-management-center" element={<AlertManagementCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
