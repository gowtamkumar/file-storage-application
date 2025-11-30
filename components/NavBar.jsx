

import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import Link from 'next/link';
export default function NavBar() {
  return (
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          
          <Link href="/">
            <CloudUploadOutlined /> FileStore
          </Link>
        </div>
        <Space>
          <Link href="/pricing">
            <Button type="text">Pricing</Button>
          </Link>
          <Link href="/docs/api">
            <Button type="text">API Docs</Button>
          </Link>
          <Link href="/login">
            <Button type="text">Login</Button>
          </Link>
          <Link href="/register">
            <Button type="primary">Get Started</Button>
          </Link>
        </Space>
      </nav>

   
  );
}