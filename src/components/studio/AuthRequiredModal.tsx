'use client';

import React from 'react';
import { Lock, ShieldCheck, Sparkles, LogIn, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionText?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  actionText = 'mengedit komponen dan mengunggah media',
}) => {
  const { login } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="h-1.5 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center space-y-4">
          {/* Glowing Icon */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Masuk Akun NexaMOS Diperlukan
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Untuk menjaga integritas dan keamanan website lembaga Anda, akses untuk{' '}
              <span className="font-semibold text-indigo-300">{actionText}</span>{' '}
              hanya dapat dilakukan oleh pengguna yang telah masuk dengan akun resmi NexaMOS.
            </p>
          </div>

          {/* Value Props */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-left space-y-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Keuntungan Akun NexaMOS:
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Edit teks kanvas langsung secara interaktif</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Upload logo & foto ke penyimpanan server terverifikasi</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Sinkronisasi otomatis leads ke WhatsApp & Nexa CRM</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => login()}
              className="w-full h-10 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:brightness-110 text-white shadow-lg shadow-indigo-500/25 transition active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk dengan Nexa ID SSO</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Lanjutkan Melihat Pratinjau Saja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

