import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

// GET - Get all available subscription plans
export async function GET() {
  await dbConnect();

  const plans = [
    {
      id: 'free',
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
    },
    {
      id: 'basic',
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
    },
    {
      id: 'pro',
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
    },
    {
      id: 'enterprise',
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
    },
  ];

  return NextResponse.json({ success: true, data: plans });
}
