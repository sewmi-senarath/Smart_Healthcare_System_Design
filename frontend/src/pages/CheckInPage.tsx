import React, { useState } from 'react';
import { CheckInScanner } from '../components/features/CheckInScanner';
import { TriageForm } from '../components/features/TriageForm';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

export function CheckInPage() {
  const [step, setStep] = useState<'verify' | 'appointment' | 'triage' | 'complete'>('verify');
  const [patient, setPatient] = useState<any>(null);
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [triageData, setTriageData] = useState<any>(null);

  const handlePatientVerified = (verifiedPatient: any) => {
    setPatient(verifiedPatient);
    // Simulate checking for appointment
    setTimeout(() => {
      setHasAppointment(true); // or false for walk-in
      setStep('appointment');
    }, 1000);
  };

  const handleAppointmentCheck = (hasApt: boolean) => {
    setHasAppointment(hasApt);
    setStep('triage');
  };

  const handleTriageComplete = (data: any) => {
    setTriageData(data);
    setStep('complete');
  };

  const handleReset = () => {
    setStep('verify');
    setPatient(null);
    setHasAppointment(null);
    setTriageData(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1>Patient Check-In</h1>
        <p className="text-muted-foreground mt-1">
          Verify patient identity and record vital signs
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {['Verify Identity', 'Check Appointment', 'Record Vitals', 'Complete'].map((label, index) => {
          const stepNumber = index + 1;
          const isActive = 
            (step === 'verify' && stepNumber === 1) ||
            (step === 'appointment' && stepNumber === 2) ||
            (step === 'triage' && stepNumber === 3) ||
            (step === 'complete' && stepNumber === 4);
          const isCompleted = 
            (step === 'appointment' && stepNumber === 1) ||
            (step === 'triage' && stepNumber <= 2) ||
            (step === 'complete' && stepNumber <= 3);

          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground' 
                    : isActive 
                    ? 'bg-primary/20 text-primary border-2 border-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : stepNumber}
                </div>
                <p className={`mt-2 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} style={{ fontSize: '0.75rem' }}>
                  {label}
                </p>
              </div>
              {index < 3 && (
                <div className={`flex-1 h-0.5 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      {step === 'verify' && (
        <CheckInScanner onVerified={handlePatientVerified} />
      )}

      {step === 'appointment' && patient && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-6 mb-4">
                <CheckCircle2 className="h-16 w-16 text-blue-600" />
              </div>
              <h2 className="mb-2">Patient Verified</h2>
              <p className="text-muted-foreground mb-6">
                {patient.name} - MRN: {patient.mrn}
              </p>

              {hasAppointment !== null && (
                <div className="w-full max-w-md mb-6">
                  {hasAppointment ? (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600 dark:text-green-400">
                        Patient has an appointment today at 10:00 AM with Dr. Wilson
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-600 dark:text-orange-400">
                        No appointment found. Creating walk-in visit.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <Button 
                size="lg"
                onClick={() => handleAppointmentCheck(hasAppointment || false)}
              >
                Continue to Triage
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'triage' && patient && (
        <TriageForm 
          patientName={patient.name}
          onSubmit={handleTriageComplete}
        />
      )}

      {step === 'complete' && patient && triageData && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="mb-2">Check-In Complete</h2>
              <p className="text-muted-foreground mb-6">
                {patient.name} has been checked in and is ready for consultation
              </p>
              <div className="flex gap-3 w-full max-w-md">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  New Check-In
                </Button>
                <Button className="flex-1">
                  View Queue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
