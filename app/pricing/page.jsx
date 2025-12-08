"use client";

import NavBar from "@/components/NavBar";
import { message, Modal, Radio, Space, Typography } from "antd";
import { motion } from "framer-motion";
import { Check, Crown, Sparkles, Star, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";

const { Title, Text, Paragraph } = Typography;

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [subscribingPlan, setSubscribingPlan] = useState(null);
  const [selectedInterval, setSelectedInterval] = useState("month");

  useEffect(() => {
    fetchPlans();
    if (session) {
      fetchCurrentSubscription();
    }

    // Check for payment status in URL
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const plan = params.get("plan");
    const reason = params.get("reason");

    if (paymentStatus === "success") {
      message.success(
        `Payment successful! You are now subscribed to ${plan} plan.`
      );
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed") {
      message.error(`Payment failed: ${reason || "Unknown error"}`);
    } else if (paymentStatus === "cancelled") {
      message.info("Payment cancelled");
    } else if (paymentStatus === "error") {
      message.error("An error occurred during payment processing");
    }
  }, [session]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/subscription/plans");
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      message.error("Failed to fetch plans");
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      if (data.success) {
        setCurrentPlan(data.data.plan);
      }
    } catch (error) {
      console.error("Failed to fetch subscription");
    }
  };

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("sslcommerz");

  const handleSubscribe = async (planId) => {
    if (!session) {
      message.info("Please login to subscribe");
      router.push("/login");
      return;
    }

    const plan = plans.find((p) => p.planId === planId);
    if (plan && plan.price === 0) {
      processSubscription(planId, "none");
      return;
    }

    setSubscribingPlan(planId);
    setIsPaymentModalVisible(true);
  };

  const handlePaymentProceed = () => {
    setIsPaymentModalVisible(false);
    processSubscription(subscribingPlan, selectedPaymentMethod);
  };

  const processSubscription = async (planId, paymentMethod) => {
    setLoading(true);
    setSubscribingPlan(planId);

    try {
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, paymentMethod }),
      });

      const data = await res.json();

      if (data.success) {
        if (data.gatewayUrl) {
          window.location.href = data.gatewayUrl;
        } else {
          message.success(
            data.message || `Successfully subscribed to ${planId} plan!`
          );
          setCurrentPlan(planId);
          fetchCurrentSubscription();

          if (!data.redirect) {
            await fetch("/api/subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                plan: planId,
                paymentInfo: {
                  transactionId: "FREE-" + Date.now(),
                  amount: 0,
                  paymentMethod: "none",
                  lastPaymentDate: new Date(),
                },
              }),
            });
            fetchCurrentSubscription();
          }
        }
      } else {
        message.error(data.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      message.error("An error occurred during subscription");
    } finally {
      setLoading(false);
      setSubscribingPlan(null);
    }
  };

  const getPlanIcon = (planId) => {
    const icons = {
      free: <Zap className="w-10 h-10" />,
      basic: <Star className="w-10 h-10" />,
      pro: <Sparkles className="w-10 h-10" />,
      enterprise: <Crown className="w-10 h-10" />,
    };
    return icons[planId] || <Star className="w-10 h-10" />;
  };

  const getPlanGradient = (planId) => {
    const gradients = {
      free: "from-purple-500 to-indigo-600",
      basic: "from-pink-500 to-rose-600",
      pro: "from-cyan-500 to-blue-600",
      enterprise: "from-emerald-500 to-teal-600",
    };
    return gradients[planId] || gradients.free;
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      USD: "$",
      BDT: "৳",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      MYR: "RM",
      AUD: "A$",
      CAD: "C$",
    };
    return symbols[currency] || currency + " ";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10"></div>

      {/* Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-5">
        <div className="absolute -top-[40%] -right-[20%] w-[100%] h-[100%] rounded-full bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/40 blur-3xl animate-pulse"></div>
        <div className="absolute top-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-blue-200/30 via-cyan-200/20 to-teal-200/30 blur-3xl animate-pulse [animation-delay:2s]"></div>
        <div className="absolute -bottom-[20%] right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-violet-200/30 via-fuchsia-200/20 to-rose-200/30 blur-3xl animate-pulse [animation-delay:4s]"></div>
      </div>

      <NavBar />

      <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-6xl md:text-7xl font-black mb-6 leading-none tracking-tighter">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-medium">
              Start free and scale as you grow. All plans include core features.
            </p>
            {session && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg">
                <Check className="w-5 h-5" />
                Current Plan: {currentPlan.toUpperCase()}
              </div>
            )}
          </motion.div>

          {/* Interval Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex bg-white/70 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/60 gap-2">
              {[
                { value: "month", label: "Monthly" },
                { value: "year", label: "Yearly", badge: "Save 20%" },
                { value: "forever", label: "Lifetime" },
              ].map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => setSelectedInterval(interval.value)}
                  className={`relative px-8 py-4 rounded-xl font-black text-base transition-all duration-300 ${selectedInterval === interval.value
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-transparent text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {interval.label}
                  {interval.badge && (
                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                      {interval.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {plans
              .filter((plan) => plan.interval === selectedInterval)
              .map((plan, index) => (
                <motion.div
                  key={plan.planId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  {plan.highlighted && (
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 rounded-[2.5rem]"></div>
                  )}

                  {/* Card */}
                  <div className={`relative h-full bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 ${plan.highlighted ? "border-yellow-400 border-2" : "border-white/60"
                    }`}>
                    {/* Badges */}
                    {plan.highlighted && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-black text-sm shadow-lg flex items-center gap-2">
                        <Star className="w-4 h-4 fill-white" />
                        MOST POPULAR
                      </div>
                    )}
                    {currentPlan === plan.planId && (
                      <div className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-bold text-xs shadow-md flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        ACTIVE
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-20 h-20 bg-gradient-to-br ${getPlanGradient(plan.planId)} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {getPlanIcon(plan.planId)}
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-3xl font-black mb-3">{plan.name}</h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 text-sm">{plan.description}</p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-6xl font-black bg-gradient-to-r ${getPlanGradient(plan.planId)} bg-clip-text text-transparent`}>
                          {getCurrencySymbol(plan.currency)}
                          {plan.price}
                        </span>
                        <span className="text-gray-500 font-semibold">/{plan.interval}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${getPlanGradient(plan.planId)} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handleSubscribe(plan.planId)}
                      disabled={currentPlan === plan.planId || loading}
                      className={`w-full py-4 rounded-2xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 ${plan.highlighted
                          ? `bg-gradient-to-r ${getPlanGradient(plan.planId)} text-white shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                    >
                      {subscribingPlan === plan.planId && (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {currentPlan === plan.planId ? (
                        <>
                          <Check className="w-5 h-5" />
                          Current Plan
                        </>
                      ) : (
                        <>Get {plan.name}</>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
              Questions? We've got{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                answers
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "Can I change plans later?",
                  a: "Yes! Upgrade or downgrade anytime from your dashboard.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Our Free plan is available forever with no credit card required.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept credit cards, mobile banking, and net banking via SSLCommerz and Stripe.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Absolutely! You can cancel your subscription at any time from your dashboard.",
                },
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300"
                >
                  <h3 className="font-black text-lg mb-3 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />

      {/* Payment Modal */}
      <Modal
        title={<span className="text-xl font-black">Select Payment Method</span>}
        open={isPaymentModalVisible}
        onOk={handlePaymentProceed}
        onCancel={() => setIsPaymentModalVisible(false)}
        okText="Proceed to Payment"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-gradient-to-r from-indigo-600 to-purple-600 border-none font-bold h-11 px-8"
        }}
      >
        <Radio.Group
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          value={selectedPaymentMethod}
          className="w-full mt-6"
        >
          <Space direction="vertical" className="w-full" size="middle">
            <Radio
              value="sslcommerz"
              className="border-2 border-gray-200 rounded-xl p-4 w-full hover:border-indigo-400 transition-colors"
            >
              <div>
                <div className="font-bold text-base">SSLCommerz</div>
                <div className="text-gray-500 text-sm mt-1">Cards, Mobile Banking, Net Banking</div>
              </div>
            </Radio>
            <Radio
              value="stripe"
              className="border-2 border-gray-200 rounded-xl p-4 w-full hover:border-indigo-400 transition-colors"
            >
              <div>
                <div className="font-bold text-base">Stripe</div>
                <div className="text-gray-500 text-sm mt-1">Credit/Debit Cards (International)</div>
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </Modal>
    </div>
  );
}
