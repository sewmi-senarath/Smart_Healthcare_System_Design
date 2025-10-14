import React from 'react';
import { Badge } from '../ui/badge';

type StatusType = 
  | 'booked' 
  | 'arrived' 
  | 'in-room' 
  | 'completed' 
  | 'no-show' 
  | 'cancelled'
  | 'queued'
  | 'draft'
  | 'signed'
  | 'dispensed'
  | 'partial'
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  booked: { label: 'Booked', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  arrived: { label: 'Arrived', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'in-room': { label: 'In Room', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  'no-show': { label: 'No Show', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  queued: { label: 'Queued', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
  signed: { label: 'Signed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  dispensed: { label: 'Dispensed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  partial: { label: 'Partial', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  active: { label: 'Active', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={`${config.className} border-0`}>
      {label || config.label}
    </Badge>
  );
}
