import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  appointmentId: {
    type: String,
    unique: true,
    // Auto-generated: APT-YYYYMMDD-XXXX
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient is required']
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Doctor is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  time: {
    type: String,
    required: [true, 'Time is required']
  },
  duration: {
    type: Number,
    default: 30, // minutes
  },
  type: {
    type: String,
    enum: ['in-person', 'telehealth'],
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  reason: {
    type: String,
    required: [true, 'Reason for visit is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  roomNumber: {
    type: String,
    trim: true
  },
  insurance: {
    provider: String,
    policyNumber: String
  },
  fee: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'insurance-claim', 'refunded'],
    default: 'pending'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: {
    type: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Generate appointment ID before saving
appointmentSchema.pre('save', async function(next) {
  if (!this.appointmentId) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await mongoose.model('Appointment').countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });
    this.appointmentId = `APT-${date}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for efficient queries
appointmentSchema.index({ date: 1, doctorId: 1 });
appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ status: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
