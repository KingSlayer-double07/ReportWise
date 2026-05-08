import Link from "next/link";
import { Lock } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
        <Lock size={40} />
      </div>
      <h1 className="text-3xl font-black text-[#0c1c37] mb-2 tracking-tight">Access Denied</h1>
      <p className="text-gray-500 max-w-sm mb-10 font-medium">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
      <Link 
        href="/login" 
        className="px-8 py-3 bg-[#0c1c37] text-white rounded-2xl font-black text-[15px] hover:bg-[goldenrod] transition-all no-underline shadow-lg shadow-[#0c1c37]/20"
      >
        Back to Login
      </Link>
    </div>
  );
}
