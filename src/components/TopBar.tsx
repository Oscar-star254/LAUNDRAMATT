import { Link, useNavigate } from 'react-router-dom';
import { Bell, Moon, Sun, ChevronLeft, Globe } from 'lucide-react';
import { useStore, toggleDarkMode, setLanguage, markAllRead } from '../lib/store';

interface TopBarProps {
  title?: string;
  back?: boolean;
  showNotif?: boolean;
  transparent?: boolean;
}

export default function TopBar({ title, back, showNotif = true, transparent }: TopBarProps) {
  const navigate = useNavigate();
  const { darkMode, notifications, language } = useStore();
  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <header
      className={`sticky top-0 z-40 flex items-center gap-3 px-4 h-14
        ${transparent
          ? 'bg-transparent'
          : 'bg-white dark:bg-[#0f2018] border-b border-[#d1e8d9] dark:border-[#1a3528] shadow-sm'
        }`}
    >
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg hover:bg-[#e8f5ed] dark:hover:bg-[#132a1c] transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft size={22} className="text-[#1a7a42]" />
        </button>
      )}

      {title ? (
        <h1 className="flex-1 font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-base">
          {title}
        </h1>
      ) : (
        <Link to="/home" className="flex-1 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a7a42] flex items-center justify-center">
            <span className="text-white font-bold text-xs">JM</span>
          </div>
          <span className="font-['Poppins'] font-bold text-[#1a7a42] text-sm">JKUAT Market</span>
        </Link>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
          className="p-1.5 rounded-lg hover:bg-[#e8f5ed] dark:hover:bg-[#132a1c] transition-colors"
          title="Switch language"
        >
          <Globe size={18} className="text-gray-500 dark:text-gray-400" />
        </button>
        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-lg hover:bg-[#e8f5ed] dark:hover:bg-[#132a1c] transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode
            ? <Sun size={18} className="text-[#f59e0b]" />
            : <Moon size={18} className="text-gray-500" />
          }
        </button>
        {showNotif && (
          <Link
            to="/notifications"
            className="relative p-1.5 rounded-lg hover:bg-[#e8f5ed] dark:hover:bg-[#132a1c] transition-colors"
            onClick={() => markAllRead()}
          >
            <Bell size={18} className={unread > 0 ? 'text-[#1a7a42]' : 'text-gray-500 dark:text-gray-400'} />
            {unread > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                {unread}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
