'use client';

import { CopyOutlined, DatabaseOutlined, DeleteOutlined, DownloadOutlined, FileImageOutlined, FileOutlined, FilePdfOutlined, FileTextOutlined, FileZipOutlined, FolderAddOutlined, FolderOpenOutlined, FolderOutlined, HomeOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined, UploadOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Form, Input, Layout, message, Modal, Popconfirm, Select, Space, Table, Tag, Tooltip, Typography, Upload } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderForm] = Form.useForm();
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [fileToMove, setFileToMove] = useState(null);
  const [selectedTargetFolder, setSelectedTargetFolder] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [currentFolderId]);

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/folders');
      const data = await res.json();
      if (data.success) {
        setFolders(data.data);
      }
    } catch (error) {
      message.error('Failed to fetch folders');
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const url = currentFolderId ? `/api/files?folderId=${currentFolderId}` : '/api/files?folderId=null';
      const res = await fetch(url);
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
    if (currentFolderId) {
      formData.append('folderId', currentFolderId);
    }
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

  const handleCreateFolder = async (values) => {
    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.folderName }),
      });
      const data = await res.json();
      if (data.success) {
        message.success('Folder created successfully');
        setFolderModalVisible(false);
        folderForm.resetFields();
        fetchFolders();
      } else {
        message.error(data.message || 'Failed to create folder');
      }
    } catch (error) {
      message.error('Failed to create folder');
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        message.success(data.message || 'Folder deleted successfully');
        fetchFolders();
        fetchFiles();
        if (currentFolderId === id) {
          setCurrentFolderId(null);
        }
      } else {
        message.error(data.message || 'Delete failed');
      }
    } catch (error) {
      message.error('Delete failed');
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

  const handleMoveFile = async () => {
    if (!fileToMove) return;
    
    try {
      const res = await fetch(`/api/files/${fileToMove}/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folderId: selectedTargetFolder || null }),
      });
      const data = await res.json();
      if (data.success) {
        message.success('File moved successfully');
        setMoveModalVisible(false);
        setFileToMove(null);
        setSelectedTargetFolder('');
        fetchFiles();
      } else {
        message.error(data.message || 'Failed to move file');
      }
    } catch (error) {
      message.error('Failed to move file');
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
      width: 80,
      render: (_, record) => (
        <div style={{ cursor: 'pointer' }} onClick={() => record.mimetype.startsWith('image/') && handlePreview(record.path)}>
          {record.mimetype.startsWith('image/') ? 
            <img src={record.path} alt={record.originalName} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} /> :
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
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '2px' }}>
            {new Date(record.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
        </div>
      ),
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
    },
    {
      title: 'Type',
      dataIndex: 'mimetype',
      key: 'type',
      width: 120,
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
        
        return <Tag color={config.color} style={{ borderRadius: '4px' }}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
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
          <Tooltip title="Download">
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              href={record.path} 
              download 
              size="small"
              style={{ color: '#52c41a' }}
            />
          </Tooltip>
          <Tooltip title="Move">
            <Button 
              type="text" 
              icon={<SwapOutlined />} 
              size="small"
              style={{ color: '#faad14' }}
              onClick={() => {
                setFileToMove(record._id);
                setMoveModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete file?"
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

  const currentFolder = folders.find(f => f._id === currentFolderId);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header style={{ 
        background: '#fff', 
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />
          <Title level={3} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            File Manager
          </Title>
        </div>
        <Space size="middle">
          {/* Files Stat Card */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            padding: '10px 20px',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            color: 'white',
            minWidth: '120px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileOutlined style={{ fontSize: '24px', opacity: 0.9 }} />
              <div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '2px' }}>Files</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{files.length}</div>
              </div>
            </div>
          </div>

          {/* Storage Stat Card */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '10px',
            padding: '10px 20px',
            boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
            color: 'white',
            minWidth: '120px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <DatabaseOutlined style={{ fontSize: '24px', opacity: 0.9 }} />
              <div>
                <div style={{ fontSize: '11px', opacity: 0.9, marginBottom: '2px' }}>Storage</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{(totalSize / (1024 * 1024)).toFixed(1)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>MB</span></div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <Button 
            onClick={() => router.push('/dashboard/subscriptions')}
            style={{ height: '36px' }}
          >
            Subscriptions
          </Button>
          <Button 
            href="/api/auth/signout"
            style={{ height: '36px' }}
          >
            Logout
          </Button>
        </Space>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={setCollapsed}
          trigger={null}
          width={280}
          style={{ 
            background: '#fafafa',
            borderRight: '1px solid #f0f0f0'
          }}
        >
          <div style={{ padding: '16px' }}>
            <Button 
              type="primary" 
              icon={<FolderAddOutlined />}
              onClick={() => setFolderModalVisible(true)}
              block
              style={{ 
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              {!collapsed && 'New Folder'}
            </Button>
            
            {/* All Files */}
            <div
              onClick={() => setCurrentFolderId(null)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: !currentFolderId ? '#e6f7ff' : 'transparent',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s'
              }}
            >
              <HomeOutlined style={{ fontSize: '18px', color: '#667eea' }} />
              {!collapsed && <span style={{ fontWeight: !currentFolderId ? 600 : 400 }}>All Files</span>}
            </div>

            {/* Folders List */}
            <div style={{ marginTop: '16px' }}>
              {!collapsed && <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '8px', paddingLeft: '12px' }}>FOLDERS</div>}
              {folders.map(folder => (
                <div
                  key={folder._id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: currentFolderId === folder._id ? '#e6f7ff' : 'transparent',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.3s'
                  }}
                  onClick={() => setCurrentFolderId(folder._id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <FolderOutlined style={{ fontSize: '18px', color: '#faad14' }} />
                    {!collapsed && (
                      <span style={{ 
                        fontWeight: currentFolderId === folder._id ? 600 : 400,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {folder.name}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <Popconfirm
                      title="Delete folder?"
                      description="Files will be moved to root"
                      onConfirm={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder._id);
                      }}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  )}
                </div>
              ))}
              {folders.length === 0 && !collapsed && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#8c8c8c', fontSize: '12px' }}>
                  No folders yet
                </div>
              )}
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Content style={{ padding: '24px', background: '#fff' }}>
          {/* Breadcrumb */}
          <Breadcrumb style={{ marginBottom: '16px' }}>
            <Breadcrumb.Item onClick={() => setCurrentFolderId(null)} style={{ cursor: 'pointer' }}>
              <HomeOutlined /> All Files
            </Breadcrumb.Item>
            {currentFolder && (
              <Breadcrumb.Item>
                <FolderOpenOutlined /> {currentFolder.name}
              </Breadcrumb.Item>
            )}
          </Breadcrumb>

          {/* Upload Section */}
          <Card 
            size="small"
            style={{ 
              marginBottom: 16,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Upload Files</Text>
                <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                  {currentFolder ? `to ${currentFolder.name}` : 'to root'}
                </div>
              </div>
              <Upload
                customRequest={handleUpload}
                showUploadList={false}
                multiple
              >
                <Button 
                  type="primary" 
                  icon={<UploadOutlined />} 
                  loading={uploading}
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  Upload Files
                </Button>
              </Upload>
            </div>
          </Card>

          {/* Files Table */}
          <Card 
            title={
              <Space>
                <FileOutlined />
                <span>Files ({files.length})</span>
              </Space>
            }
            style={{ borderRadius: '8px' }}
          >
            <Table 
              columns={columns} 
              dataSource={files} 
              rowKey="_id" 
              loading={loading}
              pagination={{ 
                pageSize: 15, 
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} files`
              }}
              size="small"
            />
          </Card>
        </Content>
      </Layout>

      {/* Modals */}
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <img src={previewImage} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
      </Modal>

      <Modal
        title="Create New Folder"
        open={folderModalVisible}
        onCancel={() => {
          setFolderModalVisible(false);
          folderForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={folderForm}
          onFinish={handleCreateFolder}
          layout="vertical"
        >
          <Form.Item
            name="folderName"
            label="Folder Name"
            rules={[
              { required: true, message: 'Please enter folder name' },
              { max: 100, message: 'Name cannot exceed 100 characters' },
            ]}
          >
            <Input placeholder="Enter folder name" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setFolderModalVisible(false);
                folderForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Move File to Folder"
        open={moveModalVisible}
        onCancel={() => {
          setMoveModalVisible(false);
          setFileToMove(null);
          setSelectedTargetFolder('');
        }}
        onOk={handleMoveFile}
      >
        <Select
          placeholder="Select destination folder"
          style={{ width: '100%' }}
          value={selectedTargetFolder}
          onChange={(value) => setSelectedTargetFolder(value)}
        >
          <Select.Option value="">Root (No Folder)</Select.Option>
          {folders.map(folder => (
            <Select.Option key={folder._id} value={folder._id}>
              <FolderOutlined /> {folder.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>

      <style jsx global>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          color: white !important;
          font-weight: 600 !important;
          font-size: 13px !important;
          padding: 14px 16px !important;
          border: none !important;
        }
        
        .ant-table-thead > tr > th::before {
          display: none !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: #f0f5ff !important;
        }
        
        .ant-table-tbody > tr > td {
          padding: 12px 16px !important;
        }
        
        .ant-layout-sider-children::-webkit-scrollbar {
          width: 6px;
        }
        
        .ant-layout-sider-children::-webkit-scrollbar-thumb {
          background: #d9d9d9;
          border-radius: 3px;
        }
      `}</style>
    </Layout>
  );
}
