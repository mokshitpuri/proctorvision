import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SessionStatusIndicator from '../../components/ui/SessionStatusIndicator';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import VideoFeedDisplay from './components/VideoFeedDisplay';
import AlertNotificationBanner from './components/AlertNotificationBanner';
import LiveStatisticsPanel from './components/LiveStatisticsPanel';
import EventLoggingSection from './components/EventLoggingSection';
import EmergencyControls from './components/EmergencyControls';

const LiveMonitoringPanel = () => {
  const [sessionData, setSessionData] = useState({
    id: 'INT-2024-001',
    candidateName: 'Sarah Johnson',
    status: 'active',
    startTime: new Date(Date.now() - 1847000),
    duration: 1847,
    participantCount: 1
  });

  const [detectionZones, setDetectionZones] = useState({
    face: { active: true, confidence: 0.95 },
    focus: { active: true, confidence: 0.87 },
    objects: { active: false, confidence: 0.0 }
  });

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'unauthorized_object',
      severity: 'critical',
      message: 'Mobile phone detected in candidate\'s hand for 15 seconds',
      timestamp: new Date(Date.now() - 120000),
      duration: 15,
      confidence: 0.92
    },
    {
      id: 2,
      type: 'focus_loss',
      severity: 'warning',
      message: 'Candidate looking away from screen for extended period',
      timestamp: new Date(Date.now() - 300000),
      duration: 8,
      confidence: 0.87
    }
  ]);

  const [sessionStats, setSessionStats] = useState({
    duration: 1847,
    focusPercentage: 87.3,
    violationCounts: {
      focusLoss: 3,
      faceAbsence: 1,
      multipleFaces: 0,
      unauthorizedObjects: 2
    },
    integrityScore: 82,
    currentStreak: 245
  });

  const [detectionConfidence, setDetectionConfidence] = useState({
    face: 0.95,
    focus: 0.87,
    objects: 0.92,
    audio: 0.78
  });

  const [events, setEvents] = useState([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        duration: prev?.duration + 1,
        currentStreak: prev?.currentStreak + 1
      }));

      // Simulate detection confidence fluctuations
      setDetectionConfidence(prev => ({
        face: Math.max(0.7, Math.min(0.99, prev?.face + (Math.random() - 0.5) * 0.1)),
        focus: Math.max(0.6, Math.min(0.95, prev?.focus + (Math.random() - 0.5) * 0.15)),
        objects: Math.max(0.8, Math.min(0.98, prev?.objects + (Math.random() - 0.5) * 0.08)),
        audio: Math.max(0.5, Math.min(0.9, prev?.audio + (Math.random() - 0.5) * 0.2))
      }));

      // Simulate detection zone updates
      setDetectionZones(prev => ({
        face: { 
          active: Math.random() > 0.1, 
          confidence: Math.max(0.7, Math.min(0.99, prev?.face?.confidence + (Math.random() - 0.5) * 0.1))
        },
        focus: { 
          active: Math.random() > 0.2, 
          confidence: Math.max(0.6, Math.min(0.95, prev?.focus?.confidence + (Math.random() - 0.5) * 0.15))
        },
        objects: { 
          active: Math.random() > 0.9, 
          confidence: Math.random() > 0.9 ? Math.random() * 0.3 + 0.7 : 0.0
        }
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEmergencyStop = () => {
    setSessionData(prev => ({ ...prev, status: 'stopped' }));
    console.log('Emergency stop initiated');
  };

  const handlePauseSession = () => {
    setSessionData(prev => ({ ...prev, status: 'paused' }));
    console.log('Session paused');
  };

  const handleResumeSession = () => {
    setSessionData(prev => ({ ...prev, status: 'active' }));
    console.log('Session resumed');
  };

  const handleFlagConcern = (alert) => {
    console.log('Flagging concern:', alert);
    // Add flagged event to events log
    const flaggedEvent = {
      id: Date.now(),
      type: 'incident_flagged',
      category: 'system',
      message: `Incident flagged: ${alert?.message}`,
      timestamp: new Date(),
      severity: 'critical',
      confidence: 1.0,
      duration: null
    };
    setEvents(prev => [flaggedEvent, ...prev]);
  };

  const handleTakeScreenshot = () => {
    console.log('Taking screenshot');
    const screenshotEvent = {
      id: Date.now(),
      type: 'screenshot_taken',
      category: 'system',
      message: 'Screenshot captured for evidence',
      timestamp: new Date(),
      severity: 'info',
      confidence: 1.0,
      duration: null
    };
    setEvents(prev => [screenshotEvent, ...prev]);
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const handleVideoError = (error) => {
    console.error('Video error:', error);
    const errorEvent = {
      id: Date.now(),
      type: 'video_error',
      category: 'system',
      message: `Video stream error: ${error?.message}`,
      timestamp: new Date(),
      severity: 'critical',
      confidence: 1.0,
      duration: null
    };
    setEvents(prev => [errorEvent, ...prev]);
  };

  const handleExportEvents = (format) => {
    console.log(`Exporting events as ${format}`);
    // Mock export functionality
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Events exported successfully');
        resolve();
      }, 1000);
    });
  };

  const handleClearEvents = () => {
    setEvents([]);
    console.log('Events cleared');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        sessionStatus={sessionData?.status}
        currentSession={sessionData}
      />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Live Monitoring Panel</h1>
              <p className="text-text-secondary mt-1">
                Real-time AI-powered detection and behavioral analysis for {sessionData?.candidateName}
              </p>
            </div>
            
            <SessionStatusIndicator
              status={sessionData?.status}
              sessionId={sessionData?.id}
              duration={sessionStats?.duration}
              participantCount={sessionData?.participantCount}
            />
          </div>

          {/* Alert Notifications */}
          <AlertNotificationBanner
            alerts={alerts}
            onDismiss={handleDismissAlert}
            onFlagConcern={handleFlagConcern}
            onEmergencyStop={handleEmergencyStop}
          />

          {/* Quick Actions */}
          <QuickActionsToolbar
            context="monitoring"
            sessionData={sessionData}
            onStopSession={handleEmergencyStop}
            onPauseSession={handlePauseSession}
            onResumeSession={handleResumeSession}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Video Feed */}
            <div className="xl:col-span-2 space-y-6">
              <VideoFeedDisplay
                isSessionActive={sessionData?.status === 'active'}
                candidateName={sessionData?.candidateName}
                detectionZones={detectionZones}
                onVideoError={handleVideoError}
              />
              
              <EventLoggingSection
                events={events}
                isLiveUpdating={sessionData?.status === 'active'}
                onExportEvents={handleExportEvents}
                onClearEvents={handleClearEvents}
              />
            </div>

            {/* Right Column - Statistics & Controls */}
            <div className="space-y-6">
              <LiveStatisticsPanel
                sessionStats={sessionStats}
                detectionConfidence={detectionConfidence}
              />
              
              <EmergencyControls
                sessionStatus={sessionData?.status}
                onEmergencyStop={handleEmergencyStop}
                onPauseSession={handlePauseSession}
                onResumeSession={handleResumeSession}
                onFlagIncident={() => handleFlagConcern({ 
                  id: Date.now(), 
                  message: 'Manual incident flag',
                  type: 'manual_flag'
                })}
                onTakeScreenshot={handleTakeScreenshot}
                candidateName={sessionData?.candidateName}
                sessionId={sessionData?.id}
              />
            </div>
          </div>

          {/* Mobile-specific bottom padding */}
          <div className="h-20 lg:hidden" />
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoringPanel;