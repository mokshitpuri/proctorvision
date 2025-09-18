import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventLoggingSection = ({ 
  events = [],
  isLiveUpdating = true,
  onExportEvents = () => {},
  onClearEvents = () => {}
}) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const eventsEndRef = useRef(null);
  const containerRef = useRef(null);

  // Mock events for demonstration
  const mockEvents = [
    {
      id: 1,
      type: 'session_start',
      category: 'system',
      message: 'Interview session initiated',
      timestamp: new Date(Date.now() - 1847000),
      severity: 'info',
      confidence: 1.0,
      duration: null
    },
    {
      id: 2,
      type: 'face_detected',
      category: 'detection',
      message: 'Candidate face successfully detected and tracked',
      timestamp: new Date(Date.now() - 1840000),
      severity: 'success',
      confidence: 0.95,
      duration: null
    },
    {
      id: 3,
      type: 'focus_loss',
      category: 'violation',
      message: 'Candidate looked away from screen for 7 seconds',
      timestamp: new Date(Date.now() - 1200000),
      severity: 'warning',
      confidence: 0.87,
      duration: 7
    },
    {
      id: 4,
      type: 'unauthorized_object',
      category: 'violation',
      message: 'Mobile phone detected in video frame',
      timestamp: new Date(Date.now() - 900000),
      severity: 'critical',
      confidence: 0.92,
      duration: 15
    },
    {
      id: 5,
      type: 'face_absence',
      category: 'violation',
      message: 'No face detected for 12 seconds',
      timestamp: new Date(Date.now() - 600000),
      severity: 'critical',
      confidence: 0.98,
      duration: 12
    },
    {
      id: 6,
      type: 'focus_restored',
      category: 'detection',
      message: 'Candidate attention restored to screen',
      timestamp: new Date(Date.now() - 300000),
      severity: 'success',
      confidence: 0.89,
      duration: null
    },
    {
      id: 7,
      type: 'audio_anomaly',
      category: 'violation',
      message: 'Background conversation detected',
      timestamp: new Date(Date.now() - 120000),
      severity: 'warning',
      confidence: 0.76,
      duration: 8
    },
    {
      id: 8,
      type: 'system_alert',
      category: 'system',
      message: 'AI detection models running optimally',
      timestamp: new Date(Date.now() - 30000),
      severity: 'info',
      confidence: 1.0,
      duration: null
    }
  ];

  const allEvents = events?.length > 0 ? events : mockEvents;

  useEffect(() => {
    const filtered = selectedFilter === 'all' 
      ? allEvents 
      : allEvents?.filter(event => event?.category === selectedFilter);
    
    setFilteredEvents(filtered?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  }, [selectedFilter, allEvents]);

  useEffect(() => {
    if (autoScroll && eventsEndRef?.current) {
      eventsEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredEvents, autoScroll]);

  const getEventIcon = (type) => {
    const icons = {
      session_start: 'Play',
      session_end: 'Square',
      face_detected: 'User',
      face_absence: 'UserX',
      focus_loss: 'EyeOff',
      focus_restored: 'Eye',
      unauthorized_object: 'AlertTriangle',
      multiple_faces: 'Users',
      audio_anomaly: 'Volume2',
      system_alert: 'Info'
    };
    return icons?.[type] || 'Circle';
  };

  const getEventColor = (severity) => {
    const colors = {
      success: 'text-success',
      info: 'text-primary',
      warning: 'text-warning',
      critical: 'text-error'
    };
    return colors?.[severity] || 'text-text-secondary';
  };

  const getBgColor = (severity) => {
    const colors = {
      success: 'bg-success/10',
      info: 'bg-primary/10',
      warning: 'bg-warning/10',
      critical: 'bg-error/10'
    };
    return colors?.[severity] || 'bg-muted';
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - eventTime) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return eventTime?.toLocaleTimeString();
  };

  const filterOptions = [
    { value: 'all', label: 'All Events', icon: 'List' },
    { value: 'violation', label: 'Violations', icon: 'AlertTriangle' },
    { value: 'detection', label: 'Detections', icon: 'Eye' },
    { value: 'system', label: 'System', icon: 'Settings' }
  ];

  const handleScroll = () => {
    if (containerRef?.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef?.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-surface border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="FileText" size={20} className="text-text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Event Log</h3>
          {isLiveUpdating && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle" />
              <span className="text-xs text-success font-medium">Live</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            onClick={onExportEvents}
            title="Export Events"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Trash2"
            onClick={onClearEvents}
            title="Clear Events"
          />
        </div>
      </div>
      {/* Filters */}
      <div className="flex items-center space-x-1 p-3 bg-muted border-b border-border overflow-x-auto">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setSelectedFilter(option?.value)}
            className={`
              flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap
              ${selectedFilter === option?.value
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }
            `}
          >
            <Icon name={option?.icon} size={14} />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Events List */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto"
      >
        <div className="p-4 space-y-3">
          {filteredEvents?.map((event) => (
            <div
              key={event?.id}
              className={`
                flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200
                ${getBgColor(event?.severity)} border-border hover:shadow-subtle
              `}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full bg-background
                ${getEventColor(event?.severity)}
              `}>
                <Icon name={getEventIcon(event?.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {event?.message}
                  </p>
                  <span className="text-xs text-text-secondary whitespace-nowrap ml-2">
                    {formatTimestamp(event?.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-text-secondary">
                  <span className="capitalize">{event?.category}</span>
                  <span>Confidence: {Math.round(event?.confidence * 100)}%</span>
                  {event?.duration && (
                    <span>Duration: {event?.duration}s</span>
                  )}
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${event?.severity === 'critical' ? 'bg-error/20 text-error' :
                      event?.severity === 'warning' ? 'bg-warning/20 text-warning' :
                      event?.severity === 'success'? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'
                    }
                  `}>
                    {event?.severity?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={eventsEndRef} />
        </div>
      </div>
      {/* Auto-scroll Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted border-t border-border">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`
              flex items-center space-x-2 px-2 py-1 rounded text-xs font-medium transition-colors duration-200
              ${autoScroll ? 'text-success' : 'text-text-secondary hover:text-text-primary'}
            `}
          >
            <Icon name={autoScroll ? "ArrowDown" : "ArrowDownOff"} size={12} />
            <span>Auto-scroll</span>
          </button>
        </div>
        
        <span className="text-xs text-text-secondary">
          {filteredEvents?.length} events
        </span>
      </div>
    </div>
  );
};

export default EventLoggingSection;