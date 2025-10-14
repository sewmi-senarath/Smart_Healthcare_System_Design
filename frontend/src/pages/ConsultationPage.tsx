import React, { useState } from 'react';
import { DoctorWorkbench } from '../components/features/DoctorWorkbench';
import { PrescriptionForm } from '../components/features/PrescriptionForm';
import { VisitSummary } from '../components/features/VisitSummary';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Stethoscope } from 'lucide-react';

export function ConsultationPage() {
  const [step, setStep] = useState<'select' | 'workbench' | 'prescription' | 'summary'>('select');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [consultationData, setConsultationData] = useState<any>(null);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);

  const mockPatient = {
    id: 'P12345',
    name: 'John Doe',
    mrn: '12345',
    dob: '1990-05-15',
    phone: '+1234567890',
  };

  const mockTriageData = {
    temperature: '98.6',
    bloodPressureSystolic: '120',
    bloodPressureDiastolic: '80',
    pulse: '72',
    spo2: '98',
    weight: '70',
    notes: 'Patient appears stable, complaining of mild headache',
  };

  const queuedPatients = [
    {
      id: 1,
      name: 'John Doe',
      mrn: '12345',
      age: 35,
      reason: 'Annual checkup',
      waitTime: '15 min',
      priority: 'normal',
    },
    {
      id: 2,
      name: 'Jane Smith',
      mrn: '12346',
      age: 42,
      reason: 'Follow-up visit',
      waitTime: '8 min',
      priority: 'high',
    },
    {
      id: 3,
      name: 'Michael Brown',
      mrn: '12347',
      age: 28,
      reason: 'Cold symptoms',
      waitTime: '22 min',
      priority: 'normal',
    },
  ];

  const handleStartConsultation = (patient: any) => {
    setSelectedPatient(patient);
    setStep('workbench');
  };

  const handleWorkbenchComplete = (data: any) => {
    setConsultationData(data);
    setStep('prescription');
  };

  const handlePrescriptionSign = (data: any) => {
    setPrescriptionData(data);
    setStep('summary');
  };

  const handleSkipPrescription = () => {
    setPrescriptionData(null);
    setStep('summary');
  };

  const handleComplete = () => {
    setStep('select');
    setSelectedPatient(null);
    setConsultationData(null);
    setPrescriptionData(null);
  };

  return (
    <div className="space-y-6">
      {step === 'select' && (
        <>
          <div>
            <h1>Consultation</h1>
            <p className="text-muted-foreground mt-1">
              Select a patient to begin consultation
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Queue</CardTitle>
              <CardDescription>
                Patients waiting for consultation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queuedPatients.map((patient) => (
                  <div 
                    key={patient.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => handleStartConsultation(patient)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-1 px-3 py-2 bg-muted rounded-lg">
                        <span className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>
                          Wait
                        </span>
                        <span>{patient.waitTime}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p>{patient.name}</p>
                          {patient.priority === 'high' && (
                            <Badge variant="destructive">Priority</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                          MRN: {patient.mrn} • Age: {patient.age} • {patient.reason}
                        </p>
                      </div>
                    </div>
                    <Button>
                      <Stethoscope className="mr-2 h-4 w-4" />
                      Start Consultation
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {step === 'workbench' && selectedPatient && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1>Consultation - {selectedPatient.name}</h1>
              <p className="text-muted-foreground mt-1">
                MRN: {selectedPatient.mrn}
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              In Progress
            </Badge>
          </div>

          <DoctorWorkbench
            patient={mockPatient}
            triageData={mockTriageData}
            onComplete={handleWorkbenchComplete}
          />
        </>
      )}

      {step === 'prescription' && selectedPatient && (
        <>
          <div>
            <h1>e-Prescription</h1>
            <p className="text-muted-foreground mt-1">
              Add medications for {selectedPatient.name}
            </p>
          </div>

          <PrescriptionForm
            patient={mockPatient}
            onSign={handlePrescriptionSign}
            onSkip={handleSkipPrescription}
          />
        </>
      )}

      {step === 'summary' && selectedPatient && consultationData && (
        <>
          <div>
            <h1>Visit Summary</h1>
            <p className="text-muted-foreground mt-1">
              Review and finalize consultation for {selectedPatient.name}
            </p>
          </div>

          <VisitSummary
            patient={mockPatient}
            triageData={mockTriageData}
            consultationData={consultationData}
            prescription={prescriptionData}
            onComplete={handleComplete}
          />
        </>
      )}
    </div>
  );
}
