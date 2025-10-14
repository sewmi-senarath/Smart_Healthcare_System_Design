import Appointment from '../models/Appointment.js';
import Visit from '../models/Visit.js';
import Prescription from '../models/Prescription.js';
import Patient from '../models/Patient.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * Get Patient Dashboard Data
 */
export const getPatientDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Find patient by user ID
  const patient = await Patient.findOne({ userId }).populate('userId', 'name email');
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient profile not found',
    });
  }

  // Get upcoming appointments
  const upcomingAppointments = await Appointment.find({
    patientId: patient._id,
    appointmentDate: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] },
  })
    .populate('doctorId', 'name specialization')
    .sort({ appointmentDate: 1 })
    .limit(5);

  // Get recent visits
  const recentVisits = await Visit.find({ patientId: patient._id })
    .populate('doctorId', 'name specialization')
    .sort({ visitDate: -1 })
    .limit(5);

  // Get active prescriptions
  const activePrescriptions = await Prescription.find({
    patientId: patient._id,
    status: { $in: ['pending', 'partial', 'verified'] },
  })
    .populate('doctorId', 'name')
    .populate('visitId')
    .sort({ createdAt: -1 })
    .limit(10);

  // Get appointment history
  const appointmentHistory = await Appointment.find({
    patientId: patient._id,
    status: { $in: ['completed', 'cancelled'] },
  })
    .populate('doctorId', 'name specialization')
    .sort({ appointmentDate: -1 })
    .limit(10);

  // Stats
  const totalAppointments = await Appointment.countDocuments({ patientId: patient._id });
  const completedVisits = await Visit.countDocuments({ patientId: patient._id, status: 'completed' });
  const activePrescriptionsCount = activePrescriptions.length;
  const nextAppointment = upcomingAppointments[0] || null;

  res.json({
    success: true,
    data: {
      patient: {
        id: patient._id,
        name: patient.userId.name,
        email: patient.userId.email,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions,
        emergencyContact: patient.emergencyContact,
      },
      stats: {
        totalAppointments,
        completedVisits,
        activePrescriptions: activePrescriptionsCount,
        nextAppointment: nextAppointment
          ? {
              date: nextAppointment.appointmentDate,
              doctor: nextAppointment.doctorId.name,
              type: nextAppointment.appointmentType,
            }
          : null,
      },
      upcomingAppointments: upcomingAppointments.map((apt) => ({
        id: apt._id,
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        type: apt.appointmentType,
        status: apt.status,
        doctor: {
          name: apt.doctorId.name,
          specialization: apt.doctorId.specialization,
        },
        reason: apt.reason,
      })),
      recentVisits: recentVisits.map((visit) => ({
        id: visit._id,
        date: visit.visitDate,
        doctor: {
          name: visit.doctorId.name,
          specialization: visit.doctorId.specialization,
        },
        diagnosis: visit.diagnosis,
        status: visit.status,
        chiefComplaint: visit.chiefComplaint,
      })),
      activePrescriptions: activePrescriptions.map((rx) => ({
        id: rx._id,
        date: rx.createdAt,
        doctor: rx.doctorId.name,
        status: rx.status,
        medications: rx.medications.map((med) => ({
          name: med.medication,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: med.instructions,
        })),
      })),
      appointmentHistory: appointmentHistory.map((apt) => ({
        id: apt._id,
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        type: apt.appointmentType,
        status: apt.status,
        doctor: {
          name: apt.doctorId.name,
          specialization: apt.doctorId.specialization,
        },
        reason: apt.reason,
      })),
    },
  });
});

/**
 * Get Patient Medical Records
 */
export const getPatientMedicalRecords = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const patient = await Patient.findOne({ userId });
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient profile not found',
    });
  }

  const medicalRecords = await Visit.find({ patientId: patient._id })
    .populate('doctorId', 'name specialization')
    .sort({ visitDate: -1 });

  res.json({
    success: true,
    data: {
      records: medicalRecords.map((visit) => ({
        id: visit._id,
        date: visit.visitDate,
        doctor: {
          name: visit.doctorId.name,
          specialization: visit.doctorId.specialization,
        },
        chiefComplaint: visit.chiefComplaint,
        diagnosis: visit.diagnosis,
        vitalSigns: visit.vitalSigns,
        findings: visit.findings,
        carePlan: visit.carePlan,
        status: visit.status,
      })),
    },
  });
});

/**
 * Get Patient Prescriptions
 */
export const getPatientPrescriptions = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const patient = await Patient.findOne({ userId });
  if (!patient) {
    return res.status(404).json({
      success: false,
      message: 'Patient profile not found',
    });
  }

  const prescriptions = await Prescription.find({ patientId: patient._id })
    .populate('doctorId', 'name specialization')
    .populate('visitId')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: {
      prescriptions: prescriptions.map((rx) => ({
        id: rx._id,
        date: rx.createdAt,
        doctor: {
          name: rx.doctorId.name,
          specialization: rx.doctorId.specialization,
        },
        status: rx.status,
        medications: rx.medications,
        dispenseStatus: rx.dispenseStatus,
        dispensedDate: rx.dispensedDate,
      })),
    },
  });
});
