import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  visitId: {
    type: String,
    unique: true,
    // Auto-generated: VIS-YYYYMMDD-XXXX
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  type: {
    type: String,
    enum: ['scheduled', 'walk-in', 'emergency'],
    default: 'scheduled'
  },
  status: {
    type: String,
    enum: ['checked-in', 'triaged', 'in-consultation', 'completed', 'cancelled'],
    default: 'checked-in'
  },
  checkInTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  checkInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Nurse who checked in the patient
  },
  // Triage Data
  triage: {
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recordedAt: Date,
    vitals: {
      temperature: {
        value: Number,
        unit: {
          type: String,
          default: 'F'
        }
      },
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      pulse: Number,
      spO2: Number,
      weight: {
        value: Number,
        unit: {
          type: String,
          default: 'kg'
        }
      },
      height: {
        value: Number,
        unit: {
          type: String,
          default: 'cm'
        }
      }
    },
    notes: String,
    attachments: [{
      filename: String,
      path: String,
      uploadedAt: Date
    }]
  },
  // Consultation Data
  consultation: {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    startTime: Date,
    endTime: Date,
    soapNotes: {
      subjective: String,
      objective: String,
      assessment: String,
      plan: String
    },
    diagnoses: [{
      code: String, // ICD-10 code
      description: String,
      type: {
        type: String,
        enum: ['primary', 'secondary']
      }
    }],
    procedures: [{
      code: String,
      description: String
    }],
    orders: [{
      type: {
        type: String,
        enum: ['lab', 'imaging', 'referral', 'follow-up']
      },
      description: String,
      notes: String
    }]
  },
  checkOutTime: {
    type: Date
  },
  totalDuration: {
    type: Number // in minutes
  }
}, {
  timestamps: true
});

// Generate visit ID before saving
visitSchema.pre('save', async function(next) {
  if (!this.visitId) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await mongoose.model('Visit').countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });
    this.visitId = `VIS-${date}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Calculate total duration before saving
visitSchema.pre('save', function(next) {
  if (this.checkInTime && this.checkOutTime) {
    this.totalDuration = Math.floor((this.checkOutTime - this.checkInTime) / (1000 * 60));
  }
  next();
});

const Visit = mongoose.model('Visit', visitSchema);

export default Visit;
