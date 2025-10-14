import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Pill,
  CalendarClock,
  BarChart3,
  Settings,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { cn } from '../ui/utils';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['all'] },
  { id: 'check-in', label: 'Check-In', icon: ClipboardList, roles: ['nurse', 'doctor'] },
  { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['all'] },
  { id: 'consultation', label: 'Consultation', icon: Stethoscope, roles: ['doctor'] },
  { id: 'patients', label: 'Patients', icon: Users, roles: ['nurse', 'doctor', 'manager'] },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill, roles: ['pharmacist', 'doctor'] },
  { id: 'planning', label: 'Planning', icon: CalendarClock, roles: ['manager'] },
  { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['manager', 'doctor'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['all'] },
];

export function Sidebar({ currentPage, onNavigate, userRole }: SidebarProps) {
  const filteredItems = menuItems.filter(item => 
    item.roles.includes('all') || item.roles.includes(userRole.toLowerCase())
  );

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-card">
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
