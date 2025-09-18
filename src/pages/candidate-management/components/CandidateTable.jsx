import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CandidateTable = ({ 
  candidates = [], 
  selectedCandidates = [], 
  onSelectionChange = () => {},
  onCandidateClick = () => {},
  onStartSession = () => {},
  onViewReport = () => {},
  sortConfig = { key: null, direction: 'asc' },
  onSort = () => {}
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (candidateId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(candidateId)) {
      newExpanded?.delete(candidateId);
    } else {
      newExpanded?.add(candidateId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(candidates?.map(c => c?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectCandidate = (candidateId, checked) => {
    if (checked) {
      onSelectionChange([...selectedCandidates, candidateId]);
    } else {
      onSelectionChange(selectedCandidates?.filter(id => id !== candidateId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { color: 'text-success', bg: 'bg-success/10', label: 'Completed' },
      'in-progress': { color: 'text-warning', bg: 'bg-warning/10', label: 'In Progress' },
      'scheduled': { color: 'text-primary', bg: 'bg-primary/10', label: 'Scheduled' },
      'cancelled': { color: 'text-error', bg: 'bg-error/10', label: 'Cancelled' },
      'no-show': { color: 'text-text-secondary', bg: 'bg-muted', label: 'No Show' }
    };

    const config = statusConfig?.[status] || statusConfig?.['completed'];
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color} ${config?.bg}`}>
        {config?.label}
      </span>
    );
  };

  const getIntegrityScoreColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-error';
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-secondary" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const allSelected = candidates?.length > 0 && selectedCandidates?.length === candidates?.length;
  const someSelected = selectedCandidates?.length > 0 && selectedCandidates?.length < candidates?.length;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-primary min-w-[200px]">
                <button
                  onClick={() => onSort('name')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Candidate Name</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-primary min-w-[120px]">
                <button
                  onClick={() => onSort('lastInterview')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Last Interview</span>
                  {getSortIcon('lastInterview')}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-primary min-w-[80px]">
                <button
                  onClick={() => onSort('totalSessions')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Sessions</span>
                  {getSortIcon('totalSessions')}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-primary min-w-[90px]">
                <button
                  onClick={() => onSort('avgIntegrityScore')}
                  className="flex items-center space-x-2 hover:text-primary transition-colors"
                >
                  <span>Avg Score</span>
                  {getSortIcon('avgIntegrityScore')}
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-text-primary min-w-[100px]">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-text-primary min-w-[150px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {candidates?.map((candidate) => (
              <React.Fragment key={candidate?.id}>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedCandidates?.includes(candidate?.id)}
                      onChange={(e) => handleSelectCandidate(candidate?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-primary">
                          {candidate?.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-text-primary truncate">{candidate?.name}</div>
                        <div className="text-sm text-text-secondary truncate">{candidate?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    {candidate?.lastInterview ? new Date(candidate.lastInterview)?.toLocaleDateString('en-US') : 'Never'}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary">{candidate?.totalSessions}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${getIntegrityScoreColor(candidate?.avgIntegrityScore)}`}>
                      {candidate?.avgIntegrityScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(candidate?.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName={expandedRows?.has(candidate?.id) ? "ChevronUp" : "ChevronDown"}
                        onClick={() => toggleRowExpansion(candidate?.id)}
                        className="p-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Play"
                        onClick={() => onStartSession(candidate)}
                        className="p-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="FileText"
                        onClick={() => onViewReport(candidate)}
                        className="p-1"
                      />
                    </div>
                  </td>
                </tr>
                {expandedRows?.has(candidate?.id) && (
                  <tr>
                    <td colSpan="7" className="px-4 py-4 bg-muted/30">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-text-primary mb-2">Recent Sessions</h4>
                          <div className="space-y-2 max-h-24 overflow-y-auto">
                            {candidate?.recentSessions?.slice(0, 3)?.map((session, index) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span className="text-text-secondary">
                                  {new Date(session.date)?.toLocaleDateString('en-US')}
                                </span>
                                <span className={getIntegrityScoreColor(session?.score)}>
                                  {session?.score}%
                                </span>
                              </div>
                            ))}
                            {candidate?.recentSessions?.length === 0 && (
                              <div className="text-xs text-text-secondary">No sessions yet</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-text-primary mb-2">Common Violations</h4>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {candidate?.commonViolations?.slice(0, 3)?.map((violation, index) => (
                              <div key={index} className="text-xs text-text-secondary">
                                • {violation}
                              </div>
                            ))}
                            {candidate?.commonViolations?.length === 0 && (
                              <div className="text-xs text-success">No violations recorded</div>
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-text-primary mb-2">Notes</h4>
                          <p className="text-xs text-text-secondary max-h-24 overflow-y-auto">
                            {candidate?.notes || 'No notes available'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Enhanced Mobile Cards */}
      <div className="lg:hidden space-y-3 p-3 sm:p-4">
        {candidates?.map((candidate) => (
          <div key={candidate?.id} className="border border-border rounded-lg p-3 sm:p-4 space-y-3 bg-background">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Checkbox
                  checked={selectedCandidates?.includes(candidate?.id)}
                  onChange={(e) => handleSelectCandidate(candidate?.id, e?.target?.checked)}
                  className="flex-shrink-0"
                />
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">
                    {candidate?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-text-primary text-sm sm:text-base truncate">{candidate?.name}</div>
                  <div className="text-xs sm:text-sm text-text-secondary truncate">{candidate?.email}</div>
                </div>
              </div>
              <div className="flex-shrink-0">
                {getStatusBadge(candidate?.status)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div>
                <span className="text-text-secondary text-xs sm:text-sm">Last Interview:</span>
                <div className="text-text-primary text-sm font-medium">
                  {candidate?.lastInterview ? new Date(candidate.lastInterview)?.toLocaleDateString('en-US') : 'Never'}
                </div>
              </div>
              <div>
                <span className="text-text-secondary text-xs sm:text-sm">Sessions:</span>
                <div className="text-text-primary text-sm font-medium">{candidate?.totalSessions}</div>
              </div>
              <div>
                <span className="text-text-secondary text-xs sm:text-sm">Position:</span>
                <div className="text-text-primary text-sm font-medium truncate">{candidate?.position}</div>
              </div>
              <div>
                <span className="text-text-secondary text-xs sm:text-sm">Avg Score:</span>
                <div className={`font-medium text-sm ${getIntegrityScoreColor(candidate?.avgIntegrityScore)}`}>
                  {candidate?.avgIntegrityScore}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                iconName={expandedRows?.has(candidate?.id) ? "ChevronUp" : "ChevronDown"}
                onClick={() => toggleRowExpansion(candidate?.id)}
                className="text-xs sm:text-sm"
              >
                <span className="hidden xs:inline">Details</span>
                <Icon name={expandedRows?.has(candidate?.id) ? "ChevronUp" : "ChevronDown"} size={16} className="xs:hidden" />
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Play"
                  onClick={() => onStartSession(candidate)}
                  className="px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Start</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="FileText"
                  onClick={() => onViewReport(candidate)}
                  className="px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Report</span>
                </Button>
              </div>
            </div>
            
            {expandedRows?.has(candidate?.id) && (
              <div className="pt-3 border-t border-border space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Recent Sessions</h4>
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {candidate?.recentSessions?.slice(0, 2)?.map((session, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span className="text-text-secondary">
                            {new Date(session.date)?.toLocaleDateString('en-US')}
                          </span>
                          <span className={getIntegrityScoreColor(session?.score)}>
                            {session?.score}%
                          </span>
                        </div>
                      ))}
                      {candidate?.recentSessions?.length === 0 && (
                        <div className="text-xs text-text-secondary">No sessions yet</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Notes</h4>
                    <p className="text-xs text-text-secondary max-h-20 overflow-y-auto">
                      {candidate?.notes || 'No notes available'}
                    </p>
                  </div>
                </div>
                {candidate?.commonViolations?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">Common Violations</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate?.commonViolations?.slice(0, 3)?.map((violation, index) => (
                        <span key={index} className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                          {violation}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateTable;