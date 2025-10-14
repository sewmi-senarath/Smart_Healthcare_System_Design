import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  Calendar, 
  Users, 
  Activity, 
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

interface DashboardProps {
  userRole: string;
}

export function Dashboard({ userRole }: DashboardProps) {
  const stats = [
    {
      label: 'Today\'s Appointments',
      value: '24',
      change: '+3',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      label: 'Patients Checked In',
      value: '18',
      change: '+5',
      icon: Users,
      color: 'text-green-600',
    },
    {
      label: 'Active Consultations',
      value: '6',
      change: '-2',
      icon: Activity,
      color: 'text-purple-600',
    },
    {
      label: 'Avg Wait Time',
      value: '12m',
      change: '-3m',
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'John Doe',
      time: '10:00 AM',
      doctor: 'Dr. Wilson',
      status: 'checked-in',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      time: '10:30 AM',
      doctor: 'Dr. Anderson',
      status: 'scheduled',
    },
    {
      id: 3,
      patient: 'Michael Brown',
      time: '11:00 AM',
      doctor: 'Dr. Wilson',
      status: 'scheduled',
    },
  ];

  const alerts = [
    {
      id: 1,
      type: 'urgent',
      message: 'Lab results pending review for Patient #12345',
      time: '5 minutes ago',
    },
    {
      id: 2,
      type: 'warning',
      message: 'Prescription renewal needed for Patient #12346',
      time: '1 hour ago',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>Welcome Back!</h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your healthcare today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                      {stat.label}
                    </p>
                    <h2 className="mb-2">{stat.value}</h2>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-green-600" style={{ fontSize: '0.875rem' }}>
                        {stat.change}
                      </span>
                      <span className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        from yesterday
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 bg-muted/50 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Today's scheduled visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1 px-3 py-2 bg-muted rounded-lg">
                      <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                        {apt.time.split(' ')[1]}
                      </span>
                      <span>{apt.time.split(' ')[0]}</span>
                    </div>
                    <div>
                      <p>{apt.patient}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        with {apt.doctor}
                      </p>
                    </div>
                  </div>
                  <Badge variant={apt.status === 'checked-in' ? 'default' : 'outline'}>
                    {apt.status === 'checked-in' ? 'Checked In' : 'Scheduled'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Appointments
            </Button>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Important notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg ${
                  alert.type === 'urgent' 
                    ? 'bg-red-50 dark:bg-red-900/20 border border-red-200' 
                    : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200'
                }`}>
                  <div className="flex gap-3">
                    <AlertCircle className={`h-5 w-5 flex-shrink-0 ${
                      alert.type === 'urgent' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <div className="flex-1">
                      <p className={alert.type === 'urgent' ? 'text-red-900 dark:text-red-100' : 'text-orange-900 dark:text-orange-100'}>
                        {alert.message}
                      </p>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                        {alert.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              <span>New Appointment</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>Check-In Patient</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col">
              <Activity className="h-6 w-6 mb-2" />
              <span>Start Consultation</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              <span>View Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
