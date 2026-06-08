'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  preventClickOutside?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  maxWidth = '400px',
  preventClickOutside = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => !preventClickOutside && onClose()}
    >
      <div 
        className="bg-[#0c0d12] border border-zinc-850 rounded-[28px] p-8 w-full text-center flex flex-col items-center gap-6 shadow-2xl relative"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-zinc-850 hover:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>
        
        {icon && (
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            {icon}
          </div>
        )}

        <div className="space-y-1">
          {subtitle && (
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">
              {subtitle}
            </span>
          )}
          <h4 className="text-sm font-bold text-white">{title}</h4>
        </div>

        {children}
      </div>
    </div>
  );
}
