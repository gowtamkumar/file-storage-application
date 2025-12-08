"use client";

import DocsNav from "@/components/DocsNav";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import {
  CheckCircleOutlined,
  CloudUploadOutlined,
  KeyOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Alert, Card, Col, Row, Steps, Timeline, Typography } from "antd";
import { motion } from "framer-motion";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

export default function GettingStartedPage() {
  return (
    <>
      <NavBar />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          paddingTop: "100px",
          paddingBottom: "80px",
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
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    background: "rgba(255, 255, 255, 0.95)",
                  }}
                >
                  <Title level={1} style={{ marginBottom: "16px" }}>
                    Getting Started
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "1.125rem",
                      color: "#8c8c8c",
                      marginBottom: "32px",
                    }}
                  >
                    Welcome! This guide will help you get up and running with
                    your file storage account in just a few minutes.
                  </Paragraph>

                  <Alert
                    message="Quick Start"
                    description="You'll be uploading your first file in less than 5 minutes!"
                    type="info"
                    showIcon
                    style={{ marginBottom: "32px", borderRadius: "8px" }}
                  />

                  {/* Steps Overview */}
                  <Title
                    level={2}
                    style={{ marginTop: "40px", marginBottom: "24px" }}
                  >
                    Overview
                  </Title>
                  <Steps
                    direction="vertical"
                    current={-1}
                    items={[
                      {
                        title: "Create Your Account",
                        description: "Sign up for a free account",
                        icon: <UserAddOutlined />,
                      },
                      {
                        title: "Log In",
                        description: "Access your dashboard",
                        icon: <LoginOutlined />,
                      },
                      {
                        title: "Upload Your First File",
                        description: "Upload and share files instantly",
                        icon: <CloudUploadOutlined />,
                      },
                      {
                        title: "Generate API Key",
                        description: "Optional: For programmatic access",
                        icon: <KeyOutlined />,
                      },
                    ]}
                    style={{ marginBottom: "48px" }}
                  />

                  {/* Step 1: Create Account */}
                  <div id="create-account">
                    <Title
                      level={2}
                      style={{ marginTop: "48px", marginBottom: "24px" }}
                    >
                      <UserAddOutlined
                        style={{ marginRight: "12px", color: "#1890ff" }}
                      />
                      Step 1: Create Your Account
                    </Title>
                    <Card
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        marginBottom: "24px",
                      }}
                    >
                      <Timeline
                        items={[
                          {
                            children: (
                              <>
                                <Text strong>
                                  Navigate to the registration page
                                </Text>
                                <br />
                                <Text type="secondary">
                                  Visit <Link href="/register">/register</Link>{" "}
                                  or click "Start for Free" on the homepage
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Fill in your details</Text>
                                <br />
                                <Text type="secondary">
                                  • Full Name
                                  <br />
                                  • Email address
                                  <br />
                                  • Secure password (minimum 6 characters)
                                  <br />• Role (select "User" for regular
                                  account or "Admin" for administrative access)
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Click "Register"</Text>
                                <br />
                                <Text type="secondary">
                                  Your account will be created instantly
                                </Text>
                              </>
                            ),
                          },
                        ]}
                      />
                    </Card>
                    <Alert
                      message="Default Plan"
                      description="All new accounts start with the Free plan (5GB storage). You can upgrade anytime from the pricing page."
                      type="success"
                      showIcon
                      style={{ marginBottom: "24px", borderRadius: "8px" }}
                    />
                  </div>

                  {/* Step 2: Log In */}
                  <div id="log-in">
                    <Title
                      level={2}
                      style={{ marginTop: "48px", marginBottom: "24px" }}
                    >
                      <LoginOutlined
                        style={{ marginRight: "12px", color: "#52c41a" }}
                      />
                      Step 2: Log In to Your Dashboard
                    </Title>
                    <Card
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        marginBottom: "24px",
                      }}
                    >
                      <Timeline
                        items={[
                          {
                            children: (
                              <>
                                <Text strong>Go to the login page</Text>
                                <br />
                                <Text type="secondary">
                                  Visit <Link href="/login">/login</Link>
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Enter your credentials</Text>
                                <br />
                                <Text type="secondary">
                                  • Email address
                                  <br />• Password
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Access your dashboard</Text>
                                <br />
                                <Text type="secondary">
                                  • Regular users →{" "}
                                  <Link href="/user">/user</Link>
                                  <br />• Administrators →{" "}
                                  <Link href="/dashboard">/dashboard</Link>
                                </Text>
                              </>
                            ),
                          },
                        ]}
                      />
                    </Card>
                  </div>

                  {/* Step 3: Upload First File */}
                  <div id="upload-file">
                    <Title
                      level={2}
                      style={{ marginTop: "48px", marginBottom: "24px" }}
                    >
                      <CloudUploadOutlined
                        style={{ marginRight: "12px", color: "#722ed1" }}
                      />
                      Step 3: Upload Your First File
                    </Title>
                    <Card
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        marginBottom: "24px",
                      }}
                    >
                      <Paragraph>
                        <Text strong>
                          From your dashboard, you have two ways to upload
                          files:
                        </Text>
                      </Paragraph>
                      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
                        <Col xs={24} md={12}>
                          <Card
                            size="small"
                            title="Method 1: Click Upload Button"
                            style={{ background: "white" }}
                          >
                            <ol style={{ paddingLeft: "20px", margin: 0 }}>
                              <li>
                                Click the "Upload Files" button in the upload
                                card
                              </li>
                              <li>Select one or more files from your device</li>
                              <li>Wait for the upload to complete</li>
                              <li>Your files appear in the table below</li>
                            </ol>
                          </Card>
                        </Col>
                        <Col xs={24} md={12}>
                          <Card
                            size="small"
                            title="Method 2: Drag & Drop"
                            style={{ background: "white" }}
                          >
                            <ol style={{ paddingLeft: "20px", margin: 0 }}>
                              <li>Drag files from your file explorer</li>
                              <li>Drop them onto the upload area</li>
                              <li>Files upload automatically</li>
                              <li>See them appear in your file list</li>
                            </ol>
                          </Card>
                        </Col>
                      </Row>
                    </Card>
                    <Alert
                      title="File Limits"
                      description="Supported file types: Images (JPG, PNG, GIF), Documents (PDF, DOC, TXT), and more. Maximum file size depends on your plan (5MB for Free plan)."
                      type="warning"
                      showIcon
                      style={{ marginBottom: "24px", borderRadius: "8px" }}
                    />
                  </div>

                  {/* Step 4: Understanding Your Dashboard */}
                  <div id="dashboard-overview">
                    <Title
                      level={2}
                      style={{ marginTop: "48px", marginBottom: "24px" }}
                    >
                      Understanding Your Dashboard
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Card
                          hoverable
                          style={{ height: "100%" }}
                          bodyStyle={{ padding: "24px" }}
                        >
                          <CheckCircleOutlined
                            style={{
                              fontSize: "32px",
                              color: "#1890ff",
                              marginBottom: "12px",
                            }}
                          />
                          <Title level={4}>File Management</Title>
                          <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                            View all your uploaded files in a table with
                            filename, size, upload date, and actions.
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card
                          hoverable
                          style={{ height: "100%" }}
                          bodyStyle={{ padding: "24px" }}
                        >
                          <CheckCircleOutlined
                            style={{
                              fontSize: "32px",
                              color: "#52c41a",
                              marginBottom: "12px",
                            }}
                          />
                          <Title level={4}>File URLs</Title>
                          <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                            Each file gets a unique, shareable URL. Click "Copy"
                            to copy the link and share it anywhere.
                          </Paragraph>
                        </Card>
                      </Col>
                      <Col xs={24} md={8}>
                        <Card
                          hoverable
                          style={{ height: "100%" }}
                          bodyStyle={{ padding: "24px" }}
                        >
                          <CheckCircleOutlined
                            style={{
                              fontSize: "32px",
                              color: "#722ed1",
                              marginBottom: "12px",
                            }}
                          />
                          <Title level={4}>Storage Stats</Title>
                          <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                            Monitor your storage usage and see how many files
                            you've uploaded.
                          </Paragraph>
                        </Card>
                      </Col>
                    </Row>
                  </div>

                  {/* Optional: Generate API Key */}
                  <div id="api-key">
                    <Title
                      level={2}
                      style={{ marginTop: "48px", marginBottom: "24px" }}
                    >
                      <KeyOutlined
                        style={{ marginRight: "12px", color: "#fa8c16" }}
                      />
                      Optional: Generate API Key
                    </Title>
                    <Paragraph>
                      If you want to integrate file uploads into your own
                      applications, you can generate an API key.
                    </Paragraph>
                    <Card
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        marginBottom: "24px",
                      }}
                    >
                      <Timeline
                        items={[
                          {
                            children: (
                              <>
                                <Text strong>
                                  Navigate to the API Key section
                                </Text>
                                <br />
                                <Text type="secondary">
                                  Found at the top of your user dashboard
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Click "Generate API Key"</Text>
                                <br />
                                <Text type="secondary">
                                  A new key will be created (this invalidates
                                  any previous key)
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Copy and save your key</Text>
                                <br />
                                <Text type="secondary">
                                  Keep it secure - treat it like a password!
                                </Text>
                              </>
                            ),
                          },
                          {
                            children: (
                              <>
                                <Text strong>Use it in your applications</Text>
                                <br />
                                <Text type="secondary">
                                  Check the{" "}
                                  <Link href="/docs/api">
                                    API Documentation
                                  </Link>{" "}
                                  for integration examples
                                </Text>
                              </>
                            ),
                          },
                        ]}
                      />
                    </Card>
                  </div>

                  {/* Next Steps */}
                  <div id="next-steps">
                    <Title
                      level={2}
                      style={{ marginTop: "48px", marginBottom: "24px" }}
                    >
                      🎉 Next Steps
                    </Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/user-guide">
                          <Card hoverable style={{ height: "100%" }}>
                            <Title level={4}>📚 Read the User Guide</Title>
                            <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                              Learn advanced file management features and
                              sharing options
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/plans">
                          <Card hoverable style={{ height: "100%" }}>
                            <Title level={4}>💎 Explore Plans</Title>
                            <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                              See subscription options and upgrade for more
                              storage
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/api">
                          <Card hoverable style={{ height: "100%" }}>
                            <Title level={4}>🔌 API Integration</Title>
                            <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
                              Integrate file uploads into your applications
                            </Paragraph>
                          </Card>
                        </Link>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Link href="/docs/faq">
                          <Card hoverable style={{ height: "100%" }}>
                            <Title level={4}>❓ FAQ</Title>
                            <Paragraph style={{ margin: 0, color: "#8c8c8c" }}>
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
