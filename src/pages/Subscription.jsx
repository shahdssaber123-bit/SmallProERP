import React, { useState } from 'react';
import { PageHeader } from '@/components/erp/ErpKit';

const MONTHLY = { plus: 1500, premium: 3000 };
const ANNUAL  = { plus: 1200, premium: 2400 };
const PLAN_NAMES = { plus: 'Plus', premium: 'Premium' };

function fmtCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1  ').trim();
}
function fmtExpiry(val) {
  let v = val.replace(/\D/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + ' / ' + v.slice(2);
  return v;
}

export default function Subscription() {
  const [billing, setBilling] = useState('annual');
  const [plan, setPlan]       = useState('premium');
  const [cardName, setCardName] = useState('');
  const [cardNum, setCardNum]   = useState('');
  const [expiry, setExpiry]     = useState('');
  const [cvv, setCvv]           = useState('');
  const [email, setEmail]       = useState('');
  const [paid, setPaid]         = useState(false);
  const [paying, setPaying]     = useState(false);

  const prices = billing === 'annual' ? ANNUAL : MONTHLY;
  const mo = prices[plan];

  let baseText, discountText, vatAmt, totalAmt, showDiscount;
  if (billing === 'annual') {
    const base = MONTHLY[plan] * 12;
    const disc = base - mo * 12;
    const sub  = mo * 12;
    const vat  = Math.round(sub * 0.14);
    baseText     = `${base.toLocaleString()} EGP / yr`;
    discountText = `-${disc.toLocaleString()} EGP`;
    vatAmt       = `${vat.toLocaleString()} EGP`;
    totalAmt     = `${Math.round(sub * 1.14).toLocaleString()} EGP`;
    showDiscount = true;
  } else {
    const vat = Math.round(mo * 0.14);
    baseText     = `${mo.toLocaleString()} EGP / mo`;
    discountText = '—';
    vatAmt       = `${vat.toLocaleString()} EGP`;
    totalAmt     = `${Math.round(mo * 1.14).toLocaleString()} EGP`;
    showDiscount = false;
  }

  function handlePay() {
    if (!cardName || cardNum.replace(/\s/g, '').length < 16) {
      alert('Please fill in all payment details.');
      return;
    }
    setPaying(true);
    setTimeout(() => { setPaying(false); setPaid(true); }, 1800);
  }

  const planCard = (id, name, tagline, features) => {
    const isSelected = plan === id;
    const isPopular  = id === 'premium';
    return (
      <div
        key={id}
        onClick={() => setPlan(id)}
        className={`relative rounded-[1.75rem] border-2 p-7 cursor-pointer transition-all shadow-[0_16px_45px_-34px_rgba(15,23,42,0.55)] hover:-translate-y-0.5
          ${isSelected
            ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-500'
            : isPopular
              ? 'border-sky-400 dark:border-sky-500 bg-white dark:bg-slate-900'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-blue-700 text-white text-[11px] font-black px-4 py-1 rounded-full whitespace-nowrap">
            ⭐ Most Popular
          </div>
        )}
        <div className="font-black text-base text-slate-900 dark:text-white mb-0.5">{name}</div>
        <div className="text-xs text-slate-500 mb-5">{tagline}</div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">{prices[id].toLocaleString()}</span>
          <span className="text-slate-500 text-sm font-semibold">EGP/mo</span>
        </div>
        {billing === 'annual' && (
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-4">
            Billed {(prices[id] * 12).toLocaleString()} EGP/yr — save 20%
          </p>
        )}
        <hr className="border-slate-200 dark:border-slate-700 mb-5 mt-4" />
        {features.map(({ ok, text }) => (
          <div key={text} className="flex items-center gap-2 text-sm mb-2">
            <span className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0
              ${ok ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
              {ok ? '✓' : '✕'}
            </span>
            <span className={ok ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}>{text}</span>
          </div>
        ))}
        <button className={`w-full mt-5 py-3 rounded-2xl text-sm font-bold transition-all
          ${isSelected
            ? 'bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-lg shadow-blue-700/30'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
          {isSelected ? '✓ Selected' : 'Select Plan'}
        </button>
      </div>
    );
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-[0.85rem] border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-slate-900 transition";
  const labelCls = "text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1 block";

  return (
    <div>
      <PageHeader
        title="Subscription & Billing"
        subtitle="Choose the plan that fits your business. Upgrade or downgrade at any time."
      />

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="text-sm font-semibold text-slate-500">Monthly</span>
        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-full p-0.5">
          {['monthly', 'annual'].map((b) => (
            <button key={b} onClick={() => setBilling(b)}
              className={`px-5 py-1.5 rounded-full text-[13px] font-bold transition-all capitalize
                ${billing === b ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-sky-400 shadow' : 'text-slate-500'}`}>
              {b}
            </button>
          ))}
        </div>
        <span className="text-sm font-semibold text-slate-500">Annual</span>
        {billing === 'annual' && (
          <span className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 text-[11px] font-black px-2.5 py-1 rounded-full">SAVE 20%</span>
        )}
      </div>

      {/* Plans grid — 2 plans centered */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 max-w-2xl mx-auto">
        {planCard('plus', 'Plus', 'Perfect for small businesses', [
          { ok: true,  text: 'Up to 10 users' },
          { ok: true,  text: 'CRM — 1,000 leads' },
          { ok: true,  text: 'Sales & Invoicing' },
          { ok: true,  text: 'Full Inventory' },
          { ok: true,  text: 'Purchase Orders' },
          { ok: false, text: 'AI Insights' },
          { ok: true, text: 'OCR Processing' },
        ])}
        {planCard('premium', 'Premium', 'For growing businesses', [
          { ok: true, text: 'Up to 25 users' },
          { ok: true, text: 'Unlimited CRM leads' },
          { ok: true, text: 'Full Sales & Purchase' },
          { ok: true, text: 'Advanced Inventory' },
          { ok: true, text: 'AI Insights (Groq)' },
          { ok: true, text: 'OCR Processing' },
        ])}
      </div>

      {/* Payment + Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">

        {/* Payment form */}
        <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 shadow-[0_16px_45px_-34px_rgba(15,23,42,0.55)]">
          <p className="text-lg font-black text-slate-900 dark:text-white mb-5">Payment Details</p>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Cardholder Name</label>
              <input className={inputCls} placeholder="Ahmed Mohamed" value={cardName} onChange={e => setCardName(e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Card Number</label>
              <input className={inputCls} placeholder="1234  5678  9012  3456" value={cardNum}
                onChange={e => setCardNum(fmtCard(e.target.value))} maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Expiry Date</label>
                <input className={inputCls} placeholder="MM / YY" value={expiry}
                  onChange={e => setExpiry(fmtExpiry(e.target.value))} maxLength={7} />
              </div>
              <div>
                <label className={labelCls}>CVV</label>
                <input className={inputCls} placeholder="•••" value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g,'').slice(0,3))} maxLength={3} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Billing Email</label>
              <input className={inputCls} type="email" placeholder="admin@yourcompany.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Country</label>
                <select className={inputCls}>
                  <option>Egypt</option>
                  <option>Saudi Arabia</option>
                  <option>UAE</option>
                  <option>Jordan</option>
                  <option>United States</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>VAT / Tax ID (optional)</label>
                <input className={inputCls} placeholder="EG-123456789" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5 pt-5 border-t border-slate-200 dark:border-slate-700">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-[11px] text-slate-500">Payments are secured with 256-bit SSL encryption · PCI-DSS Compliant</span>
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-[1.75rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-7 shadow-[0_16px_45px_-34px_rgba(15,23,42,0.55)]">
          <p className="text-lg font-black text-slate-900 dark:text-white mb-4">Order Summary</p>
          {[
            ['Plan', PLAN_NAMES[plan], false],
            ['Billing', billing === 'annual' ? 'Annual' : 'Monthly', false],
            ['Base price', baseText, false],
            showDiscount ? ['Annual discount', discountText, true] : null,
            ['VAT (14%)', vatAmt, false],
          ].filter(Boolean).map(([label, val, isDiscount]) => (
            <div key={label} className="flex justify-between items-center text-sm py-2">
              <span className="text-slate-500">{label}</span>
              <span className={`font-semibold ${isDiscount ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>{val}</span>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700 font-bold text-base mt-1">
            <span className="text-slate-900 dark:text-white">Total due today</span>
            <span className="text-slate-900 dark:text-white">{totalAmt}</span>
          </div>
          <div className="mt-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-3 flex gap-2.5">
            <svg className="flex-shrink-0 mt-0.5" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <div className="text-xs text-green-800 dark:text-green-300">
              <strong className="block font-bold mb-0.5">14-day free trial included</strong>
              You won't be charged until your trial ends. Cancel anytime.
            </div>
          </div>
          <button
            onClick={handlePay}
            disabled={paying || paid}
            className={`w-full mt-5 py-3.5 rounded-2xl font-black text-white text-[15px] transition-all disabled:opacity-70
              ${paid
                ? 'bg-gradient-to-r from-green-600 to-teal-600'
                : 'bg-gradient-to-r from-[#071A36] via-[#102F5F] to-[#0F766E] hover:-translate-y-0.5 shadow-[0_8px_30px_rgba(8,27,61,0.45)]'}`}>
            {paid ? '✓ Payment Successful!' : paying ? 'Processing…' : 'Start Free Trial →'}
          </button>
          <p className="text-center text-[11px] text-slate-500 mt-2.5">🔒 30-day money-back guarantee · Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}