import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyControls = ({ 
  sessionStatus = 'active',
  onEmergencyStop = () => {},
  onPauseSession = () => {},
  onResumeSession = () => {},
  onFlagIncident = () => {},
  onTakeScreenshot = () => {},
  candidateName = "John Doe",
  sessionId = "INT-2024-001"
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEmergencyAction = async (action, callback) => {
    setIsProcessing(true);
    try {
      await callback();
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const showConfirmation = (action, callback) => {
    setConfirmAction({ action, callback });
    setShowConfirmDialog(true);
  };

  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'active':
        return 'text-success';
      case 'paused':
        return 'text-warning';
      case 'stopped':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (sessionStatus) {
      case 'active':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'stopped':
        return 'Square';
      default:
        return 'Circle';
    }
  };

  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-3 max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-error/10 rounded-full">
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Confirm {confirmAction?.action}
            </h3>
            <p className="text-sm text-text-secondary">
              This action cannot be undone
            </p>
          </div>
        </div>
        
        <p className="text-sm text-text-secondary mb-6">
          {confirmAction?.action === 'Emergency Stop' 
            ? `Are you sure you want to immediately terminate the interview session for ${candidateName}? This will stop all recording and monitoring.`
            : `Are you sure you want to ${confirmAction?.action?.toLowerCase()} this session?`
          }
        </p>
        
        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => setShowConfirmDialog(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={isProcessing}
            onClick={() => handleEmergencyAction(confirmAction?.action, confirmAction?.callback)}
          >
            {confirmAction?.action}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="bg-background border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-surface border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${sessionStatus === 'active' ? 'bg-success/10' : 
                sessionStatus === 'paused' ? 'bg-warning/10' : 'bg-error/10'}
            `}>
              <Icon name={getStatusIcon()} size={16} className={getStatusColor()} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Session Controls</h3>
              <p className="text-sm text-text-secondary">
                {candidateName} • {sessionId}
              </p>
            </div>
          </div>
          
          <div className={`
            px-3 py-1.5 rounded-full text-xs font-medium
            ${sessionStatus === 'active' ? 'bg-success/10 text-success' :
              sessionStatus === 'paused'? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}
          `}>
            {sessionStatus?.toUpperCase()}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {sessionStatus === 'active' ? (
              <Button
                variant="warning"
                size="lg"
                iconName="Pause"
                iconPosition="left"
                onClick={onPauseSession}
                fullWidth
              >
                Pause Session
              </Button>
            ) : sessionStatus === 'paused' ? (
              <Button
                variant="success"
                size="lg"
                iconName="Play"
                iconPosition="left"
                onClick={onResumeSession}
                fullWidth
              >
                Resume Session
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                iconName="RotateCcw"
                iconPosition="left"
                disabled
                fullWidth
              >
                Session Ended
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="lg"
              iconName="Square"
              iconPosition="left"
              onClick={() => showConfirmation('Emergency Stop', onEmergencyStop)}
              disabled={sessionStatus === 'stopped'}
              fullWidth
            >
              Emergency Stop
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-border pt-4">
            <h4 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Flag"
                iconPosition="left"
                onClick={onFlagIncident}
                disabled={sessionStatus === 'stopped'}
              >
                Flag Incident
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Camera"
                iconPosition="left"
                onClick={onTakeScreenshot}
                disabled={sessionStatus === 'stopped'}
              >
                Screenshot
              </Button>
            </div>
          </div>

          {/* Emergency Information */}
          <div className="bg-error/5 border border-error/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={16} className="text-error mt-0.5" />
              <div className="text-xs text-text-secondary">
                <p className="font-medium text-error mb-1">Emergency Protocols</p>
                <ul className="space-y-1">
                  <li>• Emergency stop immediately terminates the session</li>
                  <li>• All recordings and data are automatically saved</li>
                  <li>• Incident reports are generated for flagged events</li>
                  <li>• Screenshots capture current video frame</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showConfirmDialog && <ConfirmDialog />}
    </>
  );
};

export default EmergencyControls;