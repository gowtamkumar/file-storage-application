'use client';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/transactions');
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      } else {
        message.error(result.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      message.error('Error fetching transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case 'success':
        return <Tag icon={<CheckCircleOutlined />} color="success">Success</Tag>;
      case 'pending':
        return <Tag icon={<SyncOutlined spin />} color="processing">Pending</Tag>;
      case 'failed':
        return <Tag icon={<CloseCircleOutlined />} color="error">Failed</Tag>;
      case 'cancelled':
        return <Tag icon={<CloseCircleOutlined />} color="default">Cancelled</Tag>;
      default:
        return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: 'descend',
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'user',
      render: (user) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 500 }}>{user?.name || 'Unknown'}</span>
          <span style={{ fontSize: '12px', color: '#888' }}>{user?.email}</span>
        </Space>
      ),
    },
    {
      title: 'Transaction ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      copyable: true,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (_, record) => (
        <span style={{ fontWeight: 'bold' }}>
          {record.amount} {record.currency?.toUpperCase()}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Success', value: 'success' },
        { text: 'Pending', value: 'pending' },
        { text: 'Failed', value: 'failed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => router.push(`/dashboard/transactions/${record._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const filteredTransactions = transactions.filter(t =>
    t.transactionId?.toLowerCase().includes(searchText.toLowerCase()) ||
    t.userId?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    t.userId?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Transactions</Title>
        <Input
          placeholder="Search by ID, Name or Email"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={e => setSearchText(e.target.value)}
        />
      </div>

      <Card bordered={false} className="shadow-sm">
        <Table
          columns={columns}
          dataSource={filteredTransactions}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
