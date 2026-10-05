import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Users, ShoppingBag, AlertTriangle, DollarSign,
  FileText, Settings, CheckCircle, X, Eye, TrendingUp, Shield, ChevronLeft,
  Search, Clock, Ban, RefreshCw, Percent
} from 'lucide-react';
import { mockListings, mockOrders, mockUsers, adminStats } from '../lib/mockData';
import { formatKES, orderStatusLabel, orderStatusColor, conditionLabel, timeAgo } from '../lib/utils';

type AdminTab = 'overview' | 'listings' | 'orders' | 'users' | 'disputes' | 'finance' | 'settings';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [commission, setCommission] = useState(5);
  const [editingCommission, setEditingCommission] = useState(false);
  const [newCommission, setNewCommission] = useState('5');
  const [listingFilter, setListingFilter] = useState<'all' | 'pending' | 'live' | 'rejected'>('pending');

  const pendingListings = mockListings.slice(0, 3).map(l => ({ ...l, status: 'pending' as const }));
  const allListings = [...pendingListings, ...mockListings.slice(3)];

  function saveCommission() {
    const val = parseFloat(newCommission);
    if (val >= 1 && val <= 30) {
      setCommission(val);
      setEditingCommission(false);
    }
  }

  const navItems: { key: AdminTab; icon: typeof LayoutDashboard; label: string; badge?: number }[] = [
    { key: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { key: 'listings', icon: Package, label: 'Listings', badge: adminStats.pendingListings },
    { key: 'orders', icon: ShoppingBag, label: 'Orders', badge: adminStats.pendingOrders },
    { key: 'users', icon: Users, label: 'Users' },
    { key: 'disputes', icon: AlertTriangle, label: 'Disputes', badge: adminStats.openDisputes },
    { key: 'finance', icon: DollarSign, label: 'Finance' },
    { key: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] flex">
      {/* Sidebar (md+) */}
      <aside className="hidden md:flex flex-col w-52 bg-[#0f2018] min-h-screen border-r border-[#1a3528] p-4">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-xl bg-[#1a7a42] flex items-center justify-center">
            <span className="text-white font-bold text-xs">JM</span>
          </div>
          <div>
            <p className="text-white font-bold text-xs font-['Poppins']">JKUAT Market</p>
            <p className="text-[#4db87a] text-[9px]">Admin Panel</p>
          </div>
        </div>
        {navItems.map(({ key, icon: Icon, label, badge }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-1 text-left transition-colors relative ${
              tab === key ? 'bg-[#1a7a42] text-white' : 'text-[#85a88e] hover:bg-[#132a1c] hover:text-white'
            }`}
          >
            <Icon size={16} />
            <span className="text-xs font-semibold">{label}</span>
            {badge && badge > 0 ? (
              <span className="absolute right-2 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                {badge}
              </span>
            ) : null}
          </button>
        ))}
        <div className="mt-auto">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-[#85a88e] hover:text-white text-xs px-3 py-2"
          >
            <ChevronLeft size={14} /> Back to App
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Mobile top nav */}
        <div className="md:hidden bg-[#0f2018] px-4 py-3 flex items-center gap-2 sticky top-0 z-40">
          <button onClick={() => navigate('/home')} className="text-[#4db87a] mr-1">
            <ChevronLeft size={18} />
          </button>
          <div className="w-6 h-6 rounded-lg bg-[#1a7a42] flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">JM</span>
          </div>
          <span className="text-white font-bold text-sm font-['Poppins'] flex-1">Admin Panel</span>
          <div className="flex items-center gap-1">
            {['overview', 'listings', 'orders', 'users', 'finance', 'settings'].map(k => {
              const item = navItems.find(n => n.key === k as AdminTab);
              if (!item) return null;
              return (
                <button
                  key={k}
                  onClick={() => setTab(k as AdminTab)}
                  className={`relative px-2 py-1 rounded-lg text-[9px] font-semibold transition-colors ${
                    tab === k ? 'bg-[#1a7a42] text-white' : 'text-[#4db87a]'
                  }`}
                >
                  {k.slice(0, 3)}
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[7px] font-bold rounded-full w-3 h-3 flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <main className="flex-1 p-4 max-w-4xl">

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-4">
              <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Dashboard Overview</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Pending Listings', val: adminStats.pendingListings, icon: Package, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-200' },
                  { label: 'Pending Orders', val: adminStats.pendingOrders, icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
                  { label: 'Open Disputes', val: adminStats.openDisputes, icon: AlertTriangle, color: 'bg-red-50 text-red-600', border: 'border-red-200' },
                  { label: 'Escrow Balance', val: formatKES(adminStats.escrowBalance), icon: Shield, color: 'bg-jk-green-50 text-jk-green-600', border: 'border-jk-green-200' },
                ].map(({ label, val, icon: Icon, color, border }) => (
                  <div key={label} className={`bg-white dark:bg-[#0f2018] rounded-2xl p-4 border ${border} dark:border-[#1a3528]`}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${color.split(' ')[0]}`}>
                      <Icon size={18} className={color.split(' ')[1]} />
                    </div>
                    <p className="font-['Poppins'] font-bold text-lg text-[#0f1f14] dark:text-[#e8f5ed]">{val}</p>
                    <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Today's Revenue", val: formatKES(adminStats.todayRevenue), trend: '+12%' },
                  { label: 'This Week', val: formatKES(adminStats.weeklyRevenue), trend: '+8%' },
                  { label: 'This Month', val: formatKES(adminStats.monthlyRevenue), trend: '+23%' },
                ].map(({ label, val, trend }) => (
                  <div key={label} className="bg-[#1a7a42] rounded-2xl p-3 text-white">
                    <p className="text-white/70 text-[10px]">{label}</p>
                    <p className="font-['Poppins'] font-bold text-sm mt-1">{val}</p>
                    <p className="text-[#fbbf24] text-[10px] mt-0.5 flex items-center gap-0.5">
                      <TrendingUp size={10} /> {trend}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Users', val: adminStats.totalUsers },
                  { label: 'New Today', val: adminStats.newUsersToday },
                  { label: 'Active Sellers', val: adminStats.activeSellers },
                  { label: 'Commission Rate', val: `${commission}%` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white dark:bg-[#0f2018] rounded-xl p-3 border border-[#d1e8d9] dark:border-[#1a3528]">
                    <p className="text-xs font-semibold text-[#4a6957] dark:text-[#85a88e]">{label}</p>
                    <p className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed] mt-1">{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LISTINGS */}
          {tab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Listings</h1>
                <div className="flex gap-2">
                  {(['all', 'pending', 'live', 'rejected'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setListingFilter(f)}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        listingFilter === f
                          ? 'bg-[#1a7a42] text-white'
                          : 'bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {mockListings.map(listing => (
                  <div key={listing.id} className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
                    <div className="flex items-start gap-3">
                      <img src={listing.images[0]} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#e8f5ed]" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm line-clamp-1">{listing.title}</p>
                        <p className="text-[#1a7a42] font-bold text-sm">{formatKES(listing.price)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{listing.seller.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-[#4a6957]">·</span>
                          <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{conditionLabel(listing.condition)}</span>
                          <span className="text-[10px] text-[#4a6957]">·</span>
                          <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{timeAgo(listing.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 flex items-center justify-center gap-1.5 bg-[#dcf5e6] text-[#1a7a42] font-semibold text-xs py-2 rounded-xl hover:bg-[#1a7a42] hover:text-white transition-colors">
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-600 font-semibold text-xs py-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors">
                        <X size={13} /> Reject
                      </button>
                      <button className="px-3 flex items-center gap-1.5 bg-[#f5f8f5] dark:bg-[#132a1c] text-[#4a6957] dark:text-[#85a88e] font-semibold text-xs py-2 rounded-xl hover:bg-[#e8f5ed] transition-colors">
                        <Eye size={13} /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Orders</h1>
              <div className="space-y-3">
                {mockOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
                    <div className="flex items-start gap-3">
                      <img src={order.listing.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm line-clamp-1">{order.listing.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${orderStatusColor(order.status)}`}>
                            {orderStatusLabel(order.status)}
                          </span>
                          <span className="text-[10px] text-[#4a6957]">{formatKES(order.amount)}</span>
                        </div>
                        <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-1">
                          Buyer: {order.buyer.name.split(' ')[0]} → Seller: {order.seller.name.split(' ')[0]}
                        </p>
                      </div>
                    </div>
                    {order.status === 'pending_admin' && (
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 flex items-center justify-center gap-1 bg-[#dcf5e6] text-[#1a7a42] font-semibold text-xs py-2 rounded-xl hover:bg-[#1a7a42] hover:text-white transition-colors">
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 font-semibold text-xs py-2 rounded-xl hover:bg-red-600 hover:text-white transition-colors">
                          <X size={12} /> Decline
                        </button>
                        <button className="px-3 bg-[#f5f8f5] dark:bg-[#132a1c] text-[#4a6957] text-xs font-semibold py-2 rounded-xl">
                          <RefreshCw size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <div className="space-y-4">
              <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Users</h1>
              <div className="flex items-center gap-2 bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-3 py-2.5">
                <Search size={15} className="text-[#4a6957]" />
                <input className="flex-1 text-sm bg-transparent text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none" placeholder="Search by name, email, reg number..." />
              </div>
              <div className="space-y-3">
                {mockUsers.map(user => (
                  <div key={user.id} className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} alt={user.name} className="w-11 h-11 rounded-full object-cover" />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">{user.name}</p>
                          {user.isVerified && <Shield size={12} className="text-[#1a7a42]" />}
                        </div>
                        <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{user.email}</p>
                        <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{user.regNumber} · {user.school.replace('School of ', '')}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="p-1.5 bg-[#fef3c7] text-[#d97706] rounded-lg text-[10px]" title="Suspend">
                          <Clock size={14} />
                        </button>
                        <button className="p-1.5 bg-red-50 text-red-600 rounded-lg" title="Ban">
                          <Ban size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-[#e8f5ed] dark:border-[#132a1c]">
                      <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{user.totalSales} sales</span>
                      <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">Joined {user.joinedAt.slice(0, 10)}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${user.isVerified ? 'bg-[#dcf5e6] text-[#166236]' : 'bg-yellow-50 text-yellow-700'}`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    <div className="mt-1 text-[10px] text-[#d97706] bg-[#fef3c7] rounded px-2 py-0.5 inline-block">
                      📞 Phone masked: 07XX XXX XXX (view in Super Admin)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DISPUTES */}
          {tab === 'disputes' && (
            <div className="space-y-4">
              <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Disputes ({adminStats.openDisputes} open)</h1>
              <div className="bg-[#fef3c7] dark:bg-[#92400e]/10 rounded-xl p-3 text-xs text-[#92400e] dark:text-[#fbbf24]">
                3 disputes require attention. Older than 48 hours need resolution.
              </div>
              {[
                { id: 'D001', listing: 'HP EliteBook 840', amount: 52000, reason: 'Item not as described', buyer: 'Grace M.', seller: 'Brian K.', age: '2h ago' },
                { id: 'D002', listing: 'Engineering Textbook', amount: 850, reason: 'Seller did not show up', buyer: 'Aisha W.', seller: 'Kevin O.', age: '18h ago' },
                { id: 'D003', listing: 'Jiko + Sufuria Set', amount: 800, reason: 'Damaged item', buyer: 'Dennis M.', seller: 'Kevin O.', age: '2d ago' },
              ].map(d => (
                <div key={d.id} className="bg-white dark:bg-[#0f2018] rounded-2xl border border-red-200 dark:border-red-900/30 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">{d.listing}</p>
                      <p className="text-xs text-red-600 mt-0.5">"{d.reason}"</p>
                      <p className="text-[10px] text-[#4a6957] mt-0.5">{d.buyer} (buyer) vs {d.seller} (seller)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1a7a42] text-sm">{formatKES(d.amount)}</p>
                      <p className="text-[10px] text-[#4a6957]">{d.age}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 text-[10px] font-semibold bg-[#dcf5e6] text-[#1a7a42] py-2 rounded-xl hover:bg-[#1a7a42] hover:text-white transition-colors">Full Refund</button>
                    <button className="flex-1 text-[10px] font-semibold bg-[#fef3c7] text-[#d97706] py-2 rounded-xl hover:bg-[#d97706] hover:text-white transition-colors">Partial Refund</button>
                    <button className="flex-1 text-[10px] font-semibold bg-[#f5f8f5] dark:bg-[#132a1c] text-[#4a6957] py-2 rounded-xl">Release to Seller</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FINANCE */}
          {tab === 'finance' && (
            <div className="space-y-4">
              <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Finance & Revenue</h1>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Today's Revenue", val: formatKES(adminStats.todayRevenue) },
                  { label: 'Weekly Revenue', val: formatKES(adminStats.weeklyRevenue) },
                  { label: 'Monthly Revenue', val: formatKES(adminStats.monthlyRevenue) },
                  { label: 'Escrow Balance', val: formatKES(adminStats.escrowBalance) },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
                    <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{label}</p>
                    <p className="font-['Poppins'] font-bold text-lg text-[#1a7a42] mt-1">{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
                <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm mb-3">Recent Transactions</p>
                {mockOrders.map(o => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-[#e8f5ed] dark:border-[#132a1c] last:border-0">
                    <div>
                      <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{o.listing.title.slice(0, 25)}…</p>
                      <p className="text-[10px] text-[#4a6957]">{o.mpesaRef} · {o.buyer.name.split(' ')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#1a7a42]">{formatKES(o.platformFee)}</p>
                      <p className="text-[10px] text-[#4a6957]">commission</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 bg-[#1a7a42] text-white font-semibold text-xs py-3 rounded-xl hover:bg-[#166236] transition-colors flex items-center justify-center gap-1.5">
                  <FileText size={14} /> Export CSV
                </button>
                <button className="flex-1 bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e] font-semibold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5">
                  <FileText size={14} /> Export PDF
                </button>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === 'settings' && (
            <div className="space-y-4">
              <h1 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed]">Platform Settings</h1>

              {/* Commission */}
              <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Percent size={16} className="text-[#1a7a42]" />
                  <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">Commission Rate</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-['Poppins'] font-extrabold text-[#1a7a42]">{commission}%</div>
                  <div className="flex-1">
                    <p className="text-xs text-[#4a6957] dark:text-[#85a88e]">Applied to all transactions</p>
                    <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">Range: 1%–30% · Min fee: KES 20</p>
                    <p className="text-[10px] text-[#d97706] mt-0.5">⚠️ Changes notify sellers 7 days in advance</p>
                  </div>
                </div>
                {editingCommission ? (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="number"
                      value={newCommission}
                      onChange={e => setNewCommission(e.target.value)}
                      min={1} max={30} step={0.5}
                      className="flex-1 bg-[#f5f8f5] dark:bg-[#132a1c] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-2 text-sm text-[#0f1f14] dark:text-[#e8f5ed] font-bold focus:outline-none focus:border-[#1a7a42]"
                    />
                    <button onClick={saveCommission} className="bg-[#1a7a42] text-white px-4 py-2 rounded-xl text-xs font-semibold">Save</button>
                    <button onClick={() => setEditingCommission(false)} className="bg-[#f5f8f5] dark:bg-[#132a1c] text-[#4a6957] px-4 py-2 rounded-xl text-xs font-semibold">Cancel</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingCommission(true)}
                    className="mt-3 bg-[#dcf5e6] text-[#1a7a42] font-semibold text-xs px-4 py-2 rounded-xl hover:bg-[#1a7a42] hover:text-white transition-colors"
                  >
                    Edit Commission Rate
                  </button>
                )}
              </div>

              {/* Other settings */}
              {[
                { label: 'Auto-expire listings after', val: '60 days', editable: false },
                { label: 'Max listing images', val: '8 photos', editable: false },
                { label: 'OTP expiry', val: '10 minutes', editable: false },
                { label: 'Seller payout delay', val: '24 hours after confirmation', editable: false },
                { label: 'Dispute resolution window', val: '48 hours', editable: false },
              ].map(({ label, val }) => (
                <div key={label} className="bg-white dark:bg-[#0f2018] rounded-xl border border-[#d1e8d9] dark:border-[#1a3528] p-3 flex items-center justify-between">
                  <span className="text-sm text-[#4a6957] dark:text-[#85a88e]">{label}</span>
                  <span className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{val}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
