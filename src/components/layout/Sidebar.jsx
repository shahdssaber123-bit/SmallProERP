import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { BarChart3, Brain, Boxes, Building2, CreditCard, Home, LayoutDashboard, LogOut, Moon, ShoppingCart, Sun, Users } from 'lucide-react';
import { useErp } from '@/lib/erpContext';
import { useTheme } from '@/lib/themeContext';

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

export default function Sidebar() {
  const { hasPermission, logout, currentUser } = useErp();
  const { isDark, toggleTheme } = useTheme() || {};
  return <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-gradient-to-b from-[#102f5f] via-[#0d2850] to-[#081b3d] p-5 text-slate-200 shadow-2xl dark:from-slate-950 dark:via-[#081426] dark:to-slate-950 lg:flex">
    <Link to="/home" className="mb-8 flex items-center gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.035] px-3 py-3 shadow-[0_18px_40px_-25px_rgba(0,0,0,0.9)]">
      <img src="/small-pro-logo-dark.svg" alt="Small Pro ERP" className="h-14 w-auto drop-shadow-2xl" />
    </Link>
    <Link to="/home" className="mb-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-slate-100 hover:bg-white/10"><Home className="h-5 w-5" /> Home Page</Link>
    <nav className="space-y-2">
      {links.filter((l) => hasPermission(l.module)).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${isActive ? 'bg-white/12 text-sky-200 shadow-lg shadow-black/10 before:absolute before:left-0 before:h-8 before:w-1 before:rounded-r-full before:bg-sky-300 relative' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}><Icon className="h-5 w-5" />{label}</NavLink>)}
    </nav>
    <div className="mt-auto space-y-3 border-t border-white/10 pt-4">
      <button onClick={toggleTheme} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold text-slate-300 hover:bg-white/10 hover:text-white">
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />} {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="rounded-3xl bg-white/8 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-400 text-xs font-black text-white">{(currentUser?.fullName || currentUser?.username || 'SP').slice(0,2).toUpperCase()}</div>
          <div className="min-w-0"><p className="truncate text-sm font-black text-white">{currentUser?.fullName || currentUser?.username}</p><p className="truncate text-xs text-slate-400">{currentUser?.role} · {currentUser?.companyName}</p></div>
        </div>
        <button onClick={logout} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/8 px-3 py-2 font-bold text-slate-300 hover:bg-rose-500/20 hover:text-rose-200"><LogOut className="h-4 w-4" /> Logout</button>
      </div>
    </div>
  </aside>;
}
