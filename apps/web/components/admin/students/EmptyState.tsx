import React from 'react';
import { GraduationCap } from 'lucide-react';

interface EmptyStateProps {
  onAdd: () => void;
}

export default function EmptyState({ onAdd }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={9} className="p-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <GraduationCap size={32} />
          </div>
          <p className="text-slate-900 font-bold">No students found</p>
          <p className="text-xs text-slate-500 max-w-xs">No students found. Add your first student or import via CSV.</p>
          <button onClick={onAdd} className="mt-2 text-blue-600 font-bold text-xs uppercase tracking-wider hover:underline">
            Add Student
          </button>
        </div>
      </td>
    </tr>
  );
}
