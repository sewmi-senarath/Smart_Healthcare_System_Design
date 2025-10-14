import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Users, 
  CalendarClock, 
  AlertTriangle, 
  TrendingUp,
  Activity
} from 'lucide-react';

export function PlanningDashboard() {
  const kpis = [
    {
      label: 'Utilization Rate',
      value: '87%',
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600',
    },
    {
      label: 'Overbook Risk',
      value: '12%',
      change: '-3%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
    {
      label: 'Active Providers',
      value: '24',
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      label: 'Total Slots',
      value: '456',
      change: '+12',
      trend: 'up',
      icon: CalendarClock,
      color: 'text-purple-600',
    },
  ];

  const staffingGaps = [
    { day: 'Monday', department: 'Cardiology', severity: 'low' },
    { day: 'Wednesday', department: 'Pediatrics', severity: 'high' },
    { day: 'Friday', department: 'Orthopedics', severity: 'medium' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                      {kpi.label}
                    </p>
                    <h2 className="mb-2">{kpi.value}</h2>
                    <div className="flex items-center gap-1">
                      <TrendingUp className={`h-4 w-4 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} style={{ fontSize: '0.875rem' }}>
                        {kpi.change}
                      </span>
                      <span className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        from last week
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-3 bg-muted/50 ${kpi.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Staffing Gaps</CardTitle>
            <CardDescription>Identified gaps for next week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staffingGaps.map((gap, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p>{gap.day} - {gap.department}</p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: '0.875rem' }}>
                      Coverage needed
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${
                    gap.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                    gap.severity === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                  }`} style={{ fontSize: '0.75rem' }}>
                    {gap.severity.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest planning updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                <div>
                  <p>Weekly plan published</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Next week's schedule is now live
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                    2 hours ago
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                <div>
                  <p>Dr. Wilson's schedule updated</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Added 5 new slots on Thursday
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                    5 hours ago
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                <div>
                  <p>Conflict resolved</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    Room allocation conflict in Pediatrics
                  </p>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '0.75rem' }}>
                    1 day ago
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
