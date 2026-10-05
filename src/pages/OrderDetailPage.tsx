import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Shield, MessageCircle, CheckCircle, AlertTriangle, MapPin, Clock, X, Loader2 } from 'lucide-react';
import TopBar from '../components/TopBar';
import { mockOrders } from '../lib/mockData';
import { formatKES, orderStatusLabel, orderStatusColor, formatDate, formatTime } from '../lib/utils';

const STATUS_STEPS = [
  'pending_admin',
  'admin_approved',
  'paid_escrow',
  'chat_unlocked',
  'completed',
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = mockOrders.find(o => o.id === id) || mockOrders[0];
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const currentStepIdx = STATUS_STEPS.indexOf(order.status);

  async function handleConfirm() {
    setConfirming(true);
    await new Promise(r => setTimeout(r, 1500));
    setConfirming(false);
    setConfirmed(true);
    setShowConfirm(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-8">
      <TopBar title={`Order #${order.id}`} back showNotif={false} />

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Listing summary */}
        <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4 flex items-center gap-3">
          <img src={order.listing.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-[#e8f5ed]" />
          <div className="flex-1">
            <p className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm line-clamp-2 leading-tight">{order.listing.title}</p>
            <p className="text-[#1a7a42] font-bold mt-1">{formatKES(order.amount)}</p>
            <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${orderStatusColor(order.status)}`}>
              {orderStatusLabel(order.status)}
            </span>
          </div>
        </div>

        {/* Order timeline */}
        <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
          <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm mb-4">Order Timeline</p>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, idx) => {
              const done = idx < currentStepIdx || confirmed;
              const active = idx === currentStepIdx && !confirmed;
              const event = order.timeline.find(e => e.status === step);
              const labels: Record<string, string> = {
                pending_admin: 'Admin Review',
                admin_approved: 'Approved',
                paid_escrow: 'Payment Secured',
                chat_unlocked: 'Chat & Meetup',
                completed: 'Order Complete',
              };
              return (
                <div key={step} className="flex items-start gap-3 relative">
                  {idx < STATUS_STEPS.length - 1 && (
                    <div className={`absolute left-[13px] top-7 w-0.5 h-8 ${done ? 'bg-[#1a7a42]' : 'bg-[#d1e8d9] dark:bg-[#1a3528]'}`} />
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    done || (confirmed && step === 'completed')
                      ? 'bg-[#1a7a42]'
                      : active
                        ? 'bg-[#1a7a42]/20 border-2 border-[#1a7a42]'
                        : 'bg-[#e8f5ed] dark:bg-[#132a1c]'
                  }`}>
                    {done || (confirmed && step === 'completed') ? (
                      <CheckCircle size={14} className="text-white" />
                    ) : active ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1a7a42] animate-pulse" />
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#d1e8d9] dark:bg-[#1a3528]" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className={`text-sm font-semibold ${done || active ? 'text-[#0f1f14] dark:text-[#e8f5ed]' : 'text-[#4a6957] dark:text-[#85a88e]'}`}>
                      {labels[step]}
                    </p>
                    {event && (
                      <>
                        <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">{formatDate(event.time)} at {formatTime(event.time)}</p>
                        {event.note && <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-0.5">{event.note}</p>}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
          <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm mb-3">Payment Breakdown</p>
          {[
            { label: 'Item price', val: formatKES(order.amount) },
            { label: `Platform fee (${order.commissionRate}%)`, val: formatKES(order.platformFee) },
            { label: 'Seller receives', val: formatKES(order.sellerPayout) },
          ].map(({ label, val }) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-[#e8f5ed] dark:border-[#132a1c] last:border-0">
              <span className="text-sm text-[#4a6957] dark:text-[#85a88e]">{label}</span>
              <span className="text-sm font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{val}</span>
            </div>
          ))}
          {order.mpesaRef && (
            <div className="mt-3 bg-[#dcf5e6] dark:bg-[#0f2018] rounded-xl p-2.5 flex items-center gap-2">
              <Shield size={14} className="text-[#1a7a42]" />
              <p className="text-[11px] text-[#166236] dark:text-[#4db87a]">M-Pesa Ref: <strong className="font-['JetBrains_Mono']">{order.mpesaRef}</strong></p>
            </div>
          )}
        </div>

        {/* Meetup info */}
        <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] p-4">
          <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm mb-3">Meetup Details</p>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-[#1a7a42]" />
            <p className="text-sm text-[#0f1f14] dark:text-[#e8f5ed]">{order.meetupLocation}</p>
          </div>
          {order.meetupTime && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-[#1a7a42]" />
              <p className="text-sm text-[#0f1f14] dark:text-[#e8f5ed]">{formatDate(order.meetupTime)} at {formatTime(order.meetupTime)}</p>
            </div>
          )}

          {order.handoverCode && !confirmed && (
            <div className="mt-3 bg-[#fef3c7] rounded-xl p-3">
              <p className="text-xs font-semibold text-[#92400e] mb-1">Your Handover Code</p>
              <p className="font-['JetBrains_Mono'] font-bold text-2xl text-[#d97706] tracking-widest text-center py-1">{order.handoverCode}</p>
              <p className="text-[10px] text-[#b45309] text-center">Give this code to the seller only after you've inspected the item</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!confirmed && order.status === 'chat_unlocked' && (
          <div className="space-y-3">
            <Link
              to="/chat"
              className="flex items-center justify-center gap-2 bg-white dark:bg-[#0f2018] text-[#1a7a42] border border-[#1a7a42] font-['Poppins'] font-bold py-3.5 rounded-2xl text-sm hover:bg-[#f0faf4] transition-colors"
            >
              <MessageCircle size={18} /> Open Chat with Seller
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} /> Confirm Item Received
            </button>
            <button
              onClick={() => setShowDispute(true)}
              className="w-full text-red-600 text-sm font-semibold py-2 flex items-center justify-center gap-1.5 hover:underline"
            >
              <AlertTriangle size={14} /> Open Dispute
            </button>
          </div>
        )}

        {confirmed && (
          <div className="bg-[#dcf5e6] rounded-2xl p-5 text-center">
            <CheckCircle size={36} className="text-[#1a7a42] mx-auto mb-2" />
            <p className="font-['Poppins'] font-bold text-[#166236] text-lg">Order Complete! 🎉</p>
            <p className="text-[#1a7a42] text-sm mt-1">Payment released to seller. Please leave a review.</p>
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-[#0f2018] rounded-t-3xl p-5 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed]">Confirm Receipt</h3>
              <button onClick={() => setShowConfirm(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <p className="text-sm text-[#4a6957] dark:text-[#85a88e] mb-4 leading-relaxed">
              Confirming releases the payment to the seller. Only confirm if you have received and inspected the item.
            </p>
            <div className="bg-[#fef3c7] rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-[#92400e] mb-2">Checklist before confirming:</p>
              <ul className="text-xs text-[#b45309] space-y-1">
                <li>✅ I've physically received the item</li>
                <li>✅ The item matches the description</li>
                <li>✅ No major undisclosed defects</li>
              </ul>
            </div>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {confirming && <Loader2 size={16} className="animate-spin" />}
              <CheckCircle size={18} /> Yes, I Confirm Receipt
            </button>
          </div>
        </div>
      )}

      {/* Dispute modal */}
      {showDispute && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white dark:bg-[#0f2018] rounded-t-3xl p-5 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed]">Open Dispute</h3>
              <button onClick={() => setShowDispute(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3 mb-4">
              {['Item not as described', 'Seller did not show up', 'Item is damaged', 'Wrong item received', 'Other'].map(r => (
                <button
                  key={r}
                  onClick={() => setDisputeReason(r)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                    disputeReason === r
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-[#d1e8d9] dark:border-[#1a3528] text-[#0f1f14] dark:text-[#e8f5ed]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              disabled={!disputeReason}
              onClick={() => setShowDispute(false)}
              className="w-full bg-red-600 text-white font-['Poppins'] font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              Submit Dispute
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
