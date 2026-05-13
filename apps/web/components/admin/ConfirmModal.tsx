import React from 'react';
import { Trash2, ArrowRightLeft, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmVariant?: 'primary' | 'danger';
}

export default function ConfirmModal({ 
  isOpen, onClose, onConfirm, title, description, confirmText, confirmVariant = 'primary' 
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-full ${confirmVariant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                {confirmVariant === 'danger' ? <Trash2 size={24} /> : <ArrowRightLeft size={24} />}
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
          </div>
          <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className={`px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
                confirmVariant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-primary hover:bg-primary-hover'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
