import React, { useState } from 'react';
import { PlanningDashboard } from '../components/features/PlanningDashboard';
import { WeeklyPlanner } from '../components/features/WeeklyPlanner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export function PlanningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Planning & Resources</h1>
        <p className="text-muted-foreground mt-1">
          Manage weekly schedules and resource allocation
        </p>
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="planner">Weekly Planner</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <PlanningDashboard />
        </TabsContent>

        <TabsContent value="planner" className="mt-6">
          <WeeklyPlanner />
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <div className="text-center py-12 text-muted-foreground">
            Resource allocation interface coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
