"use client";

import { useState } from "react";
import { BookOpen, Layers, Users, ChevronRight, Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { ClassLevel, Stream } from "@reportwise/shared";

const MOCK_CLASSES = [
  { id: "1", level: ClassLevel.JSS1, arms: ["A", "B", "C"], studentCount: 124, subjects: 12 },
  { id: "2", level: ClassLevel.JSS2, arms: ["A", "B"], studentCount: 86, subjects: 12 },
  { id: "3", level: ClassLevel.JSS3, arms: ["A", "B", "C", "D"], studentCount: 152, subjects: 12 },
  { id: "4", level: ClassLevel.SSS1, arms: ["A", "B"], studentCount: 92, subjects: 14 },
  { id: "5", level: ClassLevel.SSS2, arms: ["A", "B"], studentCount: 78, subjects: 14 },
  { id: "6", level: ClassLevel.SSS3, arms: ["A", "B"], studentCount: 65, subjects: 14 },
];

export default function ClassesPage() {
  return (
    <div className="space-y-8 font-dm tracking-tighter">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl font-black text-[#0c1c37] tracking-tight">
            Classes & Subjects
          </h1>
          <p className="text-gray-500 font-medium">
            Define your school structure and assign subjects to classes.
          </p>
        </div>
        <div className="flex gap-3">
          <ActionButton variant="secondary" icon={BookOpen}>
            Master Subjects
          </ActionButton>
          <ActionButton variant="primary" icon={Plus} href="/dashboard/admin/classes/new">
            Create Class
          </ActionButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLASSES.map((cls) => (
          // flex items-center gap-4
          <div key={cls.id} className="bg-white p-6 rounded-lg shadow-md/3 border border-blue-10 hover:border-[#0c1c37] duration-300 cursor-pointer group">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Layers size={24} />
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-[#0c1c37] transition-colors" />
            </div>

            <h3 className="text-[18px] font-black text-[#0c1c37] mb-1">{cls.level}</h3>
            <p className="text-[13px] text-gray-400 font-medium mb-6">
              {cls.arms.length} Arms ( {cls.arms.join(", ")} )
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span className="text-[14px] font-bold text-[#0c1c37]">{cls.studentCount}</span>
                <span className="text-[12px] text-gray-400">Students</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-gray-400" />
                <span className="text-[14px] font-bold text-[#0c1c37]">{cls.subjects}</span>
                <span className="text-[12px] text-gray-400">Subjects</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
