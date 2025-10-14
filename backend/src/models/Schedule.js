import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  weekEndDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  slots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    slotDuration: {
      type: Number,
      default: 30 // minutes
    },
    capacity: {
      type: Number,
      default: 1
    },
    roomNumber: {
      type: String
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    bookedCount: {
      type: Number,
      default: 0
    }
  }],
  conflicts: [{
    description: String,
    slotIndex: Number,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    resolved: {
      type: Boolean,
      default: false
    }
  }],
  publishedAt: {
    type: Date
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScheduleTemplate'
  }
}, {
  timestamps: true
});

// Index for efficient queries
scheduleSchema.index({ doctorId: 1, weekStartDate: 1 });
scheduleSchema.index({ status: 1 });

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;
