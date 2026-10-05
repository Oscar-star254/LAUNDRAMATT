import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Heart, Share2, Flag, Shield, MapPin, Clock,
  Star, Eye, MessageCircle, ChevronRight, CheckCircle, AlertTriangle, X
} from 'lucide-react';
import { mockListings } from '../lib/mockData';
import { useStore, toggleFavourite } from '../lib/store';
import { formatKES, conditionLabel, conditionColor, timeAgo } from '../lib/utils';

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { favourites } = useStore();
  const [imgIndex, setImgIndex] = useState(0);
  const [showRequest, setShowRequest] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [requested, setRequested] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'seller'>('desc');

  const listing = mockListings.find(l => l.id === id);
  if (!listing) return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-3">😕</p>
        <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">Listing not found</p>
        <button onClick={() => navigate(-1)} className="mt-3 text-[#1a7a42] font-semibold text-sm">← Go back</button>
      </div>
    </div>
  );

  const isFav = favourites.includes(listing.id);
  const similar = mockListings.filter(l => l.category === listing.category && l.id !== listing.id).slice(0, 4);
  const commission = listing.price * 0.05;

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-32">
      {/* Image gallery */}
      <div className="relative bg-[#e8f5ed] h-72">
        <img
          src={listing.images[imgIndex]}
          alt={`${listing.title} - image ${imgIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {/* Overlay controls */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
          >
            <ChevronLeft size={20} className="text-[#0f1f14]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => toggleFavourite(listing.id)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow"
            >
              <Heart size={18} className={isFav ? 'text-red-500 fill-red-500' : 'text-[#0f1f14]'} />
            </button>
            <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow">
              <Share2 size={16} className="text-[#0f1f14]" />
            </button>
          </div>
        </div>

        {/* Image dots + thumbnails */}
        {listing.images.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {listing.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`rounded-full transition-all ${i === imgIndex ? 'w-5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/60'}`}
                />
              ))}
            </div>
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {listing.images.map((img, i) => (
                <button key={i} onClick={() => setImgIndex(i)} className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-white' : 'border-transparent opacity-70'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </>
        )}

        {/* Status badge */}
        {listing.status !== 'live' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-xl text-sm font-semibold">
            {listing.status.toUpperCase()}
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">
        {/* Price + title */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-['Poppins'] font-extrabold text-2xl text-[#1a7a42]">{formatKES(listing.price)}</p>
            {listing.negotiable && <span className="text-xs text-[#d97706] font-semibold">Negotiable</span>}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColor(listing.condition)}`}>
            {conditionLabel(listing.condition)}
          </span>
        </div>

        <h1 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed] text-base leading-tight mb-3">
          {listing.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4 text-xs text-[#4a6957] dark:text-[#85a88e]">
          <div className="flex items-center gap-1"><MapPin size={11} />{listing.location}</div>
          <div className="flex items-center gap-1"><Clock size={11} />{timeAgo(listing.createdAt)}</div>
          <div className="flex items-center gap-1"><Eye size={11} />{listing.views} views</div>
          <div className="flex items-center gap-1"><Heart size={11} />{listing.favourites}</div>
        </div>

        {/* Escrow info box */}
        <div className="bg-[#dcf5e6] dark:bg-[#0f2018] border border-[#bbe9cd] dark:border-[#1a3528] rounded-2xl p-3 mb-4 flex items-start gap-3">
          <Shield size={18} className="text-[#1a7a42] shrink-0 mt-0.5" />
          <div>
            <p className="text-[#166236] dark:text-[#4db87a] font-semibold text-xs">Safe Escrow Payment</p>
            <p className="text-[#166236]/80 dark:text-[#4db87a]/70 text-xs mt-0.5 leading-relaxed">
              You'll pay via M-Pesa. Funds are held safely until you confirm receipt at the campus meetup.
            </p>
            <p className="text-[#166236] dark:text-[#4db87a] text-xs mt-1 font-medium">
              Seller receives: {formatKES(listing.price - commission)} (after 5% platform fee)
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#d1e8d9] dark:border-[#1a3528] mb-4">
          {[
            { key: 'desc', label: 'Description' },
            { key: 'specs', label: 'Details' },
            { key: 'seller', label: 'Seller' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === key
                  ? 'border-[#1a7a42] text-[#1a7a42]'
                  : 'border-transparent text-[#4a6957] dark:text-[#85a88e]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'desc' && (
          <div className="space-y-3 mb-4">
            <p className="text-sm text-[#0f1f14] dark:text-[#e8f5ed] leading-relaxed">{listing.description}</p>
            {listing.defects && (
              <div className="flex items-start gap-2 bg-[#fef3c7] dark:bg-[#92400e]/20 rounded-xl p-3">
                <AlertTriangle size={14} className="text-[#d97706] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-[#92400e] dark:text-[#fbbf24]">Known Issues / Defects</p>
                  <p className="text-xs text-[#b45309] dark:text-[#fcd34d] mt-0.5">{listing.defects}</p>
                </div>
              </div>
            )}
            {listing.reasonForSelling && (
              <div>
                <p className="text-xs font-semibold text-[#4a6957] dark:text-[#85a88e]">Reason for selling</p>
                <p className="text-sm text-[#0f1f14] dark:text-[#e8f5ed] mt-0.5">{listing.reasonForSelling}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {listing.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-[#e8f5ed] dark:bg-[#132a1c] text-[#4a6957] dark:text-[#85a88e] px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-2 mb-4">
            {[
              { label: 'Category', val: listing.category + ' › ' + listing.subcategory },
              { label: 'Condition', val: conditionLabel(listing.condition) },
              { label: 'Brand/Model', val: listing.brand || 'Not specified' },
              { label: 'Age', val: listing.ageInMonths ? `${listing.ageInMonths} months` : 'N/A' },
              { label: 'Quantity', val: String(listing.quantity) },
              { label: 'Pickup Location', val: listing.location },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#e8f5ed] dark:border-[#132a1c]">
                <span className="text-xs text-[#4a6957] dark:text-[#85a88e]">{label}</span>
                <span className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-right max-w-[180px]">{val}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'seller' && (
          <div className="mb-4">
            <div className="flex items-center gap-3 bg-white dark:bg-[#0f2018] rounded-2xl p-4 border border-[#d1e8d9] dark:border-[#1a3528] mb-3">
              <img
                src={listing.seller.avatarUrl}
                alt={listing.seller.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#d1e8d9]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">{listing.seller.name}</p>
                  {listing.seller.isVerified && <CheckCircle size={13} className="text-[#1a7a42]" />}
                </div>
                <p className="text-xs text-[#4a6957] dark:text-[#85a88e]">{listing.seller.school}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-0.5">
                    <Star size={11} className="text-[#f59e0b] fill-[#f59e0b]" />
                    <span className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{listing.seller.rating}</span>
                  </div>
                  <span className="text-xs text-[#4a6957] dark:text-[#85a88e]">{listing.seller.totalSales} sales</span>
                  <span className="text-xs text-[#4a6957] dark:text-[#85a88e]">⚡ {listing.seller.responseTime}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {listing.seller.badges.map(b => (
                <span key={b} className="text-[10px] bg-[#dcf5e6] dark:bg-[#0f2018] text-[#166236] dark:text-[#4db87a] border border-[#bbe9cd] dark:border-[#1a3528] px-2 py-0.5 rounded-full font-semibold">
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Safe meetup guide */}
        <div className="bg-[#fef3c7] dark:bg-[#92400e]/10 border border-[#fde68a] dark:border-[#92400e]/30 rounded-2xl p-3 mb-4">
          <p className="font-semibold text-[#92400e] dark:text-[#fbbf24] text-xs mb-1">🤝 Safe Meetup Guide</p>
          <ul className="text-xs text-[#b45309] dark:text-[#fcd34d] space-y-0.5">
            <li>• Meet only at approved campus locations</li>
            <li>• Inspect the item before confirming</li>
            <li>• Never pay outside the app</li>
            <li>• Daytime meetups only</li>
          </ul>
        </div>

        {/* Similar items */}
        {similar.length > 0 && (
          <div className="mb-4">
            <p className="font-['Poppins'] font-bold text-sm text-[#0f1f14] dark:text-[#e8f5ed] mb-3">Similar Items</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {similar.map(l => (
                <button
                  key={l.id}
                  onClick={() => navigate(`/listings/${l.id}`)}
                  className="flex-none w-32 bg-white dark:bg-[#0f2018] rounded-xl overflow-hidden border border-[#d1e8d9] dark:border-[#1a3528] hover:shadow-md transition-shadow text-left"
                >
                  <div className="h-24 bg-[#e8f5ed] overflow-hidden">
                    <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <p className="text-[10px] font-semibold line-clamp-2 text-[#0f1f14] dark:text-[#e8f5ed]">{l.title}</p>
                    <p className="text-[#1a7a42] font-bold text-xs mt-1">{formatKES(l.price)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f2018] border-t border-[#d1e8d9] dark:border-[#1a3528] p-4 pb-safe max-w-lg mx-auto shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex gap-3">
          <button
            onClick={() => toggleFavourite(listing.id)}
            className="w-12 h-12 rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] flex items-center justify-center hover:border-red-300 transition-colors"
          >
            <Heart size={20} className={isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'} />
          </button>

          {listing.negotiable && !requested && (
            <button
              onClick={() => setShowOffer(true)}
              className="flex-1 bg-white dark:bg-[#0f2018] border border-[#1a7a42] text-[#1a7a42] font-['Poppins'] font-bold py-3 rounded-2xl text-sm hover:bg-[#f0faf4] transition-colors"
            >
              Make Offer
            </button>
          )}
          <button
            onClick={() => setShowRequest(true)}
            disabled={requested || listing.status !== 'live'}
            className="flex-1 bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3 rounded-2xl text-sm shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {requested ? (<><CheckCircle size={16} /> Requested!</>) : (<><Shield size={16} /> Request to Buy</>)}
          </button>
        </div>
      </div>

      {/* Request to buy modal */}
      {showRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-[#0f2018] rounded-t-3xl p-5 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed]">Request to Buy</h3>
              <button onClick={() => setShowRequest(false)}><X size={20} className="text-gray-400" /></button>
            </div>

            <div className="bg-[#f5f8f5] dark:bg-[#132a1c] rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <img src={listing.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] line-clamp-1">{listing.title}</p>
                  <p className="text-[#1a7a42] font-bold text-sm">{formatKES(listing.price)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { label: 'Item price', val: formatKES(listing.price) },
                { label: 'Platform fee (5%)', val: formatKES(Math.round(commission)) },
                { label: 'Meetup location', val: listing.location },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-[#4a6957] dark:text-[#85a88e]">{label}</span>
                  <span className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{val}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold border-t border-[#d1e8d9] dark:border-[#1a3528] pt-2">
                <span className="text-[#0f1f14] dark:text-[#e8f5ed]">You pay (via M-Pesa)</span>
                <span className="text-[#1a7a42]">{formatKES(listing.price)}</span>
              </div>
            </div>

            <div className="bg-[#dcf5e6] rounded-xl p-3 mb-4 text-xs text-[#166236]">
              <p className="font-semibold mb-1">What happens next?</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Admin reviews and approves the request</li>
                <li>You receive an M-Pesa STK Push to pay</li>
                <li>Chat unlocks to arrange campus meetup</li>
                <li>You confirm receipt — seller gets paid</li>
              </ol>
            </div>

            <button
              onClick={() => { setRequested(true); setShowRequest(false); }}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={18} /> Confirm Request
            </button>
          </div>
        </div>
      )}

      {/* Make offer modal */}
      {showOffer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-[#0f2018] rounded-t-3xl p-5 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed]">Make an Offer</h3>
              <button onClick={() => setShowOffer(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-[#4a6957] dark:text-[#85a88e] mb-3">
              Listed price: <strong className="text-[#1a7a42]">{formatKES(listing.price)}</strong>
            </p>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#4a6957]">KES</span>
              <input
                type="number"
                placeholder={String(Math.round(listing.price * 0.9))}
                value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)}
                className="w-full bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl pl-14 pr-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] font-semibold text-lg"
              />
            </div>
            <button
              onClick={() => { setRequested(true); setShowOffer(false); }}
              disabled={!offerPrice}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors disabled:opacity-60"
            >
              Send Offer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
