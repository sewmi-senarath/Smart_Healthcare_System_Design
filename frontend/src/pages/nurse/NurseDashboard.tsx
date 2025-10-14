import React, { useState } from 'react';
import { StatTile } from '../../components/shared/StatTile';
import { QueueTable, QueueItem } from '../../components/shared/QueueTable';
import { PatientSearchForm } from '../../components/shared/PatientSearchForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Users,
  UserPlus,
  Clock,
  Activity,
  Bell,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export function NurseDashboard() {
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Mock data
  const stats = {
    todayAppointments: 24,
    checkInsCompleted: 18,
    waitingForTriage: 6,
    avgWaitTime: 12,
  };

  const queueItems: QueueItem[] = [
    {
      id: '1',
      patientName: 'John Smith',
      patientId: 'P001',
      status: 'waiting',
      priority: 'normal',
      waitTime: 15,
      notes: 'First visit',
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      patientId: 'P002',
      status: 'ready',
      priority: 'urgent',
      waitTime: 25,
      triageData: {
        temperature: '37.2°C',
        bloodPressure: '120/80',
        heartRate: '75 bpm',
      },
      notes: 'Allergic to penicillin',
    },
    {
      id: '3',
      patientName: 'Mike Brown',
      patientId: 'P003',
      status: 'in-progress',
      priority: 'normal',
      waitTime: 5,
      triageData: {
        temperature: '36.8°C',
        bloodPressure: '118/78',
        heartRate: '72 bpm',
      },
    },
  ];

  const todayAppointments = [
    { id: '1', time: '09:00', patient: 'Alice Cooper', doctor: 'Dr. Smith', status: 'completed' },
    { id: '2', time: '09:30', patient: 'Bob Wilson', doctor: 'Dr. Johnson', status: 'completed' },
    { id: '3', time: '10:00', patient: 'Carol Davis', doctor: 'Dr. Smith', status: 'in-progress' },
    { id: '4', time: '10:30', patient: 'David Lee', doctor: 'Dr. Brown', status: 'upcoming' },
    { id: '5', time: '11:00', patient: 'Emma White', doctor: 'Dr. Johnson', status: 'upcoming' },
  ];

  const notifications = [
    { id: '1', type: 'urgent', message: 'Dr. Smith requested patient Sarah Johnson', time: '5 min ago' },
    { id: '2', type: 'info', message: 'New walk-in patient checked in', time: '10 min ago' },
    { id: '3', type: 'warning', message: 'Triage room 2 needs cleaning', time: '15 min ago' },
  ];

  const handleSearch = (data: { type: string; value: string }) => {
    setSearchLoading(true);
    setSearchError('');

    // Simulate API call
    setTimeout(() => {
      setSearchLoading(false);
      if (data.value === 'ERROR') {
        setSearchError("Couldn't find patient. Try manual search.");
      } else {
        toast.success('Patient found: John Doe (ID: P12345)');
      }
    }, 1500);
  };

  const handleQueueAction = (id: string, action: string) => {
    toast.success(`Started triage for patient ${id}`);
  };

  const handleCreateWalkIn = () => {
    toast.success('Walk-in patient created and added to queue');
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'upcoming':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return '';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nurse Dashboard</h1>
          <p className="text-muted-foreground">Manage patient check-ins and triage</p>
        </div>
        <Button onClick={handleCreateWalkIn}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create Walk-in
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Calendar}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatTile
          title="Check-ins Completed"
          value={stats.checkInsCompleted}
          change="+3 from yesterday"
          changeType="positive"
          icon={Users}
          iconBg="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatTile
          title="Waiting for Triage"
          value={stats.waitingForTriage}
          icon={Activity}
          iconBg="bg-yellow-100 dark:bg-yellow-900/20"
          iconColor="text-yellow-600 dark:text-yellow-400"
        />
        <StatTile
          title="Avg. Wait Time"
          value={`${stats.avgWaitTime} min`}
          change="-2 min"
          changeType="positive"
          icon={Clock}
          iconBg="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Search & Check-in */}
          <PatientSearchForm
            onSearch={handleSearch}
            loading={searchLoading}
            error={searchError}
          />

          {/* Queue */}
          <QueueTable
            items={queueItems}
            onAction={handleQueueAction}
            actionLabel="Start Triage"
            showTriageData={true}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{apt.time}</span>
                      </div>
                      <p className="text-sm">{apt.patient}</p>
                      <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                    </div>
                    <Badge className={getAppointmentStatusColor(apt.status)} variant="secondary">
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Notifications</CardTitle>
                <Badge variant="secondary">{notifications.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 border-l-4 rounded ${getNotificationColor(notif.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="h-4 w-4 mr-2" />
                Add to Queue
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Record Vitals
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Notify Doctor
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Reschedule Patient
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
