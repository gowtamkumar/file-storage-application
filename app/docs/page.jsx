'use client';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import {
    ApiOutlined,
    BookOutlined,
    DollarOutlined,
    QuestionCircleOutlined,
    RocketOutlined,
    SafetyCertificateOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { Card, Col, Input, Row, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const { Title, Paragraph } = Typography;

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const docSections = [
    {
      title: 'Getting Started',
      description: 'Learn the basics and get up and running with your account in minutes.',
      icon: <RocketOutlined className="text-4xl text-blue-500" />,
      href: '/docs/getting-started',
      color: '#1890ff',
      delay: 0,
    },
    {
      title: 'User Guide',
      description: 'Complete guide to file management, sharing, and using your dashboard.',
      icon: <BookOutlined className="text-4xl text-green-500" />,
      href: '/docs/user-guide',
      color: '#52c41a',
      delay: 0.1,
    },
    {
      title: 'Admin Guide',
      description: 'Administrator features including user management and analytics.',
      icon: <SafetyCertificateOutlined className="text-4xl text-purple-500" />,
      href: '/docs/admin-guide',
      color: '#722ed1',
      delay: 0.2,
    },
    {
      title: 'Plans & Pricing',
      description: 'Understand subscription tiers, features, and upgrade options.',
      icon: <DollarOutlined className="text-4xl text-orange-500" />,
      href: '/docs/plans',
      color: '#fa8c16',
      delay: 0.3,
    },
    {
      title: 'API Documentation',
      description: 'Integrate file uploads into your applications with our REST API.',
      icon: <ApiOutlined className="text-4xl text-cyan-500" />,
      href: '/docs/api',
      color: '#13c2c2',
      delay: 0.4,
    },
    {
      title: 'FAQ',
      description: 'Frequently asked questions and troubleshooting guides.',
      icon: <QuestionCircleOutlined className="text-4xl text-red-500" />,
      href: '/docs/faq',
      color: '#f5222d',
      delay: 0.5,
    },
  ];

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Title
              level={1}
              style={{
                color: 'white',
                marginBottom: '16px',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              }}
            >
              Documentation
            </Title>
            <Paragraph
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '1.25rem',
                maxWidth: '600px',
                margin: '0 auto 32px',
              }}
            >
              Everything you need to know about using our file storage platform
            </Paragraph>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <Input
                size="large"
                placeholder="Search documentation..."
                prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '16px',
                }}
              />
            </div>
          </motion.div>

          {/* Documentation Cards */}
          <Row gutter={[24, 24]}>
            {filteredSections.map((section) => (
              <Col xs={24} md={12} lg={8} key={section.href}>
                <Link href={section.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: section.delay }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  >
                    <Card
                      hoverable
                      style={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                      bodyStyle={{ padding: '32px' }}
                    >
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          background: `${section.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '20px',
                        }}
                      >
                        {section.icon}
                      </div>
                      <Title level={3} style={{ marginBottom: '12px', fontSize: '1.5rem' }}>
                        {section.title}
                      </Title>
                      <Paragraph style={{ color: '#8c8c8c', margin: 0, fontSize: '1rem' }}>
                        {section.description}
                      </Paragraph>
                    </Card>
                  </motion.div>
                </Link>
              </Col>
            ))}
          </Row>

          {/* Quick Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <Card
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
              }}
              bodyStyle={{ padding: '32px' }}
            >
              <Title level={3} style={{ marginBottom: '16px' }}>
                Popular Topics
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Link href="/docs/getting-started" className="text-blue-600 hover:text-blue-800">
                    → Creating Your Account
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Link href="/docs/user-guide" className="text-blue-600 hover:text-blue-800">
                    → Uploading Files
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Link href="/docs/api" className="text-blue-600 hover:text-blue-800">
                    → API Authentication
                  </Link>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Link href="/docs/plans" className="text-blue-600 hover:text-blue-800">
                    → Upgrading Your Plan
                  </Link>
                </Col>
              </Row>
            </Card>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <Card
              style={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.95)',
              }}
              bodyStyle={{ padding: '40px' }}
            >
              <Title level={4} style={{ marginBottom: '8px' }}>
                Can't find what you're looking for?
              </Title>
              <Paragraph style={{ color: '#8c8c8c', fontSize: '1rem' }}>
                Check our <Link href="/docs/faq">FAQ page</Link> or contact our support team for assistance.
              </Paragraph>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
