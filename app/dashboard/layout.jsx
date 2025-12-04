'use client';

import {
  CrownOutlined,
  DashboardOutlined,
  FileOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Header, Sider, Content } = Layout;

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px' }} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            ...(session?.user?.role === 'admin' ? [{
              key: '0',
              icon: <HomeOutlined />,
              label: 'Home',
              onClick: () => router.push('/dashboard/home'),
            }] : []),
            {
              key: '1',
              icon: <FileOutlined />,
              label: 'Files',
              onClick: () => router.push('/dashboard'),
            },
            ...(session?.user?.role === 'admin' ? [{
              key: '2',
              icon: <TeamOutlined />,
              label: 'Users',
              onClick: () => router.push('/dashboard/users'),
            }] : []),
            ...(session?.user?.role === 'admin' ? [{
              key: '3',
              icon: <CrownOutlined />,
              label: 'Subscriptions',
              onClick: () => router.push('/dashboard/subscriptions'),
            }] : []),
            ...(session?.user?.role === 'admin' ? [{
              key: '4',
              icon: <DashboardOutlined />,
              label: 'Plans',
              onClick: () => router.push('/dashboard/plans'),
            }] : []),
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span>{session?.user?.name} ({session?.user?.role})</span>
             <Button icon={<LogoutOutlined />} onClick={() => signOut({ callbackUrl: '/login' })}>Logout</Button>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
