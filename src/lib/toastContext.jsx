import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from './framerMotionShim.jsx';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const colors = {
  success: 'bg-white/95 dark:bg-slate-950/95 border-emerald-200/80 dark:border-emerald-400/30 text-emerald-800 dark:text-emerald-200 shadow-emerald-900/10',
  warning: 'bg-white/95 dark:bg-slate-950/95 border-amber-200/80 dark:border-amber-400/30 text-amber-800 dark:text-amber-200 shadow-amber-900/10',
  error: 'bg-white/95 dark:bg-slate-950/95 border-rose-200/80 dark:border-rose-400/30 text-rose-800 dark:text-rose-200 shadow-rose-900/10',
  info: 'bg-white/95 dark:bg-slate-950/95 border-sky-200/80 dark:border-sky-400/30 text-sky-800 dark:text-sky-200 shadow-sky-900/10',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString(36);
    setToasts(prev => [{ id, message, type }, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (event) => {
      const detail = event.detail || {};
      if (detail.message) addToast(detail.message, detail.type || 'info');
    };
    window.addEventListener('smallpro-toast', handler);
    return () => window.removeEventListener('smallpro-toast', handler);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="pointer-events-none fixed left-1/2 top-4 z-[120] flex w-[calc(100vw-2rem)] max-w-[30rem] -translate-x-1/2 flex-col gap-3 px-2 sm:px-0">
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = icons[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -28, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -28, scale: 0.96 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-[1.35rem] border p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/50 dark:ring-white/10 ${colors[toast.type]}` }
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-current/10"><Icon className="h-5 w-5" /></span>
                <p className="flex-1 pt-1 text-sm font-bold leading-6">{toast.message}</p>
                <button onClick={() => removeToast(toast.id)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}