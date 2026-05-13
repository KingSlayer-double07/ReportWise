"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { Bell, Search, MessageSquare, User, Menu } from "lucide-react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-2 flex-1 md:flex-none">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg border-none bg-transparent cursor-pointer flex-shrink-0"
        >
          <Menu size={24} />
        </button>
        <div className="relative hidden md:block w-full md:w-[400px]">
          <input
            type="text"
            placeholder="What do you want to find?"
            className="w-full pl-6 pr-12 py-3 bg-[#f8f9fa] rounded-lg border-none text-[14px] font-medium text-gray-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600">
          <Search size={20} strokeWidth={2.5} />
        </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors relative bg-[#f8f9fa] rounded-lg border-none cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors relative bg-[#f8f9fa] rounded-lg border-none cursor-pointer">
          <MessageSquare size={20} />
        </button>

        <div className="h-8 w-px bg-gray-100" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[14px] font-bold text-[#0c1c37] leading-none mb-1">
              {user?.email || "User"}
            </p>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#0c1c37] flex-shrink-0">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
