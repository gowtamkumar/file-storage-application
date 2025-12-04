// Centralized plan configuration
// Used as fallback when no plans exist in database

export const DEFAULT_PLANS = [
  {
    planId: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    description: 'Perfect for trying out our service',
    features: ['100 MB Storage', '50 Files', 'Basic Support'],
    limits: { storage: 100, files: 50 },
    highlighted: false,
  },
  {
    planId: 'basic',
    name: 'Basic',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    description: 'Great for personal projects',
    features: ['1 GB Storage', '200 Files', 'API Access', 'Priority Support'],
    limits: { storage: 1024, files: 200 },
    highlighted: false,
  },
  {
    planId: 'pro',
    name: 'Pro',
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    description: 'Best for professionals',
    features: ['10 GB Storage', '1000 Files', 'API Access', 'Custom Branding', 'Analytics', 'Priority Support'],
    limits: { storage: 10240, files: 1000 },
    highlighted: true,
  },
  {
    planId: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    currency: 'USD',
    interval: 'month',
    description: 'For large organizations',
    features: ['100 GB Storage', 'Unlimited Files', 'API Access', 'Custom Branding', 'Advanced Analytics', '24/7 Support', 'SLA'],
    limits: { storage: 102400, files: -1 },
    highlighted: false,
  },
];

// Helper to get plan by ID
export function getPlanById(planId) {
  return DEFAULT_PLANS.find(p => p.planId === planId);
}
