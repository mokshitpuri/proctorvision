import React, { useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const EventLogPanel = ({ events, integrityScore, focusLossCount, suspiciousActivityCount }) => {
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef?.current) {
      logContainerRef.current.scrollTop = logContainerRef?.current?.scrollHeight;
    }
  }, [events]);

  const getEventIcon = (type) => {
    switch (type) {
      case 'focus_loss':
        return { name: 'EyeOff', color: 'text-warning' };
      case 'unauthorized_item':
        return { name: 'AlertTriangle', color: 'text-error' };
      case 'multiple_faces':
        return { name: 'Users', color: 'text-error' };
      case 'face_absence':
        return { name: 'UserX', color: 'text-error' };
      case 'session_start':
        return { name: 'Play', color: 'text-success' };
      case 'session_pause':
        return { name: 'Pause', color: 'text-warning' };
      case 'session_resume':
        return { name: 'Play', color: 'text-success' };
      case 'session_stop':
        return { name: 'Square', color: 'text-error' };
      default:
        return { name: 'Info', color: 'text-text-secondary' };
    }
  };

  const getEventSeverity = (type) => {
    switch (type) {
      case 'unauthorized_item': case'multiple_faces': case'face_absence':
        return 'high';
      case 'focus_loss':
        return 'medium';
      default:
        return 'low';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getIntegrityScoreColor = () => {
    if (integrityScore >= 90) return 'text-success';
    if (integrityScore >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-subtle h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Icon name="Activity" size={18} color="white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Live Event Log</h3>
              <p className="text-xs text-text-secondary">Real-time monitoring events</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs text-success font-medium">Live</span>
          </div>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="p-4 border-b border-border bg-muted/10">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getIntegrityScoreColor()}`}>
              {integrityScore}%
            </div>
            <div className="text-xs text-text-secondary">Integrity Score</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">
              {focusLossCount}
            </div>
            <div className="text-xs text-text-secondary">Focus Losses</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              {suspiciousActivityCount}
            </div>
            <div className="text-xs text-text-secondary">Suspicious Events</div>
          </div>
        </div>
      </div>
      {/* Event List */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={logContainerRef}
          className="h-full overflow-y-auto p-4 space-y-3"
        >
          {events?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Icon name="Clock" size={48} className="text-text-secondary mb-3" />
              <p className="text-sm text-text-secondary">No events recorded yet</p>
              <p className="text-xs text-text-secondary mt-1">
                Events will appear here when monitoring starts
              </p>
            </div>
          ) : (
            events?.map((event, index) => {
              const eventIcon = getEventIcon(event?.type);
              const severity = getEventSeverity(event?.type);
              
              return (
                <div
                  key={index}
                  className={`
                    flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200
                    ${severity === 'high' ? 'bg-error/5 border-error/20' :
                      severity === 'medium'? 'bg-warning/5 border-warning/20' : 'bg-muted/30 border-border'}
                  `}
                >
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0
                    ${severity === 'high' ? 'bg-error/10' :
                      severity === 'medium'? 'bg-warning/10' : 'bg-muted'}
                  `}>
                    <Icon name={eventIcon?.name} size={16} className={eventIcon?.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {event?.message}
                      </p>
                      <span className="text-xs text-text-secondary font-mono ml-2">
                        {formatTimestamp(event?.timestamp)}
                      </span>
                    </div>
                    
                    {event?.details && (
                      <p className="text-xs text-text-secondary mt-1">
                        {event?.details}
                      </p>
                    )}
                    
                    {event?.confidence && (
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-text-secondary">Confidence:</span>
                        <div className="flex-1 bg-muted rounded-full h-1.5 max-w-20">
                          <div 
                            className={`
                              h-full rounded-full transition-all duration-300
                              ${event?.confidence >= 0.8 ? 'bg-success' :
                                event?.confidence >= 0.6 ? 'bg-warning' : 'bg-error'}
                            `}
                            style={{ width: `${event?.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-text-secondary">
                          {Math.round(event?.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Total Events: {events?.length}</span>
          <span>Last Updated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default EventLogPanel;