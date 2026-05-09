"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActionButtonProps {
  variant?: "primary" | "secondary";
  icon?: LucideIcon;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function ActionButton({
  variant = "primary",
  icon: Icon,
  children,
  onClick,
  href,
  className,
  type = "button",
}: ActionButtonProps) {
  const styles = cn(
    "flex items-center gap-2 py-2.5 rounded-lg font-bold text-[14px] font-dm transition-all cursor-pointer border-none no-underline outline-none",
    variant === "primary" 
      ? "px-6 bg-[#0c1c37] text-white shadow-lg shadow-[#0c1c37]/20 hover:bg-[goldenrod]" 
      : "px-4 bg-white border border-gray-100 text-[#0c1c37] hover:bg-gray-50",
    className
  );

  const content = (
    <>
      {Icon && <Icon size={18} />}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(styles, "inline-flex")}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={styles}>
      {content}
    </button>
  );
}
