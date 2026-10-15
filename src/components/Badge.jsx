import React from 'react';

export const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
};

export const DepartmentBadge = ({ department }) => {
  const map = {
    'Computer Science': 'indigo',
    'Information Technology': 'primary',
    'Electronics & Communication': 'purple',
    'Mechanical Engineering': 'warning',
    'Civil Engineering': 'danger',
    'Electrical & Electronics': 'success'
  };

  return <Badge variant={map[department] || 'gray'}>{department || 'General'}</Badge>;
};

export const StatusBadge = ({ status }) => {
  if (status === 'Active') return <Badge variant="success">Active</Badge>;
  if (status === 'Pending') return <Badge variant="warning">Pending Verification</Badge>;
  if (status === 'Inactive') return <Badge variant="gray">Inactive</Badge>;
  return <Badge variant="gray">{status || 'Unknown'}</Badge>;
};
