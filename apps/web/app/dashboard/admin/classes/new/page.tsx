"use client";

import { useState } from "react";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClassLevel, Stream } from "@reportwise/shared";

export default function NewClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState([
    { name: "Mathematics", isCore: true, stream: Stream.NONE },
    { name: "English Language", isCore: true, stream: Stream.NONE },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/admin/classes");
    }, 1000);
  };

  return (
    <div className=" mx-auto space-y-8 font-dm tracking-tighter">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/classes" className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#0c1c37] hover:bg-gray-50 transition-all no-underline shadow-lg/5">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#0c1c37] tracking-tight">
            Create New Class
          </h1>
          <p className="text-gray-500 font-medium">
            Set up a class level and assign initial subjects.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0c1c37] border-b border-gray-50 pb-4">Basic Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Class Level</label>
              <select required className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#0c1c37]/10">
                {Object.values(ClassLevel).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Number of Arms</label>
              <input required type="number" min="1" defaultValue="3" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#0c1c37]/10" />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold text-[#0c1c37]">Subject Assignments</h3>
            <button type="button" className="text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer flex items-center gap-1">
              <Plus size={16} /> Add Subject
            </button>
          </div>

          <div className="space-y-3">
            {subjects.map((sub, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-1 font-bold text-[#0c1c37] text-[14px]">{sub.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase">Core</span>
                  <input type="checkbox" checked={sub.isCore} readOnly className="w-4 h-4 rounded border-gray-300" />
                </div>
                <div className="px-3 py-1 bg-white rounded-lg text-[11px] font-black text-[#0c1c37] uppercase tracking-wider border border-gray-100">
                  {sub.stream}
                </div>
                <button type="button" className="text-gray-300 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 z-50">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-10 py-3.5 bg-[#0c1c37] text-white rounded-2xl font-black text-[15px] hover:bg-[goldenrod] transition-all shadow-2xl shadow-[#0c1c37]/40 border-none cursor-pointer"
          >
            {loading ? "Creating..." : (
              <>
                <Save size={20} />
                Create Class
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
