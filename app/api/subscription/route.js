import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import Subscription from "@/models/Subscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import Transaction from "@/models/Transaction";

// GET - Get user's subscription
export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    let subscription = await Subscription.findOne({ userId: session.user.id, status: 'active' });

    // If no subscription exists, create a free plan
    if (!subscription) {
      subscription = await Subscription.create({
        userId: session.user.id,
        plan: "free",
        storageLimit: 100, // 100MB
        fileLimit: 50,
        features: {
          apiAccess: false,
          customBranding: false,
          prioritySupport: false,
          analytics: false,
        },
      });
    }

    // Fetch transaction history
    const transactions = await Transaction.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: {
        ...subscription.toObject(),
        transactions,
      },
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// POST - Subscribe to a plan
export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { plan, paymentInfo } = body;

    // Define plan limits and features
    // Fetch plan details from database
    const planDetails = await SubscriptionPlan.findOne({
      planId: plan,
      active: true,
    });

    if (!planDetails) {
      return NextResponse.json(
        { success: false, message: "Invalid plan" },
        { status: 400 }
      );
    }

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    // Update or create subscription
    const subscription = await Subscription.findOneAndUpdate(
      { userId: session.user.id },
      {
        plan,
        status: "active",
        startDate: new Date(),
        endDate,
        storageLimit: planDetails?.limits?.storage,
        fileLimit: planDetails?.limits?.files,
        features: planDetails?.features,
        paymentInfo: paymentInfo || {},
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully subscribed to ${plan} plan`,
      data: subscription,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
