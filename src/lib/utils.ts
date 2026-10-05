export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-KE', {
    hour: '2-digit', minute: '2-digit',
  });
}

export function conditionLabel(condition: string): string {
  const map: Record<string, string> = {
    brand_new: 'Brand New',
    like_new: 'Like New',
    good: 'Good',
    fair: 'Fair',
    for_parts: 'For Parts',
  };
  return map[condition] || condition;
}

export function conditionColor(condition: string): string {
  const map: Record<string, string> = {
    brand_new: 'text-jk-green-600 bg-jk-green-50',
    like_new: 'text-jk-green-500 bg-jk-green-50',
    good: 'text-jk-gold-700 bg-jk-gold-50',
    fair: 'text-orange-600 bg-orange-50',
    for_parts: 'text-red-600 bg-red-50',
  };
  return map[condition] || 'text-gray-600 bg-gray-50';
}

export function orderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending_admin: 'Awaiting Admin',
    admin_approved: 'Admin Approved',
    awaiting_payment: 'Awaiting Payment',
    paid_escrow: 'Payment in Escrow',
    chat_unlocked: 'Chat Unlocked',
    meetup_scheduled: 'Meetup Scheduled',
    completed: 'Completed',
    disputed: 'Under Dispute',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return map[status] || status;
}

export function orderStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending_admin: 'bg-yellow-100 text-yellow-800',
    admin_approved: 'bg-blue-100 text-blue-800',
    awaiting_payment: 'bg-orange-100 text-orange-800',
    paid_escrow: 'bg-purple-100 text-purple-800',
    chat_unlocked: 'bg-jk-green-100 text-jk-green-800',
    meetup_scheduled: 'bg-jk-green-200 text-jk-green-900',
    completed: 'bg-jk-green-100 text-jk-green-800',
    disputed: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-600',
    refunded: 'bg-gray-100 text-gray-600',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

export function classifyContactAttempt(text: string): boolean {
  const patterns = [
    /0[17]\d{8}/, // Kenyan phone numbers
    /\+254\d{9}/,
    /zero\s*seven/i,
    /saba\s*saba/i, // Swahili digits
    /nipe\s*namba/i,
    /nipigie/i,
    /WhatsApp\s*me/i,
    /call\s*me/i,
    /tuma\s*pesa\s*direct/i,
    /direct\s*payment/i,
    /outside\s*app/i,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    /t\.me\//i,
    /wa\.me\//i,
  ];
  return patterns.some(p => p.test(text));
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
