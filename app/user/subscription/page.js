'use client';

import { CheckOutlined, CrownOutlined, RocketOutlined } from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Progress, Row, Space, Tag, Timeline, Typography } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

export default function MySubscriptionPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
    fetchFiles();
  }, []);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subscription');
      const data = await res.json();
      if (data.success) {
        setSubscription(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch files');
    }
  };

  const getPlanFeatures = (plan) => {
    const features = {
      free: [
        '100 MB Storage',
        '50 Files',
        'Basic File Sharing',
        'Community Support',
      ],
      basic: [
        '1 GB Storage',
        '200 Files',
        'API Access',
        'Email Support',
        'File Analytics',
      ],
      pro: [
        '10 GB Storage',
        '1000 Files',
        'API Access',
        'Custom Branding',
        'Priority Support',
        'Advanced Analytics',
        'Team Collaboration',
      ],
      enterprise: [
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
    };
    return features[plan] || features.free;
  };

  const getPlanPrice = (plan) => {
    const prices = {
      free: { amount: 0, interval: 'forever' },
      basic: { amount: 9.99, interval: 'month' },
      pro: { amount: 29.99, interval: 'month' },
      enterprise: { amount: 99.99, interval: 'month' },
    };
    return prices[plan] || prices.free;
  };

  if (!subscription) {
    return <div>Loading...</div>;
  }

  const currentStorage = files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024);
  const storagePercent = subscription.storageLimit === -1 ? 0 : 
    Math.min(100, (currentStorage / subscription.storageLimit * 100));
  const filePercent = subscription.fileLimit === -1 ? 0 :
    Math.min(100, (files.length / subscription.fileLimit * 100));
  const planPrice = getPlanPrice(subscription.plan);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Title level={2} style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>
              My Subscription
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
              Manage your subscription and view usage
            </Text>
          </div>
          <Button
            onClick={() => router.push('/user')}
            style={{ borderRadius: '8px', height: '40px' }}
          >
            Back to Dashboard
          </Button>
        </div>

        <Row gutter={[24, 24]}>
          {/* Current Plan Card */}
          <Col xs={24} lg={16}>
            <Card
              style={{ 
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                marginBottom: '24px'
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <Space align="center" size="large">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    {subscription.plan === 'pro' || subscription.plan === 'enterprise' ? (
                      <CrownOutlined style={{ fontSize: '36px' }} />
                    ) : (
                      <RocketOutlined style={{ fontSize: '36px' }} />
                    )}
                  </div>
                  <div>
                    <Title level={3} style={{ margin: 0, textTransform: 'capitalize' }}>
                      {subscription.plan} Plan
                    </Title>
                    <Space>
                      <Tag color={subscription.status === 'active' ? 'green' : 'orange'}>
                        {subscription.status.toUpperCase()}
                      </Tag>
                      <Text type="secondary">
                        ${planPrice.amount}/{planPrice.interval}
                      </Text>
                    </Space>
                  </div>
                </Space>
                <Button
                  type="primary"
                  size="large"
                  icon={<RocketOutlined />}
                  onClick={() => router.push('/pricing')}
                  style={{
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                  }}
                >
                  {subscription.plan === 'free' ? 'Upgrade Plan' : 'Change Plan'}
                </Button>
              </div>

              <Descriptions bordered column={2} style={{ marginBottom: '24px' }}>
                <Descriptions.Item label="Start Date">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </Descriptions.Item>
                <Descriptions.Item label="Next Billing">
                  {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Storage Limit">
                  {subscription.storageLimit === -1 ? 'Unlimited' : `${subscription.storageLimit} MB`}
                </Descriptions.Item>
                <Descriptions.Item label="File Limit">
                  {subscription.fileLimit === -1 ? 'Unlimited' : subscription.fileLimit}
                </Descriptions.Item>
              </Descriptions>

              {/* Usage Statistics */}
              <div>
                <Title level={5}>Usage Statistics</Title>
                
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>Storage Used</Text>
                    <Text>
                      {currentStorage.toFixed(2)} MB / 
                      {subscription.storageLimit === -1 ? ' Unlimited' : ` ${subscription.storageLimit} MB`}
                    </Text>
                  </div>
                  <Progress 
                    percent={storagePercent}
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    status={storagePercent >= 90 ? 'exception' : 'active'}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <Text strong>Files</Text>
                    <Text>
                      {files.length} / {subscription.fileLimit === -1 ? 'Unlimited' : subscription.fileLimit}
                    </Text>
                  </div>
                  <Progress 
                    percent={filePercent}
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    status={filePercent >= 90 ? 'exception' : 'active'}
                  />
                </div>
              </div>
            </Card>

            {/* Payment History */}
            {subscription.paymentInfo?.transactionId && (
              <Card
                style={{ 
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
                bodyStyle={{ padding: '32px' }}
              >
                <Title level={5}>Payment History</Title>
                <Timeline
                  items={[
                    {
                      color: 'green',
                      children: (
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            Payment Successful - ${subscription.paymentInfo.amount}
                          </div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Transaction ID: {subscription.paymentInfo.transactionId}
                          </Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {new Date(subscription.paymentInfo.lastPaymentDate).toLocaleString()}
                          </Text>
                        </div>
                      ),
                    },
                  ]}
                />
              </Card>
            )}
          </Col>

          {/* Plan Features */}
          <Col xs={24} lg={8}>
            <Card
              style={{ 
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <Title level={5}>Plan Features</Title>
              <div style={{ marginTop: '20px' }}>
                {getPlanFeatures(subscription.plan).map((feature, index) => (
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
                    <Text>{feature}</Text>
                  </div>
                ))}
              </div>

              {subscription.plan === 'free' && (
                <div style={{ marginTop: '24px', padding: '16px', background: '#f0f5ff', borderRadius: '8px' }}>
                  <Paragraph style={{ margin: 0, fontSize: '13px' }}>
                    <strong>💡 Tip:</strong> Upgrade to unlock more storage, files, and premium features!
                  </Paragraph>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
