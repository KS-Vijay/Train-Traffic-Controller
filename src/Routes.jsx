import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AIRecommendationsPanel from 'pages/ai-recommendation-panel';
import AlertManagementCenter from 'pages/alert-management-center';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AIRecommendationsPanel />} />
        <Route path="/ai-recommendation-panel" element={<AIRecommendationsPanel />} />
        <Route path="/alert-management-center" element={<AlertManagementCenter />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
