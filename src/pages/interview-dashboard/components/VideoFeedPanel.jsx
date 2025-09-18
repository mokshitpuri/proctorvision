import React, { useRef, useEffect, useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VideoFeedPanel = ({ 
  candidateName, 
  onCandidateNameChange, 
  sessionStatus, 
  onStartSession, 
  onStopSession, 
  onPauseSession, 
  onResumeSession,
  sessionDuration 
}) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream?.getTracks()?.forEach(track => track?.stop());
      }
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  // Enhanced camera initialization with error handling
  const initializeCamera = async () => {
    try {
      const constraints = {
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          facingMode: 'user'
        },
        audio: true
      };
      
      const mediaStream = await navigator.mediaDevices?.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef?.current) {
        videoRef.current.srcObject = mediaStream;
        // Auto-retry on video load failure
        videoRef.current.onerror = () => {
          console.error('Video element error, retrying...');
          setTimeout(initializeCamera, 2000);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to lower quality if high quality fails
      if (error?.name === 'OverconstrainedError') {
        try {
          const fallbackStream = await navigator.mediaDevices?.getUserMedia({
            video: { width: 640, height: 480 },
            audio: true
          });
          setStream(fallbackStream);
          if (videoRef?.current) {
            videoRef.current.srcObject = fallbackStream;
          }
        } catch (fallbackError) {
          console.error('Fallback camera initialization failed:', fallbackError);
        }
      }
    }
  };

  // Enhanced recording with error handling
  const startRecording = () => {
    if (stream && !isRecording) {
      try {
        const options = {
          mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : 'video/mp4'
        };
        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event?.data?.size > 0) {
            setRecordedChunks(prev => [...prev, event?.data]);
          }
        };
        
        mediaRecorder.onerror = (error) => {
          console.error('MediaRecorder error:', error);
          setIsRecording(false);
        };
        
        mediaRecorder?.start(1000); // Collect data every second
        setIsRecording(true);
        onStartSession();
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef?.current && isRecording) {
      mediaRecorderRef?.current?.stop();
      setIsRecording(false);
      onStopSession();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Enhanced Header with Mobile Optimization */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex-shrink-0">
            <Icon name="Video" size={16} className="sm:w-[18px] sm:h-[18px]" color="white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs sm:text-sm font-semibold text-text-primary truncate">Candidate Video Feed</h3>
            <p className="text-xs text-text-secondary">Live monitoring active</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <div className={`
            flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium
            ${sessionStatus === 'recording' ? 'bg-error/10 text-error' :
              sessionStatus === 'active' ? 'bg-success/10 text-success' :
              sessionStatus === 'paused'? 'bg-warning/10 text-warning' : 'bg-muted text-text-secondary'}
          `}>
            <div className={`
              w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full
              ${sessionStatus === 'recording' ? 'bg-error animate-pulse' :
                sessionStatus === 'active' ? 'bg-success' :
                sessionStatus === 'paused'? 'bg-warning' : 'bg-text-secondary'}
            `} />
            <span className="hidden xs:inline">
              {sessionStatus === 'recording' ? 'Recording' :
               sessionStatus === 'active' ? 'Active' :
               sessionStatus === 'paused' ? 'Paused' : 'Ready'}
            </span>
          </div>
          
          {sessionDuration > 0 && (
            <div className="text-xs font-mono text-text-secondary bg-muted px-1.5 sm:px-2 py-1 rounded">
              {formatDuration(sessionDuration)}
            </div>
          )}
        </div>
      </div>
      {/* Enhanced Video Display */}
      <div className="relative aspect-video bg-slate-900">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Enhanced Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        
        {/* Recording Indicator - Mobile Optimized */}
        {isRecording && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center space-x-1 sm:space-x-2 bg-error/90 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse" />
            <span className="text-xs font-medium">REC</span>
          </div>
        )}
        
        {/* AI Detection Status - Mobile Responsive */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col space-y-1 sm:space-y-2">
          <div className="flex items-center space-x-1 sm:space-x-2 bg-success/90 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <Icon name="Eye" size={10} className="sm:w-3 sm:h-3" color="white" />
            <span className="text-xs font-medium hidden sm:inline">AI Monitoring</span>
            <span className="text-xs font-medium sm:hidden">AI</span>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 bg-primary/90 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <Icon name="Brain" size={10} className="sm:w-3 sm:h-3" color="white" />
            <span className="text-xs font-medium hidden sm:inline">TensorFlow.js</span>
            <span className="text-xs font-medium sm:hidden">TF</span>
          </div>
        </div>

        {/* Touch Gestures for Mobile */}
        <div className="absolute inset-0 md:hidden" 
             onTouchStart={(e) => {
               // Enable touch-to-focus functionality on mobile
               if (videoRef?.current) {
                 videoRef?.current?.focus();
               }
             }}>
        </div>
      </div>
      {/* Enhanced Candidate Information */}
      <div className="p-3 sm:p-4 border-b border-border bg-muted/20">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Icon name="User" size={14} className="sm:w-4 sm:h-4 text-text-secondary flex-shrink-0" />
          <input
            type="text"
            placeholder="Enter candidate name..."
            value={candidateName}
            onChange={(e) => onCandidateNameChange(e?.target?.value)}
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-surface border border-border rounded-md text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      {/* Enhanced Control Panel - Mobile Responsive */}
      <div className="p-3 sm:p-4 bg-muted/10">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-center">
          {sessionStatus === 'idle' ? (
            <Button
              variant="default"
              size="lg"
              iconName="Play"
              iconPosition="left"
              onClick={startRecording}
              disabled={!candidateName?.trim()}
              className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base"
            >
              <span className="hidden xs:inline">Start Interview Session</span>
              <span className="xs:hidden">Start Session</span>
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              {sessionStatus === 'paused' ? (
                <Button
                  variant="success"
                  size="default"
                  iconName="Play"
                  iconPosition="left"
                  onClick={onResumeSession}
                  className="w-full sm:w-auto"
                >
                  Resume
                </Button>
              ) : (
                <Button
                  variant="warning"
                  size="default"
                  iconName="Pause"
                  iconPosition="left"
                  onClick={onPauseSession}
                  className="w-full sm:w-auto"
                >
                  Pause
                </Button>
              )}
              
              <Button
                variant="destructive"
                size="default"
                iconName="Square"
                iconPosition="left"
                onClick={stopRecording}
                className="w-full sm:w-auto"
              >
                <span className="hidden xs:inline">Stop Session</span>
                <span className="xs:hidden">Stop</span>
              </Button>
            </div>
          )}
        </div>
        
        {!candidateName?.trim() && sessionStatus === 'idle' && (
          <p className="text-xs text-text-secondary text-center mt-2">
            Please enter candidate name to start session
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoFeedPanel;