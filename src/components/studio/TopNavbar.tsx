'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Laptop,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Code,
  Download,
  Palette,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Building2,
  ChevronDown,
  Sparkles,
  Rocket,
  Compass,
  ExternalLink
} from 'lucide-react';
import { DeviceView, StudioTheme, TenantType } from '../../types/builder';
import { useAuth } from '../../context/AuthContext';

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
  isPublished?: boolean;
  onOpenCodeModal?: () => void;
  onExportHtml?: () => void;
  onPublish: () => void;
  onAuthRequired?: () => void;
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
  isPublished = false,
  onOpenCodeModal,
  onExportHtml,
  onPublish,
  onAuthRequired,
}) => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              {isPublished ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  Draf
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 truncate max-w-xs">
              {pageTitle}
            </div>
          </div>
        </div>

        {/* Tenant Type Pill */}
        <div className="hidden md:flex h-9 px-1.5 items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setTenantType('LPK')}
            className={`px-2.5 py-1 rounded font-medium transition ${tenantType === 'LPK'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            LPK / Vokasi
          </button>
          <button
            onClick={() => setTenantType('General')}
            className={`px-2.5 py-1 rounded font-medium transition ${tenantType === 'General'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white'
              }`}
          >
            Bisnis Umum
          </button>
        </div>
      </div>

      {/* Center: Device Viewport Switcher */}
      <div className="h-9 px-1 flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-lg shadow-inner">
        <div className="relative group">
          <button
            onClick={() => setDevice('desktop')}
            aria-label="Tampilan Desktop (100%)"
            className={`w-7 h-7 rounded-md flex items-center justify-center transition ${device === 'desktop'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Laptop className="w-3.5 h-3.5" />
          </button>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Tampilan Desktop (100%)
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => setDevice('tablet')}
            aria-label="Tampilan Tablet (768px)"
            className={`w-7 h-7 rounded-md flex items-center justify-center transition ${device === 'tablet'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Tampilan Tablet (768px)
          </div>
        </div>

        <div className="relative group">
          <button
            onClick={() => setDevice('mobile')}
            aria-label="Tampilan Ponsel (384px)"
            className={`w-7 h-7 rounded-md flex items-center justify-center transition ${device === 'mobile'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Tampilan Ponsel (384px)
          </div>
        </div>
      </div>

      {/* Right: Theme Selector, Mode Toggle & Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Picker */}
        <div className="h-9 px-2 flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg">
          <Palette className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme('indigo')}
              title="Tema Indigo"
              className={`w-5 h-5 rounded-full bg-indigo-500 transition ${theme === 'indigo' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
            />
            <button
              onClick={() => setTheme('emerald')}
              title="Tema Emerald"
              className={`w-5 h-5 rounded-full bg-emerald-500 transition ${theme === 'emerald' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
            />
            <button
              onClick={() => setTheme('violet')}
              title="Tema Violet"
              className={`w-5 h-5 rounded-full bg-purple-500 transition ${theme === 'violet' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
            />
            <button
              onClick={() => setTheme('amber')}
              title="Tema Amber"
              className={`w-5 h-5 rounded-full bg-amber-500 transition ${theme === 'amber' ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                }`}
            />
          </div>
        </div>

        {/* Live Preview Toggle */}
        <div className="relative group">
          <button
            onClick={() => setIsLivePreview(!isLivePreview)}
            aria-label={isLivePreview ? 'Mode Editor' : 'Pratinjau Live'}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium border transition ${isLivePreview
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
          >
            {isLivePreview ? (
              <Edit3 className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            {isLivePreview ? 'Mode Editor' : 'Pratinjau Live'}
          </div>
        </div>

        {/* Publish Button */}
        <div className="relative group">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                if (onAuthRequired) {
                  onAuthRequired();
                } else {
                  login();
                }
                return;
              }
              (onPublish || onExportHtml)?.();
            }}
            aria-label="Publikasikan & Kelola Domain"
            className={`h-9 px-3.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold shadow-lg transition active:scale-95 ${
              isPublished
                ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/30 hover:brightness-110'
                : 'bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-indigo-600/30 hover:brightness-110'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-100" />
            <span className="hidden sm:inline">
              {isPublished ? 'Status Publikasi (Live)' : 'Publikasikan'}
            </span>
          </button>
          <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">
            Publikasikan & Kelola Domain
          </div>
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* NexaMOS Identity Auth Widget */}
        {isLoading ? (
          <div className="w-28 h-9 bg-slate-900 border border-slate-800 rounded-lg animate-pulse" />
        ) : !isAuthenticated ? (
          <button
            onClick={() => login()}
            className="h-9 flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-semibold bg-linear-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-600/20 hover:brightness-110 transition active:scale-95"
            title="Masuk dengan NexaMOS Single Sign-On"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk NexaMOS</span>
          </button>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="h-9 flex items-center gap-2 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition text-xs text-left"
            >
              <div className="w-6 h-6 rounded-md bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white text-xs shadow">
                {user?.display_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <div className="text-white font-medium truncate max-w-28">
                  {user?.display_name}
                </div>
                <div className="text-indigo-400 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Nexa ID</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-2">
                  <div className="font-semibold text-white text-xs truncate">
                    {user?.display_name}
                  </div>
                  <div className="text-slate-400 text-xs truncate mt-0.5">
                    {user?.email || 'Akun NexaMOS Terhubung'}
                  </div>
                  {user?.organizations && user.organizations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-xs text-slate-300">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{user.organizations[0].name}</span>
                    </div>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>Web Studio: Aktif</span>
                  </div>
                </div>

                <a
                  href="https://workspace.nexamos.cloud"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition mb-1"
                >
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>NexaMOS Workspace</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                </a>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition text-left"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

