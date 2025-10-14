import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: {
    type: String,
    unique: true,
    // Auto-generated: RX-YYYYMMDD-XXXX
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit'
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true,
      enum: ['once-daily', 'twice-daily', 'three-times-daily', 'four-times-daily', 'as-needed']
    },
    duration: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    instructions: String,
    refills: {
      type: Number,
      default: 0
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'signed', 'sent-to-pharmacy', 'dispensed', 'cancelled'],
    default: 'draft'
  },
  signedAt: {
    type: Date
  },
  dispensedAt: {
    type: Date
  },
  dispensedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Pharmacist
  },
  dispenseStatus: {
    type: String,
    enum: ['full', 'partial', 'unable'],
    default: 'full'
  },
  dispenseNotes: {
    type: String
  },
  counselingChecklist: {
    dosageExplained: {
      type: Boolean,
      default: false
    },
    sideEffectsDiscussed: {
      type: Boolean,
      default: false
    },
    interactionsReviewed: {
      type: Boolean,
      default: false
    },
    storageInstructionsGiven: {
      type: Boolean,
      default: false
    }
  },
  notes: {
    type: String
  },
  expiryDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Generate prescription ID before saving
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionId) {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const count = await mongoose.model('Prescription').countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });
    this.prescriptionId = `RX-${date}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Set expiry date (default 30 days from creation)
prescriptionSchema.pre('save', function(next) {
  if (!this.expiryDate && this.signedAt) {
    const expiryDate = new Date(this.signedAt);
    expiryDate.setDate(expiryDate.getDate() + 30);
    this.expiryDate = expiryDate;
  }
  next();
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
