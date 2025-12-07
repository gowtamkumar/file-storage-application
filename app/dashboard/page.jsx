"use client";

import {
  ClockCircleOutlined,
  CloudUploadOutlined,
  CrownOutlined,
  DatabaseOutlined,
  FileOutlined,
  FolderOutlined,
  RocketOutlined,
  TeamOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: <TeamOutlined style={{ fontSize: "32px", color: "#667eea" }} />,
      onClick: () => router.push("/dashboard/users"),
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      title: "View Files",
      description: "Browse all uploaded files",
      icon: <FileOutlined style={{ fontSize: "32px", color: "#f093fb" }} />,
      onClick: () => router.push("/dashboard/file"),
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      title: "Subscriptions",
      description: "Manage user subscriptions",
      icon: <CrownOutlined style={{ fontSize: "32px", color: "#4facfe" }} />,
      onClick: () => router.push("/dashboard/subscriptions"),
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      title: "Plans",
      description: "Configure subscription plans",
      icon: <RocketOutlined style={{ fontSize: "32px", color: "#43e97b" }} />,
      onClick: () => router.push("/dashboard/plans"),
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
  ];

  const recentFilesColumns = [
    {
      title: "File Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FileOutlined />
          <Text ellipsis style={{ maxWidth: "200px" }}>
            {text}
          </Text>
        </div>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) => {
        if (size > 1024 * 1024)
          return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / 1024).toFixed(2)} KB`;
      },
    },
    {
      title: "Views",
      dataIndex: "viewCount",
      key: "viewCount",
      render: (count, record) =>
        record.isPublic ? (
          <Tag color="blue">{count || 0}</Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            -
          </Text>
        ),
    },
    {
      title: "Downloads",
      dataIndex: "downloadCount",
      key: "downloadCount",
      render: (count, record) =>
        record.isPublic ? (
          <Tag color="cyan">{count || 0}</Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            -
          </Text>
        ),
    },
    {
      title: "Uploaded",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "calc(100vh - 64px)",
        background: "#f0f2f5",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <Title level={2} style={{ margin: 0, marginBottom: "8px" }}>
            Admin Dashboard
          </Title>
          <Text type="secondary">Overview of your file storage system</Text>
        </div>

        {/* Statistics Overview */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Total Users"
                value={stats?.overview?.totalUsers || 0}
                prefix={<UserOutlined />}
                valueStyle={{
                  color: "#667eea",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#f0f5ff",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <UserAddOutlined /> +{stats?.overview?.newUsersWeek || 0} this
                  week
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Total Files"
                value={stats?.overview?.totalFiles || 0}
                prefix={<CloudUploadOutlined />}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#f6ffed",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <FolderOutlined /> {stats?.overview?.totalFolders || 0}{" "}
                  folders
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Storage Used"
                value={stats?.overview?.totalStorageMB || 0}
                suffix="MB"
                prefix={<DatabaseOutlined />}
                valueStyle={{
                  color: "#faad14",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#fffbe6",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Across all users
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card loading={loading}>
              <Statistic
                title="Subscriptions"
                value={stats?.overview?.totalSubscriptions || 0}
                prefix={<CrownOutlined />}
                valueStyle={{
                  color: "#f5576c",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#fff1f0",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Active plans
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Analytics Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Views"
                value={stats?.overview?.totalViews || 0}
                prefix={<FileOutlined />}
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#e6f7ff",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Public file views
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Total Downloads"
                value={stats?.overview?.totalDownloads || 0}
                prefix={<CloudUploadOutlined />}
                valueStyle={{
                  color: "#13c2c2",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#e6fffb",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Public file downloads
                </Text>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card loading={loading}>
              <Statistic
                title="Public Files"
                value={stats?.overview?.publicFiles || 0}
                prefix={<FileOutlined />}
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              />
              <div
                style={{
                  marginTop: "12px",
                  padding: "8px 12px",
                  background: "#f9f0ff",
                  borderRadius: "6px",
                }}
              >
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Shared publicly
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Subscription Breakdown */}
        <Card
          title={
            <span>
              <CrownOutlined style={{ marginRight: "8px" }} />
              Subscription Breakdown
            </span>
          }
          style={{ marginBottom: "24px" }}
          loading={loading}
        >
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#8c8c8c",
                  }}
                >
                  {stats?.subscriptionBreakdown?.free || 0}
                </div>
                <Tag color="default">FREE</Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#52c41a",
                  }}
                >
                  {stats?.subscriptionBreakdown?.basic || 0}
                </div>
                <Tag color="green">BASIC</Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#1890ff",
                  }}
                >
                  {stats?.subscriptionBreakdown?.pro || 0}
                </div>
                <Tag color="blue">PRO</Tag>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: "center", padding: "16px" }}>
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#faad14",
                  }}
                >
                  {stats?.subscriptionBreakdown?.enterprise || 0}
                </div>
                <Tag color="gold">ENTERPRISE</Tag>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Quick Actions */}
        <Title level={4} style={{ marginBottom: "16px" }}>
          Quick Actions
        </Title>
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                hoverable
                onClick={action.onClick}
                style={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  transition: "all 0.3s",
                }}
                bodyStyle={{ padding: "24px" }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "12px",
                    background: action.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  {action.icon}
                </div>
                <Title level={5} style={{ marginBottom: "8px", margin: 0 }}>
                  {action.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  {action.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Trending Files */}
        {stats?.trending &&
          (stats.trending.mostViewed.length > 0 ||
            stats.trending.mostDownloaded.length > 0) && (
            <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <span>
                      <FileOutlined
                        style={{ marginRight: "8px", color: "#1890ff" }}
                      />
                      Most Viewed Files
                    </span>
                  }
                  loading={loading}
                >
                  <Table
                    columns={[
                      {
                        title: "File Name",
                        dataIndex: "name",
                        key: "name",
                        render: (text, record) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <FileOutlined />
                            <Text ellipsis style={{ maxWidth: "200px" }}>
                              {text}
                            </Text>
                          </div>
                        ),
                      },
                      {
                        title: "Views",
                        dataIndex: "viewCount",
                        key: "viewCount",
                        render: (count) => <Tag color="blue">{count}</Tag>,
                        sorter: (a, b) => a.viewCount - b.viewCount,
                      },
                      {
                        title: "Downloads",
                        dataIndex: "downloadCount",
                        key: "downloadCount",
                        render: (count) => <Tag color="cyan">{count}</Tag>,
                      },
                      {
                        title: "Share",
                        key: "share",
                        render: (_, record) =>
                          record.shareableId ? (
                            <a
                              href={`/share/${record.shareableId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: "12px" }}
                            >
                              View
                            </a>
                          ) : (
                            "-"
                          ),
                      },
                    ]}
                    dataSource={stats.trending.mostViewed}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  title={
                    <span>
                      <CloudUploadOutlined
                        style={{ marginRight: "8px", color: "#13c2c2" }}
                      />
                      Most Downloaded Files
                    </span>
                  }
                  loading={loading}
                >
                  <Table
                    columns={[
                      {
                        title: "File Name",
                        dataIndex: "name",
                        key: "name",
                        render: (text, record) => (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <FileOutlined />
                            <Text ellipsis style={{ maxWidth: "200px" }}>
                              {text}
                            </Text>
                          </div>
                        ),
                      },
                      {
                        title: "Downloads",
                        dataIndex: "downloadCount",
                        key: "downloadCount",
                        render: (count) => <Tag color="cyan">{count}</Tag>,
                        sorter: (a, b) => a.downloadCount - b.downloadCount,
                      },
                      {
                        title: "Views",
                        dataIndex: "viewCount",
                        key: "viewCount",
                        render: (count) => <Tag color="blue">{count}</Tag>,
                      },
                      {
                        title: "Share",
                        key: "share",
                        render: (_, record) =>
                          record.shareableId ? (
                            <a
                              href={`/share/${record.shareableId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ fontSize: "12px" }}
                            >
                              View
                            </a>
                          ) : (
                            "-"
                          ),
                      },
                    ]}
                    dataSource={stats.trending.mostDownloaded}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                    scroll={{ x: true }}
                  />
                </Card>
              </Col>
            </Row>
          )}

        {/* Recent Files */}
        <Card
          title={
            <span>
              <ClockCircleOutlined style={{ marginRight: "8px" }} />
              Recent Files
            </span>
          }
          loading={loading}
        >
          <Table
            columns={recentFilesColumns}
            dataSource={stats?.recentFiles || []}
            pagination={false}
            size="small"
          />
        </Card>
      </div>
    </div>
  );
}
