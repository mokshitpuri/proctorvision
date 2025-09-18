import React from 'react';
import Icon from '../../../components/AppIcon';

const DetectionStatusPanel = ({ 
  detectionStates, 
  aiModelStatus, 
  cameraStatus, 
  microphoneStatus 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case'connected':
        return 'text-success';
      case 'warning': case'detecting':
        return 'text-warning';
      case 'error': case'disconnected':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'active': case'connected':
        return 'bg-success/10 border-success/20';
      case 'warning': case'detecting':
        return 'bg-warning/10 border-warning/20';
      case 'error': case'disconnected':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-muted border-border';
    }
  };

  const detectionItems = [
    {
      id: 'face_detection',
      label: 'Face Detection',
      icon: 'User',
      status: detectionStates?.faceDetection,
      description: 'Monitoring face presence and count'
    },
    {
      id: 'focus_tracking',
      label: 'Focus Tracking',
      icon: 'Eye',
      status: detectionStates?.focusTracking,
      description: 'Tracking eye gaze and attention'
    },
    {
      id: 'object_detection',
      label: 'Object Detection',
      icon: 'Search',
      status: detectionStates?.objectDetection,
      description: 'Scanning for unauthorized items'
    },
    {
      id: 'audio_monitoring',
      label: 'Audio Monitoring',
      icon: 'Mic',
      status: detectionStates?.audioMonitoring,
      description: 'Analyzing audio patterns'
    }
  ];

  const systemStatus = [
    {
      id: 'ai_model',
      label: 'AI Model',
      icon: 'Brain',
      status: aiModelStatus,
      description: 'TensorFlow.js COCO-SSD'
    },
    {
      id: 'camera',
      label: 'Camera',
      icon: 'Video',
      status: cameraStatus,
      description: 'Video input device'
    },
    {
      id: 'microphone',
      label: 'Microphone',
      icon: 'Mic',
      status: microphoneStatus,
      description: 'Audio input device'
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Shield" size={18} color="white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Detection Status</h3>
            <p className="text-xs text-text-secondary">AI monitoring systems</p>
          </div>
        </div>
      </div>
      {/* Detection Systems */}
      <div className="p-4 space-y-3">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Detection Systems
        </h4>
        
        {detectionItems?.map((item) => (
          <div
            key={item?.id}
            className={`
              flex items-center justify-between p-3 rounded-lg border transition-all duration-200
              ${getStatusBgColor(item?.status)}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-lg
                ${item?.status === 'active' ? 'bg-success/20' :
                  item?.status === 'detecting' ? 'bg-warning/20' :
                  item?.status === 'error' ? 'bg-error/20' : 'bg-muted'}
              `}>
                <Icon name={item?.icon} size={16} className={getStatusColor(item?.status)} />
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-primary">{item?.label}</p>
                <p className="text-xs text-text-secondary">{item?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`
                w-2 h-2 rounded-full
                ${item?.status === 'active' ? 'bg-success' :
                  item?.status === 'detecting' ? 'bg-warning animate-pulse' :
                  item?.status === 'error' ? 'bg-error' : 'bg-text-secondary'}
              `} />
              <span className={`text-xs font-medium capitalize ${getStatusColor(item?.status)}`}>
                {item?.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* System Status */}
      <div className="p-4 border-t border-border bg-muted/10 space-y-3">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          System Status
        </h4>
        
        {systemStatus?.map((item) => (
          <div
            key={item?.id}
            className="flex items-center justify-between p-2 rounded-md"
          >
            <div className="flex items-center space-x-3">
              <Icon name={item?.icon} size={14} className={getStatusColor(item?.status)} />
              <div>
                <p className="text-xs font-medium text-text-primary">{item?.label}</p>
                <p className="text-xs text-text-secondary">{item?.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className={`
                w-1.5 h-1.5 rounded-full
                ${item?.status === 'connected' || item?.status === 'active' ? 'bg-success' :
                  item?.status === 'warning' ? 'bg-warning' : 'bg-error'}
              `} />
              <span className={`text-xs font-medium capitalize ${getStatusColor(item?.status)}`}>
                {item?.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      {/* Performance Metrics */}
      <div className="p-4 border-t border-border bg-muted/5">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">98.5%</div>
            <div className="text-xs text-text-secondary">Detection Accuracy</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">24ms</div>
            <div className="text-xs text-text-secondary">Processing Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionStatusPanel;