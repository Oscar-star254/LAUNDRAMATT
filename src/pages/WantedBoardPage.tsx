import { useState } from 'react';
import { Plus, X, Loader2, CheckCircle } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { mockWantedPosts } from '../lib/mockData';
import { CATEGORIES } from '../lib/types';
import { formatKES, timeAgo } from '../lib/utils';
import type { WantedPost } from '../lib/types';

export default function WantedBoardPage() {
  const [showPost, setShowPost] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', maxPrice: '', category: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    setShowPost(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar title="Wanted Board" back />

      <div className="max-w-lg mx-auto px-4 pt-3">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a7a42] to-[#279956] rounded-2xl p-4 mb-4 text-white">
          <h2 className="font-['Poppins'] font-bold text-base">📢 Can't find what you need?</h2>
          <p className="text-white/80 text-xs mt-1 leading-relaxed">Post what you're looking for and let sellers come to you. Sellers can respond with offers.</p>
          <button
            onClick={() => setShowPost(true)}
            className="mt-3 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors"
          >
            <Plus size={14} /> Post a Request
          </button>
        </div>

        {submitted && (
          <div className="bg-[#dcf5e6] rounded-xl p-3 mb-4 flex items-center gap-2 text-[#166236]">
            <CheckCircle size={16} />
            <span className="text-xs font-semibold">Your request is live! Sellers will be notified.</span>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-3">
          {mockWantedPosts.map(post => (
            <WantedCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Post form modal */}
      {showPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0f2018] rounded-t-3xl p-5 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed]">Post a Request</h3>
              <button type="button" onClick={() => setShowPost(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            {[
              { key: 'title', label: 'What are you looking for?', placeholder: 'e.g. SCO 2101 Data Structures Notes' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42]"
                  required
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Details</label>
              <textarea
                placeholder="More details about what you need..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Max Budget (KES)</label>
              <input
                type="number"
                placeholder="500"
                value={form.maxPrice}
                onChange={e => setForm(f => ({ ...f, maxPrice: e.target.value }))}
                className="w-full bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42]"
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading || !form.title || !form.maxPrice}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Post Request
            </button>
          </form>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function WantedCard({ post }: { post: WantedPost }) {
  const [offerSent, setOfferSent] = useState(false);
  const catIcon = CATEGORIES.find(c => c.id === post.category)?.icon || '📦';

  return (
    <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4 hover:border-[#1a7a42] transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#e8f5ed] dark:bg-[#132a1c] flex items-center justify-center text-xl shrink-0">
          {catIcon}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">{post.title}</p>
          <p className="text-xs text-[#4a6957] dark:text-[#85a88e] mt-0.5 leading-relaxed line-clamp-2">{post.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[#1a7a42] font-bold text-xs">{formatKES(post.maxPrice)} budget</span>
            <span className="text-[10px] text-[#4a6957]">·</span>
            <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{post.postedBy.name.split(' ')[0]}</span>
            <span className="text-[10px] text-[#4a6957]">·</span>
            <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{timeAgo(post.createdAt)}</span>
            <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">· {post.offers} offers</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setOfferSent(true)}
        disabled={offerSent}
        className={`mt-3 w-full text-xs font-semibold py-2 rounded-xl transition-colors ${
          offerSent
            ? 'bg-[#dcf5e6] text-[#1a7a42]'
            : 'bg-[#e8f5ed] dark:bg-[#132a1c] text-[#1a7a42] hover:bg-[#1a7a42] hover:text-white'
        }`}
      >
        {offerSent ? '✅ Offer Sent!' : 'I Have This — Make an Offer'}
      </button>
    </div>
  );
}
