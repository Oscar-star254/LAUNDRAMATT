import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Package, Shield, Settings, LogOut, ChevronRight, Edit2, Heart, Bell, HelpCircle, FileText, Globe } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { currentUser } from '../lib/mockData';
import { mockListings } from '../lib/mockData';
import { logout, setLanguage, useStore } from '../lib/store';
import { formatDate } from '../lib/utils';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { language } = useStore();
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings');
  const myListings = mockListings.filter(l => l.seller.id === 'u1').slice(0, 4);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar title="My Profile" showNotif />

      <div className="max-w-lg mx-auto">
        {/* Profile card */}
        <div className="px-4 py-4">
          <div className="bg-white dark:bg-[#0f2018] rounded-3xl border border-[#d1e8d9] dark:border-[#1a3528] p-5">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#d1e8d9]"
                />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1a7a42] rounded-full flex items-center justify-center">
                  <Edit2 size={11} className="text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed] text-base">{currentUser.name}</h2>
                  {currentUser.isVerified && <Shield size={14} className="text-[#1a7a42]" />}
                </div>
                <p className="text-[#4a6957] dark:text-[#85a88e] text-xs">{currentUser.email}</p>
                <p className="text-[#4a6957] dark:text-[#85a88e] text-xs mt-0.5">{currentUser.regNumber}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-[#f59e0b] fill-[#f59e0b]" />
                    <span className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{currentUser.rating || 'No rating'}</span>
                  </div>
                  <span className="text-[#4a6957] dark:text-[#85a88e] text-xs">•</span>
                  <span className="text-xs text-[#4a6957] dark:text-[#85a88e]">{currentUser.totalSales} sales</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {currentUser.badges.map(b => (
                <span key={b} className="text-[10px] bg-[#dcf5e6] dark:bg-[#0f2018] text-[#166236] dark:text-[#4db87a] border border-[#bbe9cd] dark:border-[#1a3528] px-2 py-0.5 rounded-full font-semibold">
                  ✓ {b}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-[#e8f5ed] dark:border-[#132a1c]">
              {[
                { val: currentUser.totalSales, label: 'Sales' },
                { val: currentUser.rating || '—', label: 'Rating' },
                { val: currentUser.responseTime, label: 'Response' },
              ].map(({ val, label }) => (
                <div key={label} className="text-center">
                  <p className="font-['Poppins'] font-bold text-[#1a7a42] text-sm">{val}</p>
                  <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{label}</p>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-2">Member since {formatDate(currentUser.joinedAt)}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="px-4 mb-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Package, label: 'My Listings', to: '/my-listings' },
              { icon: Heart, label: 'Favourites', to: '/favourites' },
              { icon: Bell, label: 'Alerts', to: '/notifications' },
              { icon: Settings, label: 'Settings', to: '/settings' },
            ].map(({ icon: Icon, label, to }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-1.5 bg-white dark:bg-[#0f2018] rounded-2xl p-3 border border-[#d1e8d9] dark:border-[#1a3528] hover:border-[#1a7a42] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#e8f5ed] dark:bg-[#132a1c] flex items-center justify-center">
                  <Icon size={16} className="text-[#1a7a42]" />
                </div>
                <span className="text-[9px] font-semibold text-[#4a6957] dark:text-[#85a88e] text-center">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-3">
          <div className="flex border-b border-[#d1e8d9] dark:border-[#1a3528]">
            {[
              { key: 'listings', label: 'Active Listings' },
              { key: 'reviews', label: 'Reviews' },
              { key: 'about', label: 'About' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as typeof activeTab)}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-colors ${
                  activeTab === key
                    ? 'border-[#1a7a42] text-[#1a7a42]'
                    : 'border-transparent text-[#4a6957] dark:text-[#85a88e]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'listings' && (
          <div className="px-4 mb-4">
            {myListings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-3xl mb-2">📦</p>
                <p className="text-sm text-[#4a6957] dark:text-[#85a88e]">No active listings</p>
                <Link to="/create" className="mt-2 inline-block text-[#1a7a42] font-semibold text-sm">+ Create listing</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myListings.map(l => <ProductCard key={l.id} listing={l} compact />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="px-4 mb-4 text-center py-8">
            <Star size={36} className="text-[#d1e8d9] mx-auto mb-2" />
            <p className="text-sm text-[#4a6957] dark:text-[#85a88e]">Reviews appear after completed orders</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="px-4 mb-4 space-y-2">
            {[
              { label: 'School', val: currentUser.school },
              { label: 'Year', val: `Year ${currentUser.yearOfStudy}` },
              { label: 'Hostel', val: currentUser.hostel || 'Off campus' },
              { label: 'Registration', val: currentUser.regNumber },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between py-2 border-b border-[#e8f5ed] dark:border-[#132a1c]">
                <span className="text-xs text-[#4a6957] dark:text-[#85a88e]">{label}</span>
                <span className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Menu items */}
        <div className="px-4 mb-4 space-y-1">
          {[
            { icon: Globe, label: `Language: ${language === 'en' ? 'English' : 'Kiswahili'}`, action: () => setLanguage(language === 'en' ? 'sw' : 'en') },
            { icon: HelpCircle, label: 'Help & Support', action: () => {} },
            { icon: FileText, label: 'Terms of Service & Privacy Policy', action: () => {} },
            { icon: Shield, label: 'Community Guidelines', action: () => {} },
          ].map(({ icon: Icon, label, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-3 bg-white dark:bg-[#0f2018] rounded-xl p-3 border border-[#d1e8d9] dark:border-[#1a3528] hover:border-[#1a7a42] transition-colors text-left"
            >
              <Icon size={16} className="text-[#4a6957] dark:text-[#85a88e]" />
              <span className="flex-1 text-sm text-[#0f1f14] dark:text-[#e8f5ed]">{label}</span>
              <ChevronRight size={14} className="text-[#4a6957]" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-2xl p-3.5 font-semibold text-sm hover:bg-red-100 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
