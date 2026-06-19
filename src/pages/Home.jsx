import React from 'react';
import { Link } from 'react-router-dom';
import { useErp } from '@/lib/erpContext';
import { useTheme } from '@/lib/themeContext';
import {
  LayoutDashboard, TrendingUp, ShoppingCart, Package, Truck, Users, Brain,
  ArrowRight, Sparkles, Shield, Zap, Moon, Sun, Database, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/erp/ErpKit';

const modules = [
  { icon: LayoutDashboard, title: 'Dashboard', desc: 'KPIs, charts and business totals', color: 'from-blue-500 to-blue-600' },
  { icon: TrendingUp, title: 'CRM', desc: 'Kanban pipeline and customer status', color: 'from-cyan-500 to-teal-500' },
  { icon: ShoppingCart, title: 'Sales', desc: 'Quotations, line items, invoices and payments', color: 'from-purple-500 to-indigo-500' },
  { icon: Package, title: 'Inventory', desc: 'Products, stock, low-stock and movements', color: 'from-emerald-500 to-green-600' },
  { icon: Truck, title: 'Purchase', desc: 'Suppliers, purchase orders, receive and documents', color: 'from-amber-500 to-orange-500' },
  { icon: Users, title: 'Users', desc: 'User registration and reset actions', color: 'from-rose-500 to-pink-500' },
  { icon: Brain, title: 'AI Suite', desc: 'AI insights and OCR tools', color: 'from-violet-500 to-purple-600' },
];

const features = [
  { icon: Database, title: 'Unified Workspace', desc: 'Keep your teams, sales, stock and purchases together in one place.' },
  { icon: Shield, title: 'Smooth Experience', desc: 'Cleaner navigation, focused screens and a more polished dark mode.' },
  { icon: Zap, title: 'Fast Actions', desc: 'Move quickly between modules, documents and important tasks.' },
];

export default function Home() {
  const { currentUser } = useErp();
  const { isDark, toggleTheme } = useTheme() || {};
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/50 bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/small-pro-logo-transparent.png" alt="Small Pro ERP" className="h-10 w-auto" />
            <div>
              <span className="font-heading text-lg font-bold text-foreground">Small Pro ERP</span>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">ERP</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-sm font-bold hover:bg-muted">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {isDark ? 'Light' : 'Dark'}
            </button>
            {currentUser ? (
              <Link to="/"><Button className="rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-primary/70">Open App <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            ) : (
              <>
                <Link to="/register"><Button variant="secondary" className="rounded-xl">Register</Button></Link>
                <Link to={currentUser ? '/' : '/login'}><Button className="rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20 hover:from-primary/90 hover:to-primary/70">Sign In <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Smart ERP platform
            </div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Run Your Business{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Smarter
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Small Pro helps you manage CRM, sales, inventory, purchasing, users and AI tools from one polished workspace.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              {currentUser ? (
                <Link to="/"><Button className="h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 text-base shadow-lg shadow-primary/20">Open Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              ) : (
                <>
                  <Link to={currentUser ? '/' : '/login'}><Button className="h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 text-base shadow-lg shadow-primary/20">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                  <Link to="/register"><Button variant="secondary" className="h-12 rounded-xl px-8 text-base">Register Company</Button></Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/50 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/5 p-2.5">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">Powerful Modules</h2>
          <p className="mt-2 text-muted-foreground">The module grid is organized for clear, fast navigation.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <div key={mod.title} className="group rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${mod.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <mod.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground">{mod.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground">Why teams like Small Pro</h2>
            <p className="mt-2 text-muted-foreground">A cleaner interface makes daily work easier and faster.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              'Quick access back to the main home page from inside the app.',
              'Cleaner popups and less distracting on-screen messages.',
              'Improved dark mode for a more comfortable workspace.',
              'Branding is consistent across pages and printable views.',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <span className="text-sm font-semibold text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-card/50">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
          <p className="text-sm text-muted-foreground">© 2026 Small Pro ERP. Business management system.</p>
        </div>
      </footer>
    </div>
  );
}
