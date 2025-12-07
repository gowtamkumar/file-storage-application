"use client";

import {
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Badge, Button, Drawer, Empty, List, Typography, message } from "antd";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const { Text, Paragraph } = Typography;

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (session) {
      fetchNotifications();
      // Optional: Poll every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        const unread = data.data.filter(
          (n) => !n.readBy.includes(session.user.id)
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        // Optimistic update
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, readBy: [...n.readBy, session.user.id] } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      message.error("Failed to mark as read");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleOutlined className="text-green-500" />;
      case "warning":
        return <InfoCircleOutlined className="text-orange-500" />;
      case "error":
        return <InfoCircleOutlined className="text-red-500" />;
      default:
        return <InfoCircleOutlined className="text-blue-500" />;
    }
  };

  return (
    <>
      <Badge count={unreadCount} overflowCount={99}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: "20px" }} />}
          onClick={() => setOpen(true)}
        />
      </Badge>

      <Drawer
        title={`Notifications (${unreadCount} unread)`}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <List
          itemLayout="horizontal"
          dataSource={notifications}
          locale={{
            emptyText: (
              <Empty
                description="No notifications"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ),
          }}
          renderItem={(item) => {
            const isRead = item.readBy.includes(session.user.id);
            return (
              <List.Item
                className={`transition-colors duration-200 ${
                  isRead ? "opacity-60" : "bg-blue-50/50"
                }`}
                actions={[
                  !isRead && (
                    <Button
                      type="link"
                      size="small"
                      onClick={() => markAsRead(item._id)}
                    >
                      Mark as Read
                    </Button>
                  ),
                ]}
              >
                <List.Item.Meta
                  avatar={getTypeIcon(item.type)}
                  title={
                    <div className="flex justify-between items-start">
                      <Text strong={!isRead}>{item.title}</Text>
                      <Text
                        type="secondary"
                        className="text-xs ml-2 whitespace-nowrap"
                      >
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  }
                  description={
                    <div>
                      <Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                        className="mb-1 text-sm"
                      >
                        {item.message}
                      </Paragraph>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Drawer>
    </>
  );
}
