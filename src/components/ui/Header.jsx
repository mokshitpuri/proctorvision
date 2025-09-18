import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ sessionStatus = 'idle', currentSession = null }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Interview Dashboard',
      path: '/interview-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Manage and initiate interview sessions'
    },
    {
      label: 'Live Monitoring',
      path: '/live-monitoring-panel',
      icon: 'Eye',
      tooltip: 'Real-time AI detection and monitoring'
    },
    {
      label: 'Session Reports',
      path: '/session-reports',
      icon: 'FileText',
      tooltip: 'View and export interview reports'
    },
    {
      label: 'Candidate Management',
      path: '/candidate-management',
      icon: 'Users',
      tooltip: 'Manage candidate records and history'
    }
  ];

  const moreMenuItems = [
    { label: 'Settings', icon: 'Settings', path: '/settings' },
    { label: 'Help & Support', icon: 'HelpCircle', path: '/help' },
    { label: 'Admin Panel', icon: 'Shield', path: '/admin' }
  ];

  const getSessionStatusColor = () => {
    switch (sessionStatus) {
      case 'recording':
        return 'text-error';
      case 'monitoring':
        return 'text-warning';
      case 'active':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getSessionStatusText = () => {
    switch (sessionStatus) {
      case 'recording':
        return 'Recording';
      case 'monitoring':
        return 'Monitoring';
      case 'active':
        return 'Active Session';
      default:
        return 'Ready';
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMoreMenuOpen(false);
  };

  const handleMoreMenuToggle = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleClickOutside = (e) => {
    if (!e?.target?.closest('.more-menu-container')) {
      setIsMoreMenuOpen(false);
    }
  };

  React.useEffect(() => {
    if (isMoreMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMoreMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <Icon name="Eye" size={20} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-text-primary leading-none">
              ProctorVision
            </h1>
            <span className="text-xs text-text-secondary font-normal">
              AI Interview Monitoring
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-subtle' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-muted'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Session Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-full">
            <div className={`w-2 h-2 rounded-full ${
              sessionStatus === 'recording' ? 'bg-error animate-pulse-subtle' :
              sessionStatus === 'monitoring' ? 'bg-warning animate-pulse-subtle' :
              sessionStatus === 'active' ? 'bg-success' : 'bg-text-secondary'
            }`} />
            <span className={`text-xs font-medium ${getSessionStatusColor()}`}>
              {getSessionStatusText()}
            </span>
            {currentSession && (
              <span className="text-xs text-text-secondary font-mono">
                {currentSession?.id}
              </span>
            )}
          </div>

          {/* More Menu */}
          <div className="relative more-menu-container">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMoreMenuToggle}
              iconName="MoreHorizontal"
              className="p-2"
            />
            
            {isMoreMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-elevation-2 py-1 animate-fade-in">
                {moreMenuItems?.map((item) => (
                  <button
                    key={item?.path}
                    onClick={() => handleNavigation(item?.path)}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-colors duration-200"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            iconName="Menu"
          />
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-surface">
        <nav className="flex overflow-x-auto">
          {navigationItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex flex-col items-center space-y-1 px-3 py-2 min-w-0 flex-1 text-xs transition-colors duration-200
                  ${isActive 
                    ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={item?.icon} size={16} />
                <span className="truncate font-medium">{item?.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;