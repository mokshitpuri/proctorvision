import React, { useState, useMemo, useEffect } from 'react';
import Header from '../../components/ui/Header';
import QuickActionsToolbar from '../../components/ui/QuickActionsToolbar';
import CandidateTable from './components/CandidateTable';
import CandidateFilters from './components/CandidateFilters';
import CandidateStats from './components/CandidateStats';
import BulkActionsPanel from './components/BulkActionsPanel';
import AddCandidateModal from './components/AddCandidateModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CandidateManagement = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    scoreRange: 'all',
    dateRange: 'all',
    sessionCount: 'all'
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockCandidates = [
    {
      id: 'CAND-001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      department: 'Engineering',
      experience: 'senior',
      lastInterview: '2024-09-14T10:00:00Z',
      totalSessions: 3,
      avgIntegrityScore: 92,
      status: 'completed',
      notes: 'Excellent technical skills, strong communication',
      recentSessions: [
        { date: '2024-09-14T10:00:00Z', score: 95, duration: 45 },
        { date: '2024-09-10T14:30:00Z', score: 88, duration: 60 },
        { date: '2024-09-05T09:15:00Z', score: 93, duration: 50 }
      ],
      commonViolations: ['Looking away briefly', 'Phone notification']
    },
    {
      id: 'CAND-002',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      phone: '+1 (555) 234-5678',
      position: 'Backend Developer',
      department: 'Engineering',
      experience: 'mid',
      lastInterview: '2024-09-15T15:30:00Z',
      totalSessions: 2,
      avgIntegrityScore: 78,
      status: 'in-progress',
      notes: 'Good problem-solving skills, needs improvement in system design',
      recentSessions: [
        { date: '2024-09-15T15:30:00Z', score: 82, duration: 55 },
        { date: '2024-09-12T11:00:00Z', score: 74, duration: 40 }
      ],
      commonViolations: ['Multiple faces detected', 'Unauthorized device']
    },
    {
      id: 'CAND-003',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      phone: '+1 (555) 345-6789',
      position: 'Product Manager',
      department: 'Product',
      experience: 'senior',
      lastInterview: '2024-09-16T09:00:00Z',
      totalSessions: 1,
      avgIntegrityScore: 96,
      status: 'scheduled',
      notes: 'Strong leadership experience, excellent strategic thinking',
      recentSessions: [
        { date: '2024-09-16T09:00:00Z', score: 96, duration: 65 }
      ],
      commonViolations: []
    },
    {
      id: 'CAND-004',
      name: 'David Kim',
      email: 'david.kim@email.com',
      phone: '+1 (555) 456-7890',
      position: 'Data Scientist',
      department: 'Data & Analytics',
      experience: 'mid',
      lastInterview: '2024-09-13T13:45:00Z',
      totalSessions: 4,
      avgIntegrityScore: 85,
      status: 'completed',
      notes: 'Strong analytical skills, good presentation abilities',
      recentSessions: [
        { date: '2024-09-13T13:45:00Z', score: 89, duration: 70 },
        { date: '2024-09-08T16:20:00Z', score: 81, duration: 45 },
        { date: '2024-09-03T10:30:00Z', score: 87, duration: 55 }
      ],
      commonViolations: ['Looking away', 'Background noise']
    },
    {
      id: 'CAND-005',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@email.com',
      phone: '+1 (555) 567-8901',
      position: 'UI/UX Designer',
      department: 'Design',
      experience: 'senior',
      lastInterview: null,
      totalSessions: 0,
      avgIntegrityScore: 0,
      status: 'scheduled',
      notes: 'Portfolio review pending, strong design background',
      recentSessions: [],
      commonViolations: []
    },
    {
      id: 'CAND-006',
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      phone: '+1 (555) 678-9012',
      position: 'DevOps Engineer',
      department: 'Engineering',
      experience: 'lead',
      lastInterview: '2024-09-11T14:15:00Z',
      totalSessions: 2,
      avgIntegrityScore: 67,
      status: 'cancelled',
      notes: 'Technical expertise confirmed, some integrity concerns',
      recentSessions: [
        { date: '2024-09-11T14:15:00Z', score: 72, duration: 35 },
        { date: '2024-09-07T12:00:00Z', score: 62, duration: 30 }
      ],
      commonViolations: ['Multiple faces', 'Unauthorized materials', 'Looking away frequently']
    }
  ];

  const mockStats = {
    totalCandidates: 247,
    completedSessions: 189,
    avgIntegrityScore: 84,
    highRiskCandidates: 12,
    scheduledInterviews: 23,
    commonViolations: [
      { type: 'Looking away from camera', count: 45 },
      { type: 'Multiple faces detected', count: 23 },
      { type: 'Unauthorized devices', count: 18 },
      { type: 'Background noise/interruption', count: 15 },
      { type: 'Poor lighting/visibility', count: 8 }
    ]
  };

  // Initialize data
  useEffect(() => {
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = [...candidates];

    // Apply filters
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(candidate =>
        candidate?.name?.toLowerCase()?.includes(searchTerm) ||
        candidate?.email?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.status !== 'all') {
      filtered = filtered?.filter(candidate => candidate?.status === filters?.status);
    }

    if (filters?.scoreRange !== 'all') {
      const [min, max] = filters?.scoreRange?.split('-')?.map(Number);
      filtered = filtered?.filter(candidate => {
        if (filters?.scoreRange === '10+') {
          return candidate?.totalSessions >= 10;
        }
        return candidate?.avgIntegrityScore >= min && candidate?.avgIntegrityScore <= max;
      });
    }

    if (filters?.sessionCount !== 'all') {
      if (filters?.sessionCount === '1') {
        filtered = filtered?.filter(candidate => candidate?.totalSessions === 1);
      } else if (filters?.sessionCount === '2-5') {
        filtered = filtered?.filter(candidate => candidate?.totalSessions >= 2 && candidate?.totalSessions <= 5);
      } else if (filters?.sessionCount === '6-10') {
        filtered = filtered?.filter(candidate => candidate?.totalSessions >= 6 && candidate?.totalSessions <= 10);
      } else if (filters?.sessionCount === '10+') {
        filtered = filtered?.filter(candidate => candidate?.totalSessions >= 10);
      }
    }

    // Apply sorting
    if (sortConfig?.key) {
      filtered?.sort((a, b) => {
        let aValue = a?.[sortConfig?.key];
        let bValue = b?.[sortConfig?.key];

        if (sortConfig?.key === 'lastInterview') {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        }

        if (aValue < bValue) {
          return sortConfig?.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig?.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [candidates, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      scoreRange: 'all',
      dateRange: 'all',
      sessionCount: 'all'
    });
  };

  const handleStartSession = (candidate) => {
    console.log('Starting session for:', candidate?.name);
    // Navigate to interview dashboard or start session
  };

  const handleViewReport = (candidate) => {
    console.log('Viewing report for:', candidate?.name);
    // Navigate to session reports
  };

  const handleBulkAction = async (action) => {
    console.log('Executing bulk action:', action, 'for candidates:', selectedCandidates);
    // Implement bulk actions
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setSelectedCandidates([]);
  };

  const handleAddCandidate = async (candidateData) => {
    const newCandidate = {
      id: `CAND-${String(candidates?.length + 1)?.padStart(3, '0')}`,
      ...candidateData,
      lastInterview: null,
      totalSessions: 0,
      avgIntegrityScore: 0,
      status: 'scheduled',
      recentSessions: [],
      commonViolations: []
    };

    setCandidates(prev => [...prev, newCandidate]);
    console.log('Added new candidate:', newCandidate);
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    setIsAddModalOpen(true);
  };

  const handleUpdateCandidate = async (updatedData) => {
    setCandidates(prev =>
      prev?.map(candidate =>
        candidate?.id === editingCandidate?.id
          ? { ...candidate, ...updatedData }
          : candidate
      )
    );
    setEditingCandidate(null);
    console.log('Updated candidate:', updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="text-text-secondary">Loading candidates...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Candidate Management</h1>
              <p className="text-text-secondary mt-1">
                Manage candidate records, interview history, and integrity reports
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                onClick={() => {}}
              >
                Import CSV
              </Button>
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-8">
            <CandidateStats stats={mockStats} />
          </div>

          {/* Quick Actions Toolbar */}
          <div className="mb-6">
            <QuickActionsToolbar
              context="candidates"
              onExport={(format) => console.log('Exporting as:', format)}
              onBulkAction={handleBulkAction}
            />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <CandidateFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalCandidates={candidates?.length}
              filteredCount={filteredAndSortedCandidates?.length}
            />
          </div>

          {/* Candidates Table */}
          <div className="mb-8">
            <CandidateTable
              candidates={filteredAndSortedCandidates}
              selectedCandidates={selectedCandidates}
              onSelectionChange={setSelectedCandidates}
              onCandidateClick={handleEditCandidate}
              onStartSession={handleStartSession}
              onViewReport={handleViewReport}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          </div>

          {/* Empty State */}
          {filteredAndSortedCandidates?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Users" size={24} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No candidates found</h3>
              <p className="text-text-secondary mb-4">
                {candidates?.length === 0 
                  ? "Get started by adding your first candidate" :"Try adjusting your filters to see more results"
                }
              </p>
              {candidates?.length === 0 && (
                <Button
                  variant="default"
                  iconName="UserPlus"
                  iconPosition="left"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add First Candidate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Bulk Actions Panel */}
      <BulkActionsPanel
        selectedCount={selectedCandidates?.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setSelectedCandidates([])}
        isVisible={selectedCandidates?.length > 0}
      />
      {/* Add/Edit Candidate Modal */}
      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingCandidate(null);
        }}
        onSave={editingCandidate ? handleUpdateCandidate : handleAddCandidate}
        editingCandidate={editingCandidate}
      />
    </div>
  );
};

export default CandidateManagement;