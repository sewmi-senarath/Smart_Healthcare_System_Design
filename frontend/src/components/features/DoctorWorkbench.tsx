import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Save,
  Clipboard
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface DoctorWorkbenchProps {
  patient: any;
  triageData: any;
  onComplete: (data: any) => void;
}

export function DoctorWorkbench({ patient, triageData, onComplete }: DoctorWorkbenchProps) {
  const [soapNotes, setSoapNotes] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [newDiagnosis, setNewDiagnosis] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const addDiagnosis = () => {
    if (newDiagnosis.trim()) {
      setDiagnoses([...diagnoses, { 
        id: Date.now(), 
        code: 'ICD-10: J00',
        description: newDiagnosis,
        type: 'primary'
      }]);
      setNewDiagnosis('');
    }
  };

  const removeDiagnosis = (id: number) => {
    setDiagnoses(diagnoses.filter(d => d.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onComplete({
        soapNotes,
        diagnoses,
        procedures,
        orders
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - History & Triage */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                    Last Visit
                  </p>
                  <p>Oct 1, 2025 - Annual Checkup</p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                    Chronic Conditions
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Hypertension</Badge>
                    <Badge variant="outline">Type 2 Diabetes</Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                    Allergies
                  </p>
                  <Badge variant="destructive" className="mt-1">Penicillin</Badge>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Vitals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Temperature</span>
              <span>{triageData.temperature}°F</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blood Pressure</span>
              <span>{triageData.bloodPressureSystolic}/{triageData.bloodPressureDiastolic} mmHg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pulse</span>
              <span>{triageData.pulse} bpm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">SpO2</span>
              <span>{triageData.spo2}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight</span>
              <span>{triageData.weight} kg</span>
            </div>
            {triageData.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                    Nurse Notes
                  </p>
                  <p>{triageData.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Column - SOAP Notes & Clinical Data */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Consultation Note (SOAP)</CardTitle>
            <CardDescription>
              Document the consultation using SOAP format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="subjective" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="subjective">Subjective</TabsTrigger>
                <TabsTrigger value="objective">Objective</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="plan">Plan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="subjective" className="space-y-4">
                <Textarea
                  placeholder="Chief complaint, history of present illness, review of systems..."
                  rows={8}
                  value={soapNotes.subjective}
                  onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                />
              </TabsContent>
              
              <TabsContent value="objective" className="space-y-4">
                <Textarea
                  placeholder="Physical examination findings, vital signs, test results..."
                  rows={8}
                  value={soapNotes.objective}
                  onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                />
              </TabsContent>
              
              <TabsContent value="assessment" className="space-y-4">
                <Textarea
                  placeholder="Clinical impression, differential diagnoses..."
                  rows={8}
                  value={soapNotes.assessment}
                  onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                />
              </TabsContent>
              
              <TabsContent value="plan" className="space-y-4">
                <Textarea
                  placeholder="Treatment plan, follow-up, patient education..."
                  rows={8}
                  value={soapNotes.plan}
                  onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnosis (ICD-10)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search ICD-10 codes..."
                value={newDiagnosis}
                onChange={(e) => setNewDiagnosis(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDiagnosis()}
              />
              <Button onClick={addDiagnosis}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {diagnoses.map((diagnosis) => (
                <div key={diagnosis.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p>{diagnosis.description}</p>
                    <p className="text-muted-foreground mt-1" style={{ fontSize: '0.875rem' }}>
                      {diagnosis.code}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeDiagnosis(diagnosis.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders & Advice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Add order or advice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lab">Laboratory Test</SelectItem>
                <SelectItem value="imaging">Imaging Study</SelectItem>
                <SelectItem value="referral">Specialist Referral</SelectItem>
                <SelectItem value="followup">Follow-up Visit</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <Clipboard className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FileText className="mr-2 h-4 w-4" />
            {isSaving ? 'Completing...' : 'Complete & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
