'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Check, 
  Lock,
  Link as LinkIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSession } from '../../lib/auth';
import { compressImage, formatBytes } from '../../lib/imageCompression';

interface TenantLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogoUrl?: string;
  brandName?: string;
  onSaveLogo: (url: string) => void;
  onAuthRequired?: () => void;
}

// Preset logo populer untuk opsi cepat
const PRESET_LOGOS = [
  { name: 'Education Shield', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Japan Sakura Tech', url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Global Academy Gate', url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&auto=format&fit=crop&q=80' },
];

export const TenantLogoModal: React.FC<TenantLogoModalProps> = ({
  isOpen,
  onClose,
  currentLogoUrl = '',
  brandName = '',
  onSaveLogo,
  onAuthRequired,
}) => {
  const { isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(currentLogoUrl);
  const [compressionInfo, setCompressionInfo] = useState<{
    originalSize: number;
    compressedSize: number;
    savedPercentage: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const requireAuth = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      login();
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!isAuthenticated) {
      requireAuth();
      return;
    }

    const session = getSession();
    if (!session?.accessToken) {
      requireAuth();
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (JPG, PNG, WebP, SVG).');
      return;
    }

    setIsUploading(true);
    setCompressionInfo(null);

    try {
      // 🚀 Auto-kompresi gambar logo (resolusi optimal logo max 800x800, quality 0.85 WebP)
      const compressionResult = await compressImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.85,
        targetFormat: 'image/webp',
      });

      const fileToUpload = compressionResult.file;

      if (fileToUpload.size > 5 * 1024 * 1024) {
        alert('Ukuran file setelah kompresi masih melebihi batas 5MB.');
        setIsUploading(false);
        return;
      }

      if (compressionResult.wasCompressed) {
        setCompressionInfo({
          originalSize: compressionResult.originalSize,
          compressedSize: compressionResult.compressedSize,
          savedPercentage: compressionResult.savedPercentage,
        });
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        onSaveLogo(json.url);
        setUrlInput(json.url);
      } else {
        alert(json.message || 'Gagal mengunggah logo.');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memproses unggahan logo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Upload Logo Tenant</h3>
              <p className="text-xs text-slate-400">
                {brandName ? `Brand: ${brandName}` : 'Pilih atau unggah logo resmi'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Current Logo Preview Card */}
          {currentLogoUrl ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1 overflow-hidden shrink-0">
                  <img
                    src={currentLogoUrl}
                    alt="Logo Saat Ini"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium mb-0.5">
                    <Check className="w-3 h-3" />
                    <span>Logo Aktif</span>
                  </span>
                  <p className="text-xs text-slate-400 truncate max-w-48 font-mono">
                    {currentLogoUrl}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSaveLogo('');
                  setUrlInput('');
                  setCompressionInfo(null);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-medium transition flex items-center gap-1 shrink-0"
                title="Hapus Logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-3 text-center">
              <p className="text-xs text-slate-400">Belum ada logo tenant yang dipasang. Unggah logo di bawah ini.</p>
            </div>
          )}

          {/* Compression Info Badge */}
          {compressionInfo && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs animate-in fade-in duration-150">
              <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-emerald-300">Auto-Kompresi Berhasil!</p>
                <p className="text-emerald-400/80">
                  Ukuran: {formatBytes(compressionInfo.originalSize)} → {formatBytes(compressionInfo.compressedSize)} (Hemat {compressionInfo.savedPercentage}%)
                </p>
              </div>
            </div>
          )}

          {/* Method Switcher Tabs */}
          <div className="flex border border-slate-800 rounded-lg p-0.5 bg-slate-950/60 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 font-medium transition ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 font-medium transition ${
                activeTab === 'preset'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preset Logo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 font-medium transition ${
                activeTab === 'url'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Input URL</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {/* Tab 1: Upload Dropzone */}
          {activeTab === 'upload' && (
            !isAuthenticated ? (
              <div
                onClick={requireAuth}
                className="border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 rounded-xl p-6 text-center cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/50 transition flex flex-col items-center justify-center gap-2.5 group"
              >
                <div className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Masuk Akun NexaMOS untuk Unggah Logo
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Penyimpanan media cloud dan auto-kompresi aktif untuk tenant terdaftar.
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Masuk Sekarang
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-950/40 hover:border-indigo-500/50 hover:bg-slate-950/80'
                }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                    <span className="text-xs text-slate-200 font-medium">
                      Mengompresi & mengunggah logo...
                    </span>
                    <span className="text-xs text-slate-500">
                      Mengoptimalkan ukuran gambar secara otomatis
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-200">
                        Klik untuk memilih atau seret gambar logo ke sini
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG, WebP, SVG (Auto-kompresi aktif, maks. 5MB)
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-400/90 font-medium bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 mt-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-kompresi ringan & tajam</span>
                    </span>
                  </>
                )}
              </div>
            )
          )}

          {/* Tab 2: Preset Logos */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-400">Pilih logo siap pakai untuk demonstrasi:</p>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_LOGOS.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      onSaveLogo(item.url);
                      setUrlInput(item.url);
                      setCompressionInfo(null);
                    }}
                    className={`group relative rounded-xl border p-2 text-left transition overflow-hidden ${
                      currentLogoUrl === item.url
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-full h-12 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-1">
                      <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <span className="block text-xs text-slate-400 group-hover:text-slate-200 truncate mt-1.5 font-medium">
                      {item.name}
                    </span>
                    {currentLogoUrl === item.url && (
                      <div className="absolute top-1.5 right-1.5 bg-indigo-600 rounded-full p-0.5 text-white shadow-xs">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-300">
                URL Gambar Logo Eksternal
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://domain.com/logo.png"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSaveLogo(urlInput);
                    setCompressionInfo(null);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shrink-0"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
            <span className="shrink-0 text-amber-400">💡</span>
            <span>
              Logo tenant akan otomatis muncul di bagian kiri atas navigasi mobile dan desktop. Format transparan (PNG/WebP) sangat disarankan.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
