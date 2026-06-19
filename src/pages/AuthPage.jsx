import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useErp } from '@/lib/erpContext';
import { Button, Card, Field, Input, ErrorBanner } from '@/components/erp/ErpKit';

export default function AuthPage() {
  const { currentUser, login, loading } = useErp();
  const [username, setUsername] = useState('Abdo');
  const [password, setPassword] = useState('Abdo123');
  const [error, setError] = useState('');
  if (currentUser) return <Navigate to="/" replace />;
  const submit = async (e) => {
    e.preventDefault(); setError('');
    try { await login(username, password); } catch (err) { setError(err.message); }
  };
  return <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950"><div className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl items-center gap-8 lg:grid-cols-2"><div><div className="mb-8 flex items-center gap-3"><img src="/small-pro-logo-transparent.png" alt="Small Pro ERP" className="h-16 w-auto" /><div><h1 className="text-4xl font-black text-slate-950 dark:text-white">Small Pro</h1><p className="text-slate-500 dark:text-slate-300">Smart ERP System</p></div></div><h2 className="text-5xl font-black leading-tight text-slate-950 dark:text-white">Manage your business from one polished workspace.</h2><p className="mt-4 text-lg text-slate-600 dark:text-slate-300">Sign in to access your ERP modules, or return to the main home page anytime.</p><div className="mt-6"><Link to="/home"><Button variant="secondary">Back to Home</Button></Link></div></div><Card className="p-8"><h3 className="text-2xl font-black">Sign in</h3><p className="mb-6 text-slate-500 dark:text-slate-300">Use your account.</p><ErrorBanner message={error} /><form onSubmit={submit} className="space-y-4"><Field label="Username"><Input value={username} onChange={(e) => setUsername(e.target.value)} required /></Field><Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field><Button className="w-full" loading={loading.global} type="submit">Login to Small Pro</Button></form></Card></div></div>;
}
