"use client";

import { useState } from "react";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { useRouter } from "next/navigation";
import { Stream, ClassLevel } from "@reportwise/shared";
import Link from "next/link";

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/admin/students");
    }, 1000);
  };

  return (
    <div className=" mx-auto space-y-8 font-dm tracking-tighter">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/students" className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#0c1c37] hover:bg-gray-50 transition-all no-underline shadow-lg/5">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#0c1c37] tracking-tight">
            Register New Student
          </h1>
          <p className="text-gray-500 font-medium">
            Fill in the student&apos;s biodata and enrollment details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        {/* Photo Upload */}
        <div className="bg-white p-8 rounded-lg border border-[#0c1c37]/10 hover:border-[#0c1c37] duration-300 shadow-lg/5 hover:shadow-lg/10 flex items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-1 overflow-hidden">
            <Upload size={24} />
            <span className="text-[10px] font-bold uppercase">Upload</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#0c1c37] mb-1">Student Photo</h3>
            <p className="text-[13px] text-gray-400 max-w-xs">
              Upload a clear passport-style photo. Max size 2MB.
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-8 rounded-lg border border-[#0c1c37]/10 hover:border-[#0c1c37] duration-300 shadow-lg/5 hover:shadow-lg/10 space-y-6">
          <h3 className="text-lg font-bold text-[#0c1c37] border-b border-gray-50 pb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">First Name</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Last Name</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Middle Name</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Date of Birth</label>
              <input required type="date" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Gender</label>
              <select className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">State of Origin</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
          </div>
        </div>

        {/* Enrollment Details */}
        <div className="bg-white p-8 rounded-lg border border-[#0c1c37]/10 hover:border-[#0c1c37] duration-300 shadow-lg/5 hover:shadow-lg/10 space-y-6">
          <h3 className="text-lg font-bold text-[#0c1c37] border-b border-gray-50 pb-4">Enrollment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Admission Number</label>
              <input placeholder="e.g. RW/2024/001" required type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Class</label>
              <select className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10">
                {Object.values(ClassLevel).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Stream (for SSS only)</label>
              <select className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10">
                {Object.values(Stream).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div className="bg-white p-8 rounded-lg border border-[#0c1c37]/10 hover:border-[#0c1c37] duration-300 shadow-lg/5 hover:shadow-lg/10 space-y-6">
          <h3 className="text-lg font-bold text-[#0c1c37] border-b border-gray-50 pb-4">Parent / Guardian Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Parent Name</label>
              <input required type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Contact Phone</label>
              <input required type="tel" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Email Address</label>
              <input type="email" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-[#0c1c37]">Residential Address</label>
              <input type="text" className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-none outline-none focus:ring focus:ring-[#0c1c37]/10" />
            </div>
          </div>
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 ml-32 z-50">
          <ActionButton
            type="submit"
            className="px-10 py-4 text-[15px] shadow-2xl shadow-[#0c1c37]/40"
            icon={Save}
          >
            {loading ? "Registering..." : "Register Student"}
          </ActionButton>
        </div>
      </form>
    </div>
  );
}
