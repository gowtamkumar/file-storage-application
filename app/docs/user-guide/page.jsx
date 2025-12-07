'use client';

import DocsNav from '@/components/DocsNav';
import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import {
  ApiOutlined,
  CloudUploadOutlined,
  CopyOutlined,
  EyeOutlined,
  FileOutlined,
  FolderOpenOutlined,
  LinkOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { Alert, Card, Col, Divider, Row, Table, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function UserGuidePage() {
  const fileActionsColumns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const fileActionsData = [
    {
      key: '1',
      action: 'Copy URL',
      description: 'Click the "Copy" button to copy the file\'s public URL to your clipboard',
    },
    {
      key: '2',
      action: 'View File',
      description: 'Click the eye icon to open the file in a new browser tab',
    },
    {
      key: '3',
      action: 'Delete File',
      description: 'Click the trash icon to permanently delete the file (requires confirmation)',
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
                >
                  <Title level={1} style={{ marginBottom: '16px' }}>
                    User Guide
                  </Title>
                  <Paragraph style={{ fontSize: '1.125rem', color: '#8c8c8c', marginBottom: '32px' }}>
                    Complete guide to managing your files, sharing content, and using the dashboard effectively.
                  </Paragraph>

                  {/* Table of Contents */}
                  <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
                    <Title level={4}>On This Page</Title>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li><a href="#uploading">Uploading Files</a></li>
                      <li><a href="#managing">Managing Your Files</a></li>
                      <li><a href="#sharing">Sharing Files</a></li>
                      <li><a href="#api-keys">API Keys</a></li>
                      <li><a href="#storage">Understanding Storage</a></li>
                      <li><a href="#best-practices">Best Practices</a></li>
                    </ul>
                  </Card>

                  {/* Uploading Files */}
                  <div id="uploading">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <CloudUploadOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
                      Uploading Files
                    </Title>
                    <Paragraph>
                      The file upload system is designed to be simple and intuitive. You have multiple ways to upload files to your account.
                    </Paragraph>

                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} md={12}>
                        <Card
                          title={
                            <span>
                              <FileOutlined style={{ marginRight: '8px' }} />
                              Button Upload
                            </span>
                          }
                          style={{ height: '100%' }}
                        >
                          <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                            <li>Navigate to your dashboard at <Link href="/user">/user</Link></li>
                            <li>Look for the upload card at the top of the page</li>
                            <li>Click the "Upload Files" button</li>
                            <li>Select one or more files from the file picker</li>
                            <li>Files will upload automatically</li>
                            <li>See your files appear in the table below</li>
                          </ol>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card
                          title={
                            <span>
                              <FolderOpenOutlined style={{ marginRight: '8px' }} />
                              Drag & Drop
                            </span>
                          }
                          style={{ height: '100%' }}
                        >
                          <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                            <li>Open your file explorer/finder</li>
                            <li>Select the files you want to upload</li>
                            <li>Drag them over to your dashboard</li>
                            <li>Drop them onto the upload area</li>
                            <li>Files upload automatically</li>
                            <li>Watch the progress in real-time</li>
                          </ol>
                        </Card>
                      </Col>
                    </Row>

                    <Alert
                      message="Supported File Types"
                      description={
                        <>
                          <Text strong>Images:</Text> JPG, JPEG, PNG, GIF, WebP, SVG
                          <br />
                          <Text strong>Documents:</Text> PDF, DOC, DOCX, TXT, RTF
                          <br />
                          <Text strong>Archives:</Text> ZIP, RAR, 7Z
                          <br />
                          <Text strong>Others:</Text> MP3, MP4, and more
                        </>
                      }
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* Managing Files */}
                  <div id="managing">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <FileOutlined style={{ marginRight: '12px', color: '#52c41a' }} />
                      Managing Your Files
                    </Title>
                    <Paragraph>
                      All your uploaded files are displayed in an organized table with comprehensive information and quick actions.
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px' }}>
                      <Title level={4}>File Table Columns</Title>
                      <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                        <li><Text strong>Filename:</Text> The original name of your file</li>
                        <li><Text strong>Size:</Text> File size in KB or MB</li>
                        <li><Text strong>Uploaded At:</Text> Date and time of upload</li>
                        <li><Text strong>File URL:</Text> The public URL with a copy button</li>
                        <li><Text strong>Actions:</Text> Quick action buttons</li>
                      </ul>
                    </Card>

                    <Title level={4} style={{ marginTop: '32px', marginBottom: '16px' }}>
                      Available Actions
                    </Title>
                    <Table
                      columns={fileActionsColumns}
                      dataSource={fileActionsData}
                      pagination={false}
                      bordered
                      style={{ marginBottom: '24px' }}
                    />

                    <Alert
                      message="Permanent Deletion"
                      description="When you delete a file, it is permanently removed from our servers. This action cannot be undone, so please be careful."
                      type="warning"
                      showIcon
                      style={{ marginTop: '16px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* Sharing Files */}
                  <div id="sharing">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <LinkOutlined style={{ marginRight: '12px', color: '#722ed1' }} />
                      Sharing Files
                    </Title>
                    <Paragraph>
                      Every file you upload gets a unique, publicly accessible URL that you can share with anyone.
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px', marginBottom: '24px' }}>
                      <Title level={4}>
                        <CopyOutlined style={{ marginRight: '8px' }} />
                        How to Share a File
                      </Title>
                      <ol style={{ paddingLeft: '20px', marginBottom: 0 }}>
                        <li>Locate your file in the files table</li>
                        <li>Find the "File URL" column</li>
                        <li>Click the <Text code>Copy</Text> button next to the URL</li>
                        <li>The full URL is now in your clipboard</li>
                        <li>Paste and share it anywhere (email, chat, social media, etc.)</li>
                      </ol>
                    </Card>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Card style={{ height: '100%' }}>
                          <EyeOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '12px' }} />
                          <Title level={4}>Public Access</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            File URLs are publicly accessible. Anyone with the link can view or download the file without authentication.
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card style={{ height: '100%' }}>
                          <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '12px' }} />
                          <Title level={4}>Permanent Links</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            URLs remain active until you delete the file. Perfect for embedding in websites, apps, or documents.
                          </Paragraph>
                        </Card>
                      </Col>
                    </Row>

                    <Alert
                      message="URL Format"
                      description={
                        <>
                          <Text code>https://yourdomain.com/uploads/[timestamp]-[filename]</Text>
                          <br />
                          <br />
                          Example: <Text code>https://yourdomain.com/uploads/1733306400000-image.png</Text>
                        </>
                      }
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* API Keys */}
                  <div id="api-keys">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      <ApiOutlined style={{ marginRight: '12px', color: '#fa8c16' }} />
                      API Keys
                    </Title>
                    <Paragraph>
                      API keys allow you to programmatically upload files from your own applications and services.
                    </Paragraph>

                    <Card style={{ background: '#f9fafb', border: '1px solid #e5e7eb', marginTop: '24px', marginBottom: '24px' }}>
                      <Title level={4}>Generating an API Key</Title>
                      <ol style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                        <li>Navigate to your <Link href="/user">user dashboard</Link></li>
                        <li>Look for the "API Key" section at the top</li>
                        <li>Click the "Generate API Key" button</li>
                        <li>Your new key will appear instantly</li>
                        <li>Click "Copy" to save it securely</li>
                      </ol>
                      <Alert
                        message="Important: Regenerating Keys"
                        description="Generating a new API key will invalidate your previous key. Any applications using the old key will stop working."
                        type="warning"
                        showIcon
                        style={{ borderRadius: '8px' }}
                      />
                    </Card>

                    <Card style={{ background: '#fff3e0', border: '1px solid #ffe0b2', marginBottom: '24px' }}>
                      <Title level={4}>🔒 Security Best Practices</Title>
                      <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                        <li>Treat your API key like a password - never share it publicly</li>
                        <li>Don't commit API keys to version control (Git, SVN, etc.)</li>
                        <li>Use environment variables in your applications</li>
                        <li>Regenerate your key if you suspect it has been compromised</li>
                        <li>Different projects should use different accounts/keys</li>
                      </ul>
                    </Card>

                    <Paragraph>
                      <Text strong>Ready to integrate?</Text> Check out our{' '}
                      <Link href="/docs/api">API Documentation</Link> for code examples in cURL, JavaScript, Python, and more.
                    </Paragraph>
                  </div>

                  <Divider />

                  {/* Understanding Storage */}
                  <div id="storage">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      Understanding Storage
                    </Title>
                    <Paragraph>
                      Your storage usage is tracked in real-time and displayed on your dashboard.
                    </Paragraph>

                    <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                      <Col xs={24} md={8}>
                        <Card style={{ textAlign: 'center', height: '100%' }}>
                          <div style={{ fontSize: '48px', color: '#1890ff', marginBottom: '8px' }}>📊</div>
                          <Title level={4}>Storage Limit</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Based on your subscription plan (5GB for Free, 100GB for Pro, etc.)
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card style={{ textAlign: 'center', height: '100%' }}>
                          <div style={{ fontSize: '48px', color: '#52c41a', marginBottom: '8px' }}>📈</div>
                          <Title level={4}>Current Usage</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Total size of all files currently stored in your account
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card style={{ textAlign: 'center', height: '100%' }}>
                          <div style={{ fontSize: '48px', color: '#722ed1', marginBottom: '8px' }}>🔄</div>
                          <Title level={4}>File Count</Title>
                          <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                            Total number of files you've uploaded
                          </Paragraph>
                        </Card>
                      </Col>
                    </Row>

                    <Alert
                      message="Reaching Your Limit"
                      description={
                        <>
                          When you reach your storage limit, you won't be able to upload new files. You can either delete old files to free up space or{' '}
                          <Link href="/pricing">upgrade your plan</Link> for more storage.
                        </>
                      }
                      type="info"
                      showIcon
                      style={{ marginTop: '24px', borderRadius: '8px' }}
                    />
                  </div>

                  <Divider />

                  {/* Best Practices */}
                  <div id="best-practices">
                    <Title level={2} style={{ marginTop: '48px', marginBottom: '24px' }}>
                      💡 Best Practices
                    </Title>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12}>
                        <Card
                          title="File Organization"
                          style={{ height: '100%' }}
                        >
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Use descriptive filenames</li>
                            <li>Include dates in filename for time-sensitive files</li>
                            <li>Avoid special characters in filenames</li>
                            <li>Keep filenames concise but meaningful</li>
                          </ul>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card
                          title="Storage Management"
                          style={{ height: '100%' }}
                        >
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Regularly review and delete unused files</li>
                            <li>Compress large files before uploading</li>
                            <li>Optimize images to reduce file size</li>
                            <li>Monitor your storage usage</li>
                          </ul>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card
                          title="Security"
                          style={{ height: '100%' }}
                        >
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Don't upload sensitive/confidential data</li>
                            <li>Remember that file URLs are public</li>
                            <li>Delete files you no longer need shared</li>
                            <li>Keep your API keys secure</li>
                          </ul>
                        </Card>
                      </Col>
                      <Col xs={24} md={12}>
                        <Card
                          title="Performance"
                          style={{ height: '100%' }}
                        >
                          <ul style={{ marginBottom: 0, paddingLeft: '20px' }}>
                            <li>Upload files during off-peak hours for faster speeds</li>
                            <li>Use the API for bulk uploads</li>
                            <li>Check file size limits for your plan</li>
                            <li>Ensure stable internet connection</li>
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
                        <Link href="/docs/api">
                          <Card hoverable>
                            <Title level={4}>API Documentation</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Learn how to upload files programmatically
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/plans">
                          <Card hoverable>
                            <Title level={4}>Plans & Pricing</Title>
                            <Paragraph style={{ margin: 0, color: '#8c8c8c' }}>
                              Explore subscription options for more storage
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
