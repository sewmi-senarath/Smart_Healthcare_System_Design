import React, { useState, useEffect } from 'react';
import { StatTile } from '../../components/shared/StatTile';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Separator } from '../../../components/ui/separator';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import {
  Calendar,
  FileText,
  Pill,
  Activity,
  AlertCircle,
  Clock,
  User,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import * as dashboardAPI from '../../../lib/api/dashboard';

export function PatientDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<dashboardAPI.PatientDashboardData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardAPI.getPatientDashboard();
      setDashboardData(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return '';
    }
  };

  const getPrescriptionStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'partial':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'dispensed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load dashboard data</AlertDescription>
        </Alert>
      </div>
    );
  }

  const { patient, stats, upcomingAppointments, recentVisits, activePrescriptions } =
    dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {patient.name}</h1>
          <p className="text-muted-foreground">Here's your health overview</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Patient Alerts */}
      {patient.allergies && patient.allergies.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Allergies:</strong> {patient.allergies.join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={Calendar}
          iconBg="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatTile
          title="Completed Visits"
          value={stats.completedVisits}
          icon={Activity}
          iconBg="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatTile
          title="Active Prescriptions"
          value={stats.activePrescriptions}
          icon={Pill}
          iconBg="bg-purple-100 dark:bg-purple-900/20"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatTile
          title="Next Appointment"
          value={
            stats.nextAppointment
              ? formatDate(stats.nextAppointment.date)
              : 'None scheduled'
          }
          icon={Clock}
          iconBg="bg-orange-100 dark:bg-orange-900/20"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <Activity className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="appointments">
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="prescriptions">
                <Pill className="h-4 w-4 mr-2" />
                Prescriptions
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-6">
              <div className="space-y-6">
                {/* Upcoming Appointments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingAppointments.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No upcoming appointments</p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Book an Appointment
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcomingAppointments.slice(0, 3).map((apt) => (
                          <div
                            key={apt.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">
                                  {apt.doctor.name}
                                </h4>
                                <Badge
                                  className={getAppointmentStatusColor(apt.status)}
                                  variant="secondary"
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {apt.doctor.specialization}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(apt.date)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatTime(apt.time)}
                                </span>
                              </div>
                              {apt.reason && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Reason: {apt.reason}
                                </p>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Visits */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Visits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentVisits.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No recent visits</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {recentVisits.slice(0, 3).map((visit) => (
                          <div
                            key={visit.id}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{visit.doctor.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {visit.doctor.specialization}
                                </p>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(visit.date)}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>Chief Complaint:</strong> {visit.chiefComplaint}
                              </p>
                              {visit.diagnosis && visit.diagnosis.length > 0 && (
                                <p className="text-sm">
                                  <strong>Diagnosis:</strong> {visit.diagnosis.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Appointments Tab */}
            <TabsContent value="appointments" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{apt.doctor.name}</h4>
                            <Badge
                              className={getAppointmentStatusColor(apt.status)}
                              variant="secondary"
                            >
                              {apt.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {apt.doctor.specialization}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span>{formatDate(apt.date)}</span>
                            <span>{formatTime(apt.time)}</span>
                            <span className="text-muted-foreground">{apt.type}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Prescriptions Tab */}
            <TabsContent value="prescriptions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  {activePrescriptions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Pill className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No active prescriptions</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activePrescriptions.map((rx) => (
                        <div key={rx.id} className="p-4 border rounded-lg space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Prescription #{rx.id.slice(-6)}</h4>
                                <Badge
                                  className={getPrescriptionStatusColor(rx.status)}
                                  variant="secondary"
                                >
                                  {rx.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Prescribed by: {rx.doctor}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Date: {formatDate(rx.date)}
                              </p>
                            </div>
                          </div>
                          <Separator />
                          <div className="space-y-2">
                            <h5 className="font-medium text-sm">Medications:</h5>
                            {rx.medications.map((med, index) => (
                              <div key={index} className="pl-4 border-l-2 border-primary/20">
                                <p className="font-medium">{med.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {med.dosage} - {med.frequency}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Duration: {med.duration}
                                </p>
                                {med.instructions && (
                                  <p className="text-sm text-muted-foreground italic">
                                    {med.instructions}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Health Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{patient.gender}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(patient.dateOfBirth)}</p>
                </div>
              </div>
              {patient.bloodGroup && (
                <>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p className="font-medium">{patient.bloodGroup}</p>
                    </div>
                  </div>
                </>
              )}
              {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Chronic Conditions</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.chronicConditions.map((condition, i) => (
                        <Badge key={i} variant="outline">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {patient.emergencyContact && (
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{patient.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-medium">{patient.emergencyContact.relationship}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.emergencyContact.phone}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View Medical Records
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Pill className="h-4 w-4 mr-2" />
                Request Prescription Refill
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Update Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
