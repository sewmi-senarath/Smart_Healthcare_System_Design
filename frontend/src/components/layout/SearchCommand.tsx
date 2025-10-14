import React, { useState } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Search, User, Calendar, Pill } from 'lucide-react';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search patients, appointments, prescriptions..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Patients">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>John Doe - MRN: 12345</span>
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Jane Smith - MRN: 12346</span>
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Michael Brown - MRN: 12347</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Appointments">
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Today 10:00 AM - Dr. Wilson</span>
          </CommandItem>
          <CommandItem>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Tomorrow 2:00 PM - Dr. Anderson</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Prescriptions">
          <CommandItem>
            <Pill className="mr-2 h-4 w-4" />
            <span>Rx #54321 - John Doe</span>
          </CommandItem>
          <CommandItem>
            <Pill className="mr-2 h-4 w-4" />
            <span>Rx #54322 - Jane Smith</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
