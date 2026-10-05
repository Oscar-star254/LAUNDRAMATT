import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Smartphone, Users, ChevronRight, Star, CheckCircle, Lock, TrendingUp } from 'lucide-react';
import { mockListings } from '../lib/mockData';
import { formatKES } from '../lib/utils';
import { toggleDarkMode, useStore } from '../lib/store';
import { Moon, Sun } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { darkMode } = useStore();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { icon: Shield, title: 'Safe Escrow', desc: 'Your money is held securely until you confirm the item. Hakuna matata!', color: 'bg-jk-green-50 text-jk-green-700' },
    { icon: Smartphone, title: 'M-Pesa Payments', desc: 'Pay and receive funds via M-Pesa STK Push. Fast, easy, Kenyan.', color: 'bg-jk-gold-50 text-jk-gold-700' },
    { icon: Lock, title: 'Contact Protected', desc: 'Phone numbers are never shared. All communication stays in the app.', color: 'bg-blue-50 text-blue-700' },
    { icon: Users, title: 'JKUAT Exclusive', desc: 'Only verified @students.jkuat.ac.ke and @jkuat.ac.ke emails can join.', color: 'bg-purple-50 text-purple-700' },
  ];

  const testimonials = [
    { name: 'Brian K.', school: 'Engineering', text: 'Sold my laptop within 3 days! The escrow system gave the buyer confidence.', stars: 5 },
    { name: 'Aisha W.', school: 'Science', text: 'Bought textbooks for half the campus bookshop price. Absolutely recommend.', stars: 5 },
    { name: 'Kevin O.', school: 'Business', text: 'Safe and transparent. I love that phone numbers are never visible.', stars: 5 },
  ];

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1a7a42] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">JM</span>
          </div>
          <div>
            <p className="font-['Poppins'] font-bold text-[#1a7a42] text-sm leading-none">JKUAT</p>
            <p className="font-['Poppins'] font-bold text-[#1a7a42] text-sm leading-none">Marketplace</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-[#e8f5ed] transition-colors">
            {darkMode ? <Sun size={18} className="text-[#f59e0b]" /> : <Moon size={18} className="text-gray-500" />}
          </button>
          <Link to="/auth" className="text-[#1a7a42] font-semibold text-sm px-3 py-1.5 rounded-xl border border-[#1a7a42] hover:bg-[#1a7a42] hover:text-white transition-colors">
            Login
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="px-4 pt-8 pb-10 max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 bg-[#dcf5e6] text-[#166236] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <CheckCircle size={12} />
          JKUAT Students Only · Verified & Safe
        </div>
        <h1 className="font-['Poppins'] font-extrabold text-3xl text-[#0f1f14] dark:text-[#e8f5ed] leading-tight mb-3">
          Karibu JKUAT<br />
          <span className="text-[#1a7a42]">Marketplace</span> 🛒
        </h1>
        <p className="text-[#4a6957] dark:text-[#85a88e] text-sm leading-relaxed mb-6 max-w-xs mx-auto">
          Buy and sell new &amp; second-hand items safely within the JKUAT community. Escrow-protected, M-Pesa powered.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/auth?mode=register')}
            className="bg-[#1a7a42] text-white font-['Poppins'] font-semibold px-5 py-3 rounded-2xl shadow-lg shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors text-sm flex items-center gap-1.5"
          >
            Get Started Free
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white dark:bg-[#0f2018] text-[#1a7a42] font-['Poppins'] font-semibold px-5 py-3 rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] hover:bg-[#f0faf4] transition-colors text-sm"
          >
            Browse Listings
          </button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#4a6957] dark:text-[#85a88e]">
          <div className="flex items-center gap-1"><CheckCircle size={11} className="text-[#1a7a42]" /> 1,847 users</div>
          <div className="flex items-center gap-1"><CheckCircle size={11} className="text-[#1a7a42]" /> KES 2.3M+ traded</div>
          <div className="flex items-center gap-1"><CheckCircle size={11} className="text-[#1a7a42]" /> 100% JKUAT</div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-4 pb-8 max-w-lg mx-auto">
        <h2 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed] text-lg mb-4">Why JKUAT Marketplace?</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <button
              key={i}
              className={`p-4 rounded-2xl border text-left transition-all ${
                activeFeature === i
                  ? 'border-[#1a7a42] shadow-md shadow-[#1a7a42]/10 bg-white dark:bg-[#0f2018]'
                  : 'border-[#d1e8d9] dark:border-[#1a3528] bg-white dark:bg-[#0f2018]'
              }`}
              onClick={() => setActiveFeature(i)}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${f.color}`}>
                <f.icon size={18} />
              </div>
              <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-xs mb-1">{f.title}</p>
              <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Sample listings */}
      <section className="px-4 pb-8 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed] text-lg">Live on Campus</h2>
          <button onClick={() => navigate('/auth')} className="text-[#1a7a42] text-xs font-semibold">See all →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
          {mockListings.slice(0, 5).map(listing => (
            <button
              key={listing.id}
              onClick={() => navigate('/auth')}
              className="flex-none w-36 bg-white dark:bg-[#0f2018] rounded-2xl overflow-hidden border border-[#d1e8d9] dark:border-[#1a3528] snap-start hover:shadow-md transition-shadow text-left"
            >
              <div className="h-28 bg-[#e8f5ed] overflow-hidden">
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="text-[11px] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] line-clamp-2 leading-tight">{listing.title}</p>
                <p className="text-[#1a7a42] font-bold text-xs mt-1">{formatKES(listing.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-8 max-w-lg mx-auto">
        <h2 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed] text-lg mb-4">How It Works</h2>
        <div className="space-y-3">
          {[
            { step: '1', title: 'Browse & Request', desc: 'Find what you need. Send a "Request to Buy" — no phone numbers needed.' },
            { step: '2', title: 'Admin Approves & Pay via M-Pesa', desc: 'Admin confirms the order. You pay via M-Pesa STK Push. Funds go to escrow.' },
            { step: '3', title: 'Meet on Campus & Confirm', desc: 'Meet at a safe campus spot. Inspect the item. Enter the Handover Code.' },
            { step: '4', title: 'Seller Gets Paid', desc: 'Seller receives payment via M-Pesa after deducting the small platform fee.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3 bg-white dark:bg-[#0f2018] rounded-2xl p-3 border border-[#d1e8d9] dark:border-[#1a3528]">
              <div className="w-8 h-8 rounded-full bg-[#1a7a42] text-white font-['Poppins'] font-bold text-sm flex items-center justify-center shrink-0">
                {step}
              </div>
              <div>
                <p className="font-['Poppins'] font-semibold text-[#0f1f14] dark:text-[#e8f5ed] text-sm">{title}</p>
                <p className="text-[#4a6957] dark:text-[#85a88e] text-xs mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-4 mb-8 rounded-3xl bg-[#1a7a42] p-5 text-white max-w-lg mx-auto">
        <h2 className="font-['Poppins'] font-bold text-lg mb-3">The Numbers 📊</h2>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { val: '1,847', label: 'Students' },
            { val: 'KES 2.3M+', label: 'Traded' },
            { val: '400+', label: 'Listings' },
          ].map(({ val, label }) => (
            <div key={label} className="bg-white/10 rounded-xl p-2">
              <p className="font-['Poppins'] font-extrabold text-lg text-[#fbbf24]">{val}</p>
              <p className="text-xs text-white/80">{label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 mt-3 bg-white/10 rounded-xl p-2.5 text-xs">
          <TrendingUp size={14} className="text-[#fbbf24]" />
          <span>End-of-semester move-out sales are LIVE 🏃</span>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 pb-8 max-w-lg mx-auto">
        <h2 className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed] text-lg mb-3">What Students Say</h2>
        <div className="space-y-3">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white dark:bg-[#0f2018] rounded-2xl p-3.5 border border-[#d1e8d9] dark:border-[#1a3528]">
              <div className="flex items-center gap-1 mb-1">
                {Array(t.stars).fill(0).map((_, s) => (
                  <Star key={s} size={11} className="text-[#f59e0b] fill-[#f59e0b]" />
                ))}
              </div>
              <p className="text-[#0f1f14] dark:text-[#e8f5ed] text-sm leading-relaxed">"{t.text}"</p>
              <p className="text-[#4a6957] dark:text-[#85a88e] text-xs mt-1.5 font-medium">{t.name} · {t.school}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="px-4 pb-12 max-w-lg mx-auto text-center">
        <button
          onClick={() => navigate('/auth?mode=register')}
          className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-4 rounded-2xl text-base shadow-lg shadow-[#1a7a42]/30 hover:bg-[#166236] transition-colors"
        >
          Join Free with JKUAT Email →
        </button>
        <p className="text-xs text-[#4a6957] dark:text-[#85a88e] mt-3">
          Only @students.jkuat.ac.ke and @jkuat.ac.ke emails are accepted
        </p>
      </section>
    </div>
  );
}
