import React from 'react';
import { Eye, Trash2, MoreVertical, Mail, Phone } from 'lucide-react';
import { Teacher, DESIGNATIONS, Designation } from './types';

interface TeacherRowProps {
  teacher: Teacher;
  isSelected: boolean;
  onToggleSelect: () => void;
  onDesignationChange: (id: string, newDesignation: Designation) => void;
  onDelete: (id: string) => void;
}

export default function TeacherRow({ 
  teacher, isSelected, onToggleSelect, onDesignationChange, onDelete 
}: TeacherRowProps) {
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
      <td className="p-4 font-mono text-[13px] text-slate-600 font-medium">{teacher.teacherId}</td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img src={teacher.avatarUrl} alt={teacher.fullName} className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50" />
          <div>
            <span className="text-sm font-semibold text-slate-900 block">{teacher.fullName}</span>
            <span className="text-[10px] text-slate-500 flex items-center gap-2">
              <span className="flex items-center gap-0.5"><Mail size={10} />{teacher.email}</span>
            </span>
          </div>
        </div>
      </td>
      <td className="p-4 text-center">
        <select 
          value={teacher.designation} 
          onChange={(e) => onDesignationChange(teacher.id, e.target.value as Designation)} 
          className="appearance-none text-[13px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition-colors cursor-pointer outline-none border-none text-center"
        >
          {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {teacher.subjects.map((s, idx) => (
            <span key={idx} className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {s}
            </span>
          ))}
        </div>
      </td>
      <td className="p-4 text-center text-xs font-medium text-slate-500">
        {new Date(teacher.dateJoined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
      <td className="p-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
          teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
          teacher.status === 'On Leave' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
          'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            teacher.status === 'Active' ? 'bg-emerald-500' : 
            teacher.status === 'On Leave' ? 'bg-amber-500' :
            'bg-slate-400'
          }`} />
          {teacher.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="View details"><Eye size={16} /></button>
          <button onClick={() => onDelete(teacher.id)} className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
          <button className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"><MoreVertical size={16} /></button>
        </div>
      </td>
    </tr>
  );
}
