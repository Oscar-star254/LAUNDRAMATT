import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, ShoppingBag, Bell, User } from 'lucide-react';
import { useStore } from '../lib/store';

export default function BottomNav() {
  const { pathname } = useLocation();
  const { notifications } = useStore();
  const unread = notifications.filter(n => !n.isRead).length;

  const links = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/create', icon: PlusCircle, label: 'Sell', primary: true },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/notifications', icon: Bell, label: 'Alerts', badge: unread },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f2018] border-t border-[#d1e8d9] dark:border-[#1a3528] z-50 bottom-nav shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
        {links.map(({ to, icon: Icon, label, primary, badge }) => {
          const active = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative
                ${primary
                  ? 'bg-[#1a7a42] text-white shadow-lg shadow-[#1a7a42]/30 -mt-3 px-3 py-2 rounded-2xl'
                  : active
                    ? 'text-[#1a7a42]'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
            >
              <Icon size={primary ? 22 : 20} strokeWidth={active || primary ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${primary ? 'text-white' : ''}`}>{label}</span>
              {badge && badge > 0 ? (
                <span className="absolute -top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {badge > 9 ? '9+' : badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
