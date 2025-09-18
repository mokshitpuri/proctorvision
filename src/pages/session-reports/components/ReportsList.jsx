import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportsList = ({ reports, onSelectReport, onSelectMultiple, selectedReports = [] }) => {
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectAll, setSelectAll] = useState(false);

  const getIntegrityScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getIntegrityScoreBg = (score) => {
    if (score >= 90) return 'bg-success/10';
    if (score >= 70) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      onSelectMultiple(reports?.map(report => report?.id));
    } else {
      onSelectMultiple([]);
    }
  };

  const handleSelectReport = (reportId) => {
    const newSelected = selectedReports?.includes(reportId)
      ? selectedReports?.filter(id => id !== reportId)
      : [...selectedReports, reportId];
    
    onSelectMultiple(newSelected);
    setSelectAll(newSelected?.length === reports?.length);
  };

  const sortedReports = [...reports]?.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.generatedAt);
        bValue = new Date(b.generatedAt);
        break;
      case 'candidate':
        aValue = a?.candidateName?.toLowerCase();
        bValue = b?.candidateName?.toLowerCase();
        break;
      case 'score':
        aValue = a?.integrityScore;
        bValue = b?.integrityScore;
        break;
      case 'duration':
        aValue = a?.duration;
        bValue = b?.duration;
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ArrowUpDown';
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-surface border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Session Reports
          </h3>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>{reports?.length} reports</span>
            {selectedReports?.length > 0 && (
              <span className="text-primary">
                ({selectedReports?.length} selected)
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort('candidate')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                >
                  <span>Candidate</span>
                  <Icon name={getSortIcon('candidate')} size={14} />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                >
                  <span>Date</span>
                  <Icon name={getSortIcon('date')} size={14} />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort('duration')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                >
                  <span>Duration</span>
                  <Icon name={getSortIcon('duration')} size={14} />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort('score')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-primary hover:text-primary transition-colors duration-200"
                >
                  <span>Integrity Score</span>
                  <Icon name={getSortIcon('score')} size={14} />
                </button>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Violations</span>
              </th>
              <th className="p-4 text-left">
                <span className="text-sm font-medium text-text-primary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedReports?.map((report, index) => (
              <tr 
                key={report?.id}
                className={`
                  border-b border-border hover:bg-muted/50 transition-colors duration-200
                  ${index % 2 === 0 ? 'bg-background' : 'bg-surface'}
                `}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedReports?.includes(report?.id)}
                    onChange={() => handleSelectReport(report?.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-medium text-text-primary">
                      {report?.candidateName}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {report?.position}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-text-primary">
                    {formatDate(report?.generatedAt)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-text-primary">
                    {formatDuration(report?.duration)}
                  </div>
                </td>
                <td className="p-4">
                  <div className={`
                    inline-flex items-center px-2 py-1 rounded-md text-sm font-medium
                    ${getIntegrityScoreBg(report?.integrityScore)}
                  `}>
                    <span className={getIntegrityScoreColor(report?.integrityScore)}>
                      {report?.integrityScore}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-primary">
                      {report?.totalViolations}
                    </span>
                    {report?.totalViolations > 0 && (
                      <Icon name="AlertTriangle" size={14} className="text-warning" />
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onSelectReport(report)}
                      title="View Report"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Download"
                      onClick={() => {}}
                      title="Download Report"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {reports?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
          <h4 className="text-lg font-medium text-text-primary mb-2">
            No Reports Found
          </h4>
          <p className="text-text-secondary">
            No session reports match your current filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportsList;