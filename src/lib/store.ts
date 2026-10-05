import { useState, useCallback } from 'react';
import { currentUser, mockListings, mockOrders, mockNotifications, mockWantedPosts } from './mockData';
import type { User, Listing, Order, Notification, WantedPost } from './types';

// ─── Allowed email domains ────────────────────────────────────────────────────
// Only @students.jkuat.ac.ke and @jkuat.ac.ke may register and sign in.
// One super-admin gmail is allowed (set at environment / build time).
// For the demo the super-admin email is read from the constant below — swap it
// for the real address before deploying.
const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL?.trim() ?? '';

export function isSuperAdminEmail(email: string): boolean {
  return Boolean(SUPER_ADMIN_EMAIL) && email.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase();
}

export function isAllowedEmail(email: string): boolean {
  const lower = email.toLowerCase().trim();
  if (isSuperAdminEmail(lower)) return true;
  return lower.endsWith('@students.jkuat.ac.ke') || lower.endsWith('@jkuat.ac.ke');
}

// ─── Account registry (in-memory; replace with API calls in production) ──────
interface AccountRecord {
  email: string;
  passwordHash: string; // In production: bcrypt/argon2. Here: raw string for demo.
  verified: boolean;
  profile: Partial<User>;
  loginAttempts: number;
  lockedUntil: number; // timestamp ms
}

const accountRegistry = new Map<string, AccountRecord>();

// Pre-seed with mock demo users so returning visitors can sign in
[
  { email: 'brian.kamau@students.jkuat.ac.ke', password: 'demo1234' },
  { email: 'aisha.wanjiku@students.jkuat.ac.ke', password: 'demo1234' },
  { email: 'kevin.ochieng@students.jkuat.ac.ke', password: 'demo1234' },
  { email: 'grace.muthoni@students.jkuat.ac.ke', password: 'demo1234' },
].forEach(({ email, password }) => {
  accountRegistry.set(email.toLowerCase(), {
    email: email.toLowerCase(),
    passwordHash: password,
    verified: true,
    profile: {},
    loginAttempts: 0,
    lockedUntil: 0,
  });
});

// ─── OTP store (single-use, expiry tracked) ───────────────────────────────────
interface OtpRecord {
  code: string;
  expiresAt: number;
  used: boolean;
  attempts: number;
}
const otpStore = new Map<string, OtpRecord>();

export function generateOtp(email: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    used: false,
    attempts: 0,
  });
  return code;
}

export type OtpResult = 'ok' | 'invalid' | 'expired' | 'used' | 'too_many_attempts';

export function verifyOtp(email: string, code: string): OtpResult {
  const key = email.toLowerCase();
  const record = otpStore.get(key);
  if (!record) return 'invalid';
  if (record.used) return 'used';
  if (Date.now() > record.expiresAt) return 'expired';
  if (record.attempts >= 5) return 'too_many_attempts';
  record.attempts += 1;
  if (record.code !== code.trim()) return 'invalid';
  record.used = true;
  return 'ok';
}

export function remainingOtpAttempts(email: string): number {
  const record = otpStore.get(email.toLowerCase());
  if (!record) return 5;
  return Math.max(0, 5 - record.attempts);
}

// ─── Registration ─────────────────────────────────────────────────────────────
export type RegisterResult = 'ok' | 'not_allowed_email' | 'already_exists';

export function registerAccount(email: string, password: string): RegisterResult {
  const key = email.toLowerCase().trim();
  if (!isAllowedEmail(key)) return 'not_allowed_email';
  if (accountRegistry.has(key)) return 'already_exists';
  accountRegistry.set(key, {
    email: key,
    passwordHash: password, // production: hash with argon2
    verified: false,
    profile: {},
    loginAttempts: 0,
    lockedUntil: 0,
  });
  return 'ok';
}

export function markEmailVerified(email: string, profile: Partial<User>): void {
  const key = email.toLowerCase().trim();
  const record = accountRegistry.get(key);
  if (record) {
    record.verified = true;
    record.profile = profile;
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────
export type LoginResult =
  | 'ok'
  | 'not_allowed_email'
  | 'no_account'
  | 'not_verified'
  | 'wrong_password'
  | 'locked';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function attemptLogin(email: string, password: string): LoginResult {
  const key = email.toLowerCase().trim();

  if (!isAllowedEmail(key)) return 'not_allowed_email';

  const record = accountRegistry.get(key);
  if (!record) return 'no_account';

  // Check lockout
  if (record.lockedUntil > Date.now()) return 'locked';

  if (!record.verified) return 'not_verified';

  if (record.passwordHash !== password) {
    record.loginAttempts += 1;
    if (record.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      record.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      record.loginAttempts = 0;
    }
    return 'wrong_password';
  }

  // Success — reset counters
  record.loginAttempts = 0;
  record.lockedUntil = 0;
  return 'ok';
}

export function lockedUntilMs(email: string): number {
  return accountRegistry.get(email.toLowerCase())?.lockedUntil ?? 0;
}

// ─── Reactive store ───────────────────────────────────────────────────────────
type Listener = () => void;
const listeners = new Set<Listener>();

const state = {
  user: null as User | null,
  isAuthenticated: false,
  darkMode: false,
  listings: mockListings as Listing[],
  orders: mockOrders as Order[],
  notifications: mockNotifications as Notification[],
  wantedPosts: mockWantedPosts as WantedPost[],
  favourites: ['l2', 'l6'] as string[],
  language: 'en' as 'en' | 'sw',
};

function notify() { listeners.forEach(fn => fn()); }

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() { return state; }

// Called only after attemptLogin returns 'ok'
export function setAuthenticatedUser(email: string): void {
  // In production, load the user profile from DB. For the demo use the mock.
  const account = accountRegistry.get(email.toLowerCase().trim());
  state.user = {
    ...currentUser,
    ...account?.profile,
    email,
    role: isSuperAdminEmail(email) ? 'super_admin' : currentUser.role,
    badges: isSuperAdminEmail(email) ? ['Super Admin'] : currentUser.badges,
  };
  state.isAuthenticated = true;
  notify();
}

// Legacy alias kept for the success-step button in AuthPage
export function login(email: string, password: string): boolean {
  const result = attemptLogin(email, password);
  if (result === 'ok') {
    setAuthenticatedUser(email);
    return true;
  }
  return false;
}

export function logout() {
  state.user = null;
  state.isAuthenticated = false;
  notify();
}

export function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  document.documentElement.classList.toggle('dark', state.darkMode);
  notify();
}

export function toggleFavourite(listingId: string) {
  const idx = state.favourites.indexOf(listingId);
  if (idx >= 0) state.favourites.splice(idx, 1);
  else state.favourites.push(listingId);
  notify();
}

export function markNotificationRead(id: string) {
  const n = state.notifications.find(n => n.id === id);
  if (n) { n.isRead = true; notify(); }
}

export function markAllRead() {
  state.notifications.forEach(n => { n.isRead = true; });
  notify();
}

export function setLanguage(lang: 'en' | 'sw') {
  state.language = lang;
  notify();
}

// React hook
export function useStore() {
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick(t => t + 1), []);
  useState(() => {
    const unsub = subscribe(rerender);
    return unsub;
  });
  return state;
}

// Translations
const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Karibu JKUAT Marketplace',
    tagline: 'Buy and sell safely within the JKUAT community',
    browseListings: 'Browse Listings',
    sellItem: 'Sell an Item',
    searchPlaceholder: 'Search listings, e.g. godoro, jiko, calculus...',
    yourMoney: 'Your money is safe in escrow',
    safeEscrow: 'Safe escrow — your money is protected until you confirm the item',
    mpesaFirst: 'M-Pesa First',
    campusOnly: 'JKUAT Students Only',
    trending: 'Trending Now',
    newToday: 'New Today',
    nearYou: 'Near Your Hostel',
    recommended: 'Recommended for You',
  },
  sw: {
    welcome: 'Karibu JKUAT Marketplace',
    tagline: 'Nunua na uuze salama ndani ya jamii ya JKUAT',
    browseListings: 'Tazama Bidhaa',
    sellItem: 'Uza Bidhaa',
    searchPlaceholder: 'Tafuta bidhaa, mfano godoro, jiko, calculus...',
    yourMoney: 'Pesa yako ipo salama kwenye escrow',
    safeEscrow: 'Escrow salama — pesa yako inalindwa hadi uthibitishe bidhaa',
    mpesaFirst: 'M-Pesa Kwanza',
    campusOnly: 'Wanafunzi wa JKUAT Pekee',
    trending: 'Inayopendelewa',
    newToday: 'Mpya Leo',
    nearYou: 'Karibu Nawe',
    recommended: 'Iliyopendekezwa',
  },
};

export function t(key: string): string {
  return translations[state.language]?.[key] || translations.en[key] || key;
}
