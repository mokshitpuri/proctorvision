import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const BulkActionsPanel = ({ 
  selectedCount = 0, 
  onBulkAction = () => {},
  onClearSelection = () => {},
  isVisible = false 
}) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select an action...' },
    { value: 'schedule-interview', label: 'Schedule Interview' },
    { value: 'send-email', label: 'Send Email Notification' },
    { value: 'export-data', label: 'Export Selected Data' },
    { value: 'add-notes', label: 'Add Bulk Notes' },
    { value: 'change-status', label: 'Change Status' },
    { value: 'generate-reports', label: 'Generate Reports' },
    { value: 'delete', label: 'Delete Candidates' }
  ];

  const handleExecuteAction = async () => {
    if (!selectedAction) return;
    
    setIsProcessing(true);
    try {
      await onBulkAction(selectedAction);
      setSelectedAction('');
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action) => {
    const iconMap = {
      'schedule-interview': 'Calendar',
      'send-email': 'Mail',
      'export-data': 'Download',
      'add-notes': 'FileText',
      'change-status': 'Edit',
      'generate-reports': 'BarChart3',
      'delete': 'Trash2'
    };
    return iconMap?.[action] || 'Settings';
  };

  const getActionVariant = (action) => {
    return action === 'delete' ? 'destructive' : 'default';
  };

  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-4 min-w-96">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="CheckSquare" size={16} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-text-primary">
                {selectedCount} candidate{selectedCount !== 1 ? 's' : ''} selected
              </h3>
              <p className="text-xs text-text-secondary">Choose an action to apply</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Select
              options={bulkActionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Select an action..."
              className="w-full"
            />
          </div>
          
          <Button
            variant={getActionVariant(selectedAction)}
            size="sm"
            iconName={getActionIcon(selectedAction)}
            iconPosition="left"
            loading={isProcessing}
            disabled={!selectedAction || isProcessing}
            onClick={handleExecuteAction}
          >
            Execute
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            iconName="Calendar"
            onClick={() => {
              setSelectedAction('schedule-interview');
              handleExecuteAction();
            }}
            disabled={isProcessing}
          >
            Schedule
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Mail"
            onClick={() => {
              setSelectedAction('send-email');
              handleExecuteAction();
            }}
            disabled={isProcessing}
          >
            Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={() => {
              setSelectedAction('export-data');
              handleExecuteAction();
            }}
            disabled={isProcessing}
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsPanel;