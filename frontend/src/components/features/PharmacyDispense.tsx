import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { 
  Search, 
  ScanLine, 
  AlertTriangle, 
  CheckCircle2,
  Package,
  XCircle,
  ClipboardCheck
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';

export function PharmacyDispense() {
  const [step, setStep] = useState<'search' | 'review' | 'dispense' | 'complete'>('search');
  const [rxId, setRxId] = useState('');
  const [prescription, setPrescription] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [counselingChecklist, setCounselingChecklist] = useState({
    dosage: false,
    sideEffects: false,
    interactions: false,
    storage: false,
  });
  const [dispenseStatus, setDispenseStatus] = useState<'full' | 'partial' | 'unable'>('full');
  const [reason, setReason] = useState('');

  const mockPrescription = {
    id: 'RX-54321',
    patient: {
      name: 'John Doe',
      mrn: '12345',
      allergies: ['Penicillin'],
    },
    doctor: 'Dr. Sarah Wilson',
    date: '2025-10-14',
    medications: [
      { 
        id: 1, 
        name: 'Amoxicillin 500mg', 
        dosage: '500mg', 
        frequency: 'three-times-daily',
        duration: '7 days',
        quantity: 21,
        inStock: true,
        stockQuantity: 50,
      },
      { 
        id: 2, 
        name: 'Ibuprofen 200mg', 
        dosage: '200mg', 
        frequency: 'as-needed',
        duration: '30 days',
        quantity: 60,
        inStock: true,
        stockQuantity: 100,
      },
      { 
        id: 3, 
        name: 'Lisinopril 10mg', 
        dosage: '10mg', 
        frequency: 'once-daily',
        duration: '30 days',
        quantity: 30,
        inStock: false,
        stockQuantity: 0,
      },
    ],
  };

  const handleSearch = () => {
    if (rxId.trim()) {
      setPrescription(mockPrescription);
      setSelectedItems(mockPrescription.medications.filter(m => m.inStock).map(m => m.id));
      setStep('review');
    }
  };

  const handleDispense = () => {
    setStep('dispense');
  };

  const handleComplete = () => {
    const allChecked = Object.values(counselingChecklist).every(v => v);
    if (allChecked) {
      setStep('complete');
    }
  };

  const toggleItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {step === 'search' && (
        <Card>
          <CardHeader>
            <CardTitle>Retrieve e-Prescription</CardTitle>
            <CardDescription>
              Search by prescription ID, QR code, or patient information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
              >
                <ScanLine className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
              >
                <Search className="mr-2 h-4 w-4" />
                Search Patient
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="rxId">Prescription ID</Label>
              <div className="flex gap-2">
                <Input
                  id="rxId"
                  placeholder="RX-54321"
                  value={rxId}
                  onChange={(e) => setRxId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'review' && prescription && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Prescription Details</CardTitle>
                  <CardDescription>
                    {prescription.id} - {prescription.date}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setStep('search')}>
                  Change Rx
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                    Patient
                  </p>
                  <p>{prescription.patient.name}</p>
                  <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                    MRN: {prescription.patient.mrn}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1" style={{ fontSize: '0.875rem' }}>
                    Prescribing Doctor
                  </p>
                  <p>{prescription.doctor}</p>
                </div>
              </div>

              {prescription.patient.allergies.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <span>Patient Allergies: </span>
                    {prescription.patient.allergies.map((allergy: string) => (
                      <Badge key={allergy} variant="destructive" className="ml-2">
                        {allergy}
                      </Badge>
                    ))}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stock Check</CardTitle>
              <CardDescription>
                Verify availability and select items to dispense
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {prescription.medications.map((med: any) => (
                <div 
                  key={med.id} 
                  className={`p-4 border rounded-lg ${!med.inStock ? 'bg-red-50 dark:bg-red-900/10 border-red-200' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    {med.inStock && (
                      <Checkbox
                        checked={selectedItems.includes(med.id)}
                        onCheckedChange={() => toggleItem(med.id)}
                        className="mt-1"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p>{med.name}</p>
                        {med.inStock ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Package className="h-3 w-3 mr-1" />
                            In Stock ({med.stockQuantity})
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-muted-foreground" style={{ fontSize: '0.875rem' }}>
                        <p>Dosage: {med.dosage}</p>
                        <p>Frequency: {med.frequency}</p>
                        <p>Duration: {med.duration}</p>
                        <p>Quantity: {med.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setStep('search')}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleDispense}
              disabled={selectedItems.length === 0}
            >
              Continue to Dispense
            </Button>
          </div>
        </>
      )}

      {step === 'dispense' && prescription && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Counseling Checklist</CardTitle>
              <CardDescription>
                Ensure patient understands medication usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries({
                dosage: 'Explained dosage and administration',
                sideEffects: 'Discussed potential side effects',
                interactions: 'Reviewed drug interactions and precautions',
                storage: 'Provided storage instructions',
              }).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={counselingChecklist[key as keyof typeof counselingChecklist]}
                    onCheckedChange={(checked) =>
                      setCounselingChecklist({
                        ...counselingChecklist,
                        [key]: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor={key} className="cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispense Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Outcome</Label>
                <Select value={dispenseStatus} onValueChange={(value: any) => setDispenseStatus(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Dispense</SelectItem>
                    <SelectItem value="partial">Partial Dispense</SelectItem>
                    <SelectItem value="unable">Unable to Dispense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dispenseStatus !== 'full' && (
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Explain reason for partial/unable to dispense..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setStep('review')}
            >
              Back
            </Button>
            <Button 
              className="flex-1"
              onClick={handleComplete}
              disabled={!Object.values(counselingChecklist).every(v => v) || 
                       (dispenseStatus !== 'full' && !reason.trim())}
            >
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Complete Dispense
            </Button>
          </div>
        </>
      )}

      {step === 'complete' && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <h2 className="mb-2">Dispense Completed</h2>
              <p className="text-muted-foreground mb-6">
                {dispenseStatus === 'full' 
                  ? 'All medications have been dispensed successfully'
                  : `Prescription ${dispenseStatus} dispensed`}
              </p>
              <div className="flex gap-3 w-full max-w-md">
                <Button variant="outline" className="flex-1">
                  Print Receipt
                </Button>
                <Button className="flex-1" onClick={() => {
                  setStep('search');
                  setRxId('');
                  setPrescription(null);
                }}>
                  New Prescription
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
