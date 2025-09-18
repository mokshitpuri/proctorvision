import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CandidateFilters = ({ 
  filters = {}, 
  onFiltersChange = () => {},
  onClearFilters = () => {},
  totalCandidates = 0,
  filteredCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  const scoreRangeOptions = [
    { value: 'all', label: 'All Scores' },
    { value: '90-100', label: '90-100% (Excellent)' },
    { value: '70-89', label: '70-89% (Good)' },
    { value: '50-69', label: '50-69% (Fair)' },
    { value: '0-49', label: '0-49% (Poor)' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const sessionCountOptions = [
    { value: 'all', label: 'Any Sessions' },
    { value: '1', label: '1 Session' },
    { value: '2-5', label: '2-5 Sessions' },
    { value: '6-10', label: '6-10 Sessions' },
    { value: '10+', label: '10+ Sessions' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    value && value !== 'all' && value !== ''
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search candidates by name or email..."
            value={filters?.search || ''}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-text-secondary">
            Showing {filteredCount} of {totalCandidates} candidates
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Filters
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border">
          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status || 'all'}
            onChange={(value) => handleFilterChange('status', value)}
            className="w-full"
          />
          
          <Select
            label="Integrity Score"
            options={scoreRangeOptions}
            value={filters?.scoreRange || 'all'}
            onChange={(value) => handleFilterChange('scoreRange', value)}
            className="w-full"
          />
          
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange || 'all'}
            onChange={(value) => handleFilterChange('dateRange', value)}
            className="w-full"
          />
          
          <Select
            label="Session Count"
            options={sessionCountOptions}
            value={filters?.sessionCount || 'all'}
            onChange={(value) => handleFilterChange('sessionCount', value)}
            className="w-full"
          />
        </div>
      )}
      {/* Custom Date Range */}
      {isExpanded && filters?.dateRange === 'custom' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <Input
            type="date"
            label="From Date"
            value={filters?.startDate || ''}
            onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
          />
          <Input
            type="date"
            label="To Date"
            value={filters?.endDate || ''}
            onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
          />
        </div>
      )}
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <span className="text-sm text-text-secondary">Active filters:</span>
          {Object.entries(filters)?.map(([key, value]) => {
            if (!value || value === 'all' || value === '') return null;
            
            let displayValue = value;
            if (key === 'status') {
              displayValue = statusOptions?.find(opt => opt?.value === value)?.label || value;
            } else if (key === 'scoreRange') {
              displayValue = scoreRangeOptions?.find(opt => opt?.value === value)?.label || value;
            } else if (key === 'dateRange') {
              displayValue = dateRangeOptions?.find(opt => opt?.value === value)?.label || value;
            } else if (key === 'sessionCount') {
              displayValue = sessionCountOptions?.find(opt => opt?.value === value)?.label || value;
            }
            
            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
              >
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, key === 'search' ? '' : 'all')}
                  className="hover:text-primary/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CandidateFilters;