import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotificationBanner = ({ 
  alerts = [],
  onDismiss = () => {},
  onFlagConcern = () => {},
  onEmergencyStop = () => {}
}) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    const newAlerts = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id));
    setVisibleAlerts(newAlerts);
  }, [alerts, dismissedAlerts]);

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    onDismiss(alertId);
  };

  const getAlertConfig = (type, severity) => {
    const configs = {
      focus_loss: {
        icon: 'EyeOff',
        title: 'Focus Loss Detected',
        bgColor: severity === 'critical' ? 'bg-error' : 'bg-warning',
        textColor: severity === 'critical' ? 'text-error-foreground' : 'text-warning-foreground',
        borderColor: severity === 'critical' ? 'border-error' : 'border-warning'
      },
      face_absence: {
        icon: 'UserX',
        title: 'Face Not Detected',
        bgColor: 'bg-error',
        textColor: 'text-error-foreground',
        borderColor: 'border-error'
      },
      multiple_faces: {
        icon: 'Users',
        title: 'Multiple Faces Detected',
        bgColor: 'bg-error',
        textColor: 'text-error-foreground',
        borderColor: 'border-error'
      },
      unauthorized_object: {
        icon: 'AlertTriangle',
        title: 'Unauthorized Object',
        bgColor: 'bg-error',
        textColor: 'text-error-foreground',
        borderColor: 'border-error'
      },
      audio_anomaly: {
        icon: 'Volume2',
        title: 'Audio Anomaly',
        bgColor: 'bg-warning',
        textColor: 'text-warning-foreground',
        borderColor: 'border-warning'
      }
    };

    return configs?.[type] || {
      icon: 'AlertCircle',
      title: 'Detection Alert',
      bgColor: 'bg-warning',
      textColor: 'text-warning-foreground',
      borderColor: 'border-warning'
    };
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (visibleAlerts?.length === 0) return null;

  return (
    <div className="space-y-2 mb-4">
      {visibleAlerts?.map((alert) => {
        const config = getAlertConfig(alert?.type, alert?.severity);
        
        return (
          <div
            key={alert?.id}
            className={`
              flex items-center justify-between p-4 rounded-lg border-l-4 shadow-subtle animate-slide-down
              ${config?.bgColor} ${config?.textColor} ${config?.borderColor}
            `}
          >
            <div className="flex items-center space-x-3 flex-1">
              <Icon name={config?.icon} size={20} />
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium">{config?.title}</h4>
                  {alert?.severity === 'critical' && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-background/20 rounded-full">
                      CRITICAL
                    </span>
                  )}
                </div>
                
                <p className="text-sm opacity-90">{alert?.message}</p>
                
                <div className="flex items-center space-x-4 mt-2 text-xs opacity-80">
                  <span>Duration: {formatDuration(alert?.duration)}</span>
                  <span>Confidence: {Math.round(alert?.confidence * 100)}%</span>
                  <span>Time: {new Date(alert.timestamp)?.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {alert?.severity === 'critical' && (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Flag"
                  onClick={() => onFlagConcern(alert)}
                  className="bg-background/10 border-background/20 text-current hover:bg-background/20"
                >
                  Flag
                </Button>
              )}
              
              {alert?.type === 'multiple_faces' && (
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="Square"
                  onClick={() => onEmergencyStop(alert)}
                  className="bg-background text-error hover:bg-background/90"
                >
                  Stop Session
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => handleDismiss(alert?.id)}
                className="text-current hover:bg-background/20"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertNotificationBanner;