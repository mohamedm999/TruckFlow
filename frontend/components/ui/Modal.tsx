import React, { Fragment } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

        <div className="relative transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold leading-6 text-white" id="modal-title">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};