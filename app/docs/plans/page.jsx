'use client';

import DocsNav from '@/components/DocsNav';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    CrownOutlined,
    DollarOutlined,
    RocketOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import { Alert, Badge, Card, Col, Divider, Row, Table, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function PlansPage() {
  const planComparisonColumns = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
      width: '30%',
    },
    {
      title: 'Free',
      dataIndex: 'free',
      key: 'free',
      align: 'center',
    },
    {
      title: 'Basic',
      dataIndex: 'basic',
      key: 'basic',
      align: 'center',
    },
    {
      title: 'Pro',
      dataIndex: 'pro',
      key: 'pro',
      align: 'center',
    },
    {
      title: 'Enterprise',
      dataIndex: 'enterprise',
      key: 'enterprise',
      align: 'center',
    },
  ];

  const Check = () => <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />;
  const Cross = () => <CloseCircleOutlined style={{ color: '#d9d9d9', fontSize: '20px' }} />;

  const planComparisonData = [
    {
      key: '1',
      feature: 'Storage Space',
      free: '5 GB',
      basic: '50 GB',
      pro: '500 GB',
      enterprise: 'Unlimited',
    },
    {
      key: '2',
      feature: 'Max File Size',
      free: '5 MB',
      basic: '50 MB',
      pro: '500 MB',
      enterprise: '5 GB',
    },
    {
      key: '3',
      feature: 'File Uploads',
      free: <Check />,
      basic: <Check />,
      pro: <Check />,
      enterprise: <Check />,
    },
    {
      key: '4',
      feature: 'Public File URLs',
      free: <Check />,
      basic: <Check />,
      pro: <Check />,
      enterprise: <Check />,
    },
    {
      key: '5',
      feature: 'API Access',
      free: <Check />,
      basic: <Check />,
      pro: <Check />,
      enterprise: <Check />,
    },
    {
      key: '6',
      feature: 'Priority Support',
      free: <Cross />,
      basic: <Cross />,
      pro: <Check />,
      enterprise: <Check />,
    },
    {
      key: '7',
      feature: 'Custom Domain',
      free: <Cross />,
      basic: <Cross />,
      pro: <Cross />,
      enterprise: <Check />,
    },
    {
      key: '8',
      feature: 'Advanced Analytics',
      free: <Cross />,
      basic: <Cross />,
      pro: <Check />,
      enterprise: <Check />,
    },
    {
      key: '9',
      feature: 'Team Collaboration',
      free: <Cross />,
      basic: <Cross />,
      pro: 'Up to 5 users',
      enterprise: 'Unlimited',
    },
  ];

  return (
    <>
      <NavBar />
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          paddingTop: '100px',
          paddingBottom: '80px',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Row gutter={[32, 32]}>
            {/* Sidebar Navigation */}
            <Col xs={24} lg={6}>
              <DocsNav />
            </Col>

            {/* Main Content */}
            <Col xs={24} lg={18}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  style={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    background: 'rgba(255, 255, 255, 0.95)',
                  }}
                  bodyStyle={{ padding: '48px' }}
                >
                  <Title level={1} style={{ marginBottom: '16px' }}>
                    <DollarOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
                    Plans & Pricing
                  </Title>
                  <Paragraph style={{ fontSize: '1.125rem', color: '#8c8c8c', marginBottom: '32px' }}>
                    Choose the perfect plan for your storage needs. Upgrade or downgrade anytime.
                  </Paragraph>

                  {/* Table of Contents */}
                  <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
                    <Title level={4}>On This Page</Title>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li><a href="#plan-overview">Plan Overview</a></li>
                      <li><a href="#comparison">Feature Comparison</a></li>
                      <li><a href="#upgrade">How to Upgrade</a></li>
                      <li><a href="#payment">Payment Methods</a></li>
                      <li><a href="#faq">Pricing FAQ</a></li>
                    </ul>
                  </Card>

                  {/* Plan Overview */}
                  <div id="plan-overview">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      Plan Overview
                    </Title>
                    <Paragraph>
                      We offer four subscription tiers to match your storage and collaboration needs.
                    </Paragraph>

                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} md={12} lg={6}>
                        <Card
                          hoverable
                          style={{ height: '100%' }}
                          bodyStyle={{ textAlign: 'center', padding: '32px 24px' }}
                        >
                          <RocketOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                          <Title level={3}>Free</Title>
                          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>$0</div>
                          <Text type="secondary">per month</Text>
                          <Divider />
                          <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0 }}>
                            <li>5 GB storage</li>
                            <li>5 MB max file size</li>
                            <li>Basic features</li>
                            <li>Community support</li>
                          </ul>
                          <div style={{ marginTop: '16px' }}>
                            <Tag color="blue">Best for individuals</Tag>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <Card
                          hoverable
                          style={{ height: '100%' }}
                          bodyStyle={{ textAlign: 'center', padding: '32px 24px' }}
                        >
                          <ThunderboltOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                          <Title level={3}>Basic</Title>
                          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>$9</div>
                          <Text type="secondary">per month</Text>
                          <Divider />
                          <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0 }}>
                            <li>50 GB storage</li>
                            <li>50 MB max file size</li>
                            <li>All Free features</li>
                            <li>Email support</li>
                          </ul>
                          <div style={{ marginTop: '16px' }}>
                            <Tag color="green">Popular choice</Tag>
                          </div>
                        </Card>
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <Card
                          hoverable
                          style={{
                            height: '100%',
                            border: '2px solid #722ed1',
                          }}
                          bodyStyle={{ textAlign: 'center', padding: '32px 24px' }}
                        >
                          <Badge.Ribbon text="Recommended" color="purple">
                            <div>
                              <CrownOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
                              <Title level={3}>Pro</Title>
                              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>$29</div>
                              <Text type="secondary">per month</Text>
                              <Divider />
                              <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0 }}>
                                <li>500 GB storage</li>
                                <li>500 MB max file size</li>
                                <li>Priority support</li>
                                <li>Advanced analytics</li>
                                <li>Team features (5 users)</li>
                              </ul>
                              <div style={{ marginTop: '16px' }}>
                                <Tag color="purple">Best value</Tag>
                              </div>
                            </div>
                          </Badge.Ribbon>
                        </Card>
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <Card
                          hoverable
                          style={{ height: '100%' }}
                          bodyStyle={{ textAlign: 'center', padding: '32px 24px' }}
                        >
                          <CrownOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
                          <Title level={3}>Enterprise</Title>
                          <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Custom</div>
                          <Text type="secondary">contact us</Text>
                          <Divider />
                          <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: 0 }}>
                            <li>Unlimited storage</li>
                            <li>5 GB max file size</li>
                            <li>Custom domain</li>
                            <li>24/7 support</li>
                            <li>Unlimited team members</li>
                          </ul>
                          <div style={{ marginTop: '16px' }}>
                            <Tag color="gold">For businesses</Tag>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Feature Comparison */}
                  <div id="comparison">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      Feature Comparison
                    </Title>
                    <Paragraph>
                      Detailed comparison of features across all subscription plans.
                    </Paragraph>

                    <div style={{ overflowX: 'auto', marginTop: '24px' }}>
                      <Table
                        columns={planComparisonColumns}
                        dataSource={planComparisonData}
                        pagination={false}
                        bordered
                        style={{ minWidth: '700px' }}
                      />
                    </div>

                    <Alert
                      message="All Plans Include"
                      description={
                        <ul style={{ marginBottom: 0, paddingLeft: '20px', marginTop: '8px' }}>
                          <li>Secure file storage with encryption</li>
                          <li>Public file URLs for easy sharing</li>
                          <li>Full API access for integrations</li>
                          <li>Web-based dashboard</li>
                          <li>Multi-device access</li>
                        </ul>
                      }
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* How to Upgrade */}
                  <div id="upgrade">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      How to Upgrade Your Plan
                    </Title>
                    <Paragraph>
                      Upgrading your subscription is quick and easy. Your new storage limits take effect immediately.
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px', marginBottom: '24px' }}>
                      <Title level={4}>Upgrade Process</Title>
                      <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>Visit the <Link href="/pricing">Pricing Page</Link></li>
                        <li>Review the available plans</li>
                        <li>Click "Upgrade to [Plan Name]" on your desired plan</li>
                        <li>Complete the payment process (SSLCommerz or Cash on Delivery)</li>
                        <li>Your subscription activates immediately</li>
                        <li>Start enjoying increased storage and features</li>
                      </ol>
                    </Card>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Card style={{ background: '#e6f7ff', border: '1px solid #91d5ff' }}>
                          <Title level={4}>✅ Upgrading Benefits</Title>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Immediate access to new storage limits</li>
                            <li>All existing files remain accessible</li>
                            <li>No data migration needed</li>
                            <li>Pro-rated billing (credit for time remaining)</li>
                          </ul>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card style={{ background: '#fff7e6', border: '1px solid #ffd591' }}>
                          <Title level={4}>⬇️ Downgrading</Title>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Downgrade anytime from your dashboard</li>
                            <li>Takes effect at next billing cycle</li>
                            <li>Files over new limit remain accessible</li>
                            <li>Can't upload new files if over limit</li>
                          </ul>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Payment Methods */}
                  <div id="payment">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      Payment Methods
                    </Title>
                    <Paragraph>
                      We offer multiple secure payment options for your convenience.
                    </Paragraph>

                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} md={12}>
                        <Card
                          title={
                            <span>
                              <DollarOutlined style={{ marginRight: '8px' }} />
                              SSLCommerz
                            </span>
                          }
                          style={{ height: '100%' }}
                        >
                          <Paragraph>
                            Our primary payment gateway supporting:
                          </Paragraph>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Credit & Debit Cards (Visa, Mastercard, Amex)</li>
                            <li>Mobile Banking (bKash, Rocket, Nagad)</li>
                            <li>Internet Banking</li>
                            <li>International Cards</li>
                          </ul>
                          <Alert
                            message="Secure Checkout"
                            description="All transactions are encrypted and processed securely through SSLCommerz."
                            type="success"
                            showIcon
                            style={{ marginTop: '16px', borderRadius: '8px' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card
                          title={
                            <span>
                              <DollarOutlined style={{ marginRight: '8px' }} />
                              Cash on Delivery
                            </span>
                          }
                          style={{ height: '100%' }}
                        >
                          <Paragraph>
                            Pay when we deliver (for select regions):
                          </Paragraph>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Available for annual subscriptions</li>
                            <li>Physical delivery of receipts/documentation</li>
                            <li>Subject to verification</li>
                            <li>Available in major cities only</li>
                          </ul>
                          <Alert
                            message="Note"
                            description="COD orders may take 1-2 business days to activate after payment."
                            type="info"
                            showIcon
                            style={{ marginTop: '16px', borderRadius: '8px' }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Pricing FAQ */}
                  <div id="faq">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      Pricing FAQ
                    </Title>

                    <Card style={{ marginBottom: '16px' }}>
                      <Title level={4}>Can I change my plan later?</Title>
                      <Paragraph style={{ margin: 0 }}>
                        Yes! You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades apply at your next billing cycle.
                      </Paragraph>
                    </Card>

                    <Card style={{ marginBottom: '16px' }}>
                      <Title level={4}>What happens if I exceed my storage limit?</Title>
                      <Paragraph style={{ margin: 0 }}>
                        If you reach your storage limit, you won't be able to upload new files. You can either delete existing files to free up space or upgrade to a higher plan. Your existing files remain accessible.
                      </Paragraph>
                    </Card>

                    <Card style={{ marginBottom: '16px' }}>
                      <Title level={4}>Do you offer refunds?</Title>
                      <Paragraph style={{ margin: 0 }}>
                        We offer a 14-day money-back guarantee for annual subscriptions. Monthly subscriptions are non-refundable but can be cancelled at any time.
                      </Paragraph>
                    </Card>

                    <Card style={{ marginBottom: '16px' }}>
                      <Title level={4}>Is there a discount for annual billing?</Title>
                      <Paragraph style={{ margin: 0 }}>
                        Yes! Annual subscriptions receive a 20% discount compared to monthly billing. Contact our sales team for enterprise custom pricing.
                      </Paragraph>
                    </Card>

                    <Card style={{ marginBottom: '16px' }}>
                      <Title level={4}>Can I get a custom plan?</Title>
                      <Paragraph style={{ margin: 0 }}>
                        Absolutely! Our Enterprise plan is fully customizable. <Link href="/contact">Contact our sales team</Link> to discuss your specific requirements.
                      </Paragraph>
                    </Card>
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: '48px', textAlign: 'center' }}>
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                      }}
                      bodyStyle={{ padding: '48px' }}
                    >
                      <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
                        Ready to get started?
                      </Title>
                      <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', marginBottom: '24px' }}>
                        Choose your plan and start storing files securely today.
                      </Paragraph>
                      <Link href="/pricing">
                        <button
                          style={{
                            background: 'white',
                            color: '#667eea',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 32px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                        >
                          View All Plans
                        </button>
                      </Link>
                    </Card>
                  </div>

                  {/* Related Topics */}
                  <div style={{ marginTop: '48px' }}>
                    <Title level={3}>Related Topics</Title>
                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/user-guide">
                          <Card hoverable>
                            <Title level={4}>User Guide</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Learn how to manage your files and storage
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/faq">
                          <Card hoverable>
                            <Title level={4}>FAQ</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Find answers to common questions
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
}
