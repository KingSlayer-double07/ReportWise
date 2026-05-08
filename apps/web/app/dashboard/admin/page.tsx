"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Users, GraduationCap, School, BookOpen } from "lucide-react";

const STATS = [
  { label: "Total Students", value: "842", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Total Teachers", value: "48", icon: GraduationCap, iconColor: "text-purple-600", bg: "bg-purple-50" },
  { label: "Total Classes", value: "18", icon: School, iconColor: "text-orange-600", bg: "bg-orange-50" },
  { label: "Active Subjects", value: "32", icon: BookOpen, iconColor: "text-green-600", bg: "bg-green-50" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 font-dm tracking-tighter">
      <div>
        <h1 className="text-2xl font-black text-[#0c1c37] tracking-tight">
          Welcome back, Admin
        </h1>
        <p className="text-gray-500 font-medium">
          Here&apos;s what&apos;s happening at your school today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md/3 border border-blue-10 hover:border-[#0c1c37] hover:Shadow-md/10 duration-300 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={stat.color || stat.iconColor} size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400">{stat.label}</p>
              <p className="text-2xl font-black text-[#0c1c37]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md/3 border border-blue-10 hover:border-[#0c1c37] hover:Shadow-md/10 duration-300 p-8 h-96 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#0c1c37]">Term Progress</h3>
          <p className="text-gray-400 max-w-sm">
            Detailed term analytics and score distribution charts will appear here.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md/3 border border-blue-10 hover:border-[#0c1c37] hover:Shadow-md/10 duration-300 p-8 h-96">
          <h3 className="text-lg font-bold text-[#0c1c37] mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-[14px] font-semibold text-[#0c1c37]">Score Entry Completed</p>
                  <p className="text-[12px] text-gray-400">JSS2 Mathematics - 2 mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
