import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  Menu, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Activity
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';

interface TopNavProps {
  currentPage: string;
  userRole: string;
  userName: string;
  onToggleSidebar?: () => void;
  onSearch?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
}

export function TopNav({ 
  currentPage, 
  userRole, 
  userName, 
  onToggleSidebar, 
  onSearch,
  onToggleTheme,
  isDark = false 
}: TopNavProps) {
  const [notifications] = useState(3);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <h2 className="leading-none">HealthCare+</h2>
              <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.8125rem' }}>
                {currentPage}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2 px-3"
            onClick={onSearch}
          >
            <Search className="h-4 w-4" />
            <span className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
              Search...
            </span>
            <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 opacity-100 sm:flex" style={{ fontSize: '0.625rem' }}>
              <span>⌘</span>K
            </kbd>
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onSearch}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={onToggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    style={{ fontSize: '0.625rem' }}
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 hover:bg-accent cursor-pointer">
                  <p className="mb-1">New appointment request</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    John Doe requested an appointment for tomorrow
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                    5 minutes ago
                  </p>
                </div>
                <div className="p-3 hover:bg-accent cursor-pointer">
                  <p className="mb-1">Prescription ready for pickup</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Rx #12345 is ready at the pharmacy
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                    1 hour ago
                  </p>
                </div>
                <div className="p-3 hover:bg-accent cursor-pointer">
                  <p className="mb-1">Weekly planning published</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Next week's schedule is now available
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                    2 hours ago
                  </p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="leading-none">{userName}</p>
                  <p className="text-muted-foreground mt-0.5" style={{ fontSize: '0.75rem' }}>
                    {userRole}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
