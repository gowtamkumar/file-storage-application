'use client';

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileZipOutlined,
  SearchOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminFilesPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [publicFilter, setPublicFilter] = useState('all');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.data);
      } else {
        message.error(data.message || 'Failed to fetch files');
      }
    } catch (error) {
      message.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        message.success('File deleted successfully');
        fetchFiles();
      } else {
        message.error(data.message || 'Failed to delete file');
      }
    } catch (error) {
      message.error('Failed to delete file');
    }
  };

  const copyShareUrl = (shareableId) => {
    const url = `${window.location.origin}/share/${shareableId}`;
    navigator.clipboard.writeText(url);
    message.success('Share URL copied to clipboard!');
  };

  const copyFileUrl = (path) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    message.success('File URL copied to clipboard!');
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.startsWith('image/')) return <FileImageOutlined style={{ fontSize: '24px', color: '#52c41a' }} />;
    if (mimetype?.includes('pdf')) return <FilePdfOutlined style={{ fontSize: '24px', color: '#ff4d4f' }} />;
    if (mimetype?.includes('zip') || mimetype?.includes('rar')) return <FileZipOutlined style={{ fontSize: '24px', color: '#faad14' }} />;
    if (mimetype?.includes('text')) return <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />;
    return <FileOutlined style={{ fontSize: '24px', color: '#722ed1' }} />;
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.originalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.user?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'all' || file.mimetype?.startsWith(typeFilter);

    const matchesPublic =
      publicFilter === 'all' ||
      (publicFilter === 'public' && file.isPublic) ||
      (publicFilter === 'private' && !file.isPublic);

    return matchesSearch && matchesType && matchesPublic;
  });

  const stats = {
    total: files.length,
    public: files.filter(f => f.isPublic).length,
    private: files.filter(f => !f.isPublic).length,
    totalSize: files.reduce((acc, f) => acc + (f.size || 0), 0),
    totalViews: files.reduce((acc, f) => acc + (f.viewCount || 0), 0),
    totalDownloads: files.reduce((acc, f) => acc + (f.downloadCount || 0), 0),
  };

  const columns = [
    {
      title: 'Preview',
      key: 'preview',
      width: 80,
      render: (_, record) => (
        <div>
          {record.mimetype?.startsWith('image/') ? (
            <img
              src={record.path}
              alt={record.originalName}
              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
            />
          ) : (
            getFileIcon(record.mimetype)
          )}
        </div>
      ),
    },
    {
      title: 'File Name',
      dataIndex: 'originalName',
      key: 'name',
      render: (text, record) => (
        <div>
          <a href={record.path} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500 }}>
            {text}
          </a>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            {record.user || 'Unknown User'}
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'mimetype',
      key: 'type',
      width: 120,
      render: (type) => {
        const typeMap = {
          image: { color: 'green', text: 'Image' },
          pdf: { color: 'red', text: 'PDF' },
          video: { color: 'purple', text: 'Video' },
          audio: { color: 'orange', text: 'Audio' },
          text: { color: 'blue', text: 'Text' },
          zip: { color: 'gold', text: 'Archive' },
        };

        const mainType = type?.split('/')[0];
        const config = typeMap[mainType] || { color: 'default', text: type?.split('/')[1] || 'Unknown' };

        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size) => {
        if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / 1024).toFixed(2)} KB`;
      },
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Badge
          status={record.isPublic ? 'success' : 'default'}
          text={record.isPublic ? 'Public' : 'Private'}
        />
      ),
      filters: [
        { text: 'Public', value: true },
        { text: 'Private', value: false },
      ],
      onFilter: (value, record) => record.isPublic === value,
    },
    {
      title: 'Views',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 80,
      render: (count, record) => record.isPublic ? (
        <Tag color="blue" icon={<EyeOutlined />}>{count || 0}</Tag>
      ) : <Text type="secondary">-</Text>,
      sorter: (a, b) => (a.viewCount || 0) - (b.viewCount || 0),
    },
    {
      title: 'Downloads',
      dataIndex: 'downloadCount',
      key: 'downloadCount',
      width: 110,
      render: (count, record) => record.isPublic ? (
        <Tag color="cyan" icon={<CloudDownloadOutlined />}>{count || 0}</Tag>
      ) : <Text type="secondary">-</Text>,
      sorter: (a, b) => (a.downloadCount || 0) - (b.downloadCount || 0),
    },
    {
      title: 'Uploaded',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Copy URL">
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyFileUrl(record.path)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          {record.isPublic && record.shareableId && (
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              title="Copy Share URL"
              onClick={() => copyShareUrl(record.shareableId)}
              size="small"
              style={{ color: '#1890ff' }}
            />
          )}
          <a href={record.path} download>
            <Button
              type="text"
              icon={<CloudDownloadOutlined />}
              title="Download"
              size="small"
              style={{ color: '#52c41a' }}
            />
          </a>
          <Popconfirm
            title="Delete file?"
            description="This action cannot be undone"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} title="Delete" size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              File Management
            </Title>
            <Text type="secondary">View and manage all files across the system</Text>
          </div>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>

        {/* Statistics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <Card>
            <Statistic
              title="Total Files"
              value={stats.total}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#667eea' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Public Files"
              value={stats.public}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Private Files"
              value={stats.private}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Size"
              value={(stats.totalSize / (1024 * 1024)).toFixed(2)}
              suffix="MB"
              prefix={<FileOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Views"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
          <Card>
            <Statistic
              title="Total Downloads"
              value={stats.totalDownloads}
              prefix={<CloudDownloadOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </div>

        {/* Files Table */}
        <Card
          title={
            <Space>
              <FileOutlined />
              <span>All Files ({filteredFiles.length})</span>
            </Space>
          }
          extra={
            <Space>
              <Select
                placeholder="Type"
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 120 }}
              >
                <Option value="all">All Types</Option>
                <Option value="image">Images</Option>
                <Option value="application/pdf">PDFs</Option>
                <Option value="video">Videos</Option>
                <Option value="text">Text</Option>
              </Select>
              <Select
                placeholder="Status"
                value={publicFilter}
                onChange={setPublicFilter}
                style={{ width: 120 }}
              >
                <Option value="all">All Status</Option>
                <Option value="public">Public</Option>
                <Option value="private">Private</Option>
              </Select>
              <Input
                placeholder="Search files..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ width: 300 }}
              />
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={filteredFiles}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} files`,
            }}
            scroll={{ x: 1400 }}
          />
        </Card>
      </div>
    </div>
  );
}
