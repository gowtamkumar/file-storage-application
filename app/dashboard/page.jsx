'use client';

import { CloudUploadOutlined, CopyOutlined, DatabaseOutlined, DeleteOutlined, DownloadOutlined, FileImageOutlined, FileOutlined, FilePdfOutlined, FileTextOutlined, FileZipOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, message, Modal, Popconfirm, Row, Space, Statistic, Table, Tag, Tooltip, Typography, Upload } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function Dashboard() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/files');
      const data = await res.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      message.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        message.success(`${file.name} uploaded successfully`);
        onSuccess(data.data);
        fetchFiles();
      } else {
        message.error(data.message || `${file.name} upload failed.`);
        onError(new Error(data.message || 'Upload failed'));
      }
    } catch (err) {
      message.error(`${file.name} upload failed.`);
      onError(err);
    } finally {
      setUploading(false);
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
        message.error(data.message || 'Delete failed');
      }
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const copyFileUrl = (path) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    message.success('File URL copied to clipboard!');
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return <FileImageOutlined style={{ fontSize: '32px', color: '#52c41a' }} />;
    if (mimetype.includes('pdf')) return <FilePdfOutlined style={{ fontSize: '32px', color: '#ff4d4f' }} />;
    if (mimetype.includes('zip') || mimetype.includes('rar')) return <FileZipOutlined style={{ fontSize: '32px', color: '#faad14' }} />;
    if (mimetype.includes('text')) return <FileTextOutlined style={{ fontSize: '32px', color: '#1890ff' }} />;
    return <FileOutlined style={{ fontSize: '32px', color: '#722ed1' }} />;
  };

  const handlePreview = (path) => {
    setPreviewImage(path);
    setPreviewVisible(true);
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const imageFiles = files.filter(f => f.mimetype.startsWith('image/')).length;
  const documentFiles = files.filter(f => f.mimetype.includes('pdf') || f.mimetype.includes('document')).length;

  const columns = [
    {
      title: 'Preview',
      key: 'preview',
      width: 100,
      render: (_, record) => (
        <div style={{ cursor: 'pointer' }} onClick={() => record.mimetype.startsWith('image/') && handlePreview(record.path)}>
          {record.mimetype.startsWith('image/') ? 
            <img src={record.path} alt={record.originalName} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} /> :
            getFileIcon(record.mimetype)
          }
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'originalName',
      key: 'name',
      render: (text, record) => (
        <div>
          <a href={record.path} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 500, fontSize: '14px' }}>
            {text}
          </a>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
            {new Date(record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      ),
    },
    {
      title: 'File URL',
      key: 'url',
      render: (_, record) => {
        const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${record.path}`;
        return (
          <Space>
            <Input 
              value={fullUrl} 
              readOnly 
              style={{ width: '300px', borderRadius: '6px' }}
              size="small"
            />
            <Button 
              type="primary" 
              icon={<CopyOutlined />} 
              size="small"
              onClick={() => copyFileUrl(record.path)}
              style={{ borderRadius: '6px' }}
            >
              Copy
            </Button>
          </Space>
        );
      },
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 120,
      render: (size) => {
        if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / 1024).toFixed(2)} KB`;
      },
    },
    {
      title: 'Type',
      dataIndex: 'mimetype',
      key: 'type',
      width: 140,
      render: (type) => {
        const typeMap = {
          'image': { color: 'green', text: 'Image' },
          'pdf': { color: 'red', text: 'PDF' },
          'video': { color: 'purple', text: 'Video' },
          'audio': { color: 'orange', text: 'Audio' },
          'text': { color: 'blue', text: 'Text' },
          'zip': { color: 'gold', text: 'Archive' },
        };
        
        const mainType = type.split('/')[0];
        const config = typeMap[mainType] || { color: 'default', text: type.split('/')[1] };
        
        return <Tag color={config.color} style={{ borderRadius: '4px', fontWeight: 500 }}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Download">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              href={record.path} 
              download 
              size="small"
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete the file"
            description="Are you sure to delete this file?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '100px',
       paddingBottom: '80px',
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '20px 32px',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div>
            <Title level={2} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Admin Dashboard
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>Manage all files and monitor storage</Text>
          </div>
          <Space size="large">
            <Button
              onClick={() => router.push('/dashboard/subscriptions')}
              style={{ 
                borderRadius: '8px',
                height: '40px',
                fontWeight: 500
              }}
            >
              Subscriptions
            </Button>
            <Button 
              href="/api/auth/signout"
              style={{ 
                borderRadius: '8px',
                height: '40px',
                fontWeight: 500
              }}
            >
              Logout
            </Button>
          </Space>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{ 
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
              // bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Files</span>}
                value={files.length}
                prefix={<FileOutlined />}
                // valueStyle={{ color: 'white', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{ 
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
              // bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Total Storage</span>}
                value={(totalSize / (1024 * 1024)).toFixed(2)}
                suffix="MB"
                prefix={<DatabaseOutlined />}
                // valueStyle={{ color: 'white', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{ 
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white'
              }}
              // bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Images</span>}
                value={imageFiles}
                prefix={<FileImageOutlined />}
                // valueStyle={{ color: 'white', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card
              style={{ 
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white'
              }}
              // bodyStyle={{ padding: '24px' }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>Documents</span>}
                value={documentFiles}
                prefix={<FilePdfOutlined />}
                // valueStyle={{ color: 'white', fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Upload Card */}
        <Card 
          style={{ 
            marginBottom: 24,
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
          // bodyStyle={{ padding: '32px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CloudUploadOutlined style={{ color: '#667eea' }} />
                Upload Files
              </Title>
              <p style={{ color: '#8c8c8c', marginTop: 8, marginBottom: 0, fontSize: '13px' }}>
                Upload files and get shareable URLs instantly
              </p>
            </div>
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              multiple
            >
              <Button 
                type="primary" 
                icon={<UploadOutlined />} 
                size="large" 
                loading={uploading}
                style={{ 
                  borderRadius: '10px',
                  height: '48px',
                  padding: '0 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                }}
              >
                Upload Files
              </Button>
            </Upload>
          </div>
        </Card>

        {/* Files Table Card */}
        <Card
          style={{ 
            borderRadius: '16px',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
          // bodyStyle={{ padding: '28px' }}
        >
          <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileOutlined style={{ color: '#667eea' }} />
            All Files ({files.length})
          </Title>
          <Table 
            columns={columns} 
            dataSource={files} 
            rowKey="_id" 
            loading={loading}
            pagination={{ 
              pageSize: 10, 
              showSizeChanger: true, 
              showTotal: (total) => `Total ${total} files`,
              style: { marginTop: '24px' }
            }}
            scroll={{ x: 1200 }}
            style={{ 
              borderRadius: '8px',
            }}
          />
        </Card>
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        style={{ top: 20 }}
      >
        <img src={previewImage} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
      </Modal>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;
          font-weight: 600 !important;
          color: #262626 !important;
          border-bottom: 2px solid #667eea !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #f0f5ff !important;
        }
        
        .ant-btn-primary:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5) !important;
        }
        
        .ant-upload-wrapper .ant-btn {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
