import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, MessageCircle, ChevronRight, Package, ShoppingBag } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { mockOrders } from '../lib/mockData';
import { formatKES, orderStatusLabel, orderStatusColor, timeAgo } from '../lib/utils';
import type { Order } from '../lib/types';

export default function OrdersPage() {
  const [tab, setTab] = useState<'buying' | 'selling'>('buying');
  const orders = mockOrders;

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar title="My Orders" />

      <div className="max-w-lg mx-auto px-4 pt-3">
        {/* Tabs */}
        <div className="flex bg-[#e8f5ed] dark:bg-[#132a1c] rounded-2xl p-1 mb-4">
          <button
            onClick={() => setTab('buying')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'buying'
                ? 'bg-white dark:bg-[#0f2018] text-[#1a7a42] shadow-sm'
                : 'text-[#4a6957] dark:text-[#85a88e]'
            }`}
          >
            <ShoppingBag size={15} /> Buying
          </button>
          <button
            onClick={() => setTab('selling')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'selling'
                ? 'bg-white dark:bg-[#0f2018] text-[#1a7a42] shadow-sm'
                : 'text-[#4a6957] dark:text-[#85a88e]'
            }`}
          >
            <Package size={15} /> Selling
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1">No orders yet</p>
            <p className="text-[#4a6957] dark:text-[#85a88e] text-sm">Start browsing to make your first purchase!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 p-3 border-b border-[#e8f5ed] dark:border-[#132a1c]">
        <img
          src={order.listing.images[0]}
          alt={order.listing.title}
          className="w-14 h-14 rounded-xl object-cover bg-[#e8f5ed]"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm line-clamp-1">{order.listing.title}</p>
          <p className="text-[#1a7a42] font-bold text-sm">{formatKES(order.amount)}</p>
          <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-0.5">
            Seller: {order.seller.name.split(' ')[0]} · {timeAgo(order.createdAt)}
          </p>
        </div>
        <ChevronRight size={16} className="text-[#4a6957] shrink-0" />
      </div>

      <div className="px-3 py-2.5 flex items-center justify-between">
        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${orderStatusColor(order.status)}`}>
          {orderStatusLabel(order.status)}
        </span>
        <div className="flex gap-2">
          {order.status === 'chat_unlocked' && (
            <Link
              to="/chat"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 bg-[#dcf5e6] text-[#1a7a42] text-xs font-semibold px-3 py-1.5 rounded-xl hover:bg-[#1a7a42] hover:text-white transition-colors"
            >
              <MessageCircle size={12} /> Chat
            </Link>
          )}
          {order.status === 'chat_unlocked' && (
            <div className="flex items-center gap-1 bg-[#fef3c7] text-[#92400e] text-xs font-semibold px-3 py-1.5 rounded-xl">
              <Shield size={12} />
              <span className="font-['JetBrains_Mono']">{order.handoverCode}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
