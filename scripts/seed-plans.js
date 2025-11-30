// Seed script to populate initial subscription plans
// Run with: node scripts/seed-plans.js

const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

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
      type: Number,
      required: true,
      min: 0,
    },
    files: {
      type: Number,
      required: true,
      min: -1,
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
}, { timestamps: true });

const defaultPlans = [
  {
    planId: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'forever',
    description: 'Perfect for getting started',
    features: [
      '100 MB Storage',
      '50 Files',
      'Basic File Sharing',
      'Community Support',
    ],
    limits: {
      storage: 100, // MB
      files: 50,
    },
    highlighted: false,
    active: true,
    displayOrder: 1,
  },
  {
    planId: 'basic',
    name: 'Basic',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    description: 'Great for individuals',
    features: [
      '1 GB Storage',
      '200 Files',
      'API Access',
      'Email Support',
      'File Analytics',
    ],
    limits: {
      storage: 1024, // MB
      files: 200,
    },
    highlighted: false,
    active: true,
    displayOrder: 2,
  },
  {
    planId: 'pro',
    name: 'Pro',
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    description: 'Best for professionals',
    features: [
      '10 GB Storage',
      '1000 Files',
      'API Access',
      'Custom Branding',
      'Priority Support',
      'Advanced Analytics',
      'Team Collaboration',
    ],
    limits: {
      storage: 10240, // MB
      files: 1000,
    },
    highlighted: true,
    active: true,
    displayOrder: 3,
  },
  {
    planId: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    currency: 'USD',
    interval: 'month',
    description: 'For large organizations',
    features: [
      '100 GB Storage',
      'Unlimited Files',
      'API Access',
      'Custom Branding',
      'Dedicated Support',
      'Advanced Analytics',
      'Team Management',
      'SLA Guarantee',
      'Custom Integration',
    ],
    limits: {
      storage: 102400, // MB
      files: -1, // unlimited
    },
    highlighted: false,
    active: true,
    displayOrder: 4,
  },
];

async function seedPlans() {
  try {
    // Get MongoDB URI from environment or use default
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/file-storage';
    
    console.log('Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get or create model
    const SubscriptionPlan = mongoose.models.SubscriptionPlan || 
      mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);

    // Clear existing plans (optional - comment out if you want to keep existing plans)
    // await SubscriptionPlan.deleteMany({});
    // console.log('Cleared existing plans');

    // Insert plans using upsert to avoid duplicates
    let created = 0;
    let updated = 0;

    for (const plan of defaultPlans) {
      const result = await SubscriptionPlan.updateOne(
        { planId: plan.planId },
        { $set: plan },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        created++;
        console.log(`✓ Created plan: ${plan.name}`);
      } else if (result.modifiedCount > 0) {
        updated++;
        console.log(`✓ Updated plan: ${plan.name}`);
      } else {
        console.log(`- Plan already up to date: ${plan.name}`);
      }
    }

    console.log('\n=== Seed Complete ===');
    console.log(`Created: ${created} plans`);
    console.log(`Updated: ${updated} plans`);
    console.log(`Total: ${defaultPlans.length} plans`);

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
    process.exit(1);
  }
}

seedPlans();
