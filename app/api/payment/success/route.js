import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import Subscription from "@/models/Subscription";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import Transaction from "@/models/Transaction";
import { NextResponse } from "next/server";
import Stripe from 'stripe';

// POST - Handle successful payment
export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const {
      tran_id,
      val_id,
      amount,
      card_type,
      store_amount,
      card_no,
      bank_tran_id,
      status,
      tran_date,
      currency,
      card_issuer,
      card_brand,
      card_issuer_country,
      card_issuer_country_code,
      value_a: userId,
      value_b: plan,
      value_c: transactionId,
    } = data;

    // Determine base URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Verify payment with SSLCommerz
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

    // Validation URL based on environment
    const validation_url = is_live
      ? `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
      : `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`;

    console.log("Validating payment with SSLCommerz...");

    const validationRes = await fetch(validation_url);
    const validation = await validationRes.json();

    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      // Fetch plan details from database
      const planDetails = await SubscriptionPlan.findOne({ planId: plan, active: true });

      if (!planDetails) {
        // Handle invalid plan
        console.error(`Invalid plan: ${plan}`);
        return NextResponse.redirect(
          `${baseUrl}/pricing?payment=error&reason=invalid_plan`
        );
      }

      const config = {
        storageLimit: planDetails.limits.storage,
        fileLimit: planDetails.limits.files,
        features: {
          apiAccess: planDetails.features.includes('API Access'),
          customBranding: planDetails.features.includes('Custom Branding'),
          prioritySupport: planDetails.features.includes('Priority Support'),
          analytics: planDetails.features.includes('Advanced Analytics'),
        }
      };
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      const usdAmount = planDetails.price || 0;

      console.log("Gateway amount (BDT):", amount);
      console.log("Stored amount (USD):", usdAmount);

      // Archive existing active subscription
      await Subscription.updateMany(
        { userId, status: 'active' },
        { $set: { status: 'expired', endDate: new Date() } }
      );

      // Create NEW subscription
      const subscription = await Subscription.create({
        userId,
        plan,
        status: "active",
        startDate: new Date(),
        endDate,
        storageLimit: config.storageLimit,
        fileLimit: config.fileLimit,
        features: config.features,
      });

      // Create Transaction Record with subscriptionId
      await Transaction.create({
        userId,
        planId: plan,
        subscriptionId: subscription._id, // Link to subscription
        amount: usdAmount,
        currency: "USD",
        paymentMethod: card_type || "Unknown",
        transactionId: tran_id,
        status: "success",
        metadata: {
          gatewayAmount: parseFloat(amount),
          gatewayCurrency: currency,
          validationId: val_id,
          bankTransactionId: bank_tran_id,
          cardDetails: {
            cardNo: card_no,
            cardBrand: card_brand,
            cardIssuer: card_issuer,
            cardIssuerCountry: card_issuer_country,
          },
        }
      });

      // Notify Admins
      await Notification.create({
        title: 'New Subscription',
        message: `Plan: ${plan.toUpperCase()} - Amount: $${usdAmount} (User ID: ${userId})`,
        type: 'success',
        recipient: 'admin',
      });

      // Notify User
      await Notification.create({
        title: 'Subscription Activated',
        message: `Your ${plan} plan has been successfully activated. Enjoy!`,
        type: 'success',
        recipient: userId,
      });

      // Redirect to success page
      return NextResponse.redirect(
        `${baseUrl}/user/subscription?payment=success&plan=${plan}`
      );
    } else {
      // Payment validation failed
      return NextResponse.redirect(
        `${baseUrl}/pricing?payment=failed&reason=validation_failed`
      );
    }
  } catch (error) {
    console.error("Payment success handler error:", error);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.redirect(
      `${baseUrl}/pricing?payment=error&reason=${error.message}`
    );
  }
}
// GET - Handle Stripe success redirect
export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const paymentMethod = searchParams.get("payment_method");
  const sessionId = searchParams.get("session_id");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (paymentMethod === "stripe" && sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === "paid") {
        const { userId, planId, transactionId } = session.metadata;
        const amount = session.amount_total / 100; // Convert from cents
        const currency = session.currency.toUpperCase();

        // Fetch plan details from database
        const planDetails = await SubscriptionPlan.findOne({ planId: planId, active: true });

        if (!planDetails) {
          console.error(`Invalid plan: ${planId}`);
          return NextResponse.redirect(
            `${baseUrl}/pricing?payment=error&reason=invalid_plan`
          );
        }

        const config = {
          storageLimit: planDetails.limits.storage,
          fileLimit: planDetails.limits.files,
          features: {
            apiAccess: planDetails.features.includes('API Access'),
            customBranding: planDetails.features.includes('Custom Branding'),
            prioritySupport: planDetails.features.includes('Priority Support'),
            analytics: planDetails.features.includes('Advanced Analytics'),
          }
        };
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        // Archive existing active subscription
        await Subscription.updateMany(
          { userId, status: 'active' },
          { $set: { status: 'expired', endDate: new Date() } }
        );

        // Create NEW subscription
        const subscription = await Subscription.create({
          userId,
          plan: planId,
          status: "active",
          startDate: new Date(),
          endDate,
          storageLimit: config.storageLimit,
          fileLimit: config.fileLimit,
          features: config.features,
        });

        // Create Transaction Record with subscriptionId
        await Transaction.create({
          userId,
          planId: planId,
          subscriptionId: subscription._id, // Link to subscription
          amount: amount,
          currency: currency,
          paymentMethod: "stripe",
          transactionId: transactionId,
          status: "success",
          metadata: {
            validationId: sessionId,
            bankTransactionId: session.payment_intent,
          }
        });

        // Notify Admins
        await Notification.create({
          title: 'New Subscription (Stripe)',
          message: `Plan: ${planId.toUpperCase()} - Amount: ${amount} ${currency} (User ID: ${userId})`,
          type: 'success',
          recipient: 'admin',
        });

        // Notify User
        await Notification.create({
          title: 'Subscription Activated',
          message: `Your ${planId} plan has been successfully activated via Stripe. Enjoy!`,
          type: 'success',
          recipient: userId,
        });

        return NextResponse.redirect(
          `${baseUrl}/user/subscription?payment=success&plan=${planId}`
        );
      }
    } catch (error) {
      console.error("Stripe validation error:", error);
      return NextResponse.redirect(
        `${baseUrl}/pricing?payment=error&reason=${error.message}`
      );
    }
  }

  return NextResponse.redirect(`${baseUrl}/pricing?payment=error&reason=invalid_request`);
}
