import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActionsPanel = ({ 
  sessionStatus, 
  onGenerateReport, 
  onExportData, 
  onTakeScreenshot, 
  onFlagIncident,
  candidateName 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportFormat(format);
    try {
      await onExportData(format);
    } finally {
      setIsExporting(false);
    }
  };

  const quickActions = [
    {
      id: 'screenshot',
      label: 'Screenshot',
      icon: 'Camera',
      variant: 'outline',
      onClick: onTakeScreenshot,
      disabled: sessionStatus === 'idle',
      tooltip: 'Capture current video frame'
    },
    {
      id: 'flag',
      label: 'Flag Incident',
      icon: 'Flag',
      variant: 'warning',
      onClick: onFlagIncident,
      disabled: sessionStatus === 'idle',
      tooltip: 'Mark suspicious behavior'
    },
    {
      id: 'report',
      label: 'Generate Report',
      icon: 'FileText',
      variant: 'default',
      onClick: onGenerateReport,
      disabled: !candidateName?.trim(),
      tooltip: 'Create session report'
    }
  ];

  const exportActions = [
    {
      format: 'pdf',
      label: 'Export PDF',
      icon: 'FileText',
      description: 'Comprehensive report'
    },
    {
      format: 'csv',
      label: 'Export CSV',
      icon: 'FileSpreadsheet',
      description: 'Event data only'
    },
    {
      format: 'json',
      label: 'Export JSON',
      icon: 'Code',
      description: 'Raw session data'
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-subtle">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-lg">
            <Icon name="Zap" size={18} color="white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Quick Actions</h3>
            <p className="text-xs text-text-secondary">Session management tools</p>
          </div>
        </div>
      </div>
      {/* Quick Action Buttons */}
      <div className="p-4 space-y-3">
        {quickActions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="sm"
            iconName={action?.icon}
            iconPosition="left"
            onClick={action?.onClick}
            disabled={action?.disabled}
            fullWidth
            className="justify-start"
            title={action?.tooltip}
          >
            {action?.label}
          </Button>
        ))}
      </div>
      {/* Export Section */}
      <div className="p-4 border-t border-border bg-muted/10 space-y-3">
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          Export Options
        </h4>
        
        {exportActions?.map((action) => (
          <button
            key={action?.format}
            onClick={() => handleExport(action?.format)}
            disabled={isExporting || !candidateName?.trim()}
            className={`
              w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200
              ${isExporting && exportFormat === action?.format 
                ? 'bg-primary/10 border-primary/20' :'bg-surface border-border hover:bg-muted/50'}
              ${!candidateName?.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center space-x-3">
              <Icon 
                name={action?.icon} 
                size={16} 
                className={
                  isExporting && exportFormat === action?.format 
                    ? 'text-primary' :'text-text-secondary'
                } 
              />
              <div className="text-left">
                <p className="text-sm font-medium text-text-primary">{action?.label}</p>
                <p className="text-xs text-text-secondary">{action?.description}</p>
              </div>
            </div>
            
            {isExporting && exportFormat === action?.format && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-primary">Exporting...</span>
              </div>
            )}
          </button>
        ))}
      </div>
      {/* Session Info */}
      <div className="p-4 border-t border-border bg-muted/5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Session ID:</span>
            <span className="font-mono text-text-primary">
              {sessionStatus !== 'idle' ? 'INT-' + Date.now()?.toString()?.slice(-6) : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Started:</span>
            <span className="text-text-primary">
              {sessionStatus !== 'idle' ? new Date()?.toLocaleTimeString() : 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">Candidate:</span>
            <span className="text-text-primary truncate max-w-24">
              {candidateName?.trim() || 'Not specified'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;