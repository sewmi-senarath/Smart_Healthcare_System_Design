import apiClient from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'patient' | 'nurse' | 'doctor' | 'manager' | 'pharmacist';
  phone?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const authAPI = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.put('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
