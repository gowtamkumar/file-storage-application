'use client';

import DocsNav from '@/components/DocsNav';
import NavBar from '@/components/NavBar';
import {
  ApiOutlined,
  CodeOutlined,
  CopyOutlined,
  GlobalOutlined,
  RocketOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Alert, Button, Card, Col, Row, Tabs, Tag, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';

const { Title, Text, Paragraph } = Typography;

export default function ApiDocsPage() {
  const router = useRouter();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  const CodeBlock = ({ code, language = 'bash' }) => (
    <div style={{ position: 'relative', background: '#1e1e1e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
      <Button
        type="text"
        icon={<CopyOutlined style={{ color: '#fff' }} />}
        style={{ position: 'absolute', right: '8px', top: '8px' }}
        onClick={() => copyToClipboard(code)}
      />
      <pre style={{ margin: 0, color: '#d4d4d4', fontFamily: 'monospace', overflowX: 'auto' }}>
        <code>{code}</code>
      </pre>
    </div>
  );

  const items = [
    {
      key: 'postman',
      label: (
        <span>
          <RocketOutlined />
          Postman
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Using Postman (Easiest Way)</Title>
          <Paragraph>
            1. Set Method to <Tag color="blue">POST</Tag>
          </Paragraph>
          <Paragraph>
            2. Enter URL:
            <CodeBlock code="http://localhost:3000/api/upload" />
          </Paragraph>
          <Paragraph>
            3. Add Header:
            <ul>
              <li>Key: <Text code>x-api-key</Text></li>
              <li>Value: <Text code>sk_your_api_key...</Text></li>
            </ul>
          </Paragraph>
          <Paragraph>
            4. Select <strong>Body</strong> → <strong>form-data</strong>
            <ul>
              <li>Key: <Text code>file</Text> (Type: File)</li>
              <li>Value: Select your image/file</li>
            </ul>
          </Paragraph>
          <Paragraph>
            5. Click <strong>Send</strong>
          </Paragraph>
        </div>
      ),
    },
    {
      key: 'curl',
      label: (
        <span>
          <CodeOutlined />
          cURL
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Using cURL (Terminal)</Title>
          <Paragraph>Replace the file path with your actual file location.</Paragraph>
          <CodeBlock code={`curl -X POST http://localhost:3000/api/upload \\
  -H "x-api-key: sk_your_api_key..." \\
  -F "file=@/path/to/your/image.png"`} />
        </div>
      ),
    },
    {
      key: 'js',
      label: (
        <span>
          <GlobalOutlined />
          JavaScript (Fetch)
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Using Fetch (React / Next.js)</Title>
          <CodeBlock language="javascript" code={`async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      headers: {
        "x-api-key": "sk_your_api_key...", // Replace with your key
      },
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

// Usage in React component:
// <input type="file" onChange={(e) => uploadImage(e.target.files[0])} />`} />
        </div>
      ),
    },
    {
      key: 'axios',
      label: (
        <span>
          <ThunderboltOutlined />
          Axios
        </span>
      ),
      children: (
        <div>
          <Title level={4}>Using Axios (Node.js / React)</Title>
          <CodeBlock language="javascript" code={`import axios from "axios";

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post("http://localhost:3000/api/upload", formData, {
      headers: {
        "x-api-key": "sk_your_api_key...",
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(res.data);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}`} />
        </div>
      ),
    },
  ];

  return (
    <>
      <NavBar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '100px',
        paddingBottom: '80px',
      }}>
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
                    <ApiOutlined style={{ marginRight: '12px', color: '#667eea' }} />
                    API Documentation
                  </Title>
                  <Paragraph style={{ fontSize: '1.125rem', color: '#8c8c8c', marginBottom: '32px' }}>
                    Simple and powerful file upload API for developers.
                  </Paragraph>

                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Card
                        style={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          background: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        <Title level={3}>Authentication</Title>
                        <Paragraph>
                          Authentication is handled via an API Key. You can generate your API Key from the <a onClick={() => router.push('/user')}>User Dashboard</a>.
                        </Paragraph>
                        <Alert
                          message="Security Note"
                          description="Keep your API key secret. Do not share it publicly or commit it to version control."
                          type="warning"
                          showIcon
                          style={{ marginBottom: '24px', borderRadius: '8px' }}
                        />
                        <Paragraph>
                          Include the API Key in the <Text code>x-api-key</Text> header of your requests.
                        </Paragraph>
                        <CodeBlock code="x-api-key: sk_your_api_key_here" />
                      </Card>
                    </Col>

                    <Col span={24}>
                      <Card
                        style={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          background: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        <Title level={3}>Integration Guide</Title>
                        <Tabs defaultActiveKey="postman" items={items} />
                      </Card>
                    </Col>

                    <Col span={24}>
                      <Card
                        style={{
                          borderRadius: '16px',
                          border: 'none',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          background: 'rgba(255, 255, 255, 0.95)',
                        }}
                      >
                        <Title level={3}>Response Format</Title>
                        <Row gutter={24}>
                          <Col xs={24} md={12}>
                            <Title level={4} type="success">Success Response (200)</Title>
                            <CodeBlock language="json" code={`{
  "success": true,
  "data": {
    "filename": "1732890000000-image.png",
    "originalName": "image.png",
    "path": "/uploads/1732890000000-image.png",
    "size": 1024,
    "mimetype": "image/png",
    "userId": "656..."
  }
}`} />
                          </Col>
                          <Col xs={24} md={12}>
                            <Title level={4} type="danger">Error Response</Title>
                            <CodeBlock language="json" code={`{
  "success": false,
  "message": "Invalid API Key" // or other error message
}`} />
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
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
