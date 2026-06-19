import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useErp } from '@/lib/erpContext';
import { useToast } from '@/lib/toastContext';
import { Button, Card, ErrorBanner, Field, Input, ReviewDialog, SuccessBanner } from '@/components/erp/ErpKit';

const blank = {
  CompanyName: '',
  CompanyEmail: '',
  CompanyPhone: '',
  AdminUsername: '',
  AdminEmail: '',
  AdminPassword: '',
  AdminFullName: '',
};

export default function RegisterTenant() {
  const { currentUser, registerTenant } = useErp();
  const [form, setForm] = useState(blank);
  const [review, setReview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addToast } = useToast();
  if (currentUser) return <Navigate to="/" replace />;

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));
  const validate = () => {
    const missing = Object.entries(form).filter(([, v]) => !String(v || '').trim()).map(([k]) => k);
    if (missing.length) return `Please complete: ${missing.join(', ')}`;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.CompanyEmail)) return 'Company email format is invalid.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.AdminEmail)) return 'Admin email format is invalid.';
    if (String(form.AdminPassword).length < 6) return 'Admin password should be at least 6 characters.';
    return '';
  };
  const openReview = () => { const msg = validate(); setError(msg); if (msg) addToast(msg, 'warning'); if (!msg) setReview(true); };
  const submit = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await registerTenant(form);
      const msg = `Company registered successfully. Admin username: ${res?.adminUsername || form.AdminUsername}. You can now sign in.`; setSuccess(msg); addToast(msg, 'success');
      setForm(blank);
      setReview(false);
    } catch (e) {
      const msg = e.message || 'Registration failed.'; setError(msg); addToast(msg, 'error');
      setReview(false);
    } finally { setLoading(false); }
  };

  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/40">
    <div className="mx-auto max-w-6xl py-6">
      <Link to="/home" className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="rounded-[2rem] bg-[#0f2b55] p-8 text-white shadow-2xl dark:bg-slate-950">
          <img src="/small-pro-logo-transparent.png" alt="Small Pro ERP" className="mb-6 h-16 w-auto" />
          <h1 className="text-4xl font-black leading-tight">Create your Small Pro company workspace.</h1>
          <p className="mt-4 text-lg text-slate-200">Create a company workspace and administrator account.</p>
          <div className="mt-8 space-y-4">
            {[['Company + Admin split fields', Building2], ['Review confirmation before submit', ShieldCheck], ['Company workspace creation', CheckCircle2]].map(([text, Icon]) => <div key={text} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"><Icon className="h-5 w-5 text-sky-300" /><span className="font-bold">{text}</span></div>)}
          </div>
        </div>
        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-blue-700 dark:text-sky-300">Register Company</div>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Register Company</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter the company and administrator details.</p>
          </div>
          <ErrorBanner message={error} />
          <SuccessBanner message={success} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Company Name"><Input value={form.CompanyName} onChange={(e) => set('CompanyName', e.target.value)} /></Field>
            <Field label="Company Email"><Input type="email" value={form.CompanyEmail} onChange={(e) => set('CompanyEmail', e.target.value)} /></Field>
            <Field label="Company Phone"><Input value={form.CompanyPhone} onChange={(e) => set('CompanyPhone', e.target.value)} /></Field>
            <Field label="Admin Full Name"><Input value={form.AdminFullName} onChange={(e) => set('AdminFullName', e.target.value)} /></Field>
            <Field label="Admin Username"><Input value={form.AdminUsername} onChange={(e) => set('AdminUsername', e.target.value)} /></Field>
            <Field label="Admin Email"><Input type="email" value={form.AdminEmail} onChange={(e) => set('AdminEmail', e.target.value)} /></Field>
            <Field label="Admin Password"><Input type="password" value={form.AdminPassword} onChange={(e) => set('AdminPassword', e.target.value)} /></Field>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3"><Link to="/home" className="font-bold text-blue-700 hover:underline dark:text-sky-300">Home</Link><Link to="/login" className="font-bold text-blue-700 hover:underline dark:text-sky-300">Already have an account? Sign in</Link></div>
            <Button loading={loading} onClick={openReview}>Review Registration</Button>
          </div>
        </Card>
      </div>
    </div>
    <ReviewDialog open={review} loading={loading} onClose={() => setReview(false)} onConfirm={submit} items={[
      { label: 'Action', value: 'Register company' },
      { label: 'Company', value: form.CompanyName },
      { label: 'Company Email', value: form.CompanyEmail },
      { label: 'Admin Username', value: form.AdminUsername },
      { label: 'Admin Email', value: form.AdminEmail },
    ]} />
  </div>;
}
