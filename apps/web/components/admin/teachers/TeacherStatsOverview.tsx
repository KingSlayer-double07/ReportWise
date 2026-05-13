import React from 'react';
import { Users, UserCheck, UserMinus, Activity } from 'lucide-react';
import StatCard from '../StatCard';

export default function TeacherStatsOverview() {
  const stats = [
    { title: 'Total Teachers', value: '48', change: '2%', trend: 'up' as const, period: 'vs last year', icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
    { title: 'Active Teachers', value: '45', change: '5%', trend: 'up' as const, period: 'Currently present', icon: UserCheck, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50' },
    { title: 'On Leave', value: '3', change: '1%', trend: 'down' as const, period: 'This Month', icon: UserMinus, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
    { title: 'Avg Attendance', value: '96%', change: '1%', trend: 'up' as const, period: 'This Semester', icon: Activity, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}
