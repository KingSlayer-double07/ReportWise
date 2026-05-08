"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Role } from "@reportwise/shared";
import { LogoMark } from "@/components/icons";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Settings, 
  BookOpen, 
  ClipboardCheck, 
  LogOut 
} from "lucide-react";

const ADMIN_LINKS = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/students", label: "Students", icon: Users },
  { href: "/dashboard/admin/teachers", label: "Teachers", icon: GraduationCap },
  { href: "/dashboard/admin/classes", label: "Classes & Subjects", icon: BookOpen },
  { href: "/dashboard/admin/config", label: "School Config", icon: Settings },
];

const TEACHER_LINKS = [
  { href: "/dashboard/teacher", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/teacher/scores", label: "Score Entry", icon: ClipboardCheck },
];

const STUDENT_LINKS = [
  { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/student/results", label: "My Results", icon: BookOpen },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN
    ? ADMIN_LINKS
    : user?.role === Role.TEACHER
    ? TEACHER_LINKS
    : STUDENT_LINKS;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-6 fixed left-0 top-0 z-50 font-dm">
      <Link href="/dashboard" className="flex items-center gap-2.5 no-underline mb-10">
        <LogoMark />
        <span className="font-extrabold text-xl text-[#0c1c37] tracking-tight">
          Report<span className="text-[goldenrod]">Wise</span>
        </span>
      </Link>

      <nav className="flex-1 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-md text-[14.5px] font-semibold font-dm transition-all relative",
                isActive 
                  ? "bg-blue-50/70 text-[#0c1c37]" 
                  : "text-gray-500 hover:text-[#0c1c37] hover:bg-blue-50/30"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0c1c37] rounded-r-full" />
              )}
              <link.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-[#0c1c37]" : "text-gray-400 group-hover:text-[#0c1c37]"
              )} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-6">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer border-none bg-transparent"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
