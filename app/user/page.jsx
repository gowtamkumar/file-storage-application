"use client";

import {
  CopyOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  HomeOutlined,
  KeyOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RocketOutlined,
  SearchOutlined,
  ShareAltOutlined,
  SwapOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

const { Title, Text, Paragraph } = Typography;
const { Header, Sider, Content } = Layout;

export default function UserDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [keyLoading, setKeyLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [folderModalVisible, setFolderModalVisible] = useState(false);
  const [folderForm] = Form.useForm();
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [fileToMove, setFileToMove] = useState(null);
  const [selectedTargetFolder, setSelectedTargetFolder] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [publicFilter, setPublicFilter] = useState("all");

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
    fetchSubscription();
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [currentFolderId]);

  const fetchFolders = async () => {
    try {
      const res = await fetch("/api/folders");
      const data = await res.json();
      if (data.success) {
        setFolders(data.data);
      }
    } catch (error) {
      message.error("Failed to fetch folders");
    }
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const url = currentFolderId
        ? `/api/files?folderId=${currentFolderId}`
        : "/api/files?folderId=null";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setFiles(data.data);
      }
    } catch (error) {
      message.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json();
      if (data.success) {
        setSubscription(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription");
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    // Check subscription limits before upload
    if (subscription) {
      const currentStorage =
        files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024); // in MB
      const fileSize = file.size / (1024 * 1024); // in MB

      // Check file count limit
      if (
        subscription.fileLimit !== -1 &&
        files.length >= subscription.fileLimit
      ) {
        message.error(
          `File limit reached! Upgrade your plan to upload more files.`
        );
        onError(new Error("File limit reached"));
        return;
      }

      // Check storage limit
      if (
        subscription.storageLimit !== -1 &&
        currentStorage + fileSize > subscription.storageLimit
      ) {
        message.error(
          `Storage limit exceeded! Upgrade your plan for more storage.`
        );
        onError(new Error("Storage limit exceeded"));
        return;
      }
    }

    const formData = new FormData();
    formData.append("file", file);
    if (currentFolderId) {
      formData.append("folderId", currentFolderId);
    }
    setUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        message.success(`${file.name} uploaded successfully`);
        onSuccess(data.data);
        fetchFiles();
        fetchSubscription(); // Refresh subscription to update usage
      } else {
        message.error(data.message || `${file.name} upload failed.`);
        onError(new Error(data.message || "Upload failed"));
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
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.folderName }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("Folder created successfully");
        setFolderModalVisible(false);
        folderForm.resetFields();
        fetchFolders();
      } else {
        message.error(data.message || "Failed to create folder");
      }
    } catch (error) {
      message.error("Failed to create folder");
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      const res = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        message.success(data.message || "Folder deleted successfully");
        fetchFolders();
        fetchFiles();
        if (currentFolderId === id) {
          setCurrentFolderId(null);
        }
      } else {
        message.error(data.message || "Delete failed");
      }
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        message.success("File deleted successfully");
        fetchFiles();
      } else {
        message.error(data.message || "Delete failed");
      }
    } catch (error) {
      message.error("Delete failed");
    }
  };

  const handleMoveFile = async () => {
    if (!fileToMove) return;

    try {
      const res = await fetch(`/api/files/${fileToMove}/move`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: selectedTargetFolder || null }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("File moved successfully");
        setMoveModalVisible(false);
        setFileToMove(null);
        setSelectedTargetFolder("");
        fetchFiles();
      } else {
        message.error(data.message || "Failed to move file");
      }
    } catch (error) {
      message.error("Failed to move file");
    }
  };

  const generateApiKey = async () => {
    setKeyLoading(true);
    try {
      const res = await fetch("/api/auth/apikey", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setApiKey(data.apiKey);
        message.success("New API Key generated");
      } else {
        message.error("Failed to generate key");
      }
    } catch (error) {
      message.error("Error generating key");
    } finally {
      setKeyLoading(false);
    }
  };

  const copyFileUrl = (path) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    message.success("File URL copied to clipboard!");
  };

  const copyShareUrl = (shareableId) => {
    const url = `${window.location.origin}/share/${shareableId}`;
    navigator.clipboard.writeText(url);
    message.success("Share URL copied to clipboard!");
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith("image/"))
      return (
        <FileImageOutlined style={{ fontSize: "32px", color: "#52c41a" }} />
      );
    if (mimetype.includes("pdf"))
      return <FilePdfOutlined style={{ fontSize: "32px", color: "#ff4d4f" }} />;
    if (mimetype.includes("zip") || mimetype.includes("rar"))
      return <FileZipOutlined style={{ fontSize: "32px", color: "#faad14" }} />;
    if (mimetype.includes("text"))
      return (
        <FileTextOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
      );
    return <FileOutlined style={{ fontSize: "32px", color: "#722ed1" }} />;
  };

  const handlePreview = (path) => {
    setPreviewImage(path);
    setPreviewVisible(true);
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.originalName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || file.mimetype?.startsWith(typeFilter);

    const matchesPublic =
      publicFilter === "all" ||
      (publicFilter === "public" && file.isPublic) ||
      (publicFilter === "private" && !file.isPublic);

    return matchesSearch && matchesType && matchesPublic;
  });

  const columns = [
    {
      title: "Preview",
      key: "preview",
      width: 80,
      render: (_, record) => (
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            record.mimetype.startsWith("image/") && handlePreview(record.path)
          }
        >
          {record.mimetype.startsWith("image/") ? (
            <img
              src={record.path}
              alt={record.originalName}
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />
          ) : (
            getFileIcon(record.mimetype)
          )}
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "originalName",
      key: "name",
      render: (text, record) => (
        <div>
          <a
            href={record.path}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 500, fontSize: "14px" }}
          >
            {text}
          </a>
          <div style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "2px" }}>
            {new Date(record.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: 100,
      render: (size) => {
        if (size > 1024 * 1024)
          return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        return `${(size / 1024).toFixed(2)} KB`;
      },
    },
    {
      title: "Type",
      dataIndex: "mimetype",
      key: "type",
      width: 120,
      render: (type) => {
        const typeMap = {
          image: { color: "green", text: "Image" },
          pdf: { color: "red", text: "PDF" },
          video: { color: "purple", text: "Video" },
          audio: { color: "orange", text: "Audio" },
          text: { color: "blue", text: "Text" },
          zip: { color: "gold", text: "Archive" },
        };

        const mainType = type.split("/")[0];
        const config = typeMap[mainType] || {
          color: "default",
          text: type.split("/")[1],
        };

        return (
          <Tag color={config.color} style={{ borderRadius: "4px" }}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Views",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 80,
      render: (count, record) =>
        record.isPublic ? (
          <Tag color="blue" style={{ borderRadius: "4px" }}>
            {count || 0}
          </Tag>
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
      width: 100,
      render: (count, record) =>
        record.isPublic ? (
          <Tag color="cyan" style={{ borderRadius: "4px" }}>
            {count || 0}
          </Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            -
          </Text>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          {record.isPublic && record.shareableId && (
            <Button
              type="text"
              icon={<ShareAltOutlined />}
              title="Copy Share URL"
              onClick={() => copyShareUrl(record.shareableId)}
              size="small"
              style={{ color: "#1890ff" }}
            />
          )}
          <Tooltip title="Copy URL">
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => copyFileUrl(record.path)}
              style={{ color: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              href={record.path}
              download
              size="small"
              style={{ color: "#52c41a" }}
            />
          </Tooltip>
          <Tooltip title="Move">
            <Button
              type="text"
              icon={<SwapOutlined />}
              size="small"
              style={{ color: "#faad14" }}
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

  const currentFolder = folders.find((f) => f._id === currentFolderId);
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <>
      <NavBar />
      <Layout style={{ minHeight: "100vh", marginTop: "64px" }}>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            padding: isMobile ? "12px 16px" : "16px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            position: "sticky",
            top: isMobile ? 0 : 64,
            zIndex: 100,
            gap: isMobile ? "12px" : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px" }}
            />
            <Title
              level={4}
              style={{
                margin: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              My Files
            </Title>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "12px" : "16px",
              width: isMobile ? "100%" : "auto",
              flexWrap: "wrap",
            }}
          >
            {/* Stats Container */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                flex: isMobile ? "1" : "auto",
              }}
            >
              {/* Files Stat Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
                  color: "white",
                  flex: isMobile ? "1" : "auto",
                  minWidth: isMobile ? "0" : "120px",
                }}
              >
                <div style={{ padding: isMobile ? "0px 3px" : "1px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FileOutlined
                      style={{
                        fontSize: isMobile ? "20px" : "24px",
                        opacity: 0.9,
                      }}
                    />
                    <div
                      style={{
                        fontSize: "11px",
                        opacity: 0.9,
                        marginBottom: "2px",
                      }}
                    >
                      Files
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? "18px" : "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {files.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Stat Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(245, 87, 108, 0.3)",
                  color: "white",
                  flex: isMobile ? "1" : "auto",
                  minWidth: isMobile ? "0" : "120px",
                }}
              >
                <div style={{ padding: isMobile ? "0px 3px" : "1px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <DatabaseOutlined
                      style={{
                        fontSize: isMobile ? "20px" : "24px",
                        opacity: 0.9,
                      }}
                    />
                    <div
                      style={{
                        fontSize: "11px",
                        opacity: 0.9,
                        marginBottom: "2px",
                      }}
                    >
                      Storage
                    </div>
                    <div
                      style={{
                        fontSize: isMobile ? "18px" : "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {(totalSize / (1024 * 1024)).toFixed(1)}{" "}
                      <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                        MB
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                width: isMobile ? "100%" : "auto",
              }}
            >
              <Button
                onClick={() => router.push("/user/subscription")}
                style={{ height: "36px", flex: isMobile ? "1" : "auto" }}
              >
                Subscription
              </Button>
              <Button
                onClick={() => router.push("/pricing")}
                style={{ height: "36px", flex: isMobile ? "1" : "auto" }}
              >
                Pricing
              </Button>
              <Button
                href="/api/auth/signout"
                style={{ height: "36px", flex: isMobile ? "1" : "auto" }}
              >
                Logout
              </Button>
            </div>
          </div>
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
              background: "#fafafa",
              borderRight: "1px solid #f0f0f0",
            }}
          >
            <div style={{ padding: "16px" }}>
              <Button
                type="primary"
                icon={<FolderAddOutlined />}
                onClick={() => setFolderModalVisible(true)}
                block
                style={{
                  marginBottom: "16px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                {!collapsed && "New Folder"}
              </Button>

              {/* All Files */}
              <div
                onClick={() => setCurrentFolderId(null)}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: !currentFolderId ? "#e6f7ff" : "transparent",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.3s",
                }}
              >
                <HomeOutlined style={{ fontSize: "18px", color: "#667eea" }} />
                {!collapsed && (
                  <span style={{ fontWeight: !currentFolderId ? 600 : 400 }}>
                    All Files
                  </span>
                )}
              </div>

              {/* Folders List */}
              <div style={{ marginTop: "16px" }}>
                {!collapsed && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#8c8c8c",
                      marginBottom: "8px",
                      paddingLeft: "12px",
                    }}
                  >
                    FOLDERS
                  </div>
                )}
                {folders.map((folder) => (
                  <div
                    key={folder._id}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      background:
                        currentFolderId === folder._id
                          ? "#e6f7ff"
                          : "transparent",
                      marginBottom: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "all 0.3s",
                    }}
                    onClick={() => setCurrentFolderId(folder._id)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                      }}
                    >
                      <FolderOutlined
                        style={{ fontSize: "18px", color: "#faad14" }}
                      />
                      {!collapsed && (
                        <span
                          style={{
                            fontWeight:
                              currentFolderId === folder._id ? 600 : 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
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
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px 0",
                      color: "#8c8c8c",
                      fontSize: "12px",
                    }}
                  >
                    No folders yet
                  </div>
                )}
              </div>
            </div>
          </Sider>

          {/* Backdrop overlay for mobile sidebar */}
          {isMobile && !collapsed && (
            <div
              onClick={() => setCollapsed(true)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.45)",
                zIndex: 98,
              }}
            />
          )}

          {/* Main Content */}
          <Content
            style={{
              padding: isMobile ? "16px" : "24px",
              background: "#fff",
              minHeight: "calc(100vh - 128px)",
            }}
          >
            {/* Breadcrumb */}
            <Breadcrumb style={{ marginBottom: "16px" }}>
              <Breadcrumb.Item
                onClick={() => setCurrentFolderId(null)}
                style={{ cursor: "pointer" }}
              >
                <HomeOutlined /> All Files
              </Breadcrumb.Item>
              {currentFolder && (
                <Breadcrumb.Item>
                  <FolderOpenOutlined /> {currentFolder.name}
                </Breadcrumb.Item>
              )}
            </Breadcrumb>

            {/* Subscription Progress Card */}
            {subscription && (
              <Card
                size="small"
                style={{ marginBottom: 16, borderRadius: "8px" }}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={24} md={18} lg={18}>
                    <Space
                      size={isMobile ? "middle" : "large"}
                      orientation={isMobile ? "vertical" : "horizontal"}
                      style={{ width: "100%" }}
                    >
                      <div style={{ width: isMobile ? "100%" : "auto" }}>
                        <Text
                          strong
                          style={{
                            display: "block",
                            fontSize: "12px",
                            marginBottom: 4,
                          }}
                        >
                          Storage
                        </Text>
                        <Progress
                          percent={
                            subscription.storageLimit === -1
                              ? 0
                              : Math.min(
                                  100,
                                  (totalSize /
                                    (1024 * 1024) /
                                    subscription.storageLimit) *
                                    100
                                )
                          }
                          size="small"
                        />
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          {(totalSize / (1024 * 1024)).toFixed(1)} /{" "}
                          {subscription.storageLimit === -1
                            ? "∞"
                            : subscription.storageLimit}{" "}
                          MB
                        </Text>
                      </div>
                      <div style={{ width: isMobile ? "100%" : "auto" }}>
                        <Text
                          strong
                          style={{
                            display: "block",
                            fontSize: "12px",
                            marginBottom: 4,
                          }}
                        >
                          Files
                        </Text>
                        <Progress
                          percent={
                            subscription.fileLimit === -1
                              ? 0
                              : Math.min(
                                  100,
                                  (files.length / subscription.fileLimit) * 100
                                )
                          }
                          size="small"
                          style={{ width: isMobile ? "100%" : "150px" }}
                        />
                        <Text type="secondary" style={{ fontSize: "11px" }}>
                          {files.length} /{" "}
                          {subscription.fileLimit === -1
                            ? "∞"
                            : subscription.fileLimit}
                        </Text>
                      </div>
                    </Space>
                  </Col>
                  <Col xs={24} sm={24} md={6} lg={6}>
                    <Button
                      type="primary"
                      size="small"
                      icon={<RocketOutlined />}
                      onClick={() => router.push("/pricing")}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Upgrade
                    </Button>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Mobile Action Buttons */}
            {isMobile && (
              <Card
                size="small"
                style={{
                  marginBottom: 16,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col span={12}>
                    <Button
                      type="primary"
                      icon={<FolderAddOutlined />}
                      onClick={() => setFolderModalVisible(true)}
                      block
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        height: "44px",
                      }}
                    >
                      New Folder
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Upload
                      customRequest={handleUpload}
                      showUploadList={false}
                      multiple
                    >
                      <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={uploading}
                        block
                        style={{
                          background:
                            "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                          border: "none",
                          height: "44px",
                        }}
                      >
                        Upload Files
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </Card>
            )}

            {/* Desktop Upload Section */}
            {!isMobile && (
              <Card
                size="small"
                style={{
                  marginBottom: 16,
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "center",
                    gap: isMobile ? "12px" : "0",
                  }}
                >
                  <div>
                    <Text strong>Upload Files</Text>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
                      {currentFolder ? `to ${currentFolder.name}` : "to root"}
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
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        border: "none",
                        width: isMobile ? "100%" : "auto",
                      }}
                    >
                      Upload Files
                    </Button>
                  </Upload>
                </div>
              </Card>
            )}

            {/* API Key Section */}
            <Card
              size="small"
              style={{
                marginBottom: 16,
                borderRadius: "8px",
                background: "linear-gradient(135deg, #fff 0%, #f0f2f5 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "stretch" : "center",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ flex: isMobile ? "1" : "auto" }}>
                  <Space>
                    <KeyOutlined
                      style={{ fontSize: "20px", color: "#faad14" }}
                    />
                    <Text strong>API Access</Text>
                  </Space>
                  <div
                    style={{ fontSize: "12px", color: "#8c8c8c", marginTop: 4 }}
                  >
                    Generate an API key to access your files programmatically.
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: "8px",
                    alignItems: isMobile ? "stretch" : "center",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {apiKey && (
                    <Input.Password
                      value={apiKey}
                      readOnly
                      style={{ width: isMobile ? "100%" : 250 }}
                      addonAfter={
                        <CopyOutlined
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey);
                            message.success("API Key copied");
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      }
                    />
                  )}
                  <Button
                    onClick={generateApiKey}
                    loading={keyLoading}
                    type={apiKey ? "default" : "primary"}
                    style={{
                      background: !apiKey
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                        : undefined,
                      border: !apiKey ? "none" : undefined,
                      color: !apiKey ? "white" : undefined,
                      width: isMobile ? "100%" : "auto",
                    }}
                  >
                    {apiKey ? "Regenerate Key" : "Generate Key"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Files Table */}
            <Card
              title={
                <Space>
                  <FileOutlined />
                  <span>Files ({filteredFiles.length})</span>
                </Space>
              }
              extra={
                <Space wrap>
                  <Select
                    placeholder="Type"
                    value={typeFilter}
                    onChange={setTypeFilter}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Select.Option value="all">All Types</Select.Option>
                    <Select.Option value="image">Images</Select.Option>
                    <Select.Option value="application/pdf">PDFs</Select.Option>
                    <Select.Option value="video">Videos</Select.Option>
                    <Select.Option value="text">Text</Select.Option>
                  </Select>
                  <Select
                    placeholder="Status"
                    value={publicFilter}
                    onChange={setPublicFilter}
                    style={{ width: 120 }}
                    size="small"
                  >
                    <Select.Option value="all">All Status</Select.Option>
                    <Select.Option value="public">Public</Select.Option>
                    <Select.Option value="private">Private</Select.Option>
                  </Select>
                  <Input
                    placeholder="Search files..."
                    prefix={<SearchOutlined />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                    style={{ width: 200 }}
                    size="small"
                  />
                </Space>
              }
              style={{ borderRadius: "8px" }}
            >
              <Table
                columns={columns}
                dataSource={filteredFiles}
                rowKey="_id"
                loading={loading}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} files`,
                }}
                size="small"
                scroll={{ x: isMobile ? 800 : undefined }}
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
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px" }}
          />
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
                { required: true, message: "Please enter folder name" },
                { max: 100, message: "Name cannot exceed 100 characters" },
              ]}
            >
              <Input placeholder="Enter folder name" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button
                  onClick={() => {
                    setFolderModalVisible(false);
                    folderForm.resetFields();
                  }}
                >
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
            setSelectedTargetFolder("");
          }}
          onOk={handleMoveFile}
        >
          <Select
            placeholder="Select destination folder"
            style={{ width: "100%" }}
            value={selectedTargetFolder}
            onChange={(value) => setSelectedTargetFolder(value)}
          >
            <Select.Option value="">Root (No Folder)</Select.Option>
            {folders.map((folder) => (
              <Select.Option key={folder._id} value={folder._id}>
                <FolderOutlined /> {folder.name}
              </Select.Option>
            ))}
          </Select>
        </Modal>

        <style jsx global>{`
          .ant-table-thead > tr > th {
            background: linear-gradient(
              135deg,
              #667eea 0%,
              #764ba2 100%
            ) !important;
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

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .ant-layout-sider {
              position: fixed !important;
              left: 0;
              top: 0 !important;
              bottom: 0;
              z-index: 99;
              box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
              transition: left 0.3s ease;
            }

            .ant-layout-sider-collapsed {
              left: -280px !important;
            }

            .ant-table-tbody > tr > td {
              padding: 8px 12px !important;
            }

            .ant-table-thead > tr > th {
              padding: 10px 12px !important;
              font-size: 12px !important;
            }
          }
        `}</style>
      </Layout>
      <Footer />
    </>
  );
}
