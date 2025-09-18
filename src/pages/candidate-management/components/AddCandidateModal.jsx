import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddCandidateModal = ({ 
  isOpen = false, 
  onClose = () => {},
  onSave = () => {},
  editingCandidate = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    experience: '',
    notes: '',
    ...editingCandidate
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const positionOptions = [
    { value: '', label: 'Select Position' },
    { value: 'software-engineer', label: 'Software Engineer' },
    { value: 'senior-developer', label: 'Senior Developer' },
    { value: 'frontend-developer', label: 'Frontend Developer' },
    { value: 'backend-developer', label: 'Backend Developer' },
    { value: 'fullstack-developer', label: 'Fullstack Developer' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
    { value: 'qa-engineer', label: 'QA Engineer' }
  ];

  const departmentOptions = [
    { value: '', label: 'Select Department' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'product', label: 'Product' },
    { value: 'design', label: 'Design' },
    { value: 'data', label: 'Data & Analytics' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const experienceOptions = [
    { value: '', label: 'Select Experience Level' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (2-5 years)' },
    { value: 'senior', label: 'Senior Level (5-8 years)' },
    { value: 'lead', label: 'Lead Level (8+ years)' },
    { value: 'principal', label: 'Principal Level (10+ years)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.position) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData?.department) {
      newErrors.department = 'Department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      handleClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      experience: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="relative bg-surface border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
              </h2>
              <p className="text-sm text-text-secondary">
                {editingCandidate ? 'Update candidate information' : 'Enter candidate details for interview scheduling'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter candidate's full name"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
              className="md:col-span-2"
            />
            
            <Input
              label="Email Address"
              type="email"
              placeholder="candidate@example.com"
              value={formData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              error={errors?.email}
              required
            />
            
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              error={errors?.phone}
            />
            
            <Select
              label="Position"
              options={positionOptions}
              value={formData?.position}
              onChange={(value) => handleInputChange('position', value)}
              error={errors?.position}
              required
            />
            
            <Select
              label="Department"
              options={departmentOptions}
              value={formData?.department}
              onChange={(value) => handleInputChange('department', value)}
              error={errors?.department}
              required
            />
            
            <Select
              label="Experience Level"
              options={experienceOptions}
              value={formData?.experience}
              onChange={(value) => handleInputChange('experience', value)}
              error={errors?.experience}
              className="md:col-span-2"
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Additional notes about the candidate..."
                value={formData?.notes}
                onChange={(e) => handleInputChange('notes', e?.target?.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Save"
            iconPosition="left"
            loading={isSaving}
            onClick={handleSave}
          >
            {editingCandidate ? 'Update Candidate' : 'Add Candidate'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCandidateModal;