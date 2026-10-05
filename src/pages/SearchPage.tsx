import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import { mockListings } from '../lib/mockData';
import { CATEGORIES, CONDITIONS } from '../lib/types';
import { conditionLabel } from '../lib/utils';

const RECENT_SEARCHES = ['godoro', 'calculus book', 'HP laptop', 'jiko na sufuria', 'lab coat'];
const POPULAR_TAGS = ['textbooks', 'mattress', 'laptop', 'phone', 'notes', 'calculator', 'lab coat', 'jiko', 'sufuria'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sort: 'newest',
  });

  function setFilter(k: string, v: string) {
    setFilters(f => ({ ...f, [k]: f[k as keyof typeof f] === v ? '' : v }));
  }

  const results = useMemo(() => {
    let res = mockListings.filter(l => l.status === 'live');
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q)) ||
        l.category.includes(q) ||
        l.subcategory.toLowerCase().includes(q)
      );
    }
    if (filters.category) res = res.filter(l => l.category === filters.category);
    if (filters.condition) res = res.filter(l => l.condition === filters.condition);
    if (filters.minPrice) res = res.filter(l => l.price >= parseInt(filters.minPrice));
    if (filters.maxPrice) res = res.filter(l => l.price <= parseInt(filters.maxPrice));
    if (filters.sort === 'price_asc') res = [...res].sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price_desc') res = [...res].sort((a, b) => b.price - a.price);
    else if (filters.sort === 'newest') res = [...res].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (filters.sort === 'popular') res = [...res].sort((a, b) => b.views - a.views);
    return res;
  }, [query, filters]);

  const hasFilters = Object.values(filters).some(v => v && v !== 'newest');

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar title="Search" back showNotif={false} />

      <div className="max-w-lg mx-auto px-4 pt-3">
        {/* Search input */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-2xl px-3 py-2.5 focus-within:border-[#1a7a42] focus-within:ring-2 focus-within:ring-[#1a7a42]/10 transition-all">
            <Search size={16} className="text-[#1a7a42] shrink-0" />
            <input
              type="search"
              placeholder="Search godoro, jiko, calculus..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-sm text-[#0f1f14] dark:text-[#e8f5ed] bg-transparent placeholder-gray-400 focus:outline-none"
              autoFocus
            />
            {query && <button onClick={() => setQuery('')} className="text-gray-400"><X size={14} /></button>}
          </div>
          <button
            onClick={() => setShowFilters(s => !s)}
            className={`p-2.5 rounded-2xl border transition-colors ${
              hasFilters || showFilters
                ? 'bg-[#1a7a42] border-[#1a7a42] text-white'
                : 'bg-white dark:bg-[#0f2018] border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e]'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4 mb-3 space-y-4">
            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.slice(0, 8).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setFilter('category', c.id)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      filters.category === c.id
                        ? 'bg-[#1a7a42] text-white border-[#1a7a42]'
                        : 'bg-[#f5f8f5] dark:bg-[#132a1c] border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e]'
                    }`}
                  >
                    {c.icon} {c.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition */}
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2">Condition</p>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setFilter('condition', c.value)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      filters.condition === c.value
                        ? 'bg-[#1a7a42] text-white border-[#1a7a42]'
                        : 'bg-[#f5f8f5] dark:bg-[#132a1c] border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e]'
                    }`}
                  >
                    {conditionLabel(c.value)}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2">Price Range (KES)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))}
                  className="flex-1 bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-3 py-2 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42]"
                />
                <span className="text-[#4a6957] text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                  className="flex-1 bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-3 py-2 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42]"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2">Sort By</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { v: 'newest', l: 'Newest' },
                  { v: 'price_asc', l: 'Price ↑' },
                  { v: 'price_desc', l: 'Price ↓' },
                  { v: 'popular', l: 'Popular' },
                ].map(({ v, l }) => (
                  <button
                    key={v}
                    onClick={() => setFilters(f => ({ ...f, sort: v }))}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      filters.sort === v
                        ? 'bg-[#1a7a42] text-white border-[#1a7a42]'
                        : 'bg-[#f5f8f5] dark:bg-[#132a1c] border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e]'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={() => setFilters({ category: '', condition: '', minPrice: '', maxPrice: '', location: '', sort: 'newest' })}
                className="text-red-500 text-xs font-semibold flex items-center gap-1"
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* No query: recent + popular */}
        {!query ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2 flex items-center gap-1.5">
                <span>🕒</span> Recent Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e] hover:border-[#1a7a42] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2 flex items-center gap-1.5">
                <span>🔥</span> Popular on Campus
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(t => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#dcf5e6] dark:bg-[#0f2018] border border-[#bbe9cd] dark:border-[#1a3528] text-[#166236] dark:text-[#4db87a] hover:bg-[#1a7a42] hover:text-white transition-colors"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>

            {/* All categories */}
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2">Browse by Category</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFilter('category', cat.id)}
                    className="flex items-center gap-2.5 bg-white dark:bg-[#0f2018] rounded-xl p-2.5 border border-[#d1e8d9] dark:border-[#1a3528] hover:border-[#1a7a42] transition-colors text-left"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-[#0f1f14] dark:text-[#e8f5ed]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#4a6957] dark:text-[#85a88e]">
                <span className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{results.length}</span> results for "{query}"
              </p>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1">No results found</p>
                <p className="text-[#4a6957] dark:text-[#85a88e] text-sm">Try different keywords or check the Wanted Board</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {results.map(l => <ProductCard key={l.id} listing={l} />)}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
