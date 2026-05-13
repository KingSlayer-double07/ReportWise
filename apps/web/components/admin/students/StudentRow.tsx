import React from 'react';
import { Eye, Trash2, MoreVertical } from 'lucide-react';
import { Student, CLASSES, ClassLevel } from './types';

interface StudentRowProps {
  student: Student;
  isSelected: boolean;
  onToggleSelect: () => void;
  onClassChange: (id: string, newClass: ClassLevel) => void;
  onDelete: (id: string) => void;
}

export default function StudentRow({ 
  student, isSelected, onToggleSelect, onClassChange, onDelete 
}: StudentRowProps) {
  return (
    <tr className={`table-row-hover group border-l-2 transition-all ${isSelected ? 'bg-blue-50/50 border-blue-500' : 'border-transparent'}`}>
      <td className="p-4 text-center">
        <input 
          type="checkbox" 
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
          checked={isSelected} 
          onChange={onToggleSelect} 
        />
      </td>
      <td className="p-4 font-mono text-[13px] text-slate-600 font-medium">{student.admissionNumber}</td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img src={student.avatarUrl} alt={student.fullName} className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50" />
          <span className="text-sm font-semibold text-slate-900">{student.fullName}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <select 
          value={student.class} 
          onChange={(e) => onClassChange(student.id, e.target.value as ClassLevel)} 
          className="appearance-none text-[13px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition-colors cursor-pointer outline-none border-none text-center"
        >
          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </td>
      <td className="p-4 text-center">
        {student.stream ? (
          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
            {student.stream}
          </span>
        ) : (
          <span className="text-[10px] italic font-medium text-slate-300">—</span>
        )}
      </td>
      <td className="p-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-600">
          <div className={`w-2 h-2 rounded-full ${student.gender === 'Male' ? 'bg-blue-500' : 'bg-rose-500'}`} />
          {student.gender}
        </div>
      </td>
      <td className="p-4 text-center text-xs font-medium text-slate-500">
        {new Date(student.dateRegistered).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="p-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
          student.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${student.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
          {student.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="View details"><Eye size={16} /></button>
          <button onClick={() => onDelete(student.id)} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
          <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"><MoreVertical size={16} /></button>
        </div>
      </td>
    </tr>
  );
}
