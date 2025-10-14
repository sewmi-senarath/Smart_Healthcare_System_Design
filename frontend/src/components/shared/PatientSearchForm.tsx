import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Scan, User, Calendar, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface PatientSearchFormProps {
  onSearch: (searchData: {
    type: 'id' | 'name' | 'phone' | 'scan';
    value: string;
  }) => void;
  loading?: boolean;
  error?: string;
}

export function PatientSearchForm({ onSearch, loading, error }: PatientSearchFormProps) {
  const [searchType, setSearchType] = useState<'id' | 'name' | 'phone' | 'scan'>('id');
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch({ type: searchType, value: searchValue.trim() });
    }
  };

  const handleScan = () => {
    // Simulate scan - in real app, this would use a barcode/QR scanner
    onSearch({ type: 'scan', value: 'SCANNED_ID_12345' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={searchType} onValueChange={(v) => setSearchType(v as any)}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="id">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">ID</span>
            </TabsTrigger>
            <TabsTrigger value="name">
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Name</span>
            </TabsTrigger>
            <TabsTrigger value="phone">
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Phone</span>
            </TabsTrigger>
            <TabsTrigger value="scan">
              <Scan className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Scan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="id">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-id">Patient ID</Label>
                <Input
                  id="patient-id"
                  placeholder="Enter patient ID"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !searchValue.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="name">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Patient Name</Label>
                <Input
                  id="patient-name"
                  placeholder="Enter patient name"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !searchValue.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-phone">Phone Number</Label>
                <Input
                  id="patient-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !searchValue.trim()}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="scan">
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center">
                <Scan className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Position the patient's ID card or QR code in front of the scanner
                </p>
                <Button onClick={handleScan} disabled={loading}>
                  {loading ? 'Scanning...' : 'Start Scan'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Or use manual search above
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
