import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AIRecommendationsPanel from './pages/ai-recommendations-panel';
import MainControlDashboard from './pages/main-control-dashboard';
import PerformanceAnalytics from './pages/performance-analytics';
import SystemStatusMonitor from './pages/system-status-monitor';
import AlertManagementCenter from './pages/alert-management-center';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIRecommendationsPanel />} />
        <Route path="/ai-recommendations-panel" element={<AIRecommendationsPanel />} />
        <Route path="/main-control-dashboard" element={<MainControlDashboard />} />
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
