import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ReportExportPanel = ({ selectedReports = [], onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeTimeline: true,
    includeStatistics: true,
    includeScreenshots: false,
    includeRawData: false
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Report', description: 'Comprehensive formatted report' },
    { value: 'csv', label: 'CSV Data', description: 'Raw data for analysis' },
    { value: 'json', label: 'JSON Export', description: 'Complete session data' },
    { value: 'excel', label: 'Excel Workbook', description: 'Structured data with charts' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        format: exportFormat,
        reports: selectedReports,
        options: exportOptions
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOptionChange = (option, value) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'pdf':
        return 'FileText';
      case 'csv':
        return 'FileSpreadsheet';
      case 'json':
        return 'Code';
      case 'excel':
        return 'FileSpreadsheet';
      default:
        return 'Download';
    }
  };

  const getExportSize = () => {
    const baseSize = selectedReports?.length * 0.5; // MB per report
    const multiplier = exportOptions?.includeScreenshots ? 2 : 1;
    return (baseSize * multiplier)?.toFixed(1);
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              Export Reports
            </h3>
            <p className="text-sm text-text-secondary">
              {selectedReports?.length} report{selectedReports?.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="HardDrive" size={16} />
            <span>~{getExportSize()} MB</span>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />
        </div>

        <div>
          <h4 className="text-sm font-medium text-text-primary mb-3">
            Export Options
          </h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions?.includeTimeline}
                onChange={(e) => handleOptionChange('includeTimeline', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">
                  Include Event Timeline
                </span>
                <p className="text-xs text-text-secondary">
                  Detailed chronological event log
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions?.includeStatistics}
                onChange={(e) => handleOptionChange('includeStatistics', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">
                  Include Statistics
                </span>
                <p className="text-xs text-text-secondary">
                  Behavioral analysis and metrics
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions?.includeScreenshots}
                onChange={(e) => handleOptionChange('includeScreenshots', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">
                  Include Screenshots
                </span>
                <p className="text-xs text-text-secondary">
                  Visual evidence of violations (increases file size)
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={exportOptions?.includeRawData}
                onChange={(e) => handleOptionChange('includeRawData', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <span className="text-sm font-medium text-text-primary">
                  Include Raw Data
                </span>
                <p className="text-xs text-text-secondary">
                  Complete session metadata and logs
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Export will be downloaded to your device
            </div>
            <Button
              variant="default"
              iconName={getFormatIcon(exportFormat)}
              iconPosition="left"
              loading={isExporting}
              disabled={selectedReports?.length === 0}
              onClick={handleExport}
            >
              {isExporting ? 'Exporting...' : `Export ${exportFormat?.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportExportPanel;