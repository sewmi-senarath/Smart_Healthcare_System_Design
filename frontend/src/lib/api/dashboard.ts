import apiClient from './client';

export interface PatientStats {
  totalAppointments: number;
  completedVisits: number;
  activePrescriptions: number;
  nextAppointment: {
    date: string;
    doctor: string;
    type: string;
  } | null;
}

export interface UpcomingAppointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  doctor: {
    name: string;
    specialization: string;
  };
  reason: string;
}

export interface RecentVisit {
  id: string;
  date: string;
  doctor: {
    name: string;
    specialization: string;
  };
  diagnosis: string[];
  status: string;
  chiefComplaint: string;
}

export interface ActivePrescription {
  id: string;
  date: string;
  doctor: string;
  status: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
}

export interface PatientDashboardData {
  patient: {
    id: string;
    name: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    bloodGroup?: string;
    allergies?: string[];
    chronicConditions?: string[];
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  stats: PatientStats;
  upcomingAppointments: UpcomingAppointment[];
  recentVisits: RecentVisit[];
  activePrescriptions: ActivePrescription[];
  appointmentHistory: UpcomingAppointment[];
}

export interface MedicalRecord {
  id: string;
  date: string;
  doctor: {
    name: string;
    specialization: string;
  };
  chiefComplaint: string;
  diagnosis: string[];
  vitalSigns: {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
  findings: string;
  carePlan: string;
  status: string;
}

/**
 * Get patient dashboard data
 */
export const getPatientDashboard = async (): Promise<PatientDashboardData> => {
  const response = await apiClient.get('/dashboard/patient');
  return response.data;
};

/**
 * Get patient medical records
 */
export const getPatientMedicalRecords = async (): Promise<MedicalRecord[]> => {
  const response = await apiClient.get('/dashboard/patient/medical-records');
  return response.data.records;
};

/**
 * Get patient prescriptions
 */
export const getPatientPrescriptions = async (): Promise<ActivePrescription[]> => {
  const response = await apiClient.get('/dashboard/patient/prescriptions');
  return response.data.prescriptions;
};

export default {
  getPatientDashboard,
  getPatientMedicalRecords,
  getPatientPrescriptions,
};
