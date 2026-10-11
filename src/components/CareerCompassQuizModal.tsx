'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import CareerCompassAssessment from './CareerCompassAssessment';

export default function CareerCompassQuizModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = dialog.current;
    if (!isOpen || !node) return;
    const previous = document.activeElement as HTMLElement | null;
    node.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, [isOpen]);

  return <dialog ref={dialog} aria-label="Career Compass assessment" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-3xl border border-[#1b2d63] bg-[#0F1E4A] p-0 shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm text-white">
    <div className="relative"><button type="button" onClick={onClose} aria-label="Close career assessment" className="absolute right-3 top-3 z-10 rounded-full bg-white/10 p-2 text-slate-300 hover:text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#F2B33D] cursor-pointer"><X className="h-5 w-5" /></button><CareerCompassAssessment onNavigate={onClose} /></div>
  </dialog>;
}
