import apiClient from './client';

export interface Visit {
  _id: string;
  visitId: string;
  patientId: string | any;
  appointmentId?: string;
  type: 'scheduled' | 'walk-in' | 'emergency';
  status: 'checked-in' | 'triaged' | 'in-consultation' | 'completed' | 'cancelled';
  checkInTime: string;
  triage?: {
    vitals: {
      temperature?: { value: number; unit: string };
      bloodPressure?: { systolic: number; diastolic: number };
      pulse?: number;
      spO2?: number;
      weight?: { value: number; unit: string };
    };
    notes?: string;
  };
  consultation?: {
    soapNotes?: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
    diagnoses?: Array<{
      code: string;
      description: string;
      type: 'primary' | 'secondary';
    }>;
  };
}

export const visitsAPI = {
  // Create visit
  create: async (data: {
    patientId: string;
    appointmentId?: string;
    type: 'scheduled' | 'walk-in' | 'emergency';
  }) => {
    const response = await apiClient.post('/visits', data);
    return response.data;
  },

  // Get visit by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/visits/${id}`);
    return response.data;
  },

  // Update visit
  update: async (id: string, data: Partial<Visit>) => {
    const response = await apiClient.patch(`/visits/${id}`, data);
    return response.data;
  },

  // Add triage data
  addTriage: async (id: string, data: any) => {
    const response = await apiClient.post(`/visits/${id}/triage`, data);
    return response.data;
  },

  // Add consultation data
  addConsultation: async (id: string, data: any) => {
    const response = await apiClient.post(`/visits/${id}/consultation`, data);
    return response.data;
  },

  // Complete visit
  complete: async (id: string) => {
    const response = await apiClient.post(`/visits/${id}/complete`);
    return response.data;
  },

  // Get visit queue
  getQueue: async () => {
    const response = await apiClient.get('/visits/queue');
    return response.data;
  },
};
