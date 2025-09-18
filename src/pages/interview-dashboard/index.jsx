import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import VideoFeedPanel from './components/VideoFeedPanel';
import EventLogPanel from './components/EventLogPanel';
import DetectionStatusPanel from './components/DetectionStatusPanel';
import QuickActionsPanel from './components/QuickActionsPanel';
import Icon from '../../components/AppIcon';

const InterviewDashboard = () => {
  const [candidateName, setCandidateName] = useState('');
  const [sessionStatus, setSessionStatus] = useState('idle'); // idle, active, recording, paused
  const [sessionDuration, setSessionDuration] = useState(0);
  const [events, setEvents] = useState([]);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [focusLossCount, setFocusLossCount] = useState(0);
  const [suspiciousActivityCount, setSuspiciousActivityCount] = useState(0);

  // Detection states
  const [detectionStates, setDetectionStates] = useState({
    faceDetection: 'active',
    focusTracking: 'active',
    objectDetection: 'active',
    audioMonitoring: 'active'
  });

  // System status
  const [systemStatus, setSystemStatus] = useState({
    aiModel: 'connected',
    camera: 'connected',
    microphone: 'connected'
  });

  // Session timer
  useEffect(() => {
    let interval;
    if (sessionStatus === 'active' || sessionStatus === 'recording') {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStatus]);

  // Mock AI detection simulation
  useEffect(() => {
    let detectionInterval;
    if (sessionStatus === 'active' || sessionStatus === 'recording') {
      detectionInterval = setInterval(() => {
        // Simulate random detection events
        const eventTypes = [
          { type: 'focus_loss', probability: 0.1 },
          { type: 'unauthorized_item', probability: 0.05 },
          { type: 'multiple_faces', probability: 0.02 },
          { type: 'face_absence', probability: 0.03 }
        ];

        eventTypes?.forEach(({ type, probability }) => {
          if (Math.random() < probability) {
            addEvent(type);
          }
        });
      }, 5000);
    }
    return () => clearInterval(detectionInterval);
  }, [sessionStatus]);

  const addEvent = (type, customMessage = null, confidence = null) => {
    const eventMessages = {
      focus_loss: "Candidate looked away from screen",
      unauthorized_item: "Suspicious object detected in frame",
      multiple_faces: "Multiple faces detected in video",
      face_absence: "No face detected in video feed",
      session_start: "Interview session started",
      session_pause: "Session paused by interviewer",
      session_resume: "Session resumed",
      session_stop: "Interview session ended"
    };

    const eventDetails = {
      focus_loss: "Duration: 7 seconds",
      unauthorized_item: "Object: Mobile device detected",
      multiple_faces: "Count: 2 faces in frame",
      face_absence: "Duration: 12 seconds"
    };

    const newEvent = {
      type,
      message: customMessage || eventMessages?.[type],
      details: eventDetails?.[type] || null,
      timestamp: new Date(),
      confidence: confidence || (Math.random() * 0.4 + 0.6) // 0.6-1.0 range
    };

    setEvents(prev => [...prev, newEvent]);

    // Update counters and integrity score
    if (type === 'focus_loss') {
      setFocusLossCount(prev => prev + 1);
      setIntegrityScore(prev => Math.max(0, prev - 2));
    } else if (['unauthorized_item', 'multiple_faces', 'face_absence']?.includes(type)) {
      setSuspiciousActivityCount(prev => prev + 1);
      setIntegrityScore(prev => Math.max(0, prev - 5));
    }
  };

  const handleStartSession = () => {
    setSessionStatus('recording');
    setSessionDuration(0);
    addEvent('session_start', `Interview started for ${candidateName}`);
  };

  const handleStopSession = () => {
    setSessionStatus('idle');
    addEvent('session_stop', `Interview completed. Duration: ${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60)?.toString()?.padStart(2, '0')}`);
  };

  const handlePauseSession = () => {
    setSessionStatus('paused');
    addEvent('session_pause');
  };

  const handleResumeSession = () => {
    setSessionStatus('recording');
    addEvent('session_resume');
  };

  const handleGenerateReport = () => {
    console.log('Generating report for:', candidateName);
    // Mock report generation
    addEvent('report_generated', `Comprehensive report generated for ${candidateName}`, 1.0);
  };

  const handleExportData = async (format) => {
    console.log(`Exporting data in ${format} format`);
    // Mock export delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    addEvent('data_export', `Session data exported as ${format?.toUpperCase()}`, 1.0);
  };

  const handleTakeScreenshot = () => {
    console.log('Taking screenshot');
    addEvent('screenshot_taken', 'Video frame captured', 1.0);
  };

  const handleFlagIncident = () => {
    console.log('Flagging incident');
    addEvent('incident_flagged', 'Suspicious behavior flagged by interviewer', 1.0);
    setSuspiciousActivityCount(prev => prev + 1);
    setIntegrityScore(prev => Math.max(0, prev - 10));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        sessionStatus={sessionStatus}
        currentSession={sessionStatus !== 'idle' ? { id: 'INT-' + Date.now()?.toString()?.slice(-6) } : null}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto p-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary truncate">Interview Dashboard</h1>
                <p className="text-text-secondary mt-1 text-sm sm:text-base">
                  AI-powered proctoring and monitoring system
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border rounded-lg text-xs sm:text-sm">
                  <Icon name="Calendar" size={16} className="text-text-secondary" />
                  <span className="text-text-primary hidden sm:inline">
                    {new Date()?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="text-text-primary sm:hidden">
                    {new Date()?.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-surface border border-border rounded-lg">
                  <Icon name="Clock" size={16} className="text-text-secondary" />
                  <span className="text-xs sm:text-sm text-text-primary font-mono">
                    {new Date()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Video Feed */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6 order-1">
              <VideoFeedPanel
                candidateName={candidateName}
                onCandidateNameChange={setCandidateName}
                sessionStatus={sessionStatus}
                onStartSession={handleStartSession}
                onStopSession={handleStopSession}
                onPauseSession={handlePauseSession}
                onResumeSession={handleResumeSession}
                sessionDuration={sessionDuration}
              />
              
              {/* Detection Status - Responsive Visibility */}
              <div className="hidden xl:block">
                <DetectionStatusPanel
                  detectionStates={detectionStates}
                  aiModelStatus={systemStatus?.aiModel}
                  cameraStatus={systemStatus?.camera}
                  microphoneStatus={systemStatus?.microphone}
                />
              </div>
            </div>

            {/* Right Column - Event Log & Actions */}
            <div className="space-y-4 sm:space-y-6 order-2">
              <div className="h-80 sm:h-96 xl:h-[600px]">
                <EventLogPanel
                  events={events}
                  integrityScore={integrityScore}
                  focusLossCount={focusLossCount}
                  suspiciousActivityCount={suspiciousActivityCount}
                />
              </div>
              
              <QuickActionsPanel
                sessionStatus={sessionStatus}
                onGenerateReport={handleGenerateReport}
                onExportData={handleExportData}
                onTakeScreenshot={handleTakeScreenshot}
                onFlagIncident={handleFlagIncident}
                candidateName={candidateName}
              />
            </div>
          </div>

          {/* Mobile Detection Status - Full Width on Mobile */}
          <div className="xl:hidden mt-4 sm:mt-6 order-3">
            <DetectionStatusPanel
              detectionStates={detectionStates}
              aiModelStatus={systemStatus?.aiModel}
              cameraStatus={systemStatus?.camera}
              microphoneStatus={systemStatus?.microphone}
            />
          </div>

          {/* Session Statistics - Enhanced Mobile Layout */}
          {sessionStatus !== 'idle' && (
            <div className="mt-4 sm:mt-6 bg-surface border border-border rounded-lg p-4 sm:p-6 order-4">
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-3 sm:mb-4">Session Statistics</h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-primary">
                    {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60)?.toString()?.padStart(2, '0')}
                  </div>
                  <div className="text-xs sm:text-sm text-text-secondary">Duration</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <div className={`text-lg sm:text-2xl font-bold ${integrityScore >= 90 ? 'text-success' : integrityScore >= 70 ? 'text-warning' : 'text-error'}`}>
                    {integrityScore}%
                  </div>
                  <div className="text-xs sm:text-sm text-text-secondary">Integrity Score</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-warning">{focusLossCount}</div>
                  <div className="text-xs sm:text-sm text-text-secondary">Focus Losses</div>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-muted/30 rounded-lg">
                  <div className="text-lg sm:text-2xl font-bold text-error">{suspiciousActivityCount}</div>
                  <div className="text-xs sm:text-sm text-text-secondary">Suspicious Events</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InterviewDashboard;