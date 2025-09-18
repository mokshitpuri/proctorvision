import React from 'react';
import Icon from '../AppIcon';

const SessionStatusIndicator = ({ 
  status = 'idle', 
  sessionId = null, 
  duration = null,
  participantCount = 0,
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'recording':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          icon: 'Circle',
          label: 'Recording',
          pulseColor: 'bg-error'
        };
      case 'monitoring':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          icon: 'Eye',
          label: 'Monitoring',
          pulseColor: 'bg-warning'
        };
      case 'active':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          icon: 'Play',
          label: 'Active',
          pulseColor: 'bg-success'
        };
      case 'paused':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/20',
          icon: 'Pause',
          label: 'Paused',
          pulseColor: 'bg-accent'
        };
      case 'completed':
        return {
          color: 'text-text-primary',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'CheckCircle',
          label: 'Completed',
          pulseColor: 'bg-text-secondary'
        };
      default:
        return {
          color: 'text-text-secondary',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Circle',
          label: 'Ready',
          pulseColor: 'bg-text-secondary'
        };
    }
  };

  const config = getStatusConfig();
  const isActive = ['recording', 'monitoring', 'active']?.includes(status);

  const formatDuration = (seconds) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className={`
      flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all duration-200
      ${config?.bgColor} ${config?.borderColor} ${className}
    `}>
      {/* Status Indicator */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`
            w-2.5 h-2.5 rounded-full transition-all duration-200
            ${config?.pulseColor} ${isActive ? 'animate-pulse-subtle' : ''}
          `} />
          {isActive && (
            <div className={`
              absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping
              ${config?.pulseColor} opacity-75
            `} />
          )}
        </div>
        <Icon name={config?.icon} size={16} className={config?.color} />
        <span className={`text-sm font-medium ${config?.color}`}>
          {config?.label}
        </span>
      </div>
      {/* Session Details */}
      {(sessionId || duration !== null || participantCount > 0) && (
        <div className="flex items-center space-x-3 text-xs text-text-secondary">
          {sessionId && (
            <div className="flex items-center space-x-1">
              <Icon name="Hash" size={12} />
              <span className="font-mono">{sessionId}</span>
            </div>
          )}
          
          {duration !== null && (
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span className="font-mono">{formatDuration(duration)}</span>
            </div>
          )}
          
          {participantCount > 0 && (
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={12} />
              <span>{participantCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionStatusIndicator;