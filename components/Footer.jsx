import { Typography } from "antd";
const { Title } = Typography;

export default function Footer() {
    return (
        <footer className="py-8 text-center text-gray-500 border-t">
            © {new Date().getFullYear()} FileStore. All rights reserved.
        </footer>
    );
}


