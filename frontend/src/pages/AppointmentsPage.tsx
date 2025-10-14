import React, { useState } from 'react';
import { AppointmentBooking } from '../components/features/AppointmentBooking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Plus, CheckCircle2, Calendar as CalendarIcon } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export function AppointmentsPage() {
  const [view, setView] = useState<'list' | 'book' | 'confirmation'>('list');
  const [bookingData, setBookingData] = useState<any>(null);

  const appointments = [
    {
      id: 1,
      patient: 'John Doe',
      doctor: 'Dr. Sarah Wilson',
      date: '2025-10-14',
      time: '10:00 AM',
      status: 'booked',
      type: 'In-Person',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Anderson',
      date: '2025-10-14',
      time: '2:00 PM',
      status: 'arrived',
      type: 'In-Person',
    },
    {
      id: 3,
      patient: 'Michael Brown',
      doctor: 'Dr. Sarah Wilson',
      date: '2025-10-15',
      time: '9:00 AM',
      status: 'booked',
      type: 'Telehealth',
    },
    {
      id: 4,
      patient: 'Sarah Johnson',
      doctor: 'Dr. Michael Anderson',
      date: '2025-10-15',
      time: '11:00 AM',
      status: 'completed',
      type: 'In-Person',
    },
  ];

  const handleBookingComplete = (data: any) => {
    setBookingData(data);
    setView('confirmation');
  };

  const handleNewBooking = () => {
    setView('book');
    setBookingData(null);
  };

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1>Appointments</h1>
              <p className="text-muted-foreground mt-1">
                Manage and schedule appointments
              </p>
            </div>
            <Button onClick={handleNewBooking}>
              <Plus className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    Scheduled appointments for the coming days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments
                      .filter(apt => new Date(apt.date) > new Date())
                      .map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-muted rounded-lg">
                              <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                                {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span>{new Date(apt.date).getDate()}</span>
                              <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                                {apt.time}
                              </span>
                            </div>
                            <div>
                              <p className="mb-1">{apt.patient}</p>
                              <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                                with {apt.doctor} • {apt.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={apt.status as any} />
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="today" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments
                      .filter(apt => apt.date === '2025-10-14')
                      .map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-primary/10 rounded-lg">
                              <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                                Today
                              </span>
                              <span>{apt.time}</span>
                            </div>
                            <div>
                              <p className="mb-1">{apt.patient}</p>
                              <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                                with {apt.doctor} • {apt.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={apt.status as any} />
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                  <CardDescription>
                    Completed and cancelled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments
                      .filter(apt => apt.status === 'completed')
                      .map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg opacity-75">
                          <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-muted rounded-lg">
                              <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                                {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                              </span>
                              <span>{new Date(apt.date).getDate()}</span>
                              <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                                {apt.time}
                              </span>
                            </div>
                            <div>
                              <p className="mb-1">{apt.patient}</p>
                              <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                                with {apt.doctor} • {apt.type}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={apt.status as any} />
                            <Button variant="ghost" size="sm">
                              View Summary
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {view === 'book' && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1>Book Appointment</h1>
              <p className="text-muted-foreground mt-1">
                Find and schedule an appointment
              </p>
            </div>
            <Button variant="outline" onClick={() => setView('list')}>
              Cancel
            </Button>
          </div>

          <AppointmentBooking onContinue={handleBookingComplete} />
        </>
      )}

      {view === 'confirmation' && bookingData && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="mb-2">Appointment Confirmed!</h2>
              <p className="text-muted-foreground mb-6">
                Your appointment has been successfully scheduled
              </p>

              <Card className="w-full max-w-md mb-6">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Date & Time</p>
                        <p>{bookingData.date?.toLocaleDateString()} at {bookingData.slot?.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Doctor</p>
                        <p>{bookingData.doctor?.name}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{bookingData.doctor?.specialty}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3 w-full max-w-md">
                <Button variant="outline" className="flex-1" onClick={handleNewBooking}>
                  Book Another
                </Button>
                <Button className="flex-1" onClick={() => setView('list')}>
                  View Appointments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
