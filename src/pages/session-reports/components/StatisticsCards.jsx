import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      title: 'Focus Analysis',
      icon: 'Eye',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      stats: [
        {
          label: 'Focus Percentage',
          value: `${statistics?.focusPercentage}%`,
          subtext: `${statistics?.totalFocusTime}s focused`
        },
        {
          label: 'Average Loss Duration',
          value: `${statistics?.avgFocusLossDuration}s`,
          subtext: `${statistics?.focusLossCount} incidents`
        }
      ]
    },
    {
      title: 'Object Detection',
      icon: 'Smartphone',
      color: 'text-error',
      bgColor: 'bg-error/10',
      stats: [
        {
          label: 'Unauthorized Items',
          value: statistics?.unauthorizedObjects,
          subtext: `${statistics?.objectTypes?.join(', ')}`
        },
        {
          label: 'Detection Accuracy',
          value: `${statistics?.detectionAccuracy}%`,
          subtext: 'Average confidence'
        }
      ]
    },
    {
      title: 'Behavioral Patterns',
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      stats: [
        {
          label: 'Face Presence',
          value: `${statistics?.facePresencePercentage}%`,
          subtext: `${statistics?.faceAbsentDuration}s absent`
        },
        {
          label: 'Multiple Faces',
          value: statistics?.multipleFaceIncidents,
          subtext: 'Incidents detected'
        }
      ]
    },
    {
      title: 'Session Quality',
      icon: 'Award',
      color: 'text-success',
      bgColor: 'bg-success/10',
      stats: [
        {
          label: 'Overall Score',
          value: `${statistics?.overallScore}/100`,
          subtext: statistics?.qualityRating
        },
        {
          label: 'Compliance Rate',
          value: `${statistics?.complianceRate}%`,
          subtext: 'Rules followed'
        }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards?.map((card, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-6 shadow-subtle">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card?.bgColor}`}>
              <Icon name={card?.icon} size={20} className={card?.color} />
            </div>
            <h3 className="font-semibold text-text-primary">{card?.title}</h3>
          </div>
          
          <div className="space-y-4">
            {card?.stats?.map((stat, statIndex) => (
              <div key={statIndex}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-text-secondary">{stat?.label}</span>
                  <span className="text-lg font-semibold text-text-primary">
                    {stat?.value}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{stat?.subtext}</p>
                {statIndex < card?.stats?.length - 1 && (
                  <div className="mt-3 border-t border-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;