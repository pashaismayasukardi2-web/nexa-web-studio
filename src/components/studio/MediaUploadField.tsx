'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Sparkles, 
  Link as LinkIcon, 
  Check, 
  RefreshCw,
  Image as ImageIcon,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSession } from '../../lib/auth';

interface MediaUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  placeholder?: string;
  onAuthRequired?: () => void;
}

// Koleksi preset aset siap pakai (Logo, Badges, Avatar)
const PRESET_ASSETS = [
  {
    category: 'Logo & Lambang',
    items: [
      { name: 'Global Education Shield', url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&auto=format&fit=crop&q=80' },
      { name: 'Japan Sakura Emblem', url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?w=200&auto=format&fit=crop&q=80' },
      { name: 'German Tech Gate', url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    category: 'Foto Alumni & Testimoni',
    items: [
      { name: 'Alumni Pria (Safety Helmet)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
      { name: 'Alumni Wanita (Perawat/Kaigo)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
      { name: 'Alumni Profesional Muda', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
    ]
  }
];

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  value = '',
  onChange,
  helperText,
  placeholder = 'Unggah atau pilih gambar...',
  onAuthRequired,
}) => {
  const { isAuthenticated, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>(value);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        onChange(json.url);
        setUrlInput(json.url);
      } else {
        alert(json.message || 'Gagal mengunggah file.');
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memproses unggahan file.');
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setUrlInput('');
            }}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus</span>
          </button>
        )}
      </div>

      {/* Preview Card If Value Exists */}
      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-900/80 p-2 flex items-center gap-3">
          <div className="w-14 h-14 rounded-md bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Gambar Aktif Terpasang</p>
            <p className="text-xs text-slate-500 truncate font-mono mt-0.5">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Ganti Gambar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      {/* Tabs Switcher: Upload | Galeri | URL */}
      <div className="flex border border-slate-800 rounded-lg p-0.5 bg-slate-900/60 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1 rounded flex items-center justify-center gap-1 font-medium transition ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3 h-3" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`flex-1 py-1 rounded flex items-center justify-center gap-1 font-medium transition ${
            activeTab === 'preset'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Preset</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1 rounded flex items-center justify-center gap-1 font-medium transition ${
            activeTab === 'url'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LinkIcon className="w-3 h-3" />
          <span>URL</span>
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

      {/* TAB 1: UPLOAD DROPZONE */}
      {activeTab === 'upload' && (
        !isAuthenticated ? (
          <div
            onClick={requireAuth}
            className="border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 rounded-lg p-5 text-center cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/50 transition flex flex-col items-center justify-center gap-2 group"
          >
            <div className="p-2.5 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                Masuk NexaMOS untuk Unggah Gambar
              </p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                Akses penyimpanan media dan upload file hanya dapat digunakan oleh akun terdaftar.
              </p>
            </div>
            <button
              type="button"
              className="mt-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              Masuk Akun Sekarang
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
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
              dragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-1.5 py-2">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-xs text-slate-300 font-medium">Mengunggah gambar...</span>
              </div>
            ) : (
              <>
                <div className="p-2 rounded-full bg-slate-800 text-indigo-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">
                    Klik untuk pilih atau seret gambar ke sini
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    PNG, JPG, WebP, atau SVG (maksimal 5MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )
      )}

      {/* TAB 2: PRESET GALLERY */}
      {activeTab === 'preset' && (
        <div className="space-y-3 p-2 bg-slate-900/40 rounded-lg border border-slate-800 max-h-48 overflow-y-auto">
          {PRESET_ASSETS.map((grp) => (
            <div key={grp.category} className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-400">{grp.category}</div>
              <div className="grid grid-cols-3 gap-2">
                {grp.items.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        requireAuth();
                        return;
                      }
                      onChange(item.url);
                      setUrlInput(item.url);
                    }}
                    className={`group relative rounded-md border p-1 text-left transition overflow-hidden ${
                      value === item.url
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-full h-12 bg-slate-900 rounded overflow-hidden flex items-center justify-center">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="block text-xs text-slate-400 group-hover:text-slate-200 truncate mt-1">
                      {item.name}
                    </span>
                    {value === item.url && (
                      <div className="absolute top-1 right-1 bg-indigo-600 rounded-full p-0.5 text-white">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: URL INPUT */}
      {activeTab === 'url' && (
        <div className="flex gap-1.5">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                requireAuth();
                return;
              }
              onChange(urlInput);
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
          >
            Terapkan
          </button>
        </div>
      )}

      {helperText && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

