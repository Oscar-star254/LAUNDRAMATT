import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, AlertTriangle, Shield, ImageIcon, ChevronLeft, Info } from 'lucide-react';
import { mockOrders } from '../lib/mockData';
import { currentUser } from '../lib/mockData';
import { classifyContactAttempt, formatTime, timeAgo } from '../lib/utils';
import type { Message } from '../lib/types';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1', orderId: 'ord1', senderId: 'u1',
    text: 'Sawa, tutaonana Main Library saa tano asubuhi?',
    isBlocked: false, sentAt: '2024-01-21T11:00:00Z',
  },
  {
    id: 'm2', orderId: 'ord1', senderId: 'me',
    text: 'Ndio, saa tano ni sawa. Nitakuwa nimevaa jacket ya blue.',
    isBlocked: false, sentAt: '2024-01-21T11:05:00Z',
  },
  {
    id: 'm3', orderId: 'ord1', senderId: 'u1',
    text: "Perfect. I'll bring the laptop with the charger and bag. See you then!",
    isBlocked: false, sentAt: '2024-01-21T11:07:00Z',
  },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [warnings, setWarnings] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const order = mockOrders[0];
  const otherUser = order.seller;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    if (!input.trim() || blocked) return;

    if (classifyContactAttempt(input)) {
      setWarnings(w => {
        const next = w + 1;
        if (next >= 3) setBlocked(true);
        return next;
      });
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
      return;
    }

    const msg: Message = {
      id: `m${Date.now()}`,
      orderId: order.id,
      senderId: currentUser.id,
      text: input,
      isBlocked: false,
      sentAt: new Date().toISOString(),
    };
    setMessages(ms => [...ms, msg]);
    setInput('');
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-[#0f2018] border-b border-[#d1e8d9] dark:border-[#1a3528] px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-[#e8f5ed] transition-colors">
          <ChevronLeft size={20} className="text-[#1a7a42]" />
        </button>
        <img
          src={otherUser.avatarUrl}
          alt={otherUser.name}
          className="w-9 h-9 rounded-full object-cover border-2 border-[#d1e8d9]"
        />
        <div className="flex-1">
          <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">{otherUser.name}</p>
          <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">Order #{order.id} · {order.listing.title.slice(0, 30)}…</p>
        </div>
        <button className="p-1.5 rounded-lg hover:bg-[#e8f5ed] transition-colors">
          <Info size={18} className="text-[#4a6957]" />
        </button>
      </div>

      {/* Order info strip */}
      <div className="bg-[#dcf5e6] dark:bg-[#0f2018]/60 px-4 py-2 flex items-center gap-2">
        <Shield size={13} className="text-[#1a7a42] shrink-0" />
        <p className="text-[11px] text-[#166236] dark:text-[#4db87a] flex-1">
          Chat unlocked for Order #{order.id}. Meetup: <strong>{order.meetupLocation}</strong>
        </p>
        <div className="bg-white dark:bg-[#0f2018] rounded-lg px-2 py-1 border border-[#d1e8d9] dark:border-[#1a3528]">
          <p className="text-[9px] text-[#4a6957] dark:text-[#85a88e]">Handover Code</p>
          <p className="font-['JetBrains_Mono'] font-bold text-[#1a7a42] text-sm tracking-widest">{order.handoverCode}</p>
        </div>
      </div>

      {/* Contact protection notice */}
      <div className="bg-[#fef3c7] dark:bg-[#92400e]/10 px-4 py-2 border-b border-[#fde68a] dark:border-[#92400e]/20">
        <p className="text-[10px] text-[#92400e] dark:text-[#fbbf24] flex items-center gap-1.5">
          <AlertTriangle size={11} className="shrink-0" />
          This chat is monitored. Phone numbers, emails and external links are blocked. Keep all communications here.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-w-lg mx-auto w-full">
        {/* Date separator */}
        <div className="text-center">
          <span className="text-[10px] text-[#4a6957] dark:text-[#85a88e] bg-[#e8f5ed] dark:bg-[#132a1c] px-3 py-1 rounded-full">Today</span>
        </div>

        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isMe && (
                <img
                  src={otherUser.avatarUrl}
                  alt={otherUser.name}
                  className="w-6 h-6 rounded-full object-cover mb-1 shrink-0"
                />
              )}
              <div className={`max-w-[75%] relative`}>
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? 'bg-[#1a7a42] text-white rounded-br-sm'
                      : 'bg-white dark:bg-[#0f2018] text-[#0f1f14] dark:text-[#e8f5ed] border border-[#d1e8d9] dark:border-[#1a3528] rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <p className={`text-[9px] mt-0.5 ${isMe ? 'text-right' : 'text-left'} text-[#4a6957] dark:text-[#85a88e]`}>
                  {formatTime(msg.sentAt)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Blocked message attempt */}
        {showWarning && (
          <div className="flex justify-center">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5 max-w-[90%]">
              <p className="text-xs text-red-700 dark:text-red-400 font-semibold flex items-center gap-1.5">
                <AlertTriangle size={13} />
                ⚠️ Message blocked — contact details detected
              </p>
              <p className="text-[10px] text-red-600 dark:text-red-500 mt-0.5">
                Sharing phone numbers or external contacts violates our rules.{' '}
                {warnings < 3 ? `Strike ${warnings}/3 — next strike is a chat ban.` : 'Account suspended pending admin review.'}
              </p>
            </div>
          </div>
        )}

        {blocked && (
          <div className="text-center py-4">
            <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-4 border border-red-200 dark:border-red-800">
              <AlertTriangle size={24} className="text-red-500 mx-auto mb-2" />
              <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Chat Disabled</p>
              <p className="text-xs text-red-600 dark:text-red-500 mt-1">3 contact-sharing attempts. Your account is under admin review.</p>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      {!blocked && (
        <div className="bg-white dark:bg-[#0f2018] border-t border-[#d1e8d9] dark:border-[#1a3528] p-3 max-w-lg mx-auto w-full">
          <div className="flex items-end gap-2">
            <button className="p-2 rounded-xl text-[#4a6957] hover:bg-[#e8f5ed] transition-colors">
              <ImageIcon size={20} />
            </button>
            <div className="flex-1 bg-[#f5f8f5] dark:bg-[#132a1c] rounded-2xl px-4 py-2.5 flex items-end gap-2">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message… no phone numbers!"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none resize-none max-h-32"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="w-10 h-10 bg-[#1a7a42] text-white rounded-2xl flex items-center justify-center shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors disabled:opacity-50"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
