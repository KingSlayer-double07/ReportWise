import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  key?: keyof T | string;
  label: string;
  align?: 'left' | 'center' | 'right';
}

interface SortableTableHeaderProps<T> {
  columns: Column<T>[];
  sortConfig: { key: keyof T | string; direction: 'asc' | 'desc' } | null;
  onSort: (key: any) => void;
  showCheckbox?: boolean;
  isAllSelected?: boolean;
  onSelectAll?: () => void;
}

export default function SortableTableHeader<T>({ 
  columns, 
  sortConfig, 
  onSort, 
  showCheckbox, 
  isAllSelected, 
  onSelectAll 
}: SortableTableHeaderProps<T>) {
  return (
    <thead className="sticky top-0 bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.05)] z-10">
      <tr className="border-b border-slate-100">
        {showCheckbox && (
          <th className="p-4 w-12 text-center">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
              checked={isAllSelected} 
              onChange={onSelectAll} 
            />
          </th>
        )}
        {columns.map((col, idx) => (
          <th 
            key={idx} 
            onClick={() => col.key && onSort(col.key)} 
            className={`p-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider ${col.key ? 'cursor-pointer hover:text-blue-600' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} transition-colors`}
          >
            <div className={`flex items-center gap-1.5 ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
              {col.label} 
              {col.key && (
                <ArrowUpDown 
                  size={12} 
                  className={sortConfig?.key === col.key ? 'text-blue-600' : 'text-slate-300'} 
                />
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
