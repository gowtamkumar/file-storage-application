'use client';

import DocsNav from '@/components/DocsNav';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import {
    BarChartOutlined,
    CrownOutlined,
    DashboardOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Descriptions, Divider, Row, Table, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function AdminGuidePage() {
  const adminFeaturesColumns = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
  ];

  const adminFeaturesData = [
    {
      key: '1',
      feature: 'User Management',
      description: 'View all users, their statistics, and subscription details',
      location: '/dashboard/users',
    },
    {
      key: '2',
      feature: 'Plan Management',
      description: 'Create, edit, and delete subscription plans',
      location: '/dashboard/plans',
    },
    {
      key: '3',
      feature: 'File Overview',
      description: 'View all files uploaded across all users',
      location: '/dashboard',
    },
    {
      key: '4',
      feature: 'Subscription Tracking',
      description: 'Monitor active subscriptions and revenue',
      location: '/dashboard/subscriptions',
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
                    <CrownOutlined style={{ marginRight: '12px', color: '#faad14' }} />
                    Admin Guide
                  </Title>
                  <Paragraph style={{ fontSize: '1.125rem', color: '#8c8c8c', marginBottom: '32px' }}>
                    Comprehensive guide for administrators to manage users, subscriptions, and platform settings.
                  </Paragraph>

                  <Alert
                    message="Admin Access Required"
                    description="The features described in this guide are only available to users with administrator privileges. Regular users will not see these options."
                    type="warning"
                    showIcon
                    style={{ marginBottom: '32px', borderRadius: '8px' }}
                  />

                  {/* Table of Contents */}
                  <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
                    <Title level={4}>On This Page</Title>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li><a href="#becoming-admin">Becoming an Administrator</a></li>
                      <li><a href="#dashboard-overview">Admin Dashboard Overview</a></li>
                      <li><a href="#user-management">User Management</a></li>
                      <li><a href="#plan-management">Plan Management</a></li>
                      <li><a href="#subscription-management">Subscription Management</a></li>
                      <li><a href="#analytics">Analytics & Reporting</a></li>
                    </ul>
                  </Card>

                  {/* Becoming an Administrator */}
                  <div id="becoming-admin">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <UserOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                      Becoming an Administrator
                    </Title>
                    <Paragraph>
                      Administrator access is granted during account registration. When creating an account, select "Admin" as your role.
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px' }}>
                      <Title level={4}>Registration Process</Title>
                      <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>Visit the <Link href="/register">registration page</Link></li>
                        <li>Fill in your name, email, and password</li>
                        <li>In the "Role" dropdown, select <Text strong>"Admin"</Text></li>
                        <li>Complete registration</li>
                        <li>Log in and access the admin dashboard at <Link href="/dashboard">/dashboard</Link></li>
                      </ol>
                    </Card>

                    <Alert
                      message="Admin vs User"
                      description={
                        <>
                          <Text strong>Administrators</Text> can manage all users, plans, and subscriptions through the admin dashboard.
                          <br />
                          <Text strong>Regular Users</Text> can only manage their own files and subscriptions through the user dashboard.
                        </>
                      }
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* Dashboard Overview */}
                  <div id="dashboard-overview">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <DashboardOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
                      Admin Dashboard Overview
                    </Title>
                    <Paragraph>
                      The admin dashboard (<Link href="/dashboard">/dashboard</Link>) provides a centralized interface for managing the entire platform.
                    </Paragraph>

                    <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>
                      Available Admin Features
                    </Title>
                    <Table
                      columns={adminFeaturesColumns}
                      dataSource={adminFeaturesData}
                      pagination={false}
                      bordered
                      style={{ marginBottom: '24px' }}
                    />

                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} md={8}>
                        <Card style={{ height: '100%', textAlign: 'center' }}>
                          <TeamOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '12px' }} />
                          <Title level={4}>User Management</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            View and manage all registered users
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card style={{ height: '100%', textAlign: 'center' }}>
                          <SettingOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '12px' }} />
                          <Title level={4}>Platform Settings</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Configure plans and pricing
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card style={{ height: '100%', textAlign: 'center' }}>
                          <BarChartOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '12px' }} />
                          <Title level={4}>Analytics</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Track usage and revenue metrics
                          </Paragraph>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* User Management */}
                  <div id="user-management">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <TeamOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                      User Management
                    </Title>
                    <Paragraph>
                      The User Management page (<Link href="/dashboard/users">/dashboard/users</Link>) displays all registered users with comprehensive statistics.
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px', marginBottom: '24px' }}>
                      <Title level={4}>User Information Displayed</Title>
                      <Descriptions bordered column={1}>
                        <Descriptions.Item label="Name">Full name of the user</Descriptions.Item>
                        <Descriptions.Item label="Email">User's email address</Descriptions.Item>
                        <Descriptions.Item label="Role">Admin or User</Descriptions.Item>
                        <Descriptions.Item label="Subscription">Current subscription plan</Descriptions.Item>
                        <Descriptions.Item label="File Count">Total number of files uploaded</Descriptions.Item>
                        <Descriptions.Item label="Storage Used">Total storage consumed</Descriptions.Item>
                        <Descriptions.Item label="Registered At">Account creation date</Descriptions.Item>
                      </Descriptions>
                    </Card>

                    <Card style={{ background: '#fff3e0', border: '1px solid #ffe0b2' }}>
                      <Title level={4}>Summary Statistics</Title>
                      <Paragraph>At the top of the user management page, you'll see:</Paragraph>
                      <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                        <li><Text strong>Total Users:</Text> Count of all registered accounts</li>
                        <li><Text strong>Admin Users:</Text> Count of administrator accounts</li>
                        <li><Text strong>Total Files:</Text> All files across all users</li>
                        <li><Text strong>Total Storage:</Text> Combined storage usage</li>
                      </ul>
                    </Card>

                    <Alert
                      message="Search Functionality"
                      description="Use the search bar to filter users by name or email address for quick access."
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* Plan Management */}
                  <div id="plan-management">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <SettingOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
                      Plan Management
                    </Title>
                    <Paragraph>
                      Manage subscription plans from the Plans page (<Link href="/dashboard/plans">/dashboard/plans</Link>).
                    </Paragraph>

                    <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>
                      Available Actions
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Card title="Create New Plan" style={{ height: '100%' }}>
                          <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                            <li>Click "Add New Plan" button</li>
                            <li>Fill in plan details:
                              <ul style={{ marginTop: '8px' }}>
                                <li>Plan name (e.g., "Pro")</li>
                                <li>Description</li>
                                <li>Price and currency</li>
                                <li>Storage limit (in GB)</li>
                                <li>Max file size (in MB)</li>
                                <li>Features list</li>
                              </ul>
                            </li>
                            <li>Click "Create Plan"</li>
                          </ol>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card title="Edit Existing Plan" style={{ height: '100%' }}>
                          <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                            <li>Find the plan in the table</li>
                            <li>Click the "Edit" button</li>
                            <li>Modify the plan details</li>
                            <li>Save changes</li>
                            <li>Changes apply to new subscriptions immediately</li>
                          </ol>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card title="Delete Plan" style={{ height: '100%' }}>
                          <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                            <li>Locate the plan to delete</li>
                            <li>Click the "Delete" button</li>
                            <li>Confirm deletion</li>
                            <li>Plan is removed from system</li>
                          </ol>
                          <Alert
                            message="Warning"
                            description="Deleting a plan may affect users with active subscriptions to that plan."
                            type="warning"
                            showIcon
                            style={{ marginTop: '12px', borderRadius: '8px' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card title="View Plan Details" style={{ height: '100%' }}>
                          <Paragraph>Each plan displays:</Paragraph>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Name and description</li>
                            <li>Pricing information</li>
                            <li>Storage allocation</li>
                            <li>File size limits</li>
                            <li>Feature list</li>
                            <li>Number of active subscribers</li>
                          </ul>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Subscription Management */}
                  <div id="subscription-management">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      Subscription Management
                    </Title>
                    <Paragraph>
                      Track and manage all active subscriptions from the Subscriptions page (<Link href="/dashboard/subscriptions">/dashboard/subscriptions</Link>).
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px', marginBottom: '24px' }}>
                      <Title level={4}>Subscription Details</Title>
                      <Paragraph>For each subscription, you can view:</Paragraph>
                      <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                        <li>User information (name and email)</li>
                        <li>Subscription plan name</li>
                        <li>Start date</li>
                        <li>End date / renewal date</li>
                        <li>Status (Active, Expired, Cancelled)</li>
                        <li>Payment amount and currency</li>
                        <li>Payment method</li>
                      </ul>
                    </Card>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Card style={{ height: '100%' }}>
                          <Title level={4}>📊 Revenue Tracking</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Monitor total revenue, monthly recurring revenue (MRR), and subscription growth trends.
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card style={{ height: '100%' }}>
                          <Title level={4}>🔍 Filtering & Search</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Filter subscriptions by status, plan type, or search for specific users.
                          </Paragraph>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  <Divider />

                  {/* Analytics */}
                  <div id="analytics">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <BarChartOutlined style={{ marginRight: '12px', color: '#13c2c2' }} />
                      Analytics & Reporting
                    </Title>
                    <Paragraph>
                      The admin dashboard provides key metrics to help you understand platform usage and growth.
                    </Paragraph>

                    <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>
                      Key Metrics
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12} md={6}>
                        <Card style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1890ff' }}>🧑‍🤝‍🧑</div>
                          <Title level={4}>User Growth</Title>
                          <Text type="secondary">Total registered users</Text>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Card style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#52c41a' }}>📁</div>
                          <Title level={4}>File Statistics</Title>
                          <Text type="secondary">Total files uploaded</Text>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Card style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#722ed1' }}>💾</div>
                          <Title level={4}>Storage Usage</Title>
                          <Text type="secondary">Total storage consumed</Text>
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <Card style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#fa8c16' }}>💰</div>
                          <Title level={4}>Revenue</Title>
                          <Text type="secondary">Subscription revenue</Text>
                        </Card>
                      </Col>
                    </Row>

                    <Alert
                      message="Real-Time Updates"
                      description="All statistics on the admin dashboard update in real-time as users upload files, create accounts, or purchase subscriptions."
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  {/* Best Practices */}
                  <div style={{ marginTop: '48px' }}>
                    <Title level={3}>💡 Best Practices for Admins</Title>
                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} md={12}>
                        <Card>
                          <Title level={4}>User Management</Title>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Regularly review user accounts for suspicious activity</li>
                            <li>Monitor storage usage patterns</li>
                            <li>Respond promptly to user support requests</li>
                            <li>Keep user data secure and confidential</li>
                          </ul>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card>
                          <Title level={4}>Plan Configuration</Title>
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Test plan changes before deploying</li>
                            <li>Clearly communicate plan benefits to users</li>
                            <li>Set reasonable storage and file size limits</li>
                            <li>Review pricing competitively</li>
                          </ul>
                        </Card>
                      </Col>
                    </Row>
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
                              Understand the user experience
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/plans">
                          <Card hoverable>
                            <Title level={4}>Plans & Pricing</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Learn about subscription tiers
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
