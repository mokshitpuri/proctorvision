import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveStatisticsPanel = ({ 
  sessionStats = {
    duration: 1847, // seconds
    focusPercentage: 87.3,
    violationCounts: {
      focusLoss: 3,
      faceAbsence: 1,
      multipleFaces: 0,
      unauthorizedObjects: 2
    },
    integrityScore: 82,
    currentStreak: 245 // seconds of good behavior
  },
  detectionConfidence = {
    face: 0.95,
    focus: 0.87,
    objects: 0.92,
    audio: 0.78
  }
}) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
    }
    return `${minutes}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const StatCard = ({ icon, label, value, color = 'text-text-primary', subtext = null }) => (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-2">
        <Icon name={icon} size={16} className="text-text-secondary" />
        <span className="text-sm font-medium text-text-secondary">{label}</span>
      </div>
      <div className={`text-2xl font-semibold ${color}`}>{value}</div>
      {subtext && (
        <div className="text-xs text-text-secondary mt-1">{subtext}</div>
      )}
    </div>
  );

  const ConfidenceMeter = ({ label, confidence, icon }) => (
    <div className="bg-surface border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon name={icon} size={14} className="text-text-secondary" />
          <span className="text-sm font-medium text-text-secondary">{label}</span>
        </div>
        <span className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
          {Math.round(confidence * 100)}%
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            confidence >= 0.8 ? 'bg-success' :
            confidence >= 0.6 ? 'bg-warning' : 'bg-error'
          }`}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Session Overview */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Activity" size={20} />
          <span>Live Session Statistics</span>
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon="Clock"
            label="Session Duration"
            value={formatDuration(sessionStats?.duration)}
            subtext="Active monitoring"
          />
          
          <StatCard
            icon="Target"
            label="Focus Percentage"
            value={`${sessionStats?.focusPercentage}%`}
            color={getScoreColor(sessionStats?.focusPercentage)}
            subtext="Current session"
          />
          
          <StatCard
            icon="Shield"
            label="Integrity Score"
            value={sessionStats?.integrityScore}
            color={getScoreColor(sessionStats?.integrityScore)}
            subtext="Real-time calculation"
          />
          
          <StatCard
            icon="TrendingUp"
            label="Current Streak"
            value={formatDuration(sessionStats?.currentStreak)}
            color="text-success"
            subtext="Good behavior"
          />
        </div>
      </div>
      {/* Violation Counts */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h4 className="text-md font-semibold text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="AlertTriangle" size={18} />
          <span>Violation Summary</span>
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="EyeOff" size={14} className="text-warning" />
              <span className="text-sm">Focus Loss</span>
            </div>
            <span className="text-sm font-medium">{sessionStats?.violationCounts?.focusLoss}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="UserX" size={14} className="text-error" />
              <span className="text-sm">Face Absence</span>
            </div>
            <span className="text-sm font-medium">{sessionStats?.violationCounts?.faceAbsence}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={14} className="text-error" />
              <span className="text-sm">Multiple Faces</span>
            </div>
            <span className="text-sm font-medium">{sessionStats?.violationCounts?.multipleFaces}</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <Icon name="Smartphone" size={14} className="text-error" />
              <span className="text-sm">Unauthorized Objects</span>
            </div>
            <span className="text-sm font-medium">{sessionStats?.violationCounts?.unauthorizedObjects}</span>
          </div>
        </div>
      </div>
      {/* Detection Confidence */}
      <div className="bg-background border border-border rounded-lg p-4">
        <h4 className="text-md font-semibold text-text-primary mb-3 flex items-center space-x-2">
          <Icon name="Zap" size={18} />
          <span>AI Detection Confidence</span>
        </h4>
        
        <div className="space-y-3">
          <ConfidenceMeter
            label="Face Detection"
            confidence={detectionConfidence?.face}
            icon="User"
          />
          
          <ConfidenceMeter
            label="Focus Tracking"
            confidence={detectionConfidence?.focus}
            icon="Eye"
          />
          
          <ConfidenceMeter
            label="Object Recognition"
            confidence={detectionConfidence?.objects}
            icon="Scan"
          />
          
          <ConfidenceMeter
            label="Audio Analysis"
            confidence={detectionConfidence?.audio}
            icon="Volume2"
          />
        </div>
      </div>
      {/* Real-time Status */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle" />
          <span className="text-sm font-medium text-success">AI Models Active</span>
        </div>
        <p className="text-xs text-text-secondary">
          TensorFlow.js models running at 30 FPS with real-time analysis
        </p>
      </div>
    </div>
  );
};

export default LiveStatisticsPanel;