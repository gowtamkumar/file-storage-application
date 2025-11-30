import mongoose from 'mongoose';

const SubscriptionPlanSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true,
  },
  interval: {
    type: String,
    enum: ['month', 'year', 'forever'],
    default: 'month',
  },
  description: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
    trim: true,
  }],
  limits: {
    storage: {
      type: Number, // in MB
      required: true,
      min: 0,
    },
    files: {
      type: Number,
      required: true,
      min: -1, // -1 means unlimited
    },
  },
  highlighted: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
}, { 
  timestamps: true,
});

// Index for faster queries
SubscriptionPlanSchema.index({ planId: 1 });
SubscriptionPlanSchema.index({ active: 1 });
SubscriptionPlanSchema.index({ displayOrder: 1 });

export default mongoose.models.SubscriptionPlan || mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);
