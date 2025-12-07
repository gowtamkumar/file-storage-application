'use client';

import AdDisplay from '@/components/AdDisplay';
import NavBar from '@/components/NavBar';
import PublicUpload from '@/components/PublicUpload';
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  GlobalOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  StarFilled,
  TeamOutlined
} from '@ant-design/icons';
import { Avatar, Button, Collapse, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Footer from '../components/Footer';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavBar />

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-32 pb-32">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-32 -left-24 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-6">
                  New: Team Collaboration Features 🚀
                </span>
                <Title level={1} style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                  Secure Storage for <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Modern Teams
                  </span>
                </Title>
                <Paragraph className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Experience lightning-fast uploads, military-grade encryption, and seamless sharing.
                  The workspace built for the future of work.
                </Paragraph>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/register">
                    <Button type="primary" size="large" icon={<RocketOutlined />} style={{ height: '56px', padding: '0 48px', fontSize: '18px', borderRadius: '12px' }}>
                      Start for Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="large" style={{ height: '56px', padding: '0 48px', fontSize: '18px', borderRadius: '12px' }}>
                      Live Demo
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Public Upload Component */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mt-20 relative perspective-1000"
              >
                <PublicUpload />
              </motion.div>
            </div>
          </div>
        </section>

        <AdDisplay placement="home_top" />

        {/* Stats Section */}
        <section className="py-12 border-y border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatItem number="10M+" label="Files Stored" delay={0} />
              <StatItem number="99.9%" label="Uptime" delay={0.1} />
              <StatItem number="50k+" label="Active Users" delay={0.2} />
              <StatItem number="24/7" label="Support" delay={0.3} />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Title level={2} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Everything you need</Title>
              <Paragraph className="text-xl text-gray-500 max-w-2xl mx-auto">
                Powerful features to help you manage your digital assets with confidence.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<CloudUploadOutlined className="text-4xl text-blue-500" />}
                title="Smart Uploads"
                description="Drag & drop interface with auto-compression and image optimization. Files are resized and metadata stripped for security."
                delay={0}
              />
              <FeatureCard
                icon={<SafetyCertificateOutlined className="text-4xl text-green-500" />}
                title="Bank-Level Security"
                description="File validation, size limits, and secure authentication. Rate limiting protects against abuse."
                delay={0.1}
              />
              <FeatureCard
                icon={<RocketOutlined className="text-4xl text-purple-500" />}
                title="API Access"
                description="Integrate file storage into your own apps with our REST API. Generate API keys from your dashboard."
                delay={0.2}
              />
              <FeatureCard
                icon={<CheckCircleOutlined className="text-4xl text-orange-500" />}
                title="Flexible Plans"
                description="Choose from multiple subscription tiers. Upgrade or downgrade anytime to match your needs."
                delay={0.3}
              />
              <FeatureCard
                icon={<TeamOutlined className="text-4xl text-teal-500" />}
                title="File Management"
                description="Upload, view, and delete your files. Admin dashboard for complete control over your storage."
                delay={0.4}
              />
              <FeatureCard
                icon={<GlobalOutlined className="text-4xl text-indigo-500" />}
                title="Secure Sharing"
                description="Store your files securely and access them from anywhere. Each file gets a unique URL."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Title level={2} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Loved by Developers</Title>
              <Paragraph className="text-xl text-gray-500 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our community has to say.
              </Paragraph>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah Chen"
                role="Frontend Lead @ TechCorp"
                content="The API is a joy to work with. We integrated file uploads into our app in less than an hour."
                delay={0}
              />
              <TestimonialCard
                name="Mark Davis"
                role="Freelance Designer"
                content="Finally, a storage solution that looks good and works perfectly. The sharing features are a lifesaver."
                delay={0.2}
              />
              <TestimonialCard
                name="Alex Rivera"
                role="CTO @ StartupX"
                content="Security was our top priority, and FileStore delivered. The granular permissions are exactly what we needed."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Title level={2} style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Frequently Asked Questions</Title>
            </div>
            <Collapse ghost size="large" expandIconPosition="end">
              <Panel header={<span className="text-lg font-medium">Is there a free plan?</span>} key="1">
                <p className="text-gray-600">Yes! Our free plan includes 5GB of storage and all core features. No credit card required.</p>
              </Panel>
              <Panel header={<span className="text-lg font-medium">How secure is my data?</span>} key="2">
                <p className="text-gray-600">We use AES-256 encryption for files at rest and TLS for data in transit. Your data is safe with us.</p>
              </Panel>
              <Panel header={<span className="text-lg font-medium">Can I upgrade later?</span>} key="3">
                <p className="text-gray-600">Absolutely. You can upgrade or downgrade your plan at any time from your dashboard.</p>
              </Panel>
              <Panel header={<span className="text-lg font-medium">Do you offer an API?</span>} key="4">
                <p className="text-gray-600">Yes, we offer a comprehensive REST API for developers to integrate storage into their applications.</p>
              </Panel>
            </Collapse>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-blue-100 mb-10">
              Join thousands of developers and teams who trust us with their data.
              Start your free trial today.
            </p>
            <Link href="/register">
              <Button size="large" style={{ height: '60px', padding: '0 50px', fontSize: '20px', borderRadius: '12px', border: 'none', color: '#2563eb' }}>
                Create Free Account
              </Button>
            </Link>
            <p className="mt-6 text-sm text-blue-200">No credit card required • Cancel anytime</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
    >
      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <Title level={4} style={{ marginBottom: '1rem' }}>{title}</Title>
      <Paragraph className="text-gray-500 leading-relaxed m-0">
        {description}
      </Paragraph>
    </motion.div>
  );
}

function StatItem({ number, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-500 font-medium">{label}</div>
    </motion.div>
  );
}

function TestimonialCard({ name, role, content, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 bg-gray-50 rounded-2xl border border-gray-100"
    >
      <div className="flex gap-1 text-yellow-400 mb-4">
        <StarFilled /><StarFilled /><StarFilled /><StarFilled /><StarFilled />
      </div>
      <Paragraph className="text-gray-600 text-lg italic mb-6">"{content}"</Paragraph>
      <div className="flex items-center gap-4">
        <Avatar size="large" style={{ backgroundColor: '#bfdbfe', color: '#2563eb' }}>{name[0]}</Avatar>
        <div>
          <div className="font-bold text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </motion.div>
  );
}
