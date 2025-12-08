import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: String,
      // Support both legacy string values and new plan IDs
      // For backward compatibility with existing subscriptions
      default: "free",
    },
    planRef: {
      // Optional reference to SubscriptionPlan for dynamic plans
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: false,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
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

  },
  { timestamps: true }
);

export default mongoose.models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
