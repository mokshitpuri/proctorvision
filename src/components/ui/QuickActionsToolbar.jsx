import React, { useState } from 'react';
import Button from './Button';
import Icon from '../AppIcon';

const QuickActionsToolbar = ({ 
  context = 'dashboard', // 'dashboard', 'monitoring', 'reports', 'candidates'
  sessionData = null,
  onExport = () => {},
  onDownload = () => {},
  onStartSession = () => {},
  onStopSession = () => {},
  onPauseSession = () => {},
  onResumeSession = () => {},
  onGenerateReport = () => {},
  onBulkAction = () => {},
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const getDashboardActions = () => (
    <>
      <Button
        variant="default"
        size="sm"
        iconName="Play"
        iconPosition="left"
        onClick={onStartSession}
        className="shadow-subtle"
      >
        Start Session
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        iconName="Calendar"
        iconPosition="left"
        onClick={() => {}}
      >
        Schedule
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        iconName="Settings"
        onClick={() => {}}
      />
    </>
  );

  const getMonitoringActions = () => (
    <>
      {sessionData?.status === 'active' ? (
        <Button
          variant="destructive"
          size="sm"
          iconName="Square"
          iconPosition="left"
          onClick={onStopSession}
        >
          Stop Session
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          iconName="Play"
          iconPosition="left"
          onClick={onResumeSession}
        >
          Resume
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        iconName="Pause"
        iconPosition="left"
        onClick={onPauseSession}
        disabled={sessionData?.status !== 'active'}
      >
        Pause
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        iconName="Camera"
        onClick={() => {}}
        title="Take Screenshot"
      />
      
      <Button
        variant="ghost"
        size="sm"
        iconName="Flag"
        onClick={() => {}}
        title="Flag Incident"
      />
    </>
  );

  const getReportsActions = () => (
    <>
      <div className="flex items-center space-x-1">
        <Button
          variant="default"
          size="sm"
          iconName="Download"
          iconPosition="left"
          loading={isExporting && exportFormat === 'pdf'}
          onClick={() => handleExport('pdf')}
        >
          Export PDF
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="FileSpreadsheet"
          iconPosition="left"
          loading={isExporting && exportFormat === 'csv'}
          onClick={() => handleExport('csv')}
        >
          Export CSV
        </Button>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        iconName="RefreshCw"
        onClick={onGenerateReport}
        title="Regenerate Report"
      />
      
      <Button
        variant="ghost"
        size="sm"
        iconName="Share"
        onClick={() => {}}
        title="Share Report"
      />
    </>
  );

  const getCandidatesActions = () => (
    <>
      <Button
        variant="default"
        size="sm"
        iconName="UserPlus"
        iconPosition="left"
        onClick={() => {}}
      >
        Add Candidate
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        iconName="Upload"
        iconPosition="left"
        onClick={() => {}}
      >
        Import CSV
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        iconName="Filter"
        onClick={() => {}}
        title="Filter Candidates"
      />
      
      <Button
        variant="ghost"
        size="sm"
        iconName="MoreVertical"
        onClick={() => {}}
        title="Bulk Actions"
      />
    </>
  );

  const getContextActions = () => {
    switch (context) {
      case 'monitoring':
        return getMonitoringActions();
      case 'reports':
        return getReportsActions();
      case 'candidates':
        return getCandidatesActions();
      default:
        return getDashboardActions();
    }
  };

  return (
    <div className={`
      flex items-center justify-between p-4 bg-surface border border-border rounded-lg shadow-subtle
      ${className}
    `}>
      <div className="flex items-center space-x-2">
        {getContextActions()}
      </div>
      {/* Context-specific info */}
      <div className="flex items-center space-x-3 text-sm text-text-secondary">
        {context === 'monitoring' && sessionData && (
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={14} />
            <span>{sessionData?.participantCount || 0} participants</span>
          </div>
        )}
        
        {context === 'reports' && (
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={14} />
            <span>Last updated: {new Date()?.toLocaleDateString()}</span>
          </div>
        )}
        
        {context === 'candidates' && (
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={14} />
            <span>Total candidates: 247</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActionsToolbar;