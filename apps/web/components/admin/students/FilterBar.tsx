import React from 'react';
import { ChevronDown, Upload, Download, UserPlus } from 'lucide-react';
import { CLASSES, STREAMS } from './types';

interface FilterBarProps {
  filters: any;
  setFilters: any;
  totalResults: number;
  filteredResults: number;
  onClearFilters: () => void;
  onExport: () => void;
  onAddStudent: () => void;
  onImport: () => void;
}

export default function FilterBar({ 
  filters, setFilters, totalResults, filteredResults, onClearFilters, onExport, onAddStudent, onImport 
}: FilterBarProps) {
  const isSssSelected = filters.class?.startsWith('SSS');

  return (
    <div className="bg-white border-b border-slate-200 p-4 space-y-4 rounded-t-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <select 
              value={filters.class} 
              onChange={(e) => setFilters((prev: any) => ({ ...prev, class: e.target.value, stream: '' }))} 
              className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer outline-none min-w-[120px]"
            >
              <option value="">All Classes</option>
              {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {isSssSelected && (
            <div className="relative group">
              <select 
                value={filters.stream} 
                onChange={(e) => setFilters((prev: any) => ({ ...prev, stream: e.target.value }))} 
                className="appearance-none bg-amber-50 border border-amber-200 text-amber-900 rounded-lg py-2 pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-amber-500/20 outline-none min-w-[120px]"
              >
                <option value="">All Streams</option>
                {STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
            </div>
          )}

          <div className="relative group">
            <select 
              value={filters.gender} 
              onChange={(e) => setFilters((prev: any) => ({ ...prev, gender: e.target.value }))} 
              className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-w-[120px]"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative group">
            <select 
              value={filters.status} 
              onChange={(e) => setFilters((prev: any) => ({ ...prev, status: e.target.value }))} 
              className="appearance-none bg-white border border-slate-200 rounded-lg py-2 pl-4 pr-10 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none min-w-[120px]"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Graduated">Graduated</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button onClick={onClearFilters} className="text-xs font-semibold text-slate-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Reset Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onImport} className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <Upload size={14} /><span>Import</span>
          </button>
          <button onClick={onExport} className="flex items-center gap-2 text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-md text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} /><span>Export</span>
          </button>
          <button onClick={onAddStudent} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-xs font-semibold hover:bg-primary-hover shadow-sm transition-all">
            <UserPlus size={14} /><span>Add Student</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
        <p>Showing <span className="text-slate-900">{filteredResults}</span> of <span className="text-slate-900">{totalResults}</span> students</p>
      </div>
    </div>
  );
}
