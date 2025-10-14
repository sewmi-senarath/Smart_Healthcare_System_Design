import React from 'react';
import { PharmacyDispense } from '../components/features/PharmacyDispense';

export function PharmacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1>Pharmacy</h1>
        <p className="text-muted-foreground mt-1">
          Retrieve and dispense e-prescriptions
        </p>
      </div>

      <PharmacyDispense />
    </div>
  );
}
