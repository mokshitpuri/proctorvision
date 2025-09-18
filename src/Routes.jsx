import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SessionReports from './pages/session-reports';
import LiveMonitoringPanel from './pages/live-monitoring-panel';
import CandidateManagement from './pages/candidate-management';
import InterviewDashboard from './pages/interview-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CandidateManagement />} />
        <Route path="/session-reports" element={<SessionReports />} />
        <Route path="/live-monitoring-panel" element={<LiveMonitoringPanel />} />
        <Route path="/candidate-management" element={<CandidateManagement />} />
        <Route path="/interview-dashboard" element={<InterviewDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
