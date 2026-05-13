'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  Activity, 
  FileDown, 
  TrendingUp, 
  X, 
  AlertCircle, 
  ArrowRightLeft, 
  Trash2,
  UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/admin/StatCard';
import AdminPageHeader from '@/components/admin/common/AdminPageHeader';
import { ActivityType, ClassProgress, mockActivities, mockClassProgress } from '@/components/admin/data';


// --- TYPES ---
type SubscriptionStatus = 'Active' | 'Trial' | 'Grace period';


// --- SUB-COMPONENTS ---


const BillingBanner = ({ status, endDate }: { status: SubscriptionStatus, endDate: string }) => {
  if (status === 'Active') return null;
  const isTrial = status === 'Trial';
  
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className={`mb-6 px-4 py-3 rounded-md border flex items-center justify-between gap-4 ${
        isTrial ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-full ${isTrial ? 'bg-amber-200' : 'bg-rose-200'}`}>
          <AlertCircle size={18} className={isTrial ? 'text-amber-700' : 'text-rose-700'} />
        </div>
        <p className="text-sm font-medium">
          {isTrial 
            ? `You are on a free trial. Upgrade before ${endDate} to continue.` 
            : `Your subscription lapsed on ${endDate}. Pay now to restore access.`
          }
        </p>
      </div>
      <button className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
        isTrial ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm' : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
      }`}>
        {isTrial ? 'Upgrade Now' : 'Restore Access'}
      </button>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, label, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-blue-200 transition-all group active:scale-95"
  >
    <div className={`p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform shadow-sm ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{label}</span>
  </button>
);

const ActivityItem = ({ activity }: { activity: ActivityType }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/80 px-3 rounded-xl transition-colors cursor-default">
    <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] flex-shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-slate-700 leading-tight mb-1 font-medium">{activity.content}</p>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{activity.timestamp}</span>
    </div>
  </div>
);

const ClassCard = ({ prog, onClick }: { prog: ClassProgress, onClick: () => void }) => {
  const percentage = Math.round((prog.scoresEntered / prog.totalSubjects) * 100);
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-100"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{prog.name}</h4>
          <p className="text-[11px] text-slate-500 font-medium mt-1">{prog.studentCount} students • {prog.teacher}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900">{prog.scoresEntered}/{prog.totalSubjects}</span>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Subjects</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
          <span>Score Progress</span>
          <span className={percentage === 100 ? 'text-emerald-500' : 'text-blue-500'}>{percentage}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${percentage === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
          />
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmText, confirmVariant = 'primary', isLoading = false }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" 
        />
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${confirmVariant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                  {confirmVariant === 'danger' ? <Trash2 size={24} /> : <ArrowRightLeft size={24} />}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>
            <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
              <button 
                disabled={isLoading} 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isLoading} 
                onClick={onConfirm} 
                className={`px-6 py-2 text-sm font-bold text-white rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2 ${
                  confirmVariant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
);

// --- MAIN COMPONENT ---

export default function AdminDashboard() {
  const router = useRouter();
  const [subscription] = useState<SubscriptionStatus>('Trial');
//   const [showTermModal, setShowTermModal] = useState(false);
//   const [isChangingTerm, setIsChangingTerm] = useState(false);

//   const handleTermOverride = () => {
//     setIsChangingTerm(true);
//     setTimeout(() => {
//       setIsChangingTerm(false);
//       setShowTermModal(false);
//       // In a real app, this would be a toast or state update
//       console.log('Term changed successfully!');
//     }, 1500);
//   };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50 font-dm">
      <div className="flex-1 overflow-auto ">
        <AdminPageHeader 
          title="Admin Dashboard" 
          rightContent={
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-md border border-slate-200 shadow-lg/3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Term 2 · 2024/2025</span>
            </div>
          }
        />

        <BillingBanner status={subscription} endDate="May 25, 2026" />

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <StatCard title="Total Students" value="428" period="Current Session" icon={Users} iconColor="text-blue-600" iconBg="bg-blue-50" change="4%" trend="up" />
          <StatCard title="Total Teachers" value="24" period="Registered Staff" icon={UserPlus} iconColor="text-indigo-600" iconBg="bg-indigo-50" change="2%" trend="up" />
          <StatCard title="Classes" value="9" period="JSS1–SSS3" icon={GraduationCap} iconColor="text-violet-600" iconBg="bg-violet-50" change="0%" trend="up" />
          <StatCard title="Term Ends In" value="45" period="Days Remaining" icon={Activity} iconColor="text-rose-600" iconBg="bg-rose-50" change="8%" trend="down" />
          <StatCard title="Subscription" value="Spark" period="Renewed monthly" icon={FileDown} iconColor="text-emerald-600" iconBg="bg-emerald-50" change="Active" trend="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quick Actions & Term Widget */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-slate-200" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <QuickAction icon={UserPlus} label="Add Student" color="bg-gradient-to-br from-blue-500 to-blue-600" onClick={() => navigateTo('/admin/students')} />
                <QuickAction icon={UserCircle} label="Add Teacher" color="bg-gradient-to-br from-indigo-500 to-indigo-600" onClick={() => navigateTo('/admin/teachers')} />
                <QuickAction icon={Activity} label="View Scores" color="bg-gradient-to-br from-violet-500 to-violet-600" onClick={() => alert('View scores')} />
                <QuickAction icon={FileDown} label="Export Reports" color="bg-gradient-to-br from-emerald-500 to-emerald-600" onClick={() => alert('Export all reports')} />
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                <TrendingUp size={160} />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Term Override Widget</h3>
                  <p className="text-sm text-slate-500 font-medium">Manually adjust the current active term and academic session settings.</p>
                  <div className="flex items-center gap-2 mt-4 text-xs font-bold text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full">
                    <span>ACTIVE: TERM 2</span>
                  </div>
                </div>
                <button 
                //   onClick={() => setShowTermModal(true)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 whitespace-nowrap"
                >
                  Change Active Term
                </button>
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-slate-200" />
                  Class Completion Progress
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockClassProgress.map((prog, i) => (
                  <ClassCard key={i} prog={prog} onClick={() => alert(`Navigating to ${prog.name} scores`)} />
                ))}
              </div>
            </section>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={16} className="text-blue-500" />
                  Recent Activity
                </h3>
                <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors">View All</button>
              </div>
              <div className="p-4 space-y-1 overflow-y-auto max-h-[700px] custom-scrollbar">
                {mockActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider">
                  Last updated: Just now
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* <ConfirmModal 
        isOpen={showTermModal}
        onClose={() => setShowTermModal(false)}
        onConfirm={handleTermOverride}
        isLoading={isChangingTerm}
        title="Override Active Term?"
        description="This action is irreversible for the current session. All automated term scheduling will be updated to reflect this manual change. Are you sure you want to proceed?"
        confirmText="Confirm Override"
        confirmVariant="primary"
      /> */}
    </div>
  );
}
