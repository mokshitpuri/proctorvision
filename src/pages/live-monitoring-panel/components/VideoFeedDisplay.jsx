import React, { useRef, useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';

const VideoFeedDisplay = ({ 
  isSessionActive = false,
  candidateName = "John Doe",
  detectionZones = {
    face: { active: true, confidence: 0.95 },
    focus: { active: true, confidence: 0.87 },
    objects: { active: false, confidence: 0.0 }
  },
  onVideoError = () => {}
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoStatus, setVideoStatus] = useState('loading');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (isSessionActive) {
      initializeVideoStream();
    } else {
      stopVideoStream();
    }

    return () => stopVideoStream();
  }, [isSessionActive]);

  // Enhanced initialization with better error handling
  const initializeVideoStream = async () => {
    try {
      const constraints = {
        video: { 
          width: { ideal: 1280, min: 640, max: 1920 },
          height: { ideal: 720, min: 480, max: 1080 },
          facingMode: 'user',
          frameRate: { ideal: 30, min: 15 }
        },
        audio: false 
      };
      
      const stream = await navigator.mediaDevices?.getUserMedia(constraints);
      
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        setVideoStatus('active');
        
        // Handle video element errors
        videoRef.current.onerror = (error) => {
          console.error('Video element error:', error);
          setVideoStatus('error');
          onVideoError(error);
        };
        
        // Handle stream ending
        stream?.getTracks()?.forEach(track => {
          track.onended = () => {
            console.log('Video track ended');
            setVideoStatus('stopped');
          };
        });
      }
    } catch (error) {
      console.error('Video stream error:', error);
      setVideoStatus('error');
      
      // Provide specific error feedback
      let errorMessage = 'Unable to access camera';
      if (error?.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions.';
      } else if (error?.name === 'NotFoundError') {
        errorMessage = 'No camera device found';
      } else if (error?.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application';
      }
      
      onVideoError({ ...error, userMessage: errorMessage });
    }
  };

  const stopVideoStream = () => {
    if (videoRef?.current?.srcObject) {
      const tracks = videoRef?.current?.srcObject?.getTracks();
      tracks?.forEach(track => track?.stop());
      videoRef.current.srcObject = null;
    }
    setVideoStatus('stopped');
  };

  const handleVideoLoad = () => {
    if (videoRef?.current) {
      setDimensions({
        width: videoRef?.current?.videoWidth,
        height: videoRef?.current?.videoHeight
      });
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-success';
    if (confidence >= 0.6) return 'text-warning';
    return 'text-error';
  };

  const renderDetectionOverlay = () => (
    <div className="absolute inset-0 pointer-events-none">
      {/* Face Detection Zone */}
      {detectionZones?.face?.active && (
        <div className="absolute top-4 left-4 right-4 h-32 border-2 border-success rounded-lg bg-success/10">
          <div className="absolute -top-6 left-0 flex items-center space-x-2">
            <Icon name="User" size={16} className="text-success" />
            <span className={`text-xs font-medium ${getConfidenceColor(detectionZones?.face?.confidence)}`}>
              Face: {Math.round(detectionZones?.face?.confidence * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Focus Detection Indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-background/90 px-3 py-2 rounded-lg">
        <div className={`w-2 h-2 rounded-full ${
          detectionZones?.focus?.active ? 'bg-success animate-pulse-subtle' : 'bg-error'
        }`} />
        <span className={`text-xs font-medium ${getConfidenceColor(detectionZones?.focus?.confidence)}`}>
          Focus: {Math.round(detectionZones?.focus?.confidence * 100)}%
        </span>
      </div>

      {/* Object Detection Alerts */}
      {detectionZones?.objects?.active && (
        <div className="absolute bottom-4 left-4 right-4 bg-error/90 text-error-foreground px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} />
            <span className="text-sm font-medium">Unauthorized object detected</span>
            <span className="text-xs opacity-80">
              Confidence: {Math.round(detectionZones?.objects?.confidence * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderVideoPlaceholder = () => (
    <div className="flex flex-col items-center justify-center h-full bg-muted text-text-secondary">
      {videoStatus === 'loading' && (
        <>
          <Icon name="Camera" size={48} className="mb-4 animate-pulse" />
          <p className="text-lg font-medium mb-2">Initializing Camera</p>
          <p className="text-sm">Please allow camera access</p>
        </>
      )}
      
      {videoStatus === 'error' && (
        <>
          <Icon name="CameraOff" size={48} className="mb-4 text-error" />
          <p className="text-lg font-medium mb-2 text-error">Camera Error</p>
          <p className="text-sm">Unable to access camera feed</p>
        </>
      )}
      
      {videoStatus === 'stopped' && (
        <>
          <Icon name="Square" size={48} className="mb-4" />
          <p className="text-lg font-medium mb-2">Session Stopped</p>
          <p className="text-sm">Video monitoring inactive</p>
        </>
      )}
    </div>
  );

  return (
    <div className="relative bg-background border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-surface border-b border-border">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
            isSessionActive ? 'bg-error animate-pulse-subtle' : 'bg-text-secondary'
          }`} />
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-text-primary text-sm sm:text-base truncate">Candidate Video Feed</h3>
            <p className="text-xs sm:text-sm text-text-secondary truncate">{candidateName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="text-xs text-text-secondary hidden sm:block">
            {dimensions?.width > 0 && `${dimensions?.width}×${dimensions?.height}`}
          </div>
          <Icon 
            name={isSessionActive ? "Eye" : "EyeOff"} 
            size={16} 
            className={isSessionActive ? "text-success" : "text-text-secondary"} 
          />
        </div>
      </div>
      {/* Enhanced Video Container */}
      <div className="relative aspect-video bg-background">
        {videoStatus === 'active' ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              onLoadedMetadata={handleVideoLoad}
              className="w-full h-full object-cover"
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              style={{ display: 'none' }}
            />
            {renderDetectionOverlay()}
            
            {/* Mobile Touch Interaction */}
            <div className="absolute inset-0 md:hidden"
                 onTouchStart={(e) => {
                   // Enable focus on touch for mobile accessibility
                   if (videoRef?.current) {
                     videoRef?.current?.focus();
                   }
                 }}>
            </div>
          </>
        ) : (
          renderVideoPlaceholder()
        )}
      </div>
      {/* Enhanced Detection Status Bar - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted border-t border-border space-y-2 sm:space-y-0">
        <div className="flex items-center justify-between sm:justify-start space-x-2 sm:space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <Icon name="User" size={12} />
            <span className={`${detectionZones?.face?.active ? 'text-success' : 'text-error'} truncate`}>
              <span className="hidden xs:inline">Face Detection</span>
              <span className="xs:hidden">Face</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Eye" size={12} />
            <span className={`${detectionZones?.focus?.active ? 'text-success' : 'text-warning'} truncate`}>
              <span className="hidden xs:inline">Focus Tracking</span>
              <span className="xs:hidden">Focus</span>
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Scan" size={12} />
            <span className={`${detectionZones?.objects?.active ? 'text-error' : 'text-success'} truncate`}>
              <span className="hidden xs:inline">Object Detection</span>
              <span className="xs:hidden">Objects</span>
            </span>
          </div>
        </div>
        
        <div className="text-xs text-text-secondary self-end sm:self-auto">
          <span className="hidden sm:inline">AI Models: Active</span>
          <span className="sm:hidden">AI: Active</span>
        </div>
      </div>
      {/* Mobile-Specific Controls */}
      <div className="block sm:hidden p-3 bg-muted/10 border-t border-border">
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => {
              if (videoRef?.current) {
                const canvas = document.createElement('canvas');
                const ctx = canvas?.getContext('2d');
                canvas.width = videoRef?.current?.videoWidth;
                canvas.height = videoRef?.current?.videoHeight;
                ctx?.drawImage(videoRef?.current, 0, 0);
                
                canvas?.toBlob((blob) => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `monitoring-snapshot-${Date.now()}.png`;
                  a?.click();
                  URL.revokeObjectURL(url);
                });
              }
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-surface border border-border rounded-md text-xs text-text-primary"
            disabled={videoStatus !== 'active'}
          >
            <Icon name="Camera" size={14} />
            <span>Snapshot</span>
          </button>
          
          <button
            onClick={() => {
              if (videoRef?.current) {
                if (videoRef?.current?.requestFullscreen) {
                  videoRef?.current?.requestFullscreen();
                }
              }
            }}
            className="flex items-center space-x-1 px-3 py-2 bg-surface border border-border rounded-md text-xs text-text-primary"
            disabled={videoStatus !== 'active'}
          >
            <Icon name="Maximize" size={14} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoFeedDisplay;