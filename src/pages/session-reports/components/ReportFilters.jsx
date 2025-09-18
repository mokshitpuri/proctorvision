import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ReportFilters = ({ onFilterChange, onSearch, onReset }) => {
  const [filters, setFilters] = useState({
    dateRange: 'last_7_days',
    integrityScore: 'all',
    violationType: 'all',
    candidate: '',
    interviewer: 'all'
  });

  const [searchTerm, setSearchTerm] = useState('');

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_3_months', label: 'Last 3 Months' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const integrityScoreOptions = [
    { value: 'all', label: 'All Scores' },
    { value: 'excellent', label: 'Excellent (90-100%)' },
    { value: 'good', label: 'Good (70-89%)' },
    { value: 'fair', label: 'Fair (50-69%)' },
    { value: 'poor', label: 'Poor (Below 50%)' }
  ];

  const violationTypeOptions = [
    { value: 'all', label: 'All Violations' },
    { value: 'focus_loss', label: 'Focus Loss' },
    { value: 'object_detected', label: 'Unauthorized Objects' },
    { value: 'multiple_faces', label: 'Multiple Faces' },
    { value: 'face_absent', label: 'Face Absent' }
  ];

  const interviewerOptions = [
    { value: 'all', label: 'All Interviewers' },
    { value: 'sarah_johnson', label: 'Sarah Johnson' },
    { value: 'michael_chen', label: 'Michael Chen' },
    { value: 'emily_davis', label: 'Emily Davis' },
    { value: 'david_wilson', label: 'David Wilson' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'last_7_days',
      integrityScore: 'all',
      violationType: 'all',
      candidate: '',
      interviewer: 'all'
    };
    setFilters(resetFilters);
    setSearchTerm('');
    onReset();
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Filter Reports
        </h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          onClick={handleReset}
        >
          Reset Filters
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        <Select
          label="Integrity Score"
          options={integrityScoreOptions}
          value={filters?.integrityScore}
          onChange={(value) => handleFilterChange('integrityScore', value)}
        />

        <Select
          label="Violation Type"
          options={violationTypeOptions}
          value={filters?.violationType}
          onChange={(value) => handleFilterChange('violationType', value)}
        />

        <Select
          label="Interviewer"
          options={interviewerOptions}
          value={filters?.interviewer}
          onChange={(value) => handleFilterChange('interviewer', value)}
        />

        <div className="md:col-span-2">
          <Input
            label="Search Candidate"
            type="text"
            placeholder="Enter candidate name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="Filter" size={16} />
          <span>Active filters will be applied to the report list</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Search"
            iconPosition="left"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;