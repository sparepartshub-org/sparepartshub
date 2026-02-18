import React from 'react';

const statusStyles = {
  placed: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-steel-100 text-steel-800',
  low: 'bg-steel-100 text-steel-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const StatusBadge = ({ status }) => (
  <span className={`badge ${statusStyles[status] || 'bg-steel-100 text-steel-600'}`}>
    {status?.replace('_', ' ').toUpperCase()}
  </span>
);

export default StatusBadge;
