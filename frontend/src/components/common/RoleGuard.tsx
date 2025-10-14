import React from 'react';

type Role = 'patient' | 'nurse' | 'doctor' | 'manager' | 'pharmacist';

interface RoleGuardProps {
  allowedRoles: Role[];
  currentRole: Role;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, currentRole, children, fallback = null }: RoleGuardProps) {
  if (!allowedRoles.includes(currentRole)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}
