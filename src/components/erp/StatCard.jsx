import React from 'react';
import { motion } from '../../lib/framerMotionShim.jsx';

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    accent: 'from-cyan-500 to-teal-500 shadow-cyan-500/20',
    success: 'from-emerald-500 to-green-600 shadow-emerald-500/20',
    warning: 'from-amber-500 to-orange-500 shadow-amber-500/20',
    danger: 'from-red-500 to-rose-500 shadow-red-500/20',
    purple: 'from-purple-500 to-indigo-500 shadow-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card rounded-2xl p-5 card-shadow hover:card-shadow-hover transition-all duration-300 border border-border/50 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-2xl sm:text-3xl font-heading font-bold text-foreground mt-1"
          >
            {value}
          </motion.p>
          {trend !== undefined && (
            <p className={`text-xs font-medium mt-2 ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || ''}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </motion.div>
  );
}