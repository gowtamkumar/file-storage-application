import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import SubscriptionPlan from "@/models/SubscriptionPlan";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST - Initialize payment for subscription
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
    const { plan: planId } = body;

    console.log("Payment init - Received planId:", planId);

    // Fetch plan from database
    let plan = await SubscriptionPlan.findOne({ planId: planId, active: true });

    console.log("Database plan found:", !!plan);

    // Fallback to default plans if not in database
    if (!plan) {
      console.log("Looking for plan in default configuration");
      plan = getPlanById(planId);
      console.log("Default plan found:", !!plan);

      if (!plan) {
        console.error("Plan not found. Received planId:", planId);
        return NextResponse.json(
          { success: false, message: `Invalid plan: ${planId}` },
          { status: 400 }
        );
      }
    }

    const amount = plan.price;
    const currency = plan.currency;

    console.log(`Plan selected: ${plan.name}, Amount: ${amount} ${currency}`);

    // Free plan doesn't require payment
    if (amount === 0) {
      return NextResponse.json({
        success: true,
        message: "Free plan, no payment required",
        redirect: false,
      });
    }

    // SSLCommerz configuration
    const store_id = process.env.SSLCOMMERZ_STORE_ID;
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWD;
    const is_live = process.env.SSLCOMMERZ_IS_LIVE === "true";

    if (!store_id || !store_passwd) { 
      return NextResponse.json(
        {
          success: false,
          message: "Payment gateway not configured. Please contact admin.",
        },
        { status: 500 }
      );
    }

    const transactionId = `SUB-${session.user.id}-${Date.now()}`;

    // Determine base URL
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Base URL based on environment
    const api_url = is_live
      ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
      : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    console.log(
      `Initiating payment: ${amount} ${currency} for plan ${plan.name}`
    );

    const formData = new URLSearchParams();
    formData.append("store_id", store_id);
    formData.append("store_passwd", store_passwd);
    formData.append("total_amount", amount);
    formData.append("currency", currency); // Dynamic currency from database
    formData.append("tran_id", transactionId);
    formData.append("success_url", `${baseUrl}/api/payment/success`);
    formData.append("fail_url", `${baseUrl}/api/payment/fail`);
    formData.append("cancel_url", `${baseUrl}/api/payment/cancel`);
    formData.append("ipn_url", `${baseUrl}/api/payment/ipn`);
    formData.append("shipping_method", "NO");
    formData.append("product_name", `${plan.name} Subscription`);
    formData.append("product_category", "Subscription");
    formData.append("product_profile", "general");
    formData.append("cus_name", session.user.name || session.user.email);
    formData.append("cus_email", session.user.email);
    formData.append("cus_add1", "N/A");
    formData.append("cus_city", "N/A");
    formData.append("cus_postcode", "0000");
    formData.append("cus_country", "Bangladesh");
    formData.append("cus_phone", "0000000000");
    formData.append("value_a", session.user.id);
    formData.append("value_b", planId);
    formData.append("value_c", transactionId);
    formData.append("format", "json");

    console.log("Initiating payment with SSLCommerz...");

    const response = await fetch(api_url, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("SSLCommerz Response:", result);

    if (result.status === "SUCCESS") {
      return NextResponse.json({
        success: true,
        gatewayUrl: result.GatewayPageURL,
        transactionId,
      });
    } else {
      console.error("SSLCommerz init failed:", result);
      return NextResponse.json(
        {
          success: false,
          message: result.failedreason || "Payment initialization failed",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
