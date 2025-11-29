'use client';

import { CheckOutlined, CrownOutlined, RocketOutlined, StarOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { Button, Card, Col, message, Row, Space, Tag, Typography } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [subscribingPlan, setSubscribingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
    if (session) {
      fetchCurrentSubscription();
    }
  }, [session]);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/subscription/plans');
      const data = await res.json();
      if (data.success) {
        setPlans(data.data);
      }
    } catch (error) {
      message.error('Failed to fetch plans');
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const res = await fetch('/api/subscription');
      const data = await res.json();
      if (data.success) {
        setCurrentPlan(data.data.plan);
      }
    } catch (error) {
      console.error('Failed to fetch subscription');
    }
  };

  const handleSubscribe = async (planId) => {
    if (!session) {
      message.info('Please login to subscribe');
      router.push('/login');
      return;
    }

    setSubscribingPlan(planId);
    setLoading(true);

    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planId,
          paymentInfo: {
            transactionId: `TXN-${Date.now()}`,
            amount: plans.find(p => p.id === planId)?.price || 0,
            paymentMethod: 'demo',
            lastPaymentDate: new Date(),
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        message.success(`Successfully subscribed to ${planId} plan!`);
        setCurrentPlan(planId);
        fetchCurrentSubscription();
      } else {
        message.error(data.message || 'Subscription failed');
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setLoading(false);
      setSubscribingPlan(null);
    }
  };

  const getPlanIcon = (planId) => {
    const icons = {
      free: <ThunderboltOutlined style={{ fontSize: '32px' }} />,
      basic: <StarOutlined style={{ fontSize: '32px' }} />,
      pro: <RocketOutlined style={{ fontSize: '32px' }} />,
      enterprise: <CrownOutlined style={{ fontSize: '32px' }} />,
    };
    return icons[planId] || <StarOutlined style={{ fontSize: '32px' }} />;
  };

  const getPlanGradient = (planId) => {
    const gradients = {
      free: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      basic: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      pro: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      enterprise: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    };
    return gradients[planId] || gradients.free;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '48px 24px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={1} style={{ 
            color: 'white',
            fontSize: '48px',
            marginBottom: '16px',
            fontWeight: 700
          }}>
            Choose Your Perfect Plan
          </Title>
          <Paragraph style={{ 
            color: 'rgba(255,255,255,0.9)',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Select the plan that best fits your needs. Upgrade or downgrade anytime.
          </Paragraph>
        </div>

        {/* Pricing Cards */}
        <Row gutter={[24, 24]} justify="center">
          {plans.map((plan) => (
            <Col xs={24} sm={12} lg={6} key={plan.id}>
              <Card
                style={{
                  height: '100%',
                  borderRadius: '20px',
                  border: plan.highlighted ? '3px solid #ffd700' : 'none',
                  boxShadow: plan.highlighted 
                    ? '0 12px 48px rgba(255, 215, 0, 0.3)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.15)',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                }}
                bodyStyle={{ padding: '32px 24px' }}
                hoverable
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = plan.highlighted
                    ? '0 16px 56px rgba(255, 215, 0, 0.4)'
                    : '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = plan.highlighted
                    ? '0 12px 48px rgba(255, 215, 0, 0.3)'
                    : '0 8px 32px rgba(0, 0, 0, 0.15)';
                }}
              >
                {plan.highlighted && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                  }}>
                    <Tag color="gold" style={{ 
                      borderRadius: '12px',
                      padding: '4px 12px',
                      fontWeight: 600,
                      border: 'none'
                    }}>
                      POPULAR
                    </Tag>
                  </div>
                )}

                {currentPlan === plan.id && (
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                  }}>
                    <Tag color="green" style={{ 
                      borderRadius: '12px',
                      padding: '4px 12px',
                      fontWeight: 600,
                      border: 'none'
                    }}>
                      CURRENT
                    </Tag>
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: getPlanGradient(plan.id),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '24px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }}>
                  {getPlanIcon(plan.id)}
                </div>

                {/* Plan Name */}
                <Title level={3} style={{ marginBottom: '8px', fontSize: '28px' }}>
                  {plan.name}
                </Title>

                {/* Description */}
                <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                  {plan.description}
                </Text>

                {/* Price */}
                <div style={{ marginBottom: '32px' }}>
                  <Space align="baseline">
                    <Title level={2} style={{ 
                      margin: 0,
                      fontSize: '42px',
                      fontWeight: 700,
                      background: getPlanGradient(plan.id),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      ${plan.price}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                      /{plan.interval}
                    </Text>
                  </Space>
                </div>

                {/* Features */}
                <div style={{ marginBottom: '32px' }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{ 
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <CheckOutlined style={{ 
                        color: '#52c41a',
                        fontSize: '16px',
                        flexShrink: 0
                      }} />
                      <Text style={{ fontSize: '14px' }}>{feature}</Text>
                    </div>
                  ))}
                </div>

                {/* Subscribe Button */}
                <Button
                  type={plan.highlighted ? 'primary' : 'default'}
                  size="large"
                  block
                  onClick={() => handleSubscribe(plan.id)}
                  loading={subscribingPlan === plan.id}
                  disabled={currentPlan === plan.id || loading}
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '16px',
                    ...(plan.highlighted && {
                      background: getPlanGradient(plan.id),
                      border: 'none',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                    })
                  }}
                >
                  {currentPlan === plan.id ? 'Current Plan' : `Get ${plan.name}`}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Back to Dashboard */}
        {session && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Button
              size="large"
              onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
              style={{
                borderRadius: '12px',
                height: '48px',
                padding: '0 32px',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.95)',
                border: 'none'
              }}
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
