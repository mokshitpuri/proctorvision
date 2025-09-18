import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import ReportSummaryCard from './components/ReportSummaryCard';
import EventTimeline from './components/EventTimeline';
import StatisticsCards from './components/StatisticsCards';
import ReportFilters from './components/ReportFilters';
import ReportExportPanel from './components/ReportExportPanel';
import ReportsList from './components/ReportsList';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SessionReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReports, setSelectedReports] = useState([]);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'detail'
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Mock data for reports
  const mockReports = [
    {
      id: 'RPT-2024-001',
      sessionId: 'SES-20240916-001',
      candidateName: 'Sarah Mitchell',
      candidateId: 'CAND-001',
      position: 'Senior Frontend Developer',
      interviewer: 'Michael Chen',
      generatedAt: '2024-09-16T14:30:00Z',
      startTime: '2024-09-16T13:00:00Z',
      endTime: '2024-09-16T14:15:00Z',
      duration: 4500, // 75 minutes in seconds
      integrityScore: 87,
      focusLosses: 3,
      totalViolations: 2,
      suspiciousEvents: [
        {
          id: 'EVT-001',
          type: 'focus_loss',
          timestamp: '2024-09-16T13:15:30Z',
          description: 'Candidate looked away from screen for 8 seconds',
          severity: 'medium',
          confidence: 92,
          details: {
            duration: '8s',
            direction: 'left',
            recovery_time: '2s'
          }
        },
        {
          id: 'EVT-002',
          type: 'object_detected',
          timestamp: '2024-09-16T13:45:12Z',
          description: 'Mobile phone detected in video frame',
          severity: 'high',
          confidence: 88,
          details: {
            object_type: 'mobile_phone',
            position: 'bottom_right',
            duration: '12s'
          }
        }
      ]
    },
    {
      id: 'RPT-2024-002',
      sessionId: 'SES-20240916-002',
      candidateName: 'James Rodriguez',
      candidateId: 'CAND-002',
      position: 'Backend Engineer',
      interviewer: 'Emily Davis',
      generatedAt: '2024-09-16T11:45:00Z',
      startTime: '2024-09-16T10:00:00Z',
      endTime: '2024-09-16T11:30:00Z',
      duration: 5400, // 90 minutes
      integrityScore: 94,
      focusLosses: 1,
      totalViolations: 1,
      suspiciousEvents: [
        {
          id: 'EVT-003',
          type: 'focus_loss',
          timestamp: '2024-09-16T10:30:15Z',
          description: 'Brief focus loss detected',
          severity: 'low',
          confidence: 78,
          details: {
            duration: '6s',
            direction: 'up',
            recovery_time: '1s'
          }
        }
      ]
    },
    {
      id: 'RPT-2024-003',
      sessionId: 'SES-20240915-003',
      candidateName: 'Lisa Wang',
      candidateId: 'CAND-003',
      position: 'Full Stack Developer',
      interviewer: 'David Wilson',
      generatedAt: '2024-09-15T16:20:00Z',
      startTime: '2024-09-15T15:00:00Z',
      endTime: '2024-09-15T16:00:00Z',
      duration: 3600, // 60 minutes
      integrityScore: 45,
      focusLosses: 8,
      totalViolations: 12,
      suspiciousEvents: [
        {
          id: 'EVT-004',
          type: 'multiple_faces',
          timestamp: '2024-09-15T15:20:00Z',
          description: 'Multiple faces detected in frame',
          severity: 'high',
          confidence: 95,
          details: {
            face_count: 2,
            duration: '45s',
            primary_face_confidence: 89
          }
        },
        {
          id: 'EVT-005',
          type: 'face_absent',
          timestamp: '2024-09-15T15:35:30Z',
          description: 'No face detected for extended period',
          severity: 'high',
          confidence: 98,
          details: {
            duration: '15s',
            recovery_method: 'manual_adjustment'
          }
        }
      ]
    }
  ];

  // Mock statistics for selected report
  const mockStatistics = {
    focusPercentage: 92,
    totalFocusTime: 4140,
    avgFocusLossDuration: 7,
    focusLossCount: 3,
    unauthorizedObjects: 1,
    objectTypes: ['mobile_phone'],
    detectionAccuracy: 90,
    facePresencePercentage: 98,
    faceAbsentDuration: 90,
    multipleFaceIncidents: 0,
    overallScore: 87,
    qualityRating: 'Good',
    complianceRate: 87
  };

  useEffect(() => {
    // Simulate loading reports
    const loadReports = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReports(mockReports);
      setFilteredReports(mockReports);
      setIsLoading(false);
    };

    loadReports();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...reports];

    // Apply filters
    if (filters?.integrityScore !== 'all') {
      filtered = filtered?.filter(report => {
        switch (filters?.integrityScore) {
          case 'excellent':
            return report?.integrityScore >= 90;
          case 'good':
            return report?.integrityScore >= 70 && report?.integrityScore < 90;
          case 'fair':
            return report?.integrityScore >= 50 && report?.integrityScore < 70;
          case 'poor':
            return report?.integrityScore < 50;
          default:
            return true;
        }
      });
    }

    if (filters?.violationType !== 'all') {
      filtered = filtered?.filter(report =>
        report?.suspiciousEvents?.some(event => event?.type === filters?.violationType)
      );
    }

    if (filters?.interviewer !== 'all') {
      filtered = filtered?.filter(report => 
        report?.interviewer?.toLowerCase()?.replace(' ', '_') === filters?.interviewer
      );
    }

    setFilteredReports(filtered);
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm?.trim()) {
      setFilteredReports(reports);
      return;
    }

    let filtered = reports?.filter(report =>
      report?.candidateName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      report?.candidateId?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      report?.sessionId?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );

    setFilteredReports(filtered);
  };

  const handleResetFilters = () => {
    setFilteredReports(reports);
  };

  const handleSelectReport = (report) => {
    setSelectedReport(report);
    setViewMode('detail');
  };

  const handleSelectMultiple = (reportIds) => {
    setSelectedReports(reportIds);
  };

  const handleExport = async (exportConfig) => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock download
    const filename = `proctoring_reports_${new Date()?.toISOString()?.split('T')?.[0]}.${exportConfig?.format}`;
    console.log(`Exporting ${exportConfig?.reports?.length} reports as ${exportConfig?.format}:`, filename);
    
    // In a real app, this would trigger actual file download
    alert(`Export completed: ${filename}`);
  };

  const handleGenerateReport = () => {
    // Simulate report regeneration
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Reports regenerated successfully');
    }, 1500);
  };

  const handleBackToList = () => {
    setSelectedReport(null);
    setViewMode('list');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header sessionStatus="idle" />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading session reports...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header sessionStatus="idle" />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Enhanced Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Session Reports
              </h1>
              <p className="text-text-secondary text-sm sm:text-base">
                Review comprehensive proctoring analysis and generate integrity documentation
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {isDemoMode && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-accent/10 border border-accent/20 rounded-lg">
                  <Icon name="Info" size={16} className="text-accent" />
                  <span className="text-xs sm:text-sm font-medium text-accent">Demo Mode</span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="mb-6 sm:mb-8">
            <QuickActionsToolbar
              context="reports"
              onExport={handleExport}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Filters */}
              <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
                <ReportFilters
                  onFilterChange={handleFilterChange}
                  onSearch={handleSearch}
                  onReset={handleResetFilters}
                />
              </div>

              {/* Reports List */}
              <ReportsList
                reports={filteredReports}
                onSelectReport={handleSelectReport}
                onSelectMultiple={handleSelectMultiple}
                selectedReports={selectedReports}
              />

              {/* Enhanced Export Panel */}
              {selectedReports?.length > 0 && (
                <div className="sticky bottom-4 sm:bottom-6 z-10">
                  <div className="bg-surface border border-border rounded-lg shadow-lg">
                    <ReportExportPanel
                      selectedReports={selectedReports}
                      onExport={handleExport}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              {/* Enhanced Back Button */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  iconPosition="left"
                  onClick={handleBackToList}
                  className="self-start"
                >
                  <span className="hidden xs:inline">Back to Reports</span>
                  <span className="xs:hidden">Back</span>
                </Button>
                <div className="h-px sm:h-6 sm:w-px bg-border" />
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary truncate">
                  Report Details - {selectedReport?.candidateName}
                </h2>
              </div>

              {/* Report Summary */}
              <ReportSummaryCard report={selectedReport} />

              {/* Statistics Cards */}
              <StatisticsCards statistics={mockStatistics} />

              {/* Event Timeline */}
              <EventTimeline events={selectedReport?.suspiciousEvents || []} />

              {/* Export Options for Single Report */}
              <ReportExportPanel
                selectedReports={[selectedReport?.id]}
                onExport={handleExport}
              />
            </div>
          )}

          {/* Enhanced Empty State */}
          {viewMode === 'list' && filteredReports?.length === 0 && !isLoading && (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FileText" size={24} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No reports found</h3>
              <p className="text-text-secondary mb-4 max-w-md mx-auto">
                {reports?.length === 0 
                  ? "No session reports have been generated yet. Complete an interview session to generate your first report."
                  : "No reports match your current filters. Try adjusting your search criteria."
                }
              </p>
              {reports?.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionReports;