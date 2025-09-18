import React from 'react';
import Icon from '../../../components/AppIcon';

const CandidateStats = ({ stats = {} }) => {
  const defaultStats = {
    totalCandidates: 0,
    completedSessions: 0,
    avgIntegrityScore: 0,
    highRiskCandidates: 0,
    scheduledInterviews: 0,
    commonViolations: [],
    ...stats
  };

  const statCards = [
    {
      title: 'Total Candidates',
      value: defaultStats?.totalCandidates?.toLocaleString(),
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Completed Sessions',
      value: defaultStats?.completedSessions?.toLocaleString(),
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Avg Integrity Score',
      value: `${defaultStats?.avgIntegrityScore}%`,
      icon: 'TrendingUp',
      color: defaultStats?.avgIntegrityScore >= 80 ? 'text-success' : 
             defaultStats?.avgIntegrityScore >= 60 ? 'text-warning' : 'text-error',
      bgColor: defaultStats?.avgIntegrityScore >= 80 ? 'bg-success/10' : 
               defaultStats?.avgIntegrityScore >= 60 ? 'bg-warning/10' : 'bg-error/10'
    },
    {
      title: 'High Risk Candidates',
      value: defaultStats?.highRiskCandidates?.toLocaleString(),
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Scheduled Interviews',
      value: defaultStats?.scheduledInterviews?.toLocaleString(),
      icon: 'Calendar',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards?.map((stat, index) => (
          <div key={index} className="bg-surface border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary font-medium">{stat?.title}</p>
                <p className="text-2xl font-semibold text-text-primary mt-1">{stat?.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat?.bgColor}`}>
                <Icon name={stat?.icon} size={20} className={stat?.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Violations */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="AlertCircle" size={18} className="text-warning" />
            <h3 className="text-lg font-semibold text-text-primary">Common Violations</h3>
          </div>
          <div className="space-y-3">
            {defaultStats?.commonViolations?.length > 0 ? (
              defaultStats?.commonViolations?.map((violation, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-error rounded-full" />
                    <span className="text-sm text-text-primary">{violation?.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-text-secondary">{violation?.count} cases</span>
                    <span className="text-xs text-error font-medium">
                      {((violation?.count / defaultStats?.completedSessions) * 100)?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-secondary">No violation data available</p>
            )}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Icon name="BarChart3" size={18} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Score Distribution</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">Excellent (90-100%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-sm text-text-secondary w-8">45%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">Good (70-89%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-warning rounded-full" style={{ width: '30%' }} />
                </div>
                <span className="text-sm text-text-secondary w-8">30%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">Fair (50-69%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '20%' }} />
                </div>
                <span className="text-sm text-text-secondary w-8">20%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">Poor (&lt;50%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-error rounded-full" style={{ width: '5%' }} />
                </div>
                <span className="text-sm text-text-secondary w-8">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateStats;