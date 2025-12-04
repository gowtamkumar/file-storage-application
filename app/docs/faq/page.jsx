'use client';

import DocsNav from '@/components/DocsNav';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import {
    ApiOutlined,
    LockOutlined,
    QuestionCircleOutlined,
    SafetyCertificateOutlined,
    ToolOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Card, Col, Collapse, Divider, Row, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function FAQPage() {
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
                    <QuestionCircleOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                    Frequently Asked Questions
                  </Title>
                  <Paragraph style={{ fontSize: '1.125rem', color: '#8c8c8c', marginBottom: '32px' }}>
                    Find answers to common questions about our file storage platform.
                  </Paragraph>

                  {/* Quick Links */}
                  <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                    <Col xs={12} sm={8} md={6}>
                      <a href="#general">
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <QuestionCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                          <div style={{ marginTop: '8px', fontSize: '14px' }}>General</div>
                        </Card>
                      </a>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <a href="#account">
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <UserOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                          <div style={{ marginTop: '8px', fontSize: '14px' }}>Account</div>
                        </Card>
                      </a>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <a href="#files">
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <ToolOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                          <div style={{ marginTop: '8px', fontSize: '14px' }}>Files</div>
                        </Card>
                      </a>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <a href="#security">
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                          <div style={{ marginTop: '8px', fontSize: '14px' }}>Security</div>
                        </Card>
                      </a>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <a href="#api">
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <ApiOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />
                          <div style={{ marginTop: '8px', fontSize: '14px' }}>API</div>
                        </Card>
                      </a>
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <a href="#billing">
                        <Card hoverable size="small" style={{ textAlign: 'center' }}>
                          <LockOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />
                          <div style={{ marginTop: '8px', fontSize: '14px' }}>Billing</div>
                        </Card>
                      </a>
                    </Col>
                  </Row>

                  <Divider />

                  {/* General Questions */}
                  <div id="general">
                    <Title level={2} style={{ marginTop: '32px', marginBottom: '24px' }}>
                      <QuestionCircleOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                      General Questions
                    </Title>
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      style={{ background: 'transparent' }}
                    >
                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>What is this file storage platform?</Text>}
                        key="1"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          We provide secure cloud file storage with easy sharing capabilities. Upload files through our web dashboard or API, and get instant public URLs to share your content anywhere. Perfect for developers, content creators, and businesses.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Is there a free plan?</Text>}
                        key="2"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Yes! Our Free plan includes 5GB of storage and access to all core features. No credit card required to get started. You can upgrade to a paid plan anytime for more storage and advanced features.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>What file types can I upload?</Text>}
                        key="3"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          We support all common file types including:
                          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><Text strong>Images:</Text> JPG, PNG, GIF, WebP, SVG</li>
                            <li><Text strong>Documents:</Text> PDF, DOC, DOCX, TXT, RTF</li>
                            <li><Text strong>Archives:</Text> ZIP, RAR, 7Z</li>
                            <li><Text strong>Media:</Text> MP3, MP4, AVI, MOV</li>
                            <li><Text strong>Code:</Text> HTML, CSS, JS, JSON, XML</li>
                          </ul>
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How fast are uploads?</Text>}
                        key="4"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Upload speeds depend on your internet connection. Our servers are optimized for fast transfers, and we support concurrent uploads for multiple files. Typical upload times range from seconds for small files to a few minutes for very large files.
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>

                  <Divider />

                  {/* Account Questions */}
                  <div id="account">
                    <Title level={2} style={{ marginTop: '32px', marginBottom: '24px' }}>
                      <UserOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
                      Account Questions
                    </Title>
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      style={{ background: 'transparent' }}
                    >
                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How do I create an account?</Text>}
                        key="1"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Visit the <Link href="/register">registration page</Link>, fill in your name, email, and password, select your role (User or Admin), and click Register. You'll be able to log in immediately and start uploading files.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>I forgot my password. What should I do?</Text>}
                        key="2"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Click the "Forgot Password" link on the login page. Enter your email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Can I change my email address?</Text>}
                        key="3"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Yes, you can update your email address from your account settings. Log in to your dashboard, navigate to settings, and update your email. You may need to verify the new email address.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How do I delete my account?</Text>}
                        key="4"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          To delete your account, contact our support team. Account deletion is permanent and will remove all your files and data. Please download any files you want to keep before requesting account deletion.
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>

                  <Divider />

                  {/* File Management Questions */}
                  <div id="files">
                    <Title level={2} style={{ marginTop: '32px', marginBottom: '24px' }}>
                      <ToolOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                      File Management Questions
                    </Title>
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      style={{ background: 'transparent' }}
                    >
                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How do I upload files?</Text>}
                        key="1"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          You can upload files in two ways:
                          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><Text strong>Button Upload:</Text> Click the "Upload Files" button on your dashboard and select files</li>
                            <li><Text strong>Drag & Drop:</Text> Drag files from your computer directly onto the upload area</li>
                          </ol>
                          For programmatic uploads, use our <Link href="/docs/api">API</Link>.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How do I share files?</Text>}
                        key="2"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Every uploaded file gets a unique public URL. To share a file:
                          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>Find the file in your files table</li>
                            <li>Click the "Copy" button next to the file URL</li>
                            <li>Share the URL via email, social media, or anywhere else</li>
                          </ol>
                          The URL is publicly accessible - anyone with the link can view or download the file.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Can I recover deleted files?</Text>}
                        key="3"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          No, file deletion is permanent and immediate. Once you delete a file, it cannot be recovered. We recommend downloading important files before deleting them, or being very careful when using the delete function.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>What happens when I reach my storage limit?</Text>}
                        key="4"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          When you reach your storage limit, you won't be able to upload new files. Your existing files remain accessible and can be downloaded or shared. To upload more files, you can either:
                          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>Delete old files to free up space</li>
                            <li><Link href="/pricing">Upgrade to a higher plan</Link> for more storage</li>
                          </ul>
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Can I organize files into folders?</Text>}
                        key="5"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Currently, files are displayed in a flat list on your dashboard. You can use descriptive filenames to organize your content. We're working on adding folder support in a future update.
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>

                  <Divider />

                  {/* Security Questions */}
                  <div id="security">
                    <Title level={2} style={{ marginTop: '32px', marginBottom: '24px' }}>
                      <SafetyCertificateOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
                      Security Questions
                    </Title>
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      style={{ background: 'transparent' }}
                    >
                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How secure is my data?</Text>}
                        key="1"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          We take security seriously:
                          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><Text strong>Encryption:</Text> Files are encrypted at rest using industry-standard encryption</li>
                            <li><Text strong>Secure Transmission:</Text> All uploads use HTTPS/TLS encryption</li>
                            <li><Text strong>Authentication:</Text> Secure password hashing and session management</li>
                            <li><Text strong>Validation:</Text> File type and size validation to prevent malicious uploads</li>
                            <li><Text strong>Rate Limiting:</Text> Protection against abuse and DDoS attacks</li>
                          </ul>
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Are file URLs private?</Text>}
                        key="2"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          No, file URLs are publicly accessible. Anyone with the URL can view or download the file without authentication. This is designed for easy sharing. If you need private file storage with access controls, please contact us about our Enterprise plan.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>What should I do if my API key is compromised?</Text>}
                        key="3"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          If you suspect your API key has been compromised:
                          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>Log in to your dashboard immediately</li>
                            <li>Navigate to the API Key section</li>
                            <li>Click "Generate API Key" to create a new one</li>
                            <li>The old key is immediately invalidated</li>
                            <li>Update your applications with the new key</li>
                          </ol>
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Can I upload sensitive or confidential files?</Text>}
                        key="4"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          We do not recommend uploading highly sensitive or confidential data to our platform, as file URLs are publicly accessible. For sensitive files, consider our Enterprise plan with private storage options or use client-side encryption before uploading.
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>

                  <Divider />

                  {/* API Questions */}
                  <div id="api">
                    <Title level={2} style={{ marginTop: '32px', marginBottom: '24px' }}>
                      <ApiOutlined style={{ marginRight: '12px', color: '#13c2c2' }} />
                      API Questions
                    </Title>
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      style={{ background: 'transparent' }}
                    >
                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How do I get an API key?</Text>}
                        key="1"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          To get an API key:
                          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>Log in to your <Link href="/user">user dashboard</Link></li>
                            <li>Find the "API Key" section at the top</li>
                            <li>Click "Generate API Key"</li>
                            <li>Copy and save your key securely</li>
                          </ol>
                          See our <Link href="/docs/api">API Documentation</Link> for integration examples.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Is the API free to use?</Text>}
                        key="2"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Yes, API access is included in all plans, including the Free plan. Your API uploads count towards your storage limit and must respect your plan's file size restrictions. Rate limits may apply to prevent abuse.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>What programming languages are supported?</Text>}
                        key="3"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Our API is a standard REST API that works with any programming language that can make HTTP requests. We provide code examples in:
                          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>cURL (command line)</li>
                            <li>JavaScript (Fetch & Axios)</li>
                            <li>Python</li>
                            <li>PHP</li>
                            <li>And more!</li>
                          </ul>
                          Check our <Link href="/docs/api">API Documentation</Link> for examples.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Are there rate limits on the API?</Text>}
                        key="4"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Yes, we implement rate limiting to ensure fair usage and prevent abuse. Current limits are:
                          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><Text strong>Free:</Text> 100 requests per hour</li>
                            <li><Text strong>Basic:</Text> 500 requests per hour</li>
                            <li><Text strong>Pro:</Text> 5,000 requests per hour</li>
                            <li><Text strong>Enterprise:</Text> Custom limits</li>
                          </ul>
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>

                  <Divider />

                  {/* Billing Questions */}
                  <div id="billing">
                    <Title level={2} style={{ marginTop: '32px', marginBottom: '24px' }}>
                      <LockOutlined style={{ marginRight: '12px', color: '#eb2f96' }} />
                      Billing Questions
                    </Title>
                    <Collapse
                      ghost
                      expandIconPosition="end"
                      style={{ background: 'transparent' }}
                    >
                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>How do I upgrade my plan?</Text>}
                        key="1"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Visit the <Link href="/pricing">Pricing Page</Link>, select your desired plan, and click "Upgrade". Complete the payment process through SSLCommerz or Cash on Delivery. Your new limits take effect immediately after payment.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Can I cancel my subscription?</Text>}
                        key="2"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Yes, you can cancel your subscription at any time from your dashboard. Your subscription remains active until the end of your current billing period. After cancellation, your account reverts to the Free plan.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Do you offer refunds?</Text>}
                        key="3"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          We offer a 14-day money-back guarantee for annual subscriptions. If you're not satisfied, contact our support team within 14 days of purchase for a full refund. Monthly subscriptions are non-refundable but can be cancelled anytime.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>What payment methods do you accept?</Text>}
                        key="4"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          We accept:
                          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><Text strong>SSLCommerz:</Text> Credit/Debit cards, Mobile banking (bKash, Rocket, Nagad), Internet banking</li>
                            <li><Text strong>Cash on Delivery:</Text> Available for annual subscriptions in select regions</li>
                          </ul>
                          See our <Link href="/docs/plans">Plans & Pricing</Link> page for details.
                        </Paragraph>
                      </Panel>

                      <Panel
                        header={<Text strong style={{ fontSize: '16px' }}>Will my price change if I don't cancel?</Text>}
                        key="5"
                        style={{ marginBottom: '8px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      >
                        <Paragraph>
                          Your subscription price will remain the same as long as you stay subscribed. We occasionally introduce new pricing for new customers, but existing subscribers are grandfathered at their current rate. We'll always notify you in advance if pricing changes affect your subscription.
                        </Paragraph>
                      </Panel>
                    </Collapse>
                  </div>

                  <Divider />

                  {/* Still Have Questions */}
                  <div style={{ marginTop: '48px', textAlign: 'center' }}>
                    <Card
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                      }}
                      bodyStyle={{ padding: '48px' }}
                    >
                      <Title level={2} style={{ color: 'white', marginBottom: '16px' }}>
                        Still Have Questions?
                      </Title>
                      <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.125rem', marginBottom: '0' }}>
                        Can't find the answer you're looking for? Contact our support team at{' '}
                        <Text strong style={{ color: 'white' }}>support@filestorage.com</Text> or check out our other documentation pages.
                      </Paragraph>
                    </Card>
                  </div>

                  {/* Related Topics */}
                  <div style={{ marginTop: '32px' }}>
                    <Title level={3}>Related Topics</Title>
                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} sm={12} md={8}>
                        <Link href="/docs/getting-started">
                          <Card hoverable>
                            <Title level={4}>Getting Started</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              New to the platform? Start here
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Link href="/docs/user-guide">
                          <Card hoverable>
                            <Title level={4}>User Guide</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Learn about file management
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12} md={8}>
                        <Link href="/docs/api">
                          <Card hoverable>
                            <Title level={4}>API Docs</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Integrate with your applications
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
