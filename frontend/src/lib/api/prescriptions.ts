import apiClient from './client';

export interface Prescription {
  _id: string;
  prescriptionId: string;
  patientId: string | any;
  doctorId: string | any;
  visitId?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
  }>;
  status: 'draft' | 'signed' | 'sent-to-pharmacy' | 'dispensed' | 'cancelled';
  signedAt?: string;
  dispensedAt?: string;
  dispenseStatus?: 'full' | 'partial' | 'unable';
}

export const prescriptionsAPI = {
  // Get prescriptions
  getAll: async (params?: {
    patientId?: string;
    doctorId?: string;
    status?: string;
  }) => {
    const response = await apiClient.get('/prescriptions', { params });
    return response.data;
  },

  // Get prescription by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/prescriptions/${id}`);
    return response.data;
  },

  // Create prescription
  create: async (data: {
    patientId: string;
    visitId?: string;
    medications: Array<any>;
    notes?: string;
  }) => {
    const response = await apiClient.post('/prescriptions', data);
    return response.data;
  },

  // Sign prescription
  sign: async (id: string) => {
    const response = await apiClient.post(`/prescriptions/${id}/sign`);
    return response.data;
  },

  // Dispense prescription
  dispense: async (
    id: string,
    data: {
      dispenseStatus: 'full' | 'partial' | 'unable';
      dispenseNotes?: string;
      counselingChecklist: {
        dosageExplained: boolean;
        sideEffectsDiscussed: boolean;
        interactionsReviewed: boolean;
        storageInstructionsGiven: boolean;
      };
    }
  ) => {
    const response = await apiClient.post(`/prescriptions/${id}/dispense`, data);
    return response.data;
  },

  // Cancel prescription
  cancel: async (id: string) => {
    const response = await apiClient.post(`/prescriptions/${id}/cancel`);
    return response.data;
  },
};
