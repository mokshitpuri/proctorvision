import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EventTimeline = ({ events }) => {
  const [filter, setFilter] = useState('all');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const getEventIcon = (type) => {
    switch (type) {
      case 'focus_loss':
        return { icon: 'EyeOff', color: 'text-warning', bg: 'bg-warning/10' };
      case 'object_detected':
        return { icon: 'Smartphone', color: 'text-error', bg: 'bg-error/10' };
      case 'multiple_faces':
        return { icon: 'Users', color: 'text-error', bg: 'bg-error/10' };
      case 'face_absent':
        return { icon: 'UserX', color: 'text-error', bg: 'bg-error/10' };
      case 'session_start':
        return { icon: 'Play', color: 'text-success', bg: 'bg-success/10' };
      case 'session_end':
        return { icon: 'Square', color: 'text-text-secondary', bg: 'bg-muted' };
      default:
        return { icon: 'AlertCircle', color: 'text-accent', bg: 'bg-accent/10' };
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-error bg-error/10 border-error/20';
      case 'medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'low':
        return 'text-accent bg-accent/10 border-accent/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatEventType = (type) => {
    return type?.split('_')?.map(word => 
      word?.charAt(0)?.toUpperCase() + word?.slice(1)
    )?.join(' ');
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events?.filter(event => event?.type === filter);

  const eventTypes = [...new Set(events.map(event => event.type))];

  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Event Timeline
          </h3>
          <span className="text-sm text-text-secondary">
            {filteredEvents?.length} events
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`
              px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200
              ${filter === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-text-secondary hover:text-text-primary'
              }
            `}
          >
            All Events
          </button>
          {eventTypes?.map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200
                ${filter === type 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-text-secondary hover:text-text-primary'
                }
              `}
            >
              {formatEventType(type)}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredEvents?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Calendar" size={48} className="text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">No events found for the selected filter</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredEvents?.map((event, index) => {
              const eventConfig = getEventIcon(event?.type);
              const isExpanded = expandedEvent === event?.id;
              
              return (
                <div key={event?.id} className="relative">
                  {index < filteredEvents?.length - 1 && (
                    <div className="absolute left-6 top-12 w-px h-8 bg-border" />
                  )}
                  <div className="flex items-start space-x-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0
                      ${eventConfig?.bg}
                    `}>
                      <Icon 
                        name={eventConfig?.icon} 
                        size={20} 
                        className={eventConfig?.color} 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-text-primary">
                            {formatEventType(event?.type)}
                          </h4>
                          <span className={`
                            px-2 py-1 rounded-md text-xs font-medium border
                            ${getSeverityColor(event?.severity)}
                          `}>
                            {event?.severity}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-text-secondary font-mono">
                            {formatTimestamp(event?.timestamp)}
                          </span>
                          {event?.details && (
                            <button
                              onClick={() => setExpandedEvent(
                                isExpanded ? null : event?.id
                              )}
                              className="p-1 hover:bg-muted rounded transition-colors duration-200"
                            >
                              <Icon 
                                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                                size={16} 
                                className="text-text-secondary" 
                              />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-text-secondary mb-2">
                        {event?.description}
                      </p>
                      
                      {event?.confidence && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs text-text-secondary">Confidence:</span>
                          <div className="flex-1 max-w-32 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${event?.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono text-text-secondary">
                            {event?.confidence}%
                          </span>
                        </div>
                      )}
                      
                      {isExpanded && event?.details && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                          <h5 className="text-sm font-medium text-text-primary mb-2">
                            Event Details
                          </h5>
                          <div className="space-y-2 text-sm text-text-secondary">
                            {Object.entries(event?.details)?.map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="capitalize">{key?.replace('_', ' ')}:</span>
                                <span className="font-mono">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventTimeline;