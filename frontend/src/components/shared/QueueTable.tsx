import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Clock, User, AlertCircle } from 'lucide-react';
import { cn } from '../ui/utils';

export interface QueueItem {
  id: string;
  patientName: string;
  patientId: string;
  status: 'waiting' | 'ready' | 'in-progress' | 'completed';
  priority?: 'normal' | 'urgent' | 'emergency';
  waitTime?: number;
  notes?: string;
  triageData?: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
  };
}

interface QueueTableProps {
  items: QueueItem[];
  onAction?: (id: string, action: string) => void;
  actionLabel?: string;
  showTriageData?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export function QueueTable({
  items,
  onAction,
  actionLabel = 'Start',
  showTriageData = false,
  loading = false,
  emptyMessage = 'No patients in queue',
}: QueueTableProps) {
  const getStatusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority?: QueueItem['priority']) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Status</TableHead>
                {showTriageData && <TableHead>Vitals</TableHead>}
                <TableHead>Wait Time</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{item.patientName}</p>
                        <p className="text-sm text-muted-foreground">ID: {item.patientId}</p>
                      </div>
                      {item.priority && item.priority !== 'normal' && (
                        <Badge className={getPriorityColor(item.priority)} variant="secondary">
                          {item.priority}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)} variant="secondary">
                      {item.status.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  {showTriageData && (
                    <TableCell>
                      {item.triageData ? (
                        <div className="text-sm space-y-1">
                          {item.triageData.temperature && (
                            <div>Temp: {item.triageData.temperature}</div>
                          )}
                          {item.triageData.bloodPressure && (
                            <div>BP: {item.triageData.bloodPressure}</div>
                          )}
                          {item.triageData.heartRate && (
                            <div>HR: {item.triageData.heartRate}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    {item.waitTime ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{item.waitTime} min</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {item.notes ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground max-w-[200px] truncate">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{item.notes}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {onAction && item.status !== 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => onAction(item.id, 'start')}
                        disabled={item.status === 'in-progress'}
                      >
                        {item.status === 'in-progress' ? 'In Progress' : actionLabel}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
