import { useEffect, useState } from "react";
import { getNotifications, updateNotification } from "../services/Notification";
import "../styles/Notification.css";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (id) => {
    try {
      await updateNotification(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Error updating notification", err);
    }
  };

  return (
    <div className="notification-container">
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-card ${n.isRead ? "read" : "unread"}`}
            onClick={() => handleNotificationClick(n.id)}
          >
            <div className="notification-message">
              <strong>{n.senderUser?.username}</strong> {n.message}
            </div>
            <div className="notification-time">
              {new Date(n.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
