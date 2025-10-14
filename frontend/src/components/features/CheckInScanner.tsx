import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ScanLine, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface CheckInScannerProps {
  onVerified: (patient: any) => void;
}

export function CheckInScanner({ onVerified }: CheckInScannerProps) {
  const [scanMode, setScanMode] = useState<'scanner' | 'manual'>('scanner');
  const [isScanning, setIsScanning] = useState(false);
  const [manualSearch, setManualSearch] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      setVerificationStatus('success');
      setTimeout(() => {
        onVerified({
          id: 'P12345',
          name: 'John Doe',
          mrn: '12345',
          dob: '1990-05-15',
          phone: '+1234567890'
        });
      }, 1000);
    }, 2000);
  };

  const handleManualSearch = () => {
    if (!manualSearch.trim()) {
      setVerificationStatus('error');
      setErrorMessage('Please enter a search term');
      return;
    }

    setVerificationStatus('success');
    setTimeout(() => {
      onVerified({
        id: 'P12345',
        name: 'John Doe',
        mrn: '12345',
        dob: '1990-05-15',
        phone: '+1234567890'
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          variant={scanMode === 'scanner' ? 'default' : 'outline'}
          onClick={() => setScanMode('scanner')}
          className="flex-1"
        >
          <ScanLine className="mr-2 h-4 w-4" />
          Scan Card
        </Button>
        <Button
          variant={scanMode === 'manual' ? 'default' : 'outline'}
          onClick={() => setScanMode('manual')}
          className="flex-1"
        >
          <Search className="mr-2 h-4 w-4" />
          Manual Search
        </Button>
      </div>

      {scanMode === 'scanner' && (
        <Card>
          <CardHeader>
            <CardTitle>Scan Patient Card</CardTitle>
            <CardDescription>
              Please scan the patient's digital health card or QR code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className={`rounded-lg border-2 border-dashed p-12 ${isScanning ? 'border-primary animate-pulse' : 'border-muted-foreground'}`}>
                <ScanLine className={`h-24 w-24 ${isScanning ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <p className="text-muted-foreground mt-4">
                {isScanning ? 'Scanning card...' : 'Position card in scanner area'}
              </p>
              <Button 
                onClick={handleScan} 
                disabled={isScanning}
                className="mt-6"
              >
                {isScanning ? 'Scanning...' : 'Start Scan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {scanMode === 'manual' && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Patient Search</CardTitle>
            <CardDescription>
              Search by name, MRN, phone number, or date of birth
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Patient</Label>
              <Input
                id="search"
                placeholder="Enter name, MRN, or phone..."
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
              />
            </div>
            <Button onClick={handleManualSearch} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Search Patient
            </Button>
          </CardContent>
        </Card>
      )}

      {verificationStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 dark:text-green-400">
            Patient identity verified successfully
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage || 'Unable to verify patient identity. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
