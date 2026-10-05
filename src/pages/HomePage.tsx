import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Sparkles, MapPin, BookOpen, ArrowRight, Shield } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { mockListings, mockWantedPosts, currentUser } from '../lib/mockData';
import { CATEGORIES } from '../lib/types';
import { formatKES, timeAgo } from '../lib/utils';

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'trending' | 'new' | 'near'>('trending');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const hostelListings = mockListings.filter(l =>
    l.location === currentUser.hostel || l.location === 'Gate C Hostel Area'
  );
  const newListings = [...mockListings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar />

      <div className="max-w-lg mx-auto">
        {/* Greeting + Search */}
        <div className="px-4 pt-4 pb-3">
          <div className="mb-3">
            <p className="text-[#4a6957] dark:text-[#85a88e] text-xs">Welcome back 👋</p>
            <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed] leading-tight">
              {currentUser.name.split(' ')[0]}, what are you looking for?
            </h1>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="w-full flex items-center gap-3 bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-2xl px-4 py-3 shadow-sm hover:border-[#1a7a42] transition-colors"
          >
            <Search size={16} className="text-[#1a7a42]" />
            <span className="text-gray-400 dark:text-gray-500 text-sm flex-1 text-left">
              Search godoro, jiko, calculus books…
            </span>
            <span className="text-[10px] bg-[#e8f5ed] text-[#1a7a42] px-2 py-0.5 rounded-full font-semibold">Search</span>
          </button>
        </div>

        {/* Escrow banner */}
        <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-r from-[#1a7a42] to-[#279956] p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Shield size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-['Poppins'] font-semibold text-sm">Hakuna matata, your money is safe</p>
            <p className="text-white/80 text-xs mt-0.5">Every payment is held in escrow until you confirm delivery</p>
          </div>
        </div>

        {/* Categories scroll */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-['Poppins'] font-bold text-sm text-[#0f1f14] dark:text-[#e8f5ed]">Categories</h2>
            <Link to="/search" className="text-[#1a7a42] text-xs font-semibold">See all →</Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-4 pb-2 snap-x">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex-none flex flex-col items-center gap-1.5 snap-start bg-white dark:bg-[#0f2018] rounded-2xl p-3 border border-[#d1e8d9] dark:border-[#1a3528] hover:border-[#1a7a42] hover:shadow-md transition-all min-w-[68px]"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="text-[10px] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-center leading-tight max-w-[56px]">{cat.label.split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Semester banner */}
        <div className="mx-4 mb-4 rounded-2xl bg-[#fef3c7] dark:bg-[#92400e]/20 border border-[#fde68a] dark:border-[#92400e]/40 p-3 flex items-center gap-3">
          <span className="text-2xl">🏃</span>
          <div>
            <p className="font-['Poppins'] font-semibold text-[#92400e] dark:text-[#fbbf24] text-sm">Move-out Sale Season</p>
            <p className="text-[#b45309] dark:text-[#fcd34d] text-xs">Semester ending — grab discounted hostel items!</p>
          </div>
          <Link to="/search?tag=moveout" className="ml-auto text-[#d97706] shrink-0">
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Section tabs */}
        <div className="px-4 mb-3">
          <div className="flex gap-2">
            {[
              { key: 'trending', label: 'Trending', icon: TrendingUp },
              { key: 'new', label: 'New Today', icon: Sparkles },
              { key: 'near', label: 'Near You', icon: MapPin },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as typeof activeSection)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeSection === key
                    ? 'bg-[#1a7a42] text-white shadow-sm'
                    : 'bg-white dark:bg-[#0f2018] text-[#4a6957] dark:text-[#85a88e] border border-[#d1e8d9] dark:border-[#1a3528]'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings grid */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : (activeSection === 'trending' ? mockListings : activeSection === 'new' ? newListings : hostelListings.length ? hostelListings : mockListings)
                  .map(listing => <ProductCard key={listing.id} listing={listing} />)
            }
          </div>
        </div>

        {/* Wanted board preview */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#1a7a42]" />
              <h2 className="font-['Poppins'] font-bold text-sm text-[#0f1f14] dark:text-[#e8f5ed]">Wanted Board</h2>
            </div>
            <Link to="/wanted" className="text-[#1a7a42] text-xs font-semibold">See all →</Link>
          </div>
          <div className="space-y-2">
            {mockWantedPosts.slice(0, 2).map(post => (
              <Link
                key={post.id}
                to="/wanted"
                className="flex items-center gap-3 bg-white dark:bg-[#0f2018] rounded-xl p-3 border border-[#d1e8d9] dark:border-[#1a3528] hover:border-[#1a7a42] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-[#e8f5ed] flex items-center justify-center text-lg">
                  {CATEGORIES.find(c => c.id === post.category)?.icon || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] line-clamp-1">{post.title}</p>
                  <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-0.5">
                    Budget: {formatKES(post.maxPrice)} · {post.offers} offer{post.offers !== 1 ? 's' : ''} · {timeAgo(post.createdAt)}
                  </p>
                </div>
                <ArrowRight size={14} className="text-[#1a7a42] shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* All listings */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-['Poppins'] font-bold text-sm text-[#0f1f14] dark:text-[#e8f5ed]">All Listings</h2>
            <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{mockListings.length} items</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading
              ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : mockListings.map(listing => <ProductCard key={listing.id} listing={listing} />)
            }
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
