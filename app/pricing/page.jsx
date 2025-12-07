"use client";

import NavBar from "@/components/NavBar";
import {
  CheckOutlined,
  CrownOutlined,
  RocketOutlined,
  StarOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, message, Row, Space, Tag, Typography, Modal, Radio } from "antd";
import { motion } from "framer-motion";
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

    // If plan is free, proceed directly without payment
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

      console.log(data);

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
      free: <ThunderboltOutlined style={{ fontSize: "32px" }} />,
      basic: <StarOutlined style={{ fontSize: "32px" }} />,
      pro: <RocketOutlined style={{ fontSize: "32px" }} />,
      enterprise: <CrownOutlined style={{ fontSize: "32px" }} />,
    };
    return icons[planId] || <StarOutlined style={{ fontSize: "32px" }} />;
  };

  const getPlanGradient = (planId) => {
    const gradients = {
      free: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      basic: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      pro: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      enterprise: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
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
    <>
      <NavBar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          paddingTop: "100px",
          paddingBottom: "80px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <Title
              level={1}
              style={{
                color: "white",
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                marginBottom: "16px",
                fontWeight: 800,
              }}
            >
              Choose Your Perfect Plan
            </Title>
            <Paragraph
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "20px",
                maxWidth: "600px",
                margin: "0 auto 32px",
              }}
            >
              Start free and scale as you grow. All plans include core features.
            </Paragraph>
            {session && (
              <Tag
                color="green"
                style={{
                  fontSize: "14px",
                  padding: "6px 16px",
                  borderRadius: "20px",
                }}
              >
                Current Plan: {currentPlan.toUpperCase()}
              </Tag>
            )}
          </motion.div>

          {/* Pricing Cards */}
          <Row gutter={[24, 24]} justify="center">
            {plans.map((plan, index) => (
              <Col xs={24} sm={12} lg={6} key={plan.planId}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    style={{
                      height: "100%",
                      borderRadius: "24px",
                      border: plan.highlighted ? "3px solid #ffd700" : "none",
                      boxShadow: plan.highlighted
                        ? "0 20px 60px rgba(255, 215, 0, 0.4)"
                        : "0 10px 40px rgba(0, 0, 0, 0.2)",
                      background: "rgba(255, 255, 255, 0.98)",
                      backdropFilter: "blur(20px)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    styles={{ body: { padding: "40px 28px" } }}
                  >
                    {plan.highlighted && (
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "20px",
                        }}
                      >
                        <Tag
                          color="gold"
                          style={{
                            borderRadius: "12px",
                            padding: "6px 14px",
                            fontWeight: 700,
                            border: "none",
                            fontSize: "12px",
                          }}
                        >
                          ⭐ POPULAR
                        </Tag>
                      </div>
                    )}

                    {currentPlan === plan.planId && (
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          left: "20px",
                        }}
                      >
                        <Tag
                          color="green"
                          style={{
                            borderRadius: "12px",
                            padding: "6px 14px",
                            fontWeight: 700,
                            border: "none",
                            fontSize: "12px",
                          }}
                        >
                          ✓ CURRENT
                        </Tag>
                      </div>
                    )}

                    {/* Icon */}
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "20px",
                        background: getPlanGradient(plan.planId),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        marginBottom: "24px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      }}
                    >
                      {getPlanIcon(plan.planId)}
                    </div>

                    {/* Plan Name */}
                    <Title
                      level={3}
                      style={{
                        marginBottom: "8px",
                        fontSize: "28px",
                        fontWeight: 700,
                      }}
                    >
                      {plan.name}
                    </Title>

                    {/* Description */}
                    <Text
                      type="secondary"
                      style={{
                        display: "block",
                        marginBottom: "24px",
                        fontSize: "15px",
                      }}
                    >
                      {plan.description}
                    </Text>

                    {/* Price */}
                    <div style={{ marginBottom: "32px" }}>
                      <Space align="baseline">
                        <Title
                          level={2}
                          style={{
                            margin: 0,
                            fontSize: "48px",
                            fontWeight: 800,
                            background: getPlanGradient(plan.planId),
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          {getCurrencySymbol(plan.currency)}
                          {plan.price}
                        </Title>
                        <Text type="secondary" style={{ fontSize: "16px" }}>
                          /{plan.interval}
                        </Text>
                      </Space>
                    </div>

                    {/* Features */}
                    <div style={{ marginBottom: "32px" }}>
                      {plan.features.map((feature, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "14px",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                          }}
                        >
                          <CheckOutlined
                            style={{
                              color: "#52c41a",
                              fontSize: "16px",
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          />
                          <Text style={{ fontSize: "14px", lineHeight: "1.6" }}>
                            {feature}
                          </Text>
                        </div>
                      ))}
                    </div>

                    {/* Subscribe Button */}
                    <Button
                      type={plan.highlighted ? "primary" : "default"}
                      size="large"
                      block
                      onClick={() => handleSubscribe(plan.planId)}
                      loading={subscribingPlan === plan.planId}
                      disabled={currentPlan === plan.planId || loading}
                      style={{
                        height: "52px",
                        borderRadius: "14px",
                        fontWeight: 700,
                        fontSize: "16px",
                        ...(plan.highlighted && {
                          background: getPlanGradient(plan.planId),
                          border: "none",
                          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        }),
                      }}
                    >
                      {currentPlan === plan.planId
                        ? "✓ Current Plan"
                        : `Get ${plan.name}`}
                    </Button>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              marginTop: "80px",
              textAlign: "center",
              maxWidth: "800px",
              margin: "80px auto 0",
            }}
          >
            <Title level={3} style={{ color: "white", marginBottom: "24px" }}>
              Questions? We've got answers.
            </Title>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "left",
                }}
              >
                <Text
                  strong
                  style={{
                    color: "white",
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                  }}
                >
                  Can I change plans later?
                </Text>
                <Text
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                >
                  Yes! Upgrade or downgrade anytime from your dashboard.
                </Text>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "left",
                }}
              >
                <Text
                  strong
                  style={{
                    color: "white",
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "16px",
                  }}
                >
                  Is there a free trial?
                </Text>
                <Text
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                >
                  Our Free plan is available forever with no credit card
                  required.
                </Text>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      <Modal
        title="Select Payment Method"
        open={isPaymentModalVisible}
        onOk={handlePaymentProceed}
        onCancel={() => setIsPaymentModalVisible(false)}
        okText="Next Step"
        cancelText="Cancel"
      >
        <Radio.Group
          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          value={selectedPaymentMethod}
          style={{ width: '100%', marginTop: '20px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="sslcommerz" style={{
              border: '1px solid #d9d9d9',
              padding: '15px',
              borderRadius: '8px',
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>1. SSLCommerz</span>
              <div style={{ marginLeft: '24px', color: '#8c8c8c', fontSize: '12px' }}>
                Cards, Mobile Banking, Net Banking
              </div>
            </Radio>
            <Radio value="stripe" style={{
              border: '1px solid #d9d9d9',
              padding: '15px',
              borderRadius: '8px',
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: 'bold' }}>2. Stripe</span>
              <div style={{ marginLeft: '24px', color: '#8c8c8c', fontSize: '12px' }}>
                Credit/Debit Cards (International)
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </Modal>
    </>
  );
}
