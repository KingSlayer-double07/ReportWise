import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions?: number[];
}

export default function TablePagination({ 
  currentPage, 
  totalPages, 
  rowsPerPage, 
  onPageChange, 
  onRowsPerPageChange,
  rowsPerPageOptions = [25, 50, 100]
}: TablePaginationProps) {
  return (
    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500">Rows per page:</span>
        <select 
          value={rowsPerPage} 
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))} 
          className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {rowsPerPageOptions.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-1">
        <button 
          disabled={currentPage === 1} 
          onClick={() => onPageChange(currentPage - 1)} 
          className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded disabled:opacity-30 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center px-4">
          <span className="text-xs font-bold text-slate-900">{currentPage}</span>
          <span className="text-xs font-medium text-slate-400 mx-2">of</span>
          <span className="text-xs font-bold text-slate-900">{totalPages || 1}</span>
        </div>
        <button 
          disabled={currentPage === totalPages || totalPages === 0} 
          onClick={() => onPageChange(currentPage + 1)} 
          className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded disabled:opacity-30 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
