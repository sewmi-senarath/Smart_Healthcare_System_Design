import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Pill, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { cn } from '../ui/utils';

export interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  quantity?: number;
  dispenseStatus?: 'pending' | 'partial' | 'completed';
  inStock?: boolean;
  alternative?: string;
}

export interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  date: string;
  status: 'pending' | 'verified' | 'dispensed' | 'completed';
  items: PrescriptionItem[];
  allergies?: string[];
  warnings?: string[];
}

interface PrescriptionPanelProps {
  prescription: Prescription;
  onAction?: (action: 'verify' | 'dispense' | 'alternative', itemId?: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export function PrescriptionPanel({
  prescription,
  onAction,
  showActions = true,
  compact = false,
}: PrescriptionPanelProps) {
  const getStatusColor = (status: Prescription['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'dispensed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return '';
    }
  };

  const getDispenseStatusColor = (status?: PrescriptionItem['dispenseStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'partial':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>E-Prescription #{prescription.id}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{prescription.patientName}</span>
              <span>•</span>
              <span>ID: {prescription.patientId}</span>
            </div>
          </div>
          <Badge className={getStatusColor(prescription.status)} variant="secondary">
            {prescription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metadata */}
        {!compact && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Doctor:</span>
              <p className="font-medium">{prescription.doctorName}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date:</span>
              <p className="font-medium">{prescription.date}</p>
            </div>
          </div>
        )}

        {/* Allergies & Warnings */}
        {(prescription.allergies?.length || prescription.warnings?.length) && (
          <>
            <Separator />
            <div className="space-y-2">
              {prescription.allergies && prescription.allergies.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900 dark:text-red-100">
                      Allergies
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {prescription.allergies.join(', ')}
                    </p>
                  </div>
                </div>
              )}
              {prescription.warnings && prescription.warnings.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900 dark:text-yellow-100">
                      Warnings
                    </p>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside">
                      {prescription.warnings.map((warning, i) => (
                        <li key={i}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Medications */}
        <Separator />
        <div className="space-y-3">
          <h4 className="font-medium">Medications ({prescription.items.length})</h4>
          {prescription.items.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium">{item.medication}</h5>
                      {!item.inStock && (
                        <Badge variant="destructive" className="text-xs">
                          Out of Stock
                        </Badge>
                      )}
                      {item.dispenseStatus && (
                        <Badge className={getDispenseStatusColor(item.dispenseStatus)} variant="secondary">
                          {item.dispenseStatus}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Dosage:</span> {item.dosage}
                      </div>
                      <div>
                        <span className="font-medium">Frequency:</span> {item.frequency}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {item.duration}
                      </div>
                      {item.quantity && (
                        <div>
                          <span className="font-medium">Qty:</span> {item.quantity}
                        </div>
                      )}
                    </div>
                    {item.instructions && (
                      <p className="text-sm text-muted-foreground italic">
                        {item.instructions}
                      </p>
                    )}
                    {item.alternative && !item.inStock && (
                      <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>Alternative: {item.alternative}</span>
                      </div>
                    )}
                  </div>
                </div>
                {showActions && onAction && (
                  <div className="flex gap-2">
                    {!item.inStock && item.alternative && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAction('alternative', item.id)}
                      >
                        Use Alt.
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        {showActions && onAction && prescription.status !== 'completed' && (
          <>
            <Separator />
            <div className="flex gap-2">
              {prescription.status === 'pending' && (
                <Button onClick={() => onAction('verify')} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verify Prescription
                </Button>
              )}
              {prescription.status === 'verified' && (
                <Button onClick={() => onAction('dispense')} className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Dispense Medications
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
