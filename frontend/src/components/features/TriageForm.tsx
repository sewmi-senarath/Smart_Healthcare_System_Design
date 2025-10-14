import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Save, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface TriageFormProps {
  patientName: string;
  onSubmit: (data: any) => void;
}

export function TriageForm({ patientName, onSubmit }: TriageFormProps) {
  const [formData, setFormData] = useState({
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    pulse: '',
    spo2: '',
    weight: '',
    notes: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => {
        onSubmit(formData);
      }, 1000);
    }, 1500);
  };

  const isValid = formData.temperature && formData.bloodPressureSystolic && 
                  formData.bloodPressureDiastolic && formData.pulse && 
                  formData.spo2 && formData.weight;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Triage Assessment</CardTitle>
          <CardDescription>
            Record vital signs for {patientName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°F) *</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Blood Pressure (mmHg) *</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="120"
                  value={formData.bloodPressureSystolic}
                  onChange={(e) => handleInputChange('bloodPressureSystolic', e.target.value)}
                />
                <span className="flex items-center">/</span>
                <Input
                  type="number"
                  placeholder="80"
                  value={formData.bloodPressureDiastolic}
                  onChange={(e) => handleInputChange('bloodPressureDiastolic', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pulse">Pulse (bpm) *</Label>
              <Input
                id="pulse"
                type="number"
                placeholder="72"
                value={formData.pulse}
                onChange={(e) => handleInputChange('pulse', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spo2">SpO2 (%) *</Label>
              <Input
                id="spo2"
                type="number"
                placeholder="98"
                value={formData.spo2}
                onChange={(e) => handleInputChange('spo2', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70.5"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Nursing Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional observations or concerns..."
              rows={4}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary cursor-pointer transition-colors">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-muted-foreground mt-1" style={{ fontSize: '0.875rem' }}>
                PDF, PNG, JPG up to 10MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSuccess && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 dark:text-green-400">
            Triage data saved successfully
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => handleInputChange('', '')}
        >
          Cancel
        </Button>
        <Button 
          className="flex-1"
          onClick={handleSubmit}
          disabled={!isValid || isSaving}
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
}
