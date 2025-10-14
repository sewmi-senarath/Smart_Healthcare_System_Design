import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LoginPage } from './src/pages/LoginPage';
import { TopNav } from './src/components/layout/TopNav';
import { Sidebar } from './src/components/layout/Sidebar';
import { SearchCommand } from './src/components/layout/SearchCommand';
import { Dashboard } from './src/pages/Dashboard';
import { CheckInPage } from './src/pages/CheckInPage';
import { ConsultationPage } from './src/pages/ConsultationPage';
import { AppointmentsPage } from './src/pages/AppointmentsPage';
import { PlanningPage } from './src/pages/PlanningPage';
import { PharmacyPage } from './src/pages/PharmacyPage';
import { Toaster } from './src/components/ui/sonner';
import { Alert, AlertDescription } from './src/components/ui/alert';
import { WifiOff } from 'lucide-react';

type Page = 'dashboard' | 'check-in' | 'appointments' | 'consultation' | 'patients' | 'pharmacy' | 'planning' | 'reports' | 'settings';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Handle theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const pageTitles: Record<Page, string> = {
    dashboard: 'Dashboard',
    'check-in': 'Patient Check-In',
    appointments: 'Appointments',
    consultation: 'Consultation',
    patients: 'Patients',
    pharmacy: 'Pharmacy',
    planning: 'Planning & Resources',
    reports: 'Reports',
    settings: 'Settings',
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard userRole={user?.role || ''} />;
      case 'check-in':
        return <CheckInPage />;
      case 'consultation':
        return <ConsultationPage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'planning':
        return <PlanningPage />;
      case 'pharmacy':
        return <PharmacyPage />;
      case 'patients':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <h2>Patients Module</h2>
              <p className="mt-2">Patient management interface coming soon...</p>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <h2>Reports Module</h2>
              <p className="mt-2">Analytics and reporting interface coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center text-muted-foreground">
              <h2>Settings</h2>
              <p className="mt-2">System settings and preferences coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard userRole={user?.role || ''} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav
        currentPage={pageTitles[currentPage]}
        userRole={user?.role || ''}
        userName={user?.fullName || ''}
        onSearch={() => setSearchOpen(true)}
        onToggleTheme={() => setIsDark(!isDark)}
        isDark={isDark}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userRole={user?.role || ''}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-7xl">
            {isOffline && (
              <Alert variant="destructive" className="mb-6">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  You are currently offline. Some features may be unavailable.
                </AlertDescription>
              </Alert>
            )}
            {renderPage()}
          </div>
        </main>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
