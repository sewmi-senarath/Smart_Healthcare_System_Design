import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '../ui/utils';

export interface TimeSlot {
  time: string;
  available: boolean;
  doctor?: string;
  department?: string;
}

interface AppointmentCalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  timeSlots?: TimeSlot[];
  onSlotSelect?: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
  loading?: boolean;
}

export function AppointmentCalendar({
  selectedDate,
  onDateSelect,
  timeSlots = [],
  onSlotSelect,
  selectedSlot,
  loading = false,
}: AppointmentCalendarProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Select Date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle>
            Available Time Slots
            {selectedDate && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Select a date to view available slots</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No available slots for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {timeSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant={selectedSlot?.time === slot.time ? 'default' : 'outline'}
                  className={cn(
                    'justify-start',
                    !slot.available && 'opacity-50 cursor-not-allowed'
                  )}
                  disabled={!slot.available}
                  onClick={() => onSlotSelect?.(slot)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  {slot.time}
                </Button>
              ))}
            </div>
          )}

          {selectedSlot && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <h4 className="font-medium mb-2">Selected Slot</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedSlot.time}</span>
                </div>
                {selectedSlot.doctor && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doctor:</span>
                    <span className="font-medium">{selectedSlot.doctor}</span>
                  </div>
                )}
                {selectedSlot.department && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{selectedSlot.department}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
