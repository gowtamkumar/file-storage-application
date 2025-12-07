import { Typography } from "antd";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function Footer() {
    const [settings, setSettings] = useState({
        footerText: `© ${new Date().getFullYear()} FileStore. All rights reserved.`,
        footerLinks: []
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/site');
                const data = await res.json();
                if (data.success && data.data) {
                    setSettings({
                        footerText: data.data.footerText || `© ${new Date().getFullYear()} FileStore. All rights reserved.`,
                        footerLinks: data.data.footerLinks || []
                    });
                }
            } catch (error) {
                console.error('Failed to fetch footer settings');
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="py-8 bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-gray-500 text-sm">
                        {settings.footerText}
                    </div>
                </div>
            </div>
        </footer>
    );
}


