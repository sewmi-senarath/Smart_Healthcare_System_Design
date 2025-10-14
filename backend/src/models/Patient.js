import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  mrn: {
    type: String,
    required: false, // Auto-generated in pre-save hook
    unique: true,
    // Medical Record Number - auto-generated
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Not all patients need user accounts
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [{
    allergen: String,
    reaction: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    }
  }],
  chronicConditions: [{
    condition: String,
    diagnosedDate: Date,
    status: {
      type: String,
      enum: ['active', 'controlled', 'resolved']
    }
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    startDate: Date,
    endDate: Date
  }],
  insurance: {
    provider: String,
    policyNumber: String,
    groupNumber: String,
    expiryDate: Date
  },
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate MRN before saving
patientSchema.pre('save', async function(next) {
  if (!this.mrn) {
    const count = await mongoose.model('Patient').countDocuments();
    this.mrn = `MRN${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  return Math.floor((new Date() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

patientSchema.set('toJSON', { virtuals: true });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
