import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { 
  Search, 
  MapPin, 
  Languages, 
  Video,
  Clock,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';

interface AppointmentBookingProps {
  onContinue: (data: any) => void;
}

export function AppointmentBooking({ onContinue }: AppointmentBookingProps) {
  const [step, setStep] = useState<'search' | 'slots' | 'details'>('search');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    language: '',
    telehealth: false,
  });

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialty: 'Cardiologist',
      location: 'Main Hospital',
      languages: ['English', 'Spanish'],
      telehealth: true,
      rating: 4.8,
      availability: 'Available Today',
    },
    {
      id: 2,
      name: 'Dr. Michael Anderson',
      specialty: 'Internal Medicine',
      location: 'City Clinic',
      languages: ['English'],
      telehealth: true,
      rating: 4.9,
      availability: 'Available Tomorrow',
    },
  ];

  const timeSlots = [
    { time: '9:00 AM', available: true, fee: 150 },
    { time: '10:00 AM', available: true, fee: 150 },
    { time: '11:00 AM', available: false, fee: 150 },
    { time: '2:00 PM', available: true, fee: 150 },
    { time: '3:00 PM', available: true, fee: 150 },
    { time: '4:00 PM', available: true, fee: 150 },
  ];

  const handleSelectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setStep('slots');
  };

  const handleSelectSlot = (slot: any) => {
    setSelectedSlot(slot);
    setStep('details');
  };

  const handleConfirm = (patientDetails: any) => {
    onContinue({
      doctor: selectedDoctor,
      slot: selectedSlot,
      date,
      ...patientDetails,
    });
  };

  return (
    <div className="space-y-6">
      {step === 'search' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Find a Doctor</CardTitle>
              <CardDescription>
                Search by specialty, location, or doctor name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Doctor name or specialty..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <Select value={filters.specialty} onValueChange={(value) => setFilters({ ...filters, specialty: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All specialties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="internal">Internal Medicine</SelectItem>
                      <SelectItem value="pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">Main Hospital</SelectItem>
                      <SelectItem value="city">City Clinic</SelectItem>
                      <SelectItem value="north">North Branch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="telehealth"
                    checked={filters.telehealth}
                    onCheckedChange={(checked) => setFilters({ ...filters, telehealth: checked as boolean })}
                  />
                  <Label htmlFor="telehealth" className="flex items-center gap-2 cursor-pointer">
                    <Video className="h-4 w-4" />
                    Telehealth available
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:border-primary cursor-pointer transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3>{doctor.name}</h3>
                        <Badge variant="outline">{doctor.specialty}</Badge>
                        {doctor.telehealth && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Video className="h-3 w-3 mr-1" />
                            Telehealth
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Languages className="h-4 w-4" />
                          {doctor.languages.join(', ')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {doctor.availability}
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => handleSelectDoctor(doctor)}>
                      Book Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {step === 'slots' && selectedDoctor && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedDoctor.name}</CardTitle>
                  <CardDescription>{selectedDoctor.specialty}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setStep('search')}>
                  Change Doctor
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
                <CardDescription>
                  {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={selectedSlot?.time === slot.time ? 'default' : 'outline'}
                      className="flex flex-col h-auto py-3"
                      disabled={!slot.available}
                      onClick={() => handleSelectSlot(slot)}
                    >
                      <span>{slot.time}</span>
                      <span className="flex items-center gap-1 mt-1" style={{ fontSize: '0.75rem' }}>
                        <DollarSign className="h-3 w-3" />
                        {slot.fee}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {selectedSlot && (
            <Button className="w-full" onClick={() => setStep('details')}>
              Continue to Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {step === 'details' && (
        <PatientDetailsForm 
          doctor={selectedDoctor}
          slot={selectedSlot}
          date={date}
          onConfirm={handleConfirm}
          onBack={() => setStep('slots')}
        />
      )}
    </div>
  );
}

function PatientDetailsForm({ doctor, slot, date, onConfirm, onBack }: any) {
  const [details, setDetails] = useState({
    reason: '',
    insurance: '',
    consent: false,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>
            {doctor.name} - {date?.toLocaleDateString()} at {slot.time}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              placeholder="Brief description of your symptoms or concern..."
              value={details.reason}
              onChange={(e) => setDetails({ ...details, reason: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="insurance">Insurance Provider</Label>
            <Select value={details.insurance} onValueChange={(value) => setDetails({ ...details, insurance: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select insurance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue-cross">Blue Cross Blue Shield</SelectItem>
                <SelectItem value="aetna">Aetna</SelectItem>
                <SelectItem value="united">UnitedHealthcare</SelectItem>
                <SelectItem value="self-pay">Self Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="consent"
              checked={details.consent}
              onCheckedChange={(checked) => setDetails({ ...details, consent: checked as boolean })}
            />
            <Label htmlFor="consent" className="cursor-pointer leading-normal">
              I agree to the privacy policy and consent to share my medical information
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button 
          className="flex-1"
          disabled={!details.reason || !details.consent}
          onClick={() => onConfirm(details)}
        >
          Confirm Appointment
        </Button>
      </div>
    </>
  );
}
