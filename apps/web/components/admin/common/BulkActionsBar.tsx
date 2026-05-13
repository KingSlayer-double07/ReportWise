import React from 'react';
import { Trash2, ArrowRightLeft, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BulkActionsBarProps {
  selectedCount: number;
  onDelete: () => void;
  onTransfer?: () => void;
  onExport?: () => void;
}

export default function BulkActionsBar({ selectedCount, onDelete, onTransfer, onExport }: BulkActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          exit={{ opacity: 0, scale: 0.95 }} 
          className="flex items-center gap-2 bg-blue-50 border border-blue-100 py-1.5 px-3 rounded-lg"
        >
          <span className="text-xs font-bold text-blue-700">{selectedCount} selected</span>
          <div className="w-px h-4 bg-blue-200 mx-1" />
          <button 
            onClick={onDelete} 
            className="p-1 hover:bg-rose-100 text-rose-600 rounded transition-colors" 
            title="Bulk Delete"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={onTransfer} 
            className="p-1 hover:bg-blue-100 text-blue-600 rounded transition-colors" 
            title="Bulk Transfer"
          >
            <ArrowRightLeft size={16} />
          </button>
          <button 
            onClick={onExport} 
            className="p-1 hover:bg-blue-100 text-blue-600 rounded transition-colors" 
            title="Bulk Export"
          >
            <FileDown size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
