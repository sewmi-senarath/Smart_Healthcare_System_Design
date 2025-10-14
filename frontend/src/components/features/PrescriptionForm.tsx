import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { 
  Plus, 
  Trash2, 
  FileSignature, 
  AlertTriangle 
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';

interface PrescriptionFormProps {
  patient: any;
  onSign: (prescription: any) => void;
  onSkip: () => void;
}

interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

export function PrescriptionForm({ patient, onSign, onSkip }: PrescriptionFormProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentMed, setCurrentMed] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: '',
  });

  const addMedication = () => {
    if (currentMed.name && currentMed.dosage && currentMed.frequency && currentMed.duration) {
      setMedications([...medications, { 
        id: Date.now(), 
        ...currentMed 
      }]);
      setCurrentMed({
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        notes: '',
      });
    }
  };

  const removeMedication = (id: number) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleSign = () => {
    onSign({
      medications,
      patient: patient.name,
      patientId: patient.id,
      date: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Allergy Alert */}
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <span>Patient Allergies: </span>
          <Badge variant="destructive" className="ml-2">Penicillin</Badge>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>e-Prescription</CardTitle>
          <CardDescription>
            Add medications for {patient.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="medication">Medication Name *</Label>
              <Input
                id="medication"
                placeholder="Search medication..."
                value={currentMed.name}
                onChange={(e) => setCurrentMed({ ...currentMed, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage *</Label>
              <Input
                id="dosage"
                placeholder="e.g., 500mg"
                value={currentMed.dosage}
                onChange={(e) => setCurrentMed({ ...currentMed, dosage: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select 
                value={currentMed.frequency}
                onValueChange={(value) => setCurrentMed({ ...currentMed, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once-daily">Once daily</SelectItem>
                  <SelectItem value="twice-daily">Twice daily</SelectItem>
                  <SelectItem value="three-times-daily">Three times daily</SelectItem>
                  <SelectItem value="four-times-daily">Four times daily</SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Input
                id="duration"
                placeholder="e.g., 7 days"
                value={currentMed.duration}
                onChange={(e) => setCurrentMed({ ...currentMed, duration: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Special Instructions</Label>
              <Textarea
                id="notes"
                placeholder="e.g., Take with food, avoid alcohol..."
                rows={2}
                value={currentMed.notes}
                onChange={(e) => setCurrentMed({ ...currentMed, notes: e.target.value })}
              />
            </div>
          </div>

          <Button 
            onClick={addMedication}
            variant="outline"
            className="w-full"
            disabled={!currentMed.name || !currentMed.dosage || !currentMed.frequency || !currentMed.duration}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add to Prescription
          </Button>
        </CardContent>
      </Card>

      {medications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Prescription Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {medications.map((med, index) => (
              <div key={med.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p>{index + 1}. {med.name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                      <p>Dosage: {med.dosage}</p>
                      <p>Frequency: {med.frequency}</p>
                      <p>Duration: {med.duration}</p>
                    </div>
                    {med.notes && (
                      <p className="text-muted-foreground mt-2" style={{ fontSize: '0.875rem' }}>
                        Notes: {med.notes}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeMedication(med.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onSkip}
        >
          Skip Prescription
        </Button>
        <Button 
          className="flex-1"
          onClick={handleSign}
          disabled={medications.length === 0}
        >
          <FileSignature className="mr-2 h-4 w-4" />
          Sign & Send
        </Button>
      </div>
    </div>
  );
}
