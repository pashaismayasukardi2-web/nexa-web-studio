'use client';

import React from 'react';
import { 
  Laptop, 
  Tablet, 
  Smartphone, 
  Eye, 
  Edit3, 
  Code, 
  Download, 
  Sparkles,
  Palette
} from 'lucide-react';
import { DeviceView, StudioTheme, TenantType } from '../../types/builder';

interface TopNavbarProps {
  device: DeviceView;
  setDevice: (d: DeviceView) => void;
  isLivePreview: boolean;
  setIsLivePreview: (v: boolean) => void;
  theme: StudioTheme;
  setTheme: (t: StudioTheme) => void;
  tenantType: TenantType;
  setTenantType: (t: TenantType) => void;
  pageTitle: string;
  onOpenCodeModal: () => void;
  onExportHtml: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  device,
  setDevice,
  isLivePreview,
  setIsLivePreview,
  theme,
  setTheme,
  tenantType,
  setTenantType,
  pageTitle,
  onOpenCodeModal,
  onExportHtml,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            N
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight">NexaMOS</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-medium border border-indigo-500/30">
                Web Studio
              </span>
            </div>
            <div className="text-xs text-slate-400 truncate max-w-xs">
              {pageTitle}
            </div>
          </div>
        </div>

        {/* Tenant Type Pill */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setTenantType('LPK')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              tenantType === 'LPK'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            LPK / Vokasi
          </button>
          <button
            onClick={() => setTenantType('General')}
            className={`px-2.5 py-1 rounded font-medium transition ${
              tenantType === 'General'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bisnis Umum
          </button>
        </div>
      </div>

      {/* Center: Device Viewport Switcher */}
      <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
        <button
          onClick={() => setDevice('desktop')}
          title="Tampilan Desktop (100%)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            device === 'desktop'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span className="hidden sm:inline">Desktop</span>
        </button>
        <button
          onClick={() => setDevice('tablet')}
          title="Tampilan Tablet (768px)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            device === 'tablet'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tablet className="w-4 h-4" />
          <span className="hidden sm:inline">Tablet</span>
        </button>
        <button
          onClick={() => setDevice('mobile')}
          title="Tampilan Ponsel (390px)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            device === 'mobile'
              ? 'bg-slate-800 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">Ponsel</span>
        </button>
      </div>

      {/* Right: Theme Selector, Mode Toggle & Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Picker */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <Palette className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme('indigo')}
              title="Tema Indigo"
              className={`w-5 h-5 rounded-full bg-indigo-500 transition ${
                theme === 'indigo' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
              }`}
            />
            <button
              onClick={() => setTheme('emerald')}
              title="Tema Emerald"
              className={`w-5 h-5 rounded-full bg-emerald-500 transition ${
                theme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
              }`}
            />
            <button
              onClick={() => setTheme('violet')}
              title="Tema Violet"
              className={`w-5 h-5 rounded-full bg-purple-500 transition ${
                theme === 'violet' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
              }`}
            />
            <button
              onClick={() => setTheme('amber')}
              title="Tema Amber"
              className={`w-5 h-5 rounded-full bg-amber-500 transition ${
                theme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
              }`}
            />
          </div>
        </div>

        {/* Live Preview Toggle */}
        <button
          onClick={() => setIsLivePreview(!isLivePreview)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
            isLivePreview
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          {isLivePreview ? (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Mode Editor</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Pratinjau Live</span>
            </>
          )}
        </button>

        {/* Code Modal Button */}
        <button
          onClick={onOpenCodeModal}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 transition"
        >
          <Code className="w-3.5 h-3.5" />
          <span>Lihat Kode</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExportHtml}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Web</span>
        </button>
      </div>
    </header>
  );
};

