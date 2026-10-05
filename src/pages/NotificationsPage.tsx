import { Link } from 'react-router-dom';
import { Bell, ShoppingBag, Tag, MessageCircle, CreditCard, CheckCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useStore, markNotificationRead, markAllRead } from '../lib/store';
import { timeAgo } from '../lib/utils';
import type { Notification } from '../lib/types';

function NotifIcon({ type }: { type: Notification['type'] }) {
  const map = {
    order: { icon: ShoppingBag, bg: 'bg-jk-green-100 dark:bg-jk-green-900/30', text: 'text-jk-green-600' },
    listing: { icon: Tag, bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600' },
    chat: { icon: MessageCircle, bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600' },
    payment: { icon: CreditCard, bg: 'bg-jk-gold-100 dark:bg-jk-gold-900/30', text: 'text-jk-gold-600' },
    system: { icon: Bell, bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-500' },
  };
  const { icon: Icon, bg, text } = map[type];
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}>
      <Icon size={18} className={text} />
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications } = useStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar title="Notifications" back showNotif={false} />

      <div className="max-w-lg mx-auto px-4 pt-3">
        {unreadCount > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#4a6957] dark:text-[#85a88e]">
              <span className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{unreadCount}</span> unread
            </p>
            <button onClick={markAllRead} className="text-[#1a7a42] text-xs font-semibold flex items-center gap-1">
              <CheckCircle size={12} /> Mark all read
            </button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="text-[#d1e8d9] mx-auto mb-3" />
            <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">All caught up!</p>
            <p className="text-[#4a6957] dark:text-[#85a88e] text-sm mt-1">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`w-full text-left flex items-start gap-3 rounded-2xl p-3.5 border transition-all hover:shadow-sm ${
                  !n.isRead
                    ? 'bg-white dark:bg-[#0f2018] border-[#1a7a42]/30 shadow-sm'
                    : 'bg-white/60 dark:bg-[#0f2018]/60 border-[#d1e8d9] dark:border-[#1a3528]'
                }`}
              >
                <NotifIcon type={n.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold leading-tight ${!n.isRead ? 'text-[#0f1f14] dark:text-[#e8f5ed]' : 'text-[#4a6957] dark:text-[#85a88e]'}`}>
                      {n.title}
                    </p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[9px] text-[#4a6957] dark:text-[#85a88e]">{timeAgo(n.createdAt)}</span>
                      {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#1a7a42]" />}
                    </div>
                  </div>
                  <p className="text-xs text-[#4a6957] dark:text-[#85a88e] mt-0.5 leading-relaxed">{n.body}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
