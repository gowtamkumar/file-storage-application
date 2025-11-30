
import { CloudUploadOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NavBar() {
    const { data: session } = useSession();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  return (
      <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:text-blue-700 transition-colors">
            <CloudUploadOutlined /> FileStore
          </Link>
        </div>
        <Space size="middle">
          <Link href="/pricing">
            <Button type="text" className="font-medium">Pricing</Button>
          </Link>
          <Link href="/docs/api">
            <Button type="text" className="font-medium">API Docs</Button>
          </Link>

           {/* Back to Dashboard */}
        {session ? (
            <Button
              type="primary"
              onClick={() => router.push(session.user.role === 'admin' ? '/dashboard' : '/user')}
              style={{
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Dashboard
            </Button>
        ): <Link href="/login">
            <Button type="text" className="font-medium">Login</Button>
          </Link>}
          
          {!session && (
            <Link href="/register">
              <Button type="primary" style={{ borderRadius: '8px', fontWeight: 600 }}>Get Started</Button>
            </Link>
          )}
        </Space>
      </nav>
  );
}