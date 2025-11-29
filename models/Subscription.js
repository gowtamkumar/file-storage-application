import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'pro', 'enterprise'],
    default: 'free',
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired'],
    default: 'active',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: false,
  },
  storageLimit: {
    type: Number, // in MB
    default: 100, // 100MB for free plan
  },
  fileLimit: {
    type: Number,
    default: 50, // 50 files for free plan
  },
  features: {
    apiAccess: {
      type: Boolean,
      default: false,
    },
    customBranding: {
      type: Boolean,
      default: false,
    },
    prioritySupport: {
      type: Boolean,
      default: false,
    },
    analytics: {
      type: Boolean,
      default: false,
    },
  },
  paymentInfo: {
    transactionId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: String,
    lastPaymentDate: Date,
  },
}, { timestamps: true });

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
