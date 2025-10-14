import apiClient from './client';

export interface Patient {
  _id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bloodType?: string;
  allergies?: Array<{
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  chronicConditions?: Array<{
    condition: string;
    diagnosedDate: string;
    status: 'active' | 'controlled' | 'resolved';
  }>;
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
  age?: number;
  isActive: boolean;
}

export const patientsAPI = {
  // Get all patients
  getAll: async (params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/patients', { params });
    return response.data;
  },

  // Get patient by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  // Create patient
  create: async (data: Partial<Patient>) => {
    const response = await apiClient.post('/patients', data);
    return response.data;
  },

  // Update patient
  update: async (id: string, data: Partial<Patient>) => {
    const response = await apiClient.put(`/patients/${id}`, data);
    return response.data;
  },

  // Delete patient
  delete: async (id: string) => {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  },

  // Search patients
  search: async (query: string) => {
    const response = await apiClient.get('/patients/search', {
      params: { query },
    });
    return response.data;
  },

  // Get patient history
  getHistory: async (id: string) => {
    const response = await apiClient.get(`/patients/${id}/history`);
    return response.data;
  },
};
