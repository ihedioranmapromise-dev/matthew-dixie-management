import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/user/notifications');
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/user/notifications/${id}/read`);
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/user/notifications/read-all');
      await fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-white/60 hover:text-white transition"
        aria-label="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-charcoal-light rounded-xl border border-white/5 shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-white/10 flex justify-between items-center sticky top-0 bg-charcoal-light">
            <span className="text-sm font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-gold hover:text-gold-light transition">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-sm text-white/40 text-center">No notifications</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer transition ${!n.read ? 'bg-gold/5' : ''}`}
                onClick={() => markAsRead(n.id)}
              >
                <div className="text-sm text-white">{n.message}</div>
                <div className="text-xs text-white/30 mt-1">{new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
