import React from 'react';
import { Users, UserCheck, UserMinus, Activity } from 'lucide-react';
import StatCard from '../StatCard';

export default function StatsOverview() {
  const stats = [
    { title: 'Total Students', value: '428', change: '4%', trend: 'up' as const, period: 'vs last year', icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { title: 'Active Students', value: '401', change: '7%', trend: 'down' as const, period: 'vs last semester', icon: UserCheck, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50' },
    { title: 'On Leave', value: '12', change: '4%', trend: 'up' as const, period: 'This Semester', icon: UserMinus, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
    { title: 'Avg Attendance', value: '93%', change: '2%', trend: 'up' as const, period: 'This Semester', icon: Activity, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
