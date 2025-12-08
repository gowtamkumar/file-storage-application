"use client";

import {
  CrownOutlined,
  DollarOutlined,
  HistoryOutlined,
  RocketOutlined,
  SearchOutlined,
  StarOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

const { Title, Text } = Typography;

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscription/all");
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.data);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (plan) => {
    const icons = {
      free: (
        <ThunderboltOutlined style={{ fontSize: "20px", color: "#667eea" }} />
      ),
      basic: <StarOutlined style={{ fontSize: "20px", color: "#f5576c" }} />,
      pro: <RocketOutlined style={{ fontSize: "20px", color: "#00f2fe" }} />,
      enterprise: (
        <CrownOutlined style={{ fontSize: "20px", color: "#38f9d7" }} />
      ),
    };
    return icons[plan] || icons.free;
  };

  const getPlanColor = (plan) => {
    const colors = {
      free: "default",
      basic: "pink",
      pro: "blue",
      enterprise: "green",
    };
    return colors[plan] || "default";
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.userId?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
    const matchesPlan = planFilter === "all" || sub.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedUserTransactions, setSelectedUserTransactions] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUserHistory = async (userId, userName) => {
    setHistoryLoading(true);
    setSelectedUser({ name: userName });
    setHistoryModalVisible(true);
    try {
      const res = await fetch(`/api/admin/transactions?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedUserTransactions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const columns = [
    {
      title: "User",
      key: "user",
      render: (_, record) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => window.location.href = `/dashboard/users/${record.userId?._id}`}
        >
          <div style={{ fontWeight: 500, color: '#1890ff' }}>
            {record.userId?.name || "Unknown"}
          </div>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.userId?.email}
          </Text>
        </div>
      ),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      render: (plan) => (
        <Space>
          {getPlanIcon(plan)}
          <Tag
            color={getPlanColor(plan)}
            style={{ textTransform: "capitalize", fontWeight: 500 }}
          >
            {plan}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "active"
              ? "green"
              : status === "cancelled"
                ? "orange"
                : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Storage Limit",
      dataIndex: "storageLimit",
      key: "storage",
      render: (limit) => (limit === -1 ? "Unlimited" : `${limit} MB`),
    },
    {
      title: "File Limit",
      dataIndex: "fileLimit",
      key: "files",
      render: (limit) => (limit === -1 ? "Unlimited" : limit),
    },
    {
      title: "Features",
      key: "features",
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          {record.features.apiAccess && <div>✓ API Access</div>}
          {record.features.customBranding && <div>✓ Custom Branding</div>}
          {record.features.prioritySupport && <div>✓ Priority Support</div>}
          {record.features.analytics && <div>✓ Analytics</div>}
        </div>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) =>
        record.paymentInfo?.amount ? (
          <div>
            <div style={{ fontWeight: 500 }}>${record.paymentInfo.amount}</div>
            <Text type="secondary" style={{ fontSize: "11px" }}>
              {record.paymentInfo.transactionId}
            </Text>
          </div>
        ) : (
          <Text type="secondary">Free</Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<HistoryOutlined />}
          onClick={() =>
            fetchUserHistory(record.userId._id, record.userId.name)
          }
        >
          History
        </Button>
      ),
    },
  ];

  const historyColumns = [
    {
      title: "Plan",
      dataIndex: "planId",
      key: "planId",
      render: (plan) => (
        <Tag color={getPlanColor(plan)} style={{ textTransform: "capitalize" }}>
          {plan}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) =>
        `${record.currency === "USD" ? "$" : record.currency} ${amount}`,
    },
    {
      title: "Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => <Tag>{method}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "success"
              ? "green"
              : status === "pending"
                ? "blue"
                : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Transaction ID",
      dataIndex: "transactionId",
      key: "transactionId",
      render: (id) => (
        <Text copyable style={{ fontSize: "12px" }}>
          {id}
        </Text>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "100px",
        paddingBottom: "80px",
      }}
    >
      <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            background: "rgba(255, 255, 255, 0.95)",
            padding: "20px 32px",
            borderRadius: "16px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Subscription Management
          </Title>
          <Text style={{ color: "#8c8c8c", fontSize: "14px" }}>
            Monitor and manage all user subscriptions
          </Text>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <Row gutter={[24, 24]} style={{ marginBottom: "24px" }}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <Statistic
                  title={
                    <span
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "14px",
                      }}
                    >
                      Total Subscriptions
                    </span>
                  }
                  value={stats.total}
                  prefix={<UserOutlined />}
                  styles={{ content: { color: "white", fontWeight: 600 } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  background:
                    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                }}
              >
                <Statistic
                  title={
                    <span
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "14px",
                      }}
                    >
                      Active Subscriptions
                    </span>
                  }
                  value={stats.active}
                  prefix={<TeamOutlined />}
                  styles={{ content: { color: "white", fontWeight: 600 } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                }}
              >
                <Statistic
                  title={
                    <span
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        fontSize: "14px",
                      }}
                    >
                      Total Revenue
                    </span>
                  }
                  value={stats.totalRevenue.toFixed(2)}
                  prefix={<DollarOutlined />}
                  styles={{ content: { color: "white", fontWeight: 600 } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  background:
                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                }}
              >
                <div style={{ color: "white" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      marginBottom: "8px",
                      opacity: 0.9,
                    }}
                  >
                    Plan Distribution
                  </div>
                  <div style={{ fontSize: "12px" }}>
                    <div>Free: {stats.free}</div>
                    <div>Basic: {stats.basic}</div>
                    <div>Pro: {stats.pro}</div>
                    <div>Enterprise: {stats.enterprise}</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Subscriptions Table */}
        <Card
          style={{
            borderRadius: "16px",
            border: "none",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <Title level={4} style={{ margin: 0 }}>
              All Subscriptions ({filteredSubscriptions.length})
            </Title>
            <Space wrap>
              <Input
                placeholder="Search user or email"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: 200 }}
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={setStatusFilter}
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="cancelled">Cancelled</Option>
                <Option value="expired">Expired</Option>
              </Select>
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                onChange={setPlanFilter}
              >
                <Option value="all">All Plans</Option>
                <Option value="free">Free</Option>
                <Option value="basic">Basic</Option>
                <Option value="pro">Pro</Option>
                <Option value="enterprise">Enterprise</Option>
              </Select>
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={filteredSubscriptions}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} subscriptions`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </div>

      <Modal
        title={`Transaction History - ${selectedUser?.name}`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          columns={historyColumns}
          dataSource={selectedUserTransactions}
          rowKey="_id"
          loading={historyLoading}
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(
            135deg,
            #f5f7fa 0%,
            #c3cfe2 100%
          ) !important;
          font-weight: 600 !important;
          color: #262626 !important;
          border-bottom: 2px solid #667eea !important;
        }

        .ant-table-tbody > tr:hover > td {
          background: #f0f5ff !important;
        }
      `}</style>
    </div>
  );
}
