import apiClient from './client';

export interface Appointment {
  _id: string;
  appointmentId: string;
  patientId: string | any;
  doctorId: string | any;
  date: string;
  time: string;
  duration: number;
  type: 'in-person' | 'telehealth';
  status: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  roomNumber?: string;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'insurance-claim' | 'refunded';
}

export const appointmentsAPI = {
  // Get appointments
  getAll: async (params?: {
    date?: string;
    status?: string;
    doctorId?: string;
    patientId?: string;
  }) => {
    const response = await apiClient.get('/appointments', { params });
    return response.data;
  },

  // Get appointment by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  // Create appointment
  create: async (data: Partial<Appointment>) => {
    const response = await apiClient.post('/appointments', data);
    return response.data;
  },

  // Update appointment
  update: async (id: string, data: Partial<Appointment>) => {
    const response = await apiClient.patch(`/appointments/${id}`, data);
    return response.data;
  },

  // Cancel appointment
  cancel: async (id: string, reason: string) => {
    const response = await apiClient.post(`/appointments/${id}/cancel`, {
      reason,
    });
    return response.data;
  },

  // Check-in appointment
  checkIn: async (id: string) => {
    const response = await apiClient.post(`/appointments/${id}/check-in`);
    return response.data;
  },

  // Get availability
  getAvailability: async (doctorId: string, date: string) => {
    const response = await apiClient.get('/appointments/availability', {
      params: { doctorId, date },
    });
    return response.data;
  },
};
