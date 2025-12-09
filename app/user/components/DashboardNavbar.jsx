"use client";

import {
  BellOutlined,
  CreditCardOutlined,
  DatabaseOutlined,
  FileOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Layout,
  Space,
  theme,
  Tooltip
} from "antd";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Header } = Layout;

export default function DashboardNavbar({
  collapsed,
  setCollapsed,
  files = [],
  totalSize = 0,
  session,
}) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(1);

  const userMenu = [
    {
      key: "profile",
      label: (
        <Space>
          <UserOutlined />
          Profile
        </Space>
      ),
      onClick: () => router.push("/user/profile"),
    },
    {
      key: "subscription",
      label: (
        <Space>
          <CreditCardOutlined />
          Subscription
        </Space>
      ),
      onClick: () => router.push("/user/subscription"),
    },
    {
      key: "settings",
      label: (
        <Space>
          <SettingOutlined />
          Settings
        </Space>
      ),
      onClick: () => router.push("/user/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <Space>
          <LogoutOutlined />
          Logout
        </Space>
      ),
      danger: true,
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];

  return (
    <Header
      className={`fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ${scrolled
          ? "bg-gradient-to-r from-indigo-900 to-purple-900 shadow-lg border-b border-white/10"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
        }`}
      style={{
        height: "72px",
        paddingInline: "24px",
      }}
    >
      {/* Left Section: Toggle & Title */}
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={
            collapsed ? (
              <MenuUnfoldOutlined className="text-lg text-white" />
            ) : (
              <MenuFoldOutlined className="text-lg text-white" />
            )
          }
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-10 h-10 hover:bg-white/10 text-white"
        />

        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-lg">
            <DatabaseOutlined />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            FileStore
          </span>
        </div>
      </div>

      {/* Center Section: Search (Optional, can be added later) */}
      <div className="hidden md:flex flex-1 max-w-xl mx-8">
        {/* Placeholder for global search if needed */}
      </div>

      {/* Right Section: Stats & User */}
      <div className="flex items-center gap-6">
        {/* Quick Stats */}
        <div className="hidden lg:flex items-center gap-4 mr-4">
          <Tooltip title="Total Files">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <FileOutlined className="text-white" />
              <span className="text-sm font-medium text-white">
                {files.length}
              </span>
            </div>
          </Tooltip>

          <Tooltip title="Storage Used">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20">
              <DatabaseOutlined className="text-white" />
              <span className="text-sm font-medium text-white">
                {totalSizeMB} MB
              </span>
            </div>
          </Tooltip>
        </div>

        {/* Actions */}
        <Space size="middle">
          <Tooltip title="Notifications">
            <Button
              type="text"
              shape="circle"
              icon={<Badge dot><BellOutlined className="text-lg text-white" /></Badge>}
              className="flex items-center justify-center hover:bg-white/10"
            />
          </Tooltip>

          {/* User Profile */}
          <Dropdown menu={{ items: userMenu }} trigger={["click"]} placement="bottomRight">
            <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20">
              <Avatar
                size="default"
                src={session?.user?.image}
                icon={<UserOutlined />}
                className="bg-white/20 border-2 border-white/50 shadow-md text-white"
              />
              <div className="hidden md:block text-sm">
                <p className="font-semibold text-white leading-tight">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-white/80 leading-tight">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
}
