

import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
export default function NavBar() {
    const { data: session } = useSession();
    const router = useRouter();
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

           {/* Back to Dashboard */}
        {session ? (
            <Button
              size="large"
              onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
              style={{
                borderRadius: '12px',
                height: '48px',
                padding: '0 32px',
                fontWeight: 600,
                background: 'rgba(255,255,255,0.95)',
                border: 'none'
              }}
            >
              Dashboard
            </Button>
        ): <Link href="/login">
            <Button type="text">Login</Button>
          </Link>}
          
          <Link href="/register">
            <Button type="primary">Get Started</Button>
          </Link>
        </Space>
      </nav>

   
  );
}