import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, ChevronLeft, Loader2, ShieldCheck, Lock } from 'lucide-react';
import {
  isAllowedEmail,
  isSuperAdminEmail,
  registerAccount,
  generateOtp,
  verifyOtp,
  remainingOtpAttempts,
  markEmailVerified,
  attemptLogin,
  setAuthenticatedUser,
  lockedUntilMs,
} from '../lib/store';

type AuthStep = 'login' | 'register' | 'otp' | 'details' | 'success';

const SCHOOLS = [
  'School of Engineering',
  'School of Science',
  'School of Architecture and Building Sciences',
  'School of Agricultural Sciences',
  'School of Computing and Information Technology',
  'School of Pharmacy and Health Sciences',
  'School of Business',
  'School of Education and Social Sciences',
  'College of Human Medicine',
];

// Demo OTP is shown in UI only when running in dev mode (import.meta.env.DEV)
const IS_DEV = (import.meta as any).env?.DEV ?? false;

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [step, setStep] = useState<AuthStep>(
    params.get('mode') === 'register' ? 'register' : 'login'
  );
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState(''); // only used in dev
  const [lockCountdown, setLockCountdown] = useState(0);

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    regNumber: '',
    phone: '',
    school: '',
    year: '',
    hostel: '',
  });

  // Countdown timer for locked accounts
  useEffect(() => {
    if (lockCountdown <= 0) return;
    const interval = setInterval(() => {
      setLockCountdown(c => {
        if (c <= 1) { clearInterval(interval); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockCountdown]);

  function field(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
  }

  function validateEmail(email: string) {
    return isAllowedEmail(email);
  }

  function validateRegNumber(reg: string) {
    return /^[A-Z]{2,5}-\d{3}-\d{4}\/\d{4}$/.test(reg.trim());
  }

  function validatePhone(phone: string) {
    return /^(07|01)\d{8}$/.test(phone.replace(/\s/g, ''));
  }

  function passwordStrength(pwd: string): { score: number; label: string; color: string } {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Fair', color: 'bg-orange-400' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-yellow-400' };
    return { score, label: 'Strong', color: 'bg-[#1a7a42]' };
  }

  // ─── LOGIN ───────────────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const email = form.email.toLowerCase().trim();

    if (!isAllowedEmail(email)) {
      setError('Access denied. Use a JKUAT institutional email or the configured super-admin email.');
      return;
    }

    const lockMs = lockedUntilMs(email);
    if (lockMs > Date.now()) {
      const secs = Math.ceil((lockMs - Date.now()) / 1000);
      setLockCountdown(secs);
      setError(`Account locked after too many failed attempts. Try again in ${Math.ceil(secs / 60)} minute(s).`);
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700)); // simulate network
    const result = attemptLogin(email, form.password);
    setLoading(false);

    switch (result) {
      case 'ok':
        setAuthenticatedUser(email);
        navigate(isSuperAdminEmail(email) ? '/admin' : '/home');
        break;
      case 'not_allowed_email':
        setError('Access denied. Use a JKUAT institutional email or the configured super-admin email.');
        break;
      case 'no_account':
        setError('No account found for this email. Please register first.');
        break;
      case 'not_verified':
        setError('Email not verified. Please complete registration to verify your email.');
        break;
      case 'wrong_password':
        setError('Incorrect password. Please try again.');
        break;
      case 'locked': {
        const secs = Math.ceil((lockedUntilMs(email) - Date.now()) / 1000);
        setLockCountdown(secs);
        setError(`Account temporarily locked after 5 failed attempts. Try again in ${Math.ceil(secs / 60)} min.`);
        break;
      }
    }
  }

  // ─── REGISTER ────────────────────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const email = form.email.toLowerCase().trim();

    if (!isAllowedEmail(email)) {
      setError('Access denied. Use a JKUAT institutional email or the configured super-admin email.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (passwordStrength(form.password).score < 2) {
      setError('Password is too weak. Add uppercase letters, numbers, or symbols.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = registerAccount(email, form.password);
    setLoading(false);

    if (result === 'already_exists') {
      setError('An account already exists for this email. Please sign in instead.');
      return;
    }
    if (result === 'not_allowed_email') {
      setError('Access denied. Use a JKUAT institutional email or the configured super-admin email.');
      return;
    }

    // Generate OTP and (in dev only) display it
    const code = generateOtp(email);
    if (IS_DEV) setGeneratedCode(code);

    setStep('otp');
  }

  // ─── OTP VERIFICATION ────────────────────────────────────────────────────────
  async function handleOtp() {
    setError('');
    const code = otpDigits.join('');
    if (code.length < 6) { setError('Please enter all 6 digits.'); return; }

    const email = form.email.toLowerCase().trim();
    const remaining = remainingOtpAttempts(email);
    if (remaining === 0) {
      setError('Maximum OTP attempts reached. Please register again with a new code.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = verifyOtp(email, code);
    setLoading(false);

    switch (result) {
      case 'ok':
        if (isSuperAdminEmail(email)) {
          markEmailVerified(email, {
            name: 'Super Admin',
            role: 'super_admin',
          });
          setStep('success');
        } else {
          setStep('details');
        }
        break;
      case 'invalid': {
        const left = remainingOtpAttempts(email);
        setError(`Incorrect code. ${left} attempt${left !== 1 ? 's' : ''} remaining.`);
        break;
      }
      case 'expired':
        setError('Code expired. Please go back and resend a new code.');
        break;
      case 'used':
        setError('This code has already been used. Please request a new one.');
        break;
      case 'too_many_attempts':
        setError('Maximum attempts exceeded. Please register again.');
        break;
    }
  }

  function handleResendOtp() {
    const email = form.email.toLowerCase().trim();
    const code = generateOtp(email);
    if (IS_DEV) setGeneratedCode(code);
    setOtpDigits(['', '', '', '', '', '']);
    setError('');
    document.getElementById('otp-0')?.focus();
  }

  // ─── PROFILE DETAILS ─────────────────────────────────────────────────────────
  async function handleDetails(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Full name is required.'); return; }
    if (!validateRegNumber(form.regNumber)) {
      setError('Invalid reg number format. Example: ENG-212-0045/2021');
      return;
    }
    if (!validatePhone(form.phone)) {
      setError('Enter a valid Kenyan mobile number (07xx or 01xx).');
      return;
    }
    if (!form.school) { setError('Please select your school.'); return; }
    if (!form.year) { setError('Please select your year of study.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    markEmailVerified(form.email.toLowerCase().trim(), {
      name: form.name,
      school: form.school,
      yearOfStudy: parseInt(form.year) || 1,
      hostel: form.hostel || undefined,
    });
    setLoading(false);
    setStep('success');
  }

  function handleOtpInput(i: number, val: string) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[i] = val;
    setOtpDigits(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  }

  const strength = passwordStrength(form.password);
  const emailOk = isAllowedEmail(form.email);

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto w-full">
        <button
          onClick={() => {
            if (step === 'login' || step === 'register') navigate('/');
            else if (step === 'otp') setStep('register');
            else if (step === 'details') { /* cannot go back — OTP consumed */ }
          }}
          className="p-2 rounded-xl hover:bg-[#e8f5ed] dark:hover:bg-[#132a1c] transition-colors"
          aria-label="Back"
        >
          <ChevronLeft size={20} className="text-[#1a7a42]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1a7a42] flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">JM</span>
          </div>
          <span className="font-['Poppins'] font-bold text-[#1a7a42] text-sm">JKUAT Marketplace</span>
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-[#4a6957] dark:text-[#85a88e]">
          <Lock size={10} />
          <span>Secure</span>
        </div>
      </div>

      {/* Progress bar (register flow) */}
      {(step === 'otp' || step === 'details') && (
        <div className="px-4 max-w-lg mx-auto w-full mb-2">
          <div className="flex gap-1.5">
            {[1, 2, 3].map(s => {
              const stepIdx = step === 'otp' ? 2 : step === 'details' ? 3 : 1;
              return (
                <div
                  key={s}
                  className={`flex-1 h-1.5 rounded-full transition-all ${s <= stepIdx ? 'bg-[#1a7a42]' : 'bg-[#d1e8d9] dark:bg-[#1a3528]'}`}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-0.5">
            Step {step === 'otp' ? 2 : 3} of 3
          </p>
        </div>
      )}

      <div className="flex-1 px-4 pb-10 max-w-lg mx-auto w-full">

        {/* ── LOGIN ── */}
        {step === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div className="pt-4 pb-4">
              <h1 className="font-['Poppins'] font-bold text-2xl text-[#0f1f14] dark:text-[#e8f5ed]">Welcome back 👋</h1>
              <p className="text-[#4a6957] dark:text-[#85a88e] text-sm mt-1">Sign in with your verified JKUAT account</p>
            </div>

            {/* JKUAT-only notice */}
            <div className="flex items-start gap-2 bg-[#dcf5e6] dark:bg-[#0f2018] rounded-xl p-3">
              <ShieldCheck size={15} className="text-[#1a7a42] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#166236] dark:text-[#4db87a] leading-relaxed">
                Students and staff must use a JKUAT institutional email. The configured super-admin email is also accepted.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                JKUAT Email
              </label>
              <input
                type="email"
                placeholder="you@students.jkuat.ac.ke"
                value={form.email}
                onChange={e => field('email', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] focus:ring-2 focus:ring-[#1a7a42]/10 transition-colors"
                required
                autoComplete="email"
                spellCheck={false}
                autoCapitalize="none"
              />
              {form.email && !emailOk && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> Use a JKUAT email or the configured super-admin email
                </p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => field('password', e.target.value)}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 pr-11 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] focus:ring-2 focus:ring-[#1a7a42]/10 transition-colors"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {lockCountdown > 0 && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-xs text-red-700 dark:text-red-400">
                🔒 Account locked. Unlocks in{' '}
                <strong>{Math.floor(lockCountdown / 60)}:{String(lockCountdown % 60).padStart(2, '0')}</strong>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !form.email || !form.password || lockCountdown > 0}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Sign In
            </button>

            <p className="text-center text-sm text-[#4a6957] dark:text-[#85a88e]">
              No account?{' '}
              <button type="button" onClick={() => { setStep('register'); setError(''); }} className="text-[#1a7a42] font-semibold">
                Register free
              </button>
            </p>

            {/* Dev-mode hint only */}
            {IS_DEV && (
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-3 text-[10px] text-gray-500 dark:text-gray-400">
                <p className="font-semibold mb-1">🛠 Dev mode — pre-seeded accounts</p>
                <p>grace.muthoni@students.jkuat.ac.ke · password: <code>demo1234</code></p>
                <p>brian.kamau@students.jkuat.ac.ke · password: <code>demo1234</code></p>
              </div>
            )}
          </form>
        )}

        {/* ── REGISTER ── */}
        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div className="pt-4 pb-4">
              <h1 className="font-['Poppins'] font-bold text-2xl text-[#0f1f14] dark:text-[#e8f5ed]">Create Account 🎓</h1>
              <p className="text-[#4a6957] dark:text-[#85a88e] text-sm mt-1">
                Join with your official JKUAT email — all other addresses are rejected
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">JKUAT Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                placeholder="you@students.jkuat.ac.ke"
                value={form.email}
                onChange={e => field('email', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] focus:ring-2 focus:ring-[#1a7a42]/10 transition-colors"
                required
                autoComplete="email"
                spellCheck={false}
                autoCapitalize="none"
              />
              {form.email && !emailOk && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> Use a JKUAT email or the configured super-admin email
                </p>
              )}
              {form.email && emailOk && (
                <p className="text-[#1a7a42] text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={11} /> {isSuperAdminEmail(form.email) ? 'Super-admin email' : 'JKUAT email'} ✓
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a strong password (min 8 chars)"
                  value={form.password}
                  onChange={e => field('password', e.target.value)}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 pr-11 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] focus:ring-2 focus:ring-[#1a7a42]/10 transition-colors"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded-full transition-all ${
                          i <= strength.score ? strength.color : 'bg-[#d1e8d9] dark:bg-[#1a3528]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-[#4a6957]">Strength: {strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={e => field('confirmPassword', e.target.value)}
                  className={`w-full bg-white dark:bg-[#0f2018] border rounded-xl px-4 py-3 pr-11 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a7a42]/10 transition-colors ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-400 focus:border-red-400'
                      : 'border-[#d1e8d9] dark:border-[#1a3528] focus:border-[#1a7a42]'
                  }`}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1"
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle size={11} /> Passwords do not match
                </p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.password && (
                <p className="text-[#1a7a42] text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={11} /> Passwords match
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <div className="bg-[#fef3c7] rounded-xl p-3 text-[#92400e] text-xs flex gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>
                By continuing you agree to our <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>{' '}
                and <strong>Seller Commission Agreement</strong>. Your IP address and timestamp are recorded at signup.
              </span>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !emailOk ||
                form.password.length < 8 ||
                form.password !== form.confirmPassword
              }
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Verification Code →
            </button>

            <p className="text-center text-sm text-[#4a6957] dark:text-[#85a88e]">
              Already registered?{' '}
              <button type="button" onClick={() => { setStep('login'); setError(''); }} className="text-[#1a7a42] font-semibold">
                Sign in
              </button>
            </p>
          </form>
        )}

        {/* ── OTP ── */}
        {step === 'otp' && (
          <div className="space-y-6">
            <div className="pt-4 pb-2">
              <h1 className="font-['Poppins'] font-bold text-2xl text-[#0f1f14] dark:text-[#e8f5ed]">Verify Email 📧</h1>
              <p className="text-[#4a6957] dark:text-[#85a88e] text-sm mt-1">
                We sent a 6-digit verification code to{' '}
                <strong className="text-[#0f1f14] dark:text-[#e8f5ed]">{form.email}</strong>.
                Check your inbox and spam folder.
              </p>
              <p className="text-xs text-[#4a6957] dark:text-[#85a88e] mt-1">
                Code expires in <strong>10 minutes</strong>. Maximum <strong>5 attempts</strong>. Single use only.
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpInput(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      document.getElementById(`otp-${i - 1}`)?.focus();
                    }
                  }}
                  className="w-11 h-14 text-center text-xl font-['Poppins'] font-bold bg-white dark:bg-[#0f2018] border-2 border-[#d1e8d9] dark:border-[#1a3528] rounded-xl focus:border-[#1a7a42] focus:outline-none transition-colors text-[#0f1f14] dark:text-[#e8f5ed] select-none"
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Dev-only: show the generated code */}
            {IS_DEV && generatedCode && (
              <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-3 text-[10px] text-gray-500">
                🛠 Dev — OTP code: <strong className="font-['JetBrains_Mono'] text-sm">{generatedCode}</strong>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <button
              onClick={handleOtp}
              disabled={loading || otpDigits.join('').length < 6}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Verify Code
            </button>

            <div className="text-center">
              <p className="text-xs text-[#4a6957] dark:text-[#85a88e] mb-1">Didn't receive the code?</p>
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#1a7a42] text-sm font-semibold hover:underline"
              >
                Resend code
              </button>
            </div>
          </div>
        )}

        {/* ── DETAILS ── */}
        {step === 'details' && (
          <form onSubmit={handleDetails} className="space-y-4" noValidate>
            <div className="pt-4 pb-2">
              <h1 className="font-['Poppins'] font-bold text-2xl text-[#0f1f14] dark:text-[#e8f5ed]">Complete Profile ✏️</h1>
              <p className="text-[#4a6957] dark:text-[#85a88e] text-sm mt-1">
                Almost done! Email verified ✅ — now fill in your student details.
              </p>
            </div>

            {[
              { key: 'name', label: 'Full Name', placeholder: 'e.g. Grace Wanjiru Muthoni', type: 'text', autocomplete: 'name' },
              { key: 'regNumber', label: 'Registration Number', placeholder: 'e.g. ICT-312-0101/2022', type: 'text', autocomplete: 'off' },
              { key: 'phone', label: 'M-Pesa Phone Number', placeholder: '07XXXXXXXX', type: 'tel', autocomplete: 'tel' },
            ].map(({ key, label, placeholder, type, autocomplete }) => (
              <div key={key}>
                <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={e => field(key, e.target.value)}
                  autoComplete={autocomplete}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] focus:ring-2 focus:ring-[#1a7a42]/10 transition-colors"
                  required
                />
                {key === 'phone' && (
                  <p className="text-[10px] text-[#4a6957] mt-0.5">
                    🔒 Your phone number is <strong>never</strong> shared with other users and is stored encrypted.
                  </p>
                )}
                {key === 'regNumber' && form.regNumber && !validateRegNumber(form.regNumber) && (
                  <p className="text-orange-500 text-xs mt-0.5 flex items-center gap-1">
                    <AlertCircle size={11} /> Format: ABC-123-0000/2022
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                School / Faculty <span className="text-red-500">*</span>
              </label>
              <select
                value={form.school}
                onChange={e => field('school', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
                required
              >
                <option value="">Select your school</option>
                {SCHOOLS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                value={form.year}
                onChange={e => field('year', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
                required
              >
                <option value="">Select year</option>
                {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Year {y}</option>)}
                <option value="6">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                Hostel / Area <span className="text-[#4a6957] font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Gate C, Chiromo, Ruiru, Kalimoni..."
                value={form.hostel}
                onChange={e => field('hostel', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] transition-colors"
                autoComplete="off"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-3 text-red-700 dark:text-red-400 text-xs">
                <AlertCircle size={14} className="shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Complete Registration
            </button>
          </form>
        )}

        {/* ── SUCCESS ── */}
        {step === 'success' && (
          <div className="text-center py-10 space-y-4">
            <div className="w-20 h-20 rounded-full bg-[#dcf5e6] flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle size={40} className="text-[#1a7a42]" />
            </div>
            <h1 className="font-['Poppins'] font-bold text-2xl text-[#0f1f14] dark:text-[#e8f5ed]">
              {isSuperAdminEmail(form.email) ? 'Super-admin account ready' : 'Karibu!'}
            </h1>
            <p className="text-[#4a6957] dark:text-[#85a88e] text-sm leading-relaxed max-w-xs mx-auto">
              Your account is registered and email-verified. Sign in now to continue.
            </p>
            <div className="bg-[#dcf5e6] rounded-xl p-3 text-[#166236] text-xs text-left space-y-1">
              <p>Email verified</p>
              <p>Account created</p>
              <p>{isSuperAdminEmail(form.email) ? 'Super-admin access enabled' : 'Seller access requires admin approval'}</p>
            </div>
            <button
              onClick={() => { setStep('login'); setError(''); setForm(f => ({ ...f, password: '' })); }}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors"
            >
              Sign In →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
