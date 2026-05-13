import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export default function AdminPageHeader({ title, description, rightContent, className = "mb-8" }: AdminPageHeaderProps) {
  return (
    <header className={className}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {description && <p className="text-sm text-slate-500 font-medium mt-1">{description}</p>}
        </div>
        {rightContent && (
          <div className="flex items-center gap-3">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}
