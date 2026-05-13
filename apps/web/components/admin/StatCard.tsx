import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  period: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export default function StatCard({ 
  title, value, change, trend, period, icon: Icon, iconColor, iconBg 
}: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-lg border shadow-lg/3 hover:shadow-lg/5 duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={iconColor} size={20} />
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
        <div className="flex items-end gap-3">
          <h3 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{value}</h3>
          <div className={`flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded-md mb-0.5 ${
            trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
          }`}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            <span>{change}</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-medium mt-2">{period}</p>
      </div>
    </div>
  );
}
