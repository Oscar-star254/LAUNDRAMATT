import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, ChevronDown, CheckCircle, AlertCircle, Loader2, Plus, Info } from 'lucide-react';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { CATEGORIES, CONDITIONS, CAMPUS_LOCATIONS } from '../lib/types';
import { formatKES } from '../lib/utils';

const DEMO_IMAGES = [
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop',
];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: '',
    category: '',
    subcategory: '',
    condition: '',
    price: '',
    negotiable: false,
    quantity: '1',
    brand: '',
    description: '',
    defects: '',
    ageInMonths: '',
    reasonForSelling: '',
    location: '',
    tags: '',
  });

  function setField(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }));
  }

  const selectedCat = CATEGORIES.find(c => c.id === form.category);
  const commission = form.price ? Math.round(parseInt(form.price) * 0.05) : 0;
  const payout = form.price ? parseInt(form.price) - commission : 0;

  function addDemoImage() {
    if (images.length < 8) {
      setImages(imgs => [...imgs, DEMO_IMAGES[imgs.length % DEMO_IMAGES.length]]);
    }
  }

  function removeImage(i: number) {
    setImages(imgs => imgs.filter((_, idx) => idx !== i));
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
  }

  const canAdvance1 = form.title && form.category && form.condition && form.price && form.location;
  const canAdvance2 = form.description;
  const canSubmit = canAdvance1 && canAdvance2 && images.length > 0;

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-[#dcf5e6] flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-[#1a7a42]" />
          </div>
          <h2 className="font-['Poppins'] font-bold text-xl text-[#0f1f14] dark:text-[#e8f5ed] mb-2">Listing Submitted! 🎉</h2>
          <p className="text-[#4a6957] dark:text-[#85a88e] text-sm leading-relaxed mb-4">
            Your listing is now in the <strong>Pending</strong> queue. Admin will review it within 30 minutes and notify you by email and SMS.
          </p>
          <div className="bg-[#dcf5e6] rounded-xl p-3 text-[#166236] text-xs text-left mb-4 space-y-1">
            <p>✅ Listing received</p>
            <p>⏳ Awaiting admin review</p>
            <p>📧 You'll be notified once approved</p>
          </div>
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5] dark:bg-[#0a1610] pb-24">
      <TopBar title="Create Listing" back showNotif={false} />

      {/* Progress */}
      <div className="px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-1">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-[#1a7a42]' : 'bg-[#d1e8d9] dark:bg-[#1a3528]'
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e]">Step {step} of 3 — {['Basic Info', 'Description', 'Review & Submit'][step - 1]}</p>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-4">

        {/* STEP 1: Basic info */}
        {step === 1 && (
          <>
            {/* Photos */}
            <div>
              <p className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-2">
                Photos <span className="text-red-500">*</span>
                <span className="text-[#4a6957] font-normal ml-1">({images.length}/8 — first photo is the cover)</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-[#d1e8d9]" />
                    {i === 0 && <span className="absolute bottom-1 left-1 text-[8px] bg-[#1a7a42] text-white px-1.5 rounded-full">Cover</span>}
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {images.length < 8 && (
                  <button
                    onClick={addDemoImage}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-[#d1e8d9] dark:border-[#1a3528] flex flex-col items-center justify-center gap-1 hover:border-[#1a7a42] transition-colors"
                  >
                    <Camera size={18} className="text-[#4a6957]" />
                    <span className="text-[9px] text-[#4a6957]">Add Photo</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-[#4a6957] dark:text-[#85a88e] mt-1">Images are OCR-scanned to remove personal details</p>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. HP EliteBook 840 G5 — Core i7, 16GB RAM"
                value={form.title}
                onChange={e => setField('title', e.target.value)}
                maxLength={100}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] transition-colors"
              />
              <p className="text-[10px] text-[#4a6957] text-right mt-0.5">{form.title.length}/100</p>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Category <span className="text-red-500">*</span></label>
              <select
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors appearance-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>

            {selectedCat && (
              <div>
                <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Subcategory</label>
                <select
                  value={form.subcategory}
                  onChange={e => setField('subcategory', e.target.value)}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
                >
                  <option value="">Select subcategory</option>
                  {selectedCat.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {/* Condition */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Condition <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setField('condition', c.value)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.condition === c.value
                        ? 'bg-[#1a7a42] text-white border-[#1a7a42] shadow-sm'
                        : 'bg-white dark:bg-[#0f2018] border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              {form.condition && ['good', 'fair', 'for_parts'].includes(form.condition) && (
                <p className="text-xs text-[#d97706] flex items-center gap-1 mt-1">
                  <AlertCircle size={11} /> You'll need to list any defects in the next step
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Price (KES) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#4a6957]">KES</span>
                <input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={e => setField('price', e.target.value)}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl pl-14 pr-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] transition-colors font-semibold"
                  min="10"
                />
              </div>
              {form.price && parseInt(form.price) > 0 && (
                <div className="mt-1.5 bg-[#dcf5e6] dark:bg-[#0f2018] rounded-xl p-2.5 flex items-center gap-2">
                  <Info size={12} className="text-[#1a7a42] shrink-0" />
                  <p className="text-[11px] text-[#166236] dark:text-[#4db87a]">
                    You receive <strong>{formatKES(payout)}</strong> after 5% platform fee ({formatKES(commission)})
                  </p>
                </div>
              )}
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <div
                  onClick={() => setField('negotiable', !form.negotiable)}
                  className={`w-10 h-5 rounded-full transition-colors ${form.negotiable ? 'bg-[#1a7a42]' : 'bg-gray-200 dark:bg-[#1a3528]'} relative`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${form.negotiable ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="text-xs text-[#0f1f14] dark:text-[#e8f5ed]">Price is negotiable</span>
              </label>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Pickup Location <span className="text-red-500">*</span></label>
              <select
                value={form.location}
                onChange={e => setField('location', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
              >
                <option value="">Select safe meetup point</option>
                {CAMPUS_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <p className="text-[10px] text-[#4a6957] mt-0.5">Only pre-approved campus safe spots are allowed</p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canAdvance1}
              className="w-full bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3.5 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors disabled:opacity-60"
            >
              Next: Add Description →
            </button>
          </>
        )}

        {/* STEP 2: Description */}
        {step === 2 && (
          <>
            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                Description <span className="text-red-500">*</span>
                <span className="text-[#4a6957] font-normal ml-1">Be honest and detailed</span>
              </label>
              <textarea
                placeholder="Describe your item in detail. Include specs, what's included, usage history..."
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                rows={5}
                maxLength={1000}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] transition-colors resize-none"
              />
              <p className="text-[10px] text-[#4a6957] text-right">{form.description.length}/1000</p>
            </div>

            {['good', 'fair', 'for_parts'].includes(form.condition) && (
              <div>
                <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">
                  Defects / Issues <span className="text-red-500">*</span>
                  <span className="text-[#4a6957] font-normal ml-1">(required for used items)</span>
                </label>
                <textarea
                  placeholder="List all known defects honestly. e.g. 'Screen has a small crack at top corner, battery lasts 3 hours'"
                  value={form.defects}
                  onChange={e => setField('defects', e.target.value)}
                  rows={3}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] placeholder-gray-400 focus:outline-none focus:border-[#1a7a42] transition-colors resize-none"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Age (months)</label>
                <input
                  type="number"
                  placeholder="e.g. 18"
                  value={form.ageInMonths}
                  onChange={e => setField('ageInMonths', e.target.value)}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Brand</label>
                <input
                  type="text"
                  placeholder="e.g. Samsung, HP"
                  value={form.brand}
                  onChange={e => setField('brand', e.target.value)}
                  className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Reason for selling</label>
              <input
                type="text"
                placeholder="e.g. Upgrading, leaving campus, done with unit..."
                value={form.reasonForSelling}
                onChange={e => setField('reasonForSelling', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#0f1f14] dark:text-[#e8f5ed] mb-1.5 block">Tags</label>
              <input
                type="text"
                placeholder="e.g. laptop, hp, student, engineering (comma-separated)"
                value={form.tags}
                onChange={e => setField('tags', e.target.value)}
                className="w-full bg-white dark:bg-[#0f2018] border border-[#d1e8d9] dark:border-[#1a3528] rounded-xl px-4 py-3 text-sm text-[#0f1f14] dark:text-[#e8f5ed] focus:outline-none focus:border-[#1a7a42] transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e] font-semibold py-3 rounded-2xl text-sm hover:bg-[#f5f8f5] dark:hover:bg-[#132a1c] transition-colors">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canAdvance2}
                className="flex-[2] bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors disabled:opacity-60"
              >
                Review Listing →
              </button>
            </div>
          </>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <>
            <div className="bg-white dark:bg-[#0f2018] rounded-2xl border border-[#d1e8d9] dark:border-[#1a3528] overflow-hidden">
              {images[0] && <img src={images[0]} alt="" className="w-full h-48 object-cover" />}
              <div className="p-4 space-y-2">
                <p className="font-['Poppins'] font-bold text-[#0f1f14] dark:text-[#e8f5ed]">{form.title || 'Untitled'}</p>
                <p className="text-[#1a7a42] font-bold text-xl">{form.price ? formatKES(parseInt(form.price)) : 'KES —'}</p>
                {[
                  { label: 'Category', val: CATEGORIES.find(c => c.id === form.category)?.label || '—' },
                  { label: 'Condition', val: CONDITIONS.find(c => c.value === form.condition)?.label || '—' },
                  { label: 'Location', val: form.location || '—' },
                  { label: 'Your payout', val: payout ? formatKES(payout) : '—' },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#4a6957] dark:text-[#85a88e]">{label}</span>
                    <span className="font-semibold text-[#0f1f14] dark:text-[#e8f5ed]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#dcf5e6] dark:bg-[#0f2018] rounded-xl p-3 text-xs text-[#166236] dark:text-[#4db87a]">
              <p className="font-semibold mb-1">Before you submit:</p>
              <ul className="space-y-1">
                {[
                  'All info is accurate and honest',
                  'No phone numbers or contact details in the listing',
                  'Photos are of the actual item (no stock photos)',
                  'Defects are honestly disclosed',
                ].map((i, idx) => <li key={idx} className="flex items-center gap-1.5"><CheckCircle size={11} />{i}</li>)}
              </ul>
            </div>

            <div className="bg-[#fef3c7] rounded-xl p-3 text-xs text-[#92400e]">
              <p className="font-semibold">⏳ Your listing will be reviewed by an admin</p>
              <p className="mt-0.5">Prohibited items are auto-flagged. Approved listings go live within 30 minutes.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-[#d1e8d9] dark:border-[#1a3528] text-[#4a6957] dark:text-[#85a88e] font-semibold py-3 rounded-2xl text-sm hover:bg-[#f5f8f5] dark:hover:bg-[#132a1c] transition-colors">
                ← Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !canSubmit}
                className="flex-[2] bg-[#1a7a42] text-white font-['Poppins'] font-bold py-3 rounded-2xl shadow-md shadow-[#1a7a42]/25 hover:bg-[#166236] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Submit for Review
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
