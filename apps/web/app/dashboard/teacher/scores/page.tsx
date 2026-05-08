"use client";

import { useState } from "react";
import { Save, Search, ChevronDown, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_STUDENTS = [
  { id: "1", name: "Abubakar Sadiq", admission: "RW/2024/001", ca: 32, exam: 54, avatar: "AS" },
  { id: "2", name: "Chioma Okoro", admission: "RW/2024/002", ca: 38, exam: 58, avatar: "CO" },
  { id: "3", name: "Babatunde Ige", admission: "RW/2024/003", ca: 24, exam: 42, avatar: "BI" },
  { id: "4", name: "Fatima Yusuf", admission: "RW/2024/004", ca: 29, exam: 48, avatar: "FY" },
  { id: "5", name: "Chidi Okafor", admission: "RW/2024/005", ca: 35, exam: null, avatar: "CO" },
];

export default function ScoreEntryPage() {
  const [scores, setScores] = useState(MOCK_STUDENTS);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleScoreChange = (id: string, field: "ca" | "exam", value: string) => {
    const numValue = value === "" ? null : Number(value);
    setScores(scores.map(s => s.id === id ? { ...s, [field]: numValue } : s));
  };

  const getGrade = (total: number) => {
    if (total >= 75) return { grade: "A1", color: "text-green-600" };
    if (total >= 70) return { grade: "B2", color: "text-blue-600" };
    if (total >= 65) return { grade: "B3", color: "text-blue-500" };
    if (total >= 60) return { grade: "C4", color: "text-indigo-600" };
    if (total >= 50) return { grade: "C6", color: "text-orange-600" };
    return { grade: "F9", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-[#0c1c37] tracking-tight">Score Entry</h1>
          <div className="flex items-center gap-2 text-sm font-bold text-gray-400">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-gray-500">Score Entry</span>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1500);
          }}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-[15px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 border-none cursor-pointer"
        >
          {isSaving ? "Saving..." : (
            <>
              <Save size={20} />
              Save All Scores
            </>
          )}
        </button>
      </div>

      {/* Selection Bar */}
      <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 flex flex-wrap gap-6">
        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider">Class</label>
          <div className="relative mt-1.5">
            <select className="w-full appearance-none px-4 py-3 bg-[#f8f9fa] rounded-xl border-none font-bold text-[#0c1c37] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all">
              <option>SSS 3A</option>
              <option>SSS 3B</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider">Subject</label>
          <div className="relative mt-1.5">
            <select className="w-full appearance-none px-4 py-3 bg-[#f8f9fa] rounded-xl border-none font-bold text-[#0c1c37] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all">
              <option>Mathematics</option>
              <option>Further Mathematics</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-black text-gray-400 uppercase ml-1 tracking-wider">Term</label>
          <div className="relative mt-1.5">
            <select className="w-full appearance-none px-4 py-3 bg-[#f8f9fa] rounded-xl border-none font-bold text-[#0c1c37] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all">
              <option>First Term (2024/2025)</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <h2 className="text-lg font-black text-[#0c1c37]">Student Scores</h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-[#f8f9fa] rounded-xl border-none text-[13px] font-medium text-gray-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 py-4 text-[13px] font-bold text-gray-400">Student Name</th>
                <th className="px-4 py-4 text-[13px] font-bold text-gray-400">Admission No</th>
                <th className="px-4 py-4 text-[13px] font-bold text-gray-400 text-center w-32">CA (40)</th>
                <th className="px-4 py-4 text-[13px] font-bold text-gray-400 text-center w-32">Exam (60)</th>
                <th className="px-4 py-4 text-[13px] font-bold text-gray-400 text-center w-24">Total</th>
                <th className="px-4 py-4 text-[13px] font-bold text-gray-400 text-center w-24">Grade</th>
                <th className="px-4 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {scores.map((student) => {
                const total = (student.ca || 0) + (student.exam || 0);
                const { grade, color } = getGrade(total);
                const isComplete = student.ca !== null && student.exam !== null;

                return (
                  <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[13px]">
                          {student.avatar}
                        </div>
                        <span className="text-[14px] font-bold text-[#0c1c37]">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[14px] font-medium text-gray-500">{student.admission}</td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        max={40}
                        value={student.ca === null ? "" : student.ca}
                        onChange={(e) => handleScoreChange(student.id, "ca", e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#f8f9fa] border-none text-center font-bold text-[#0c1c37] outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="number"
                        max={60}
                        value={student.exam === null ? "" : student.exam}
                        onChange={(e) => handleScoreChange(student.id, "exam", e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#f8f9fa] border-none text-center font-bold text-[#0c1c37] outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[15px] font-black text-[#0c1c37]">{total}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={cn("text-[14px] font-black", color)}>{grade}</span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {isComplete ? (
                        <CheckCircle2 size={20} className="text-green-500 inline-block" />
                      ) : (
                        <AlertCircle size={20} className="text-orange-400 inline-block" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
