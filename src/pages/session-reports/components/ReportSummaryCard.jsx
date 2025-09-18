import React from 'react';
import Icon from '../../../components/AppIcon';

const ReportSummaryCard = ({ report }) => {
  const getIntegrityScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getIntegrityScoreBg = (score) => {
    if (score >= 90) return 'bg-success/10 border-success/20';
    if (score >= 70) return 'bg-warning/10 border-warning/20';
    return 'bg-error/10 border-error/20';
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Session Report Summary
          </h2>
          <p className="text-sm text-text-secondary">
            Generated on {new Date(report.generatedAt)?.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <div className={`
          px-4 py-2 rounded-lg border text-center min-w-[120px]
          ${getIntegrityScoreBg(report?.integrityScore)}
        `}>
          <div className="text-2xl font-bold mb-1">
            <span className={getIntegrityScoreColor(report?.integrityScore)}>
              {report?.integrityScore}%
            </span>
          </div>
          <div className="text-xs text-text-secondary font-medium">
            Integrity Score
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="User" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Candidate</p>
              <p className="text-lg font-semibold text-text-primary">{report?.candidateName}</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            ID: {report?.candidateId}
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Duration</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatDuration(report?.duration)}
              </p>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            {new Date(report.startTime)?.toLocaleTimeString()} - {new Date(report.endTime)?.toLocaleTimeString()}
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon name="EyeOff" size={16} className="text-warning" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Focus Losses</p>
              <p className="text-lg font-semibold text-text-primary">{report?.focusLosses}</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            {((report?.focusLosses / report?.duration) * 100)?.toFixed(1)}% of session
          </p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" size={16} className="text-error" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Violations</p>
              <p className="text-lg font-semibold text-text-primary">{report?.totalViolations}</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary">
            {report?.suspiciousEvents?.length} suspicious events
          </p>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary">Session ID:</span>
            <span className="font-mono text-text-primary">{report?.sessionId}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary">Position:</span>
            <span className="text-text-primary">{report?.position}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary">Interviewer:</span>
            <span className="text-text-primary">{report?.interviewer}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryCard;