import React, { useState } from 'react';
import { Link, Navigate, NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Brain, Boxes, Building2, CreditCard, Home, LayoutDashboard, LogOut, Menu, Moon, ShoppingCart, Sun, Users, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useErp } from '@/lib/erpContext';
import { useTheme } from '@/lib/themeContext';
import AIChatBot from '@/components/AIChatBot';
const links = [
  { to: '/',             label: 'Dashboard',    module: 'dashboard',    icon: LayoutDashboard },
  { to: '/crm',          label: 'CRM',          module: 'crm',          icon: Users },
  { to: '/sales',        label: 'Sales',        module: 'sales',        icon: BarChart3 },
  { to: '/inventory',    label: 'Inventory',    module: 'inventory',    icon: Boxes },
  { to: '/purchase',     label: 'Purchase',     module: 'purchase',     icon: ShoppingCart },
  { to: '/users',        label: 'Users',        module: 'users',        icon: Building2 },
  { to: '/ai',           label: 'AI Suite',     module: 'ai',           icon: Brain },
  { to: '/subscription', label: 'Subscription', module: 'subscription', icon: CreditCard },
];

function MobileMenu({ open, onClose }) {
  const { hasPermission, logout, currentUser } = useErp();
  const { isDark, toggleTheme } = useTheme() || {};
  if (!open) return null;
  return <div className="fixed inset-0 z-[100000] lg:hidden">
    <div className="absolute inset-0 bg-slate-950/60" onClick={onClose} />
    <aside className="absolute inset-y-0 left-0 flex w-[86vw] max-w-sm flex-col bg-gradient-to-b from-[#102f5f] via-[#0d2850] to-[#081b3d] p-5 text-slate-200 shadow-2xl dark:bg-slate-950">
      <div className="mb-6 flex items-center justify-between rounded-[1.75rem] border border-white/10 bg-white/[0.035] px-3 py-3">
        <Link to="/home" onClick={onClose} className="flex items-center gap-3">
          <img src="/small-pro-logo-dark.svg" alt="Small Pro ERP" className="h-14 w-auto drop-shadow-2xl" />
        </Link>
        <button onClick={onClose} className="rounded-2xl bg-white/10 p-2 hover:bg-white/15"><X className="h-5 w-5" /></button>
      </div>
      <Link to="/home" onClick={onClose} className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-slate-100 hover:bg-white/10"><Home className="h-5 w-5" /> Home Page</Link>
      <nav className="space-y-2">
        {links.filter((l) => hasPermission(l.module)).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${isActive ? 'bg-white/15 text-sky-200' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}><Icon className="h-5 w-5" />{label}</NavLink>)}
      </nav>
      <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
        <button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold text-slate-300 hover:bg-white/10 hover:text-white">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} {isDark ? 'Light Mode' : 'Dark Mode'}</button>
        <div className="rounded-3xl bg-white/8 p-3 text-sm"><b>{currentUser?.fullName || currentUser?.username}</b><p className="text-slate-400">{currentUser?.role} · {currentUser?.companyName}</p><button onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/8 px-3 py-2 font-bold hover:bg-rose-500/20 hover:text-rose-200"><LogOut className="h-4 w-4" /> Logout</button></div>
      </div>
    </aside>
  </div>;
}

export default function AppLayout() {
  const { currentUser } = useErp();
  const [open, setOpen] = useState(false);
  if (!currentUser) return <Navigate to="/login" replace />;
  return <div className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <Sidebar />
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
      <button onClick={() => setOpen(true)} className="rounded-2xl bg-[#0f2b55] p-2 text-white shadow-lg"><Menu className="h-5 w-5" /></button>
      <Link to="/home" className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"><Home className="h-4 w-4" /> Home</Link>
    </header>
    <MobileMenu open={open} onClose={() => setOpen(false)} />
    <main className="p-4 sm:p-5 lg:ml-72 lg:p-10"><Outlet /></main>
    <AIChatBot />
  </div>;
}
