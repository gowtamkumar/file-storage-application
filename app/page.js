'use client';

import { CloudUploadOutlined, RocketOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}


      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl">
          <Title level={1} style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
            Secure File Storage for <span className="text-blue-600">Modern Teams</span>
          </Title>
          <Paragraph className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload, store, and share your files with enterprise-grade security and a beautiful interface. 
            Built for developers and businesses.
          </Paragraph>
          <Space size="large">
            <Link href="/register">
              <Button type="primary" size="large" icon={<RocketOutlined />} style={{ height: '50px', padding: '0 40px', fontSize: '18px' }}>
                Start for Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="large" style={{ height: '50px', padding: '0 40px', fontSize: '18px' }}>
                Sign In
              </Button>
            </Link>
          </Space>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full px-4 mb-20">
          <FeatureCard 
            icon={<CloudUploadOutlined className="text-4xl text-blue-500" />}
            title="Fast Uploads"
            description="Lightning fast uploads with drag and drop support. Handle large files with ease."
          />
          <FeatureCard 
            icon={<SafetyCertificateOutlined className="text-4xl text-green-500" />}
            title="Secure Storage"
            description="Your files are encrypted and stored securely. Control who has access to your data."
          />
          <FeatureCard 
            icon={<RocketOutlined className="text-4xl text-purple-500" />}
            title="Easy Sharing"
            description="Share files with a single click. Generate public links or share privately."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t">
        © 2024 FileStore. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="mb-4">{icon}</div>
      <Title level={4}>{title}</Title>
      <Paragraph className="text-gray-500">
        {description}
      </Paragraph>
    </div>
  );
}
