import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Download, 
  Send, 
  CheckCircle2, 
  FileText, 
  Calendar,
  User,
  Stethoscope,
  Pill
} from 'lucide-react';

interface VisitSummaryProps {
  patient: any;
  triageData: any;
  consultationData: any;
  prescription?: any;
  onComplete: () => void;
}

export function VisitSummary({ 
  patient, 
  triageData, 
  consultationData, 
  prescription,
  onComplete 
}: VisitSummaryProps) {
  const visitDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const visitTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSendToPatient = () => {
    // Simulate sending to patient app
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
        <div>
          <h3 className="text-green-900 dark:text-green-100">Visit Completed Successfully</h3>
          <p className="text-green-700 dark:text-green-300" style={{ fontSize: '0.875rem' }}>
            Summary has been generated and is ready to share with the patient
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-muted/50">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Visit Summary</CardTitle>
              <p className="text-muted-foreground mt-2" style={{ fontSize: '0.875rem' }}>
                {visitDate} at {visitTime}
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Patient Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-primary" />
              <h4>Patient Information</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 pl-7">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Name</p>
                <p>{patient.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>MRN</p>
                <p>{patient.mrn}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Date of Birth</p>
                <p>{patient.dob}</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Phone</p>
                <p>{patient.phone}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Vital Signs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-5 w-5 text-primary" />
              <h4>Vital Signs</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pl-7">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Temperature</p>
                <p>{triageData.temperature}°F</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Blood Pressure</p>
                <p>{triageData.bloodPressureSystolic}/{triageData.bloodPressureDiastolic} mmHg</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Pulse</p>
                <p>{triageData.pulse} bpm</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>SpO2</p>
                <p>{triageData.spo2}%</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>Weight</p>
                <p>{triageData.weight} kg</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Diagnosis */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h4>Diagnosis</h4>
            </div>
            <div className="space-y-2 pl-7">
              {consultationData.diagnoses.map((diagnosis: any) => (
                <div key={diagnosis.id}>
                  <p>{diagnosis.description}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    {diagnosis.code}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assessment & Plan */}
          <div>
            <h4 className="mb-3">Assessment & Plan</h4>
            <div className="space-y-3 pl-4">
              {consultationData.soapNotes.assessment && (
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Assessment</p>
                  <p className="whitespace-pre-wrap">{consultationData.soapNotes.assessment}</p>
                </div>
              )}
              {consultationData.soapNotes.plan && (
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>Plan</p>
                  <p className="whitespace-pre-wrap">{consultationData.soapNotes.plan}</p>
                </div>
              )}
            </div>
          </div>

          {/* Prescription */}
          {prescription && prescription.medications.length > 0 && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="h-5 w-5 text-primary" />
                  <h4>Prescription</h4>
                </div>
                <div className="space-y-3 pl-7">
                  {prescription.medications.map((med: any, index: number) => (
                    <div key={med.id} className="p-3 bg-muted/50 rounded-lg">
                      <p className="mb-1">{index + 1}. {med.name} - {med.dosage}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        {med.frequency} for {med.duration}
                      </p>
                      {med.notes && (
                        <p className="text-muted-foreground mt-1" style={{ fontSize: '0.875rem' }}>
                          {med.notes}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <p className="text-blue-900 dark:text-blue-100" style={{ fontSize: '0.875rem' }}>
                      e-Prescription sent to pharmacy
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handlePrint}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button 
          className="flex-1"
          onClick={handleSendToPatient}
        >
          <Send className="mr-2 h-4 w-4" />
          Send to Patient App
        </Button>
      </div>
    </div>
  );
}
