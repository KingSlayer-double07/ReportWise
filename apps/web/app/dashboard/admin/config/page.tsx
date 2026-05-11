"use client";

import { useState } from "react";
import { Save, Plus, Trash2, ChevronRight } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { cn } from "@/lib/utils";

const INITIAL_GRADES = [
  { min: 75, max: 100, grade: "A1", remark: "Excellent" },
  { min: 70, max: 74, grade: "B2", remark: "Very Good" },
  { min: 65, max: 69, grade: "B3", remark: "Good" },
  { min: 60, max: 64, grade: "C4", remark: "Credit" },
  { min: 55, max: 59, grade: "C5", remark: "Credit" },
  { min: 50, max: 54, grade: "C6", remark: "Credit" },
  { min: 45, max: 49, grade: "D7", remark: "Pass" },
  { min: 40, max: 44, grade: "E8", remark: "Pass" },
  { min: 0, max: 39, grade: "F9", remark: "Fail" },
];

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState("grading");
  const [grades, setGrades] = useState(INITIAL_GRADES);
  const [caWeight, setCaWeight] = useState(40);
  const [examWeight, setExamWeight] = useState(60);

  const handleAddGrade = () => {
    setGrades([...grades, { min: 0, max: 0, grade: "", remark: "" }]);
  };

  const handleRemoveGrade = (index: number) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const handleGradeChange = (index: number, field: string, value: string | number) => {
    const newGrades = [...grades];
    newGrades[index] = { ...newGrades[index], [field]: value };
    setGrades(newGrades);
  };

  return (
    <div className="space-y-8 font-dm tracking-tighter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0c1c37] tracking-tight">
            School Configuration
          </h1>
          <p className="text-gray-500 font-medium">
            Manage grading scales, term dates, and academic structure.
          </p>
        </div>
        <ActionButton variant="primary" icon={Save}>
          Save Changes
        </ActionButton>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {["grading", "terms", "structure"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-8 py-2 rounded-lg text-[14px] font-bold transition-all border-none cursor-pointer",
              activeTab === tab
                ? "bg-white text-[#0c1c37] shadow-sm"
                : "text-gray-500 hover:text-[#0c1c37]"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {activeTab === "grading" && (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0c1c37]">Score Weights</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[#0c1c37]">CA Weight (%)</label>
                    <input
                      type="number"
                      value={caWeight}
                      onChange={(e) => setCaWeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#0c1c37]/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-[#0c1c37]">Exam Weight (%)</label>
                    <input
                      type="number"
                      value={examWeight}
                      onChange={(e) => setExamWeight(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#0c1c37]/10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0c1c37]">Grading Bands</h3>
                <button
                  onClick={handleAddGrade}
                  className="flex items-center gap-2 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer"
                >
                  <Plus size={16} />
                  Add Band
                </button>
              </div>
              
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase">Min Score</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase">Max Score</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase">Grade</th>
                      <th className="px-6 py-4 text-[12px] font-bold text-gray-400 uppercase">Remark</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {grades.map((g, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={g.min}
                            onChange={(e) => handleGradeChange(idx, "min", Number(e.target.value))}
                            className="w-20 px-3 py-1.5 rounded-lg bg-gray-50 border-none outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={g.max}
                            onChange={(e) => handleGradeChange(idx, "max", Number(e.target.value))}
                            className="w-20 px-3 py-1.5 rounded-lg bg-gray-50 border-none outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={g.grade}
                            onChange={(e) => handleGradeChange(idx, "grade", e.target.value)}
                            className="w-20 px-3 py-1.5 rounded-lg bg-gray-50 border-none outline-none font-bold"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={g.remark}
                            onChange={(e) => handleGradeChange(idx, "remark", e.target.value)}
                            className="w-48 px-3 py-1.5 rounded-lg bg-gray-50 border-none outline-none"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleRemoveGrade(idx)}
                            className="text-gray-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "terms" && (
          <div className="p-8 flex flex-col items-center justify-center h-96 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Plus size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#0c1c37]">Term Date Configuration</h3>
            <p className="text-gray-400 max-w-sm">
              Define the start and end dates for your first, second, and third terms.
            </p>
          </div>
        )}

        {activeTab === "structure" && (
          <div className="p-8 flex flex-col items-center justify-center h-96 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#0c1c37]">Class Structure</h3>
            <p className="text-gray-400 max-w-sm">
              Configure class arms (A, B, C) and stream availability.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
