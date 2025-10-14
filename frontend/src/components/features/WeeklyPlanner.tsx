import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Calendar, 
  Plus, 
  Edit, 
  AlertTriangle,
  CheckCircle2,
  Send
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export function WeeklyPlanner() {
  const [planStatus, setPlanStatus] = useState<'draft' | 'published'>('draft');
  const [conflicts, setConflicts] = useState(2);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['8:00 AM', '10:00 AM', '2:00 PM', '4:00 PM'];
  
  const doctors = [
    { id: 1, name: 'Dr. Wilson', color: 'bg-blue-100 border-blue-300 text-blue-900' },
    { id: 2, name: 'Dr. Anderson', color: 'bg-green-100 border-green-300 text-green-900' },
    { id: 3, name: 'Dr. Martinez', color: 'bg-purple-100 border-purple-300 text-purple-900' },
  ];

  const handlePublish = () => {
    setPlanStatus('published');
    setConflicts(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Weekly Schedule Planner</h2>
          <p className="text-muted-foreground mt-1">
            Oct 21-27, 2025
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={planStatus === 'published' ? 'default' : 'outline'}>
            {planStatus === 'published' ? 'Published' : 'Draft'}
          </Badge>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Change Week
          </Button>
          <Button onClick={handlePublish} disabled={conflicts > 0 || planStatus === 'published'}>
            <Send className="mr-2 h-4 w-4" />
            {planStatus === 'published' ? 'Published' : 'Publish Plan'}
          </Button>
        </div>
      </div>

      {conflicts > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {conflicts} conflict{conflicts > 1 ? 's' : ''} detected. Please resolve before publishing.
          </AlertDescription>
        </Alert>
      )}

      {planStatus === 'published' && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 dark:text-green-400">
            Weekly plan has been published. Staff members have been notified.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Schedule Grid</CardTitle>
          <CardDescription>
            Drag and drop to assign doctors to time slots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="p-3"></div>
                {days.map((day) => (
                  <div key={day} className="p-3 text-center">
                    <p>{day.slice(0, 3)}</p>
                  </div>
                ))}
              </div>

              {timeSlots.map((time, timeIndex) => (
                <div key={time} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="p-3 flex items-center">
                    <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                      {time}
                    </p>
                  </div>
                  {days.map((day, dayIndex) => {
                    const hasAssignment = (timeIndex + dayIndex) % 3 === 0;
                    const doctor = hasAssignment ? doctors[(timeIndex + dayIndex) % doctors.length] : null;
                    const hasConflict = dayIndex === 2 && timeIndex === 1;

                    return (
                      <div
                        key={day}
                        className={`min-h-[80px] p-2 border-2 border-dashed rounded-lg transition-colors ${
                          hasConflict ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :
                          hasAssignment ? `${doctor?.color} border-solid` :
                          'border-muted hover:border-primary hover:bg-accent'
                        }`}
                      >
                        {hasAssignment && doctor && (
                          <div className="flex flex-col gap-1">
                            <p style={{ fontSize: '0.875rem' }}>{doctor.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                              Room 102
                            </p>
                            <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                              6 slots
                            </p>
                            {hasConflict && (
                              <Badge variant="destructive" className="mt-1" style={{ fontSize: '0.625rem' }}>
                                Conflict
                              </Badge>
                            )}
                          </div>
                        )}
                        {!hasAssignment && (
                          <Button variant="ghost" size="sm" className="w-full h-full opacity-0 hover:opacity-100">
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Settings</CardTitle>
          <CardDescription>
            Configure default slot settings for the week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.875rem' }}>
                Default Slot Length
              </p>
              <h4>15 minutes</h4>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.875rem' }}>
                Average Capacity
              </p>
              <h4>24 patients/day</h4>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground mb-2" style={{ fontSize: '0.875rem' }}>
                Buffer Time
              </p>
              <h4>5 minutes</h4>
            </div>
          </div>
          <Button variant="outline" className="mt-4">
            <Edit className="mr-2 h-4 w-4" />
            Edit Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
