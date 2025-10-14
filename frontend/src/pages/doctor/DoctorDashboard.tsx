import React, { useState } from 'react';
import { StatTile } from '../../components/shared/StatTile';
import { QueueTable, QueueItem } from '../../components/shared/QueueTable';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Separator } from '../../components/ui/separator';
import {
  Users,
  ClipboardList,
  Pill,
  FileText,
  AlertTriangle,
  Clock,
  Calendar,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

export function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('queue');

  // Mock data
  const stats = {
    todayPatients: 12,
    completed: 8,
    pending: 4,
    avgConsultTime: 18,
  };

  const queueItems: QueueItem[] = [
    {
      id: '1',
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
      id: '2',
      patientName: 'Mike Brown',
      patientId: 'P003',
      status: 'waiting',
      priority: 'normal',
      waitTime: 15,
      triageData: {
        temperature: '36.8°C',
        bloodPressure: '118/78',
        heartRate: '72 bpm',
      },
    },
    {
      id: '3',
      patientName: 'Emma Davis',
      patientId: 'P004',
      status: 'waiting',
      priority: 'normal',
      waitTime: 10,
    },
  ];

  const prescriptions = [
    {
      id: 'RX001',
      patient: 'Sarah Johnson',
      date: 'Today, 10:30 AM',
      status: 'pending' as const,
      items: 3,
    },
    {
      id: 'RX002',
      patient: 'Mike Brown',
      date: 'Today, 09:15 AM',
      status: 'partial' as const,
      items: 2,
    },
    {
      id: 'RX003',
      patient: 'John Smith',
      date: 'Yesterday',
      status: 'dispensed' as const,
      items: 4,
    },
  ];

  const labResults = [
    {
      id: 'LAB001',
      patient: 'Sarah Johnson',
      type: 'Blood Test',
      status: 'ready',
      urgent: true,
    },
    {
      id: 'LAB002',
      patient: 'Emma Davis',
      type: 'X-Ray',
      status: 'ready',
      urgent: false,
    },
    {
      id: 'LAB003',
      patient: 'Mike Brown',
      type: 'CT Scan',
      status: 'pending',
      urgent: false,
    },
  ];

  const schedule = [
    { time: '09:00 - 10:00', activity: 'General Consultations', patients: 4, status: 'completed' },
    { time: '10:00 - 11:00', activity: 'General Consultations', patients: 3, status: 'in-progress' },
    { time: '11:00 - 12:00', activity: 'General Consultations', patients: 4, status: 'upcoming' },
    { time: '12:00 - 13:00', activity: 'Lunch Break', patients: 0, status: 'upcoming' },
    { time: '13:00 - 14:00', activity: 'Follow-ups', patients: 3, status: 'upcoming' },
  ];

  const handleStartConsultation = (id: string) => {
    toast.success(`Started consultation for patient ${id}`);
  };

  const handleIssuePrescription = () => {
    toast.success('Prescription issued and sent to pharmacy');
  };

  const getPrescriptionStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'partial':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'dispensed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return '';
    }
  };

  const getScheduleStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Today's consultations and patient queue</p>
        </div>
        <Button onClick={handleIssuePrescription}>
          <Pill className="h-4 w-4 mr-2" />
          New Prescription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          title="Today's Patients"
          value={stats.todayPatients}
          icon={Users}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatTile
          title="Completed"
          value={stats.completed}
          change={`${stats.pending} pending`}
          changeType="neutral"
          icon={ClipboardList}
          iconBg="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatTile
          title="Prescriptions Issued"
          value={prescriptions.length}
          icon={Pill}
          iconBg="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatTile
          title="Avg. Consult Time"
          value={`${stats.avgConsultTime} min`}
          change="+2 min"
          changeType="neutral"
          icon={Clock}
          iconBg="bg-orange-100 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Queue & Prescriptions */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="queue">
                <Users className="h-4 w-4 mr-2" />
                Queue
              </TabsTrigger>
              <TabsTrigger value="prescriptions">
                <Pill className="h-4 w-4 mr-2" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="labs">
                <FileText className="h-4 w-4 mr-2" />
                Lab Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="mt-6">
              <QueueTable
                items={queueItems}
                onAction={handleStartConsultation}
                actionLabel="Start Consult"
                showTriageData={true}
              />
            </TabsContent>

            <TabsContent value="prescriptions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>E-Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prescriptions.map((rx) => (
                      <div
                        key={rx.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">#{rx.id}</h4>
                            <Badge
                              className={getPrescriptionStatusColor(rx.status)}
                              variant="secondary"
                            >
                              {rx.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rx.patient}</p>
                          <p className="text-sm text-muted-foreground">{rx.date}</p>
                          <p className="text-sm text-muted-foreground">{rx.items} items</p>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="labs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lab Results to Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {labResults.map((lab) => (
                      <div
                        key={lab.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          {lab.urgent && (
                            <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{lab.type}</h4>
                              {lab.status === 'ready' && (
                                <Badge variant="secondary">Ready</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{lab.patient}</p>
                            <p className="text-sm text-muted-foreground">ID: {lab.id}</p>
                          </div>
                        </div>
                        {lab.status === 'ready' && (
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schedule.map((slot, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{slot.time}</span>
                      </div>
                      <Badge className={getScheduleStatusColor(slot.status)} variant="secondary">
                        {slot.status}
                      </Badge>
                    </div>
                    <div className="pl-6">
                      <p className="text-sm">{slot.activity}</p>
                      {slot.patients > 0 && (
                        <p className="text-sm text-muted-foreground">
                          {slot.patients} patients
                        </p>
                      )}
                    </div>
                    {index < schedule.length - 1 && <Separator className="mt-3" />}
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
                <FileText className="h-4 w-4 mr-2" />
                View Medical History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Pill className="h-4 w-4 mr-2" />
                Issue Prescription
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Request Tests
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ClipboardList className="h-4 w-4 mr-2" />
                Complete Visit
              </Button>
            </CardContent>
          </Card>

          {/* Patient Snapshot (when active) */}
          <Card>
            <CardHeader>
              <CardTitle>Current Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No active consultation</p>
                <Button variant="outline" size="sm" className="mt-4">
                  Start Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
