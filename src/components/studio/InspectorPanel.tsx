'use client';

import React from 'react';
import { 
  Sliders, 
  X,
  Plus,
  Trash2,
  Database,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BlockItem } from '../../types/builder';
import { MediaUploadField } from './MediaUploadField';

interface InspectorPanelProps {
  selectedBlock: BlockItem | null;
  onUpdateBlock: (updated: BlockItem) => void;
  onClose: () => void;
  onAuthRequired?: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onClose,
  onAuthRequired,
}) => {
  const { isAuthenticated, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <aside className="w-80 bg-slate-950 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-400 select-none space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Panel Pengaturan Terkunci</p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Masuk dengan akun resmi NexaMOS untuk mengubah detail teks, nomor WhatsApp, foto/logo, dan integrasi CRM bagian ini.
          </p>
        </div>
        <button
          type="button"
          onClick={onAuthRequired ? onAuthRequired : login}
          className="w-full h-9 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white shadow-md shadow-indigo-600/25 transition active:scale-95"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Masuk Akun NexaMOS</span>
        </button>
      </aside>
    );
  }

  if (!selectedBlock) {
    return (
      <aside className="w-80 bg-slate-950 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center text-slate-400 select-none">
        <Sliders className="w-10 h-10 text-slate-700 mb-3" />
        <p className="text-sm font-medium text-slate-300">Pilih Bagian untuk Diedit</p>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Klik salah satu blok pada daftar sebelah kiri atau langsung pada kanvas untuk mengubah teks, tombol WhatsApp, dan opsi tampilannya.
        </p>
      </aside>
    );
  }

  const handleChange = (field: string, value: any) => {
    onUpdateBlock({
      ...selectedBlock,
      [field]: value,
    });
  };

  return (
    <aside className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-200">
            Edit: {selectedBlock.title || selectedBlock.type}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Title for Internal Tracking */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Nama Bagian (Internal)
          </label>
          <input
            type="text"
            value={selectedBlock.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Header / Top Bar Specific */}
        {selectedBlock.type === 'header' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nama Brand / Lembaga
              </label>
              <input
                type="text"
                value={selectedBlock.brandName || ''}
                onChange={(e) => handleChange('brandName', e.target.value)}
                placeholder="Contoh: LPK Cakrawala Global"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Tagline Pendukung (Opsional)
              </label>
              <input
                type="text"
                value={selectedBlock.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Contoh: Resmi Penyaluran Jepang & Jerman"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <MediaUploadField
                label="Logo Brand / Lembaga"
                value={selectedBlock.logoUrl || ''}
                onChange={(url) => handleChange('logoUrl', url)}
                helperText="Unggah gambar logo atau pilih dari galeri preset. Kosongkan untuk inisial otomatis."
                onAuthRequired={onAuthRequired}
              />
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Teks Tombol Aksi (CTA)
                </label>
                <input
                  type="text"
                  value={selectedBlock.ctaText || ''}
                  onChange={(e) => handleChange('ctaText', e.target.value)}
                  placeholder="Konsultasi Gratis"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Nomor WhatsApp CTA (Format 62xxx)
                </label>
                <input
                  type="text"
                  value={selectedBlock.ctaWhatsapp || ''}
                  onChange={(e) => handleChange('ctaWhatsapp', e.target.value)}
                  placeholder="6281234567890"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBlock.isSticky}
                    onChange={(e) => handleChange('isSticky', e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Tempel di Atas saat Scroll (Sticky Header)</span>
                </label>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Daftar Menu Navigasi ({selectedBlock.navItems?.length || 0})
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const items = selectedBlock.navItems || [];
                    handleChange('navItems', [
                      ...items,
                      {
                        id: `nav_${Date.now()}`,
                        label: 'Menu Baru',
                        href: '#programs',
                      },
                    ]);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="space-y-2">
                {(selectedBlock.navItems || []).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-mono">Menu #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (selectedBlock.navItems || []).filter((_, i) => i !== idx);
                          handleChange('navItems', updated);
                        }}
                        className="p-1 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded transition"
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <label className="block text-slate-400 text-xs mb-0.5">Label Teks</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...(selectedBlock.navItems || [])];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            handleChange('navItems', updated);
                          }}
                          placeholder="Nama Menu"
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 text-xs mb-0.5">Tujuan / Anchor Target</label>
                        <input
                          type="text"
                          value={item.href}
                          onChange={(e) => {
                            const updated = [...(selectedBlock.navItems || [])];
                            updated[idx] = { ...updated[idx], href: e.target.value };
                            handleChange('navItems', updated);
                          }}
                          placeholder="#programs atau https://..."
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Hero Specific */}
        {selectedBlock.type === 'hero' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Badge / Label Atas
              </label>
              <input
                type="text"
                value={selectedBlock.badge}
                onChange={(e) => handleChange('badge', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Judul Utama (Headline)
              </label>
              <textarea
                rows={3}
                value={selectedBlock.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Deskripsi Pendukung (Sub-headline)
              </label>
              <textarea
                rows={3}
                value={selectedBlock.subheadline}
                onChange={(e) => handleChange('subheadline', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Teks Tombol CTA WhatsApp
              </label>
              <input
                type="text"
                value={selectedBlock.ctaText}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nomor WhatsApp Admin (Format 62xxx)
              </label>
              <input
                type="text"
                value={selectedBlock.ctaWhatsapp}
                onChange={(e) => handleChange('ctaWhatsapp', e.target.value)}
                placeholder="6281234567890"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Teks Bukti Kepercayaan (Trust Badge)
              </label>
              <input
                type="text"
                value={selectedBlock.trustText}
                onChange={(e) => handleChange('trustText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {/* Lead Form Specific */}
        {selectedBlock.type === 'lead-form' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Judul Formulir
              </label>
              <input
                type="text"
                value={selectedBlock.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nomor WhatsApp Tujuan Form
              </label>
              <input
                type="text"
                value={selectedBlock.whatsappDirectNumber}
                onChange={(e) => handleChange('whatsappDirectNumber', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Teks Tombol Kirim Form
              </label>
              <input
                type="text"
                value={selectedBlock.submitButtonText}
                onChange={(e) => handleChange('submitButtonText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBlock.showSchoolField}
                  onChange={(e) => handleChange('showSchoolField', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span>Tampilkan Kolom Asal Sekolah / Domisili</span>
              </label>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBlock.showProgramField}
                  onChange={(e) => handleChange('showProgramField', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span>Tampilkan Dropdown Program Pilihan</span>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                <Database className="w-3.5 h-3.5" />
                <span>Integrasi NexaMOS CRM & WhatsApp CAPI</span>
              </div>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBlock.syncToNexaCRM ?? true}
                  onChange={(e) => handleChange('syncToNexaCRM', e.target.checked)}
                  className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                />
                <span className="font-medium text-slate-200">Sinkronisasi Otomatis ke Nexa OS Webhook</span>
              </label>

              {(selectedBlock.syncToNexaCRM ?? true) && (
                <div className="space-y-2.5 pl-4 border-l-2 border-indigo-500/40 mt-1">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Tenant Identifier / Slug CRM
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.tenantSlug || 'crm-demo'}
                      onChange={(e) => handleChange('tenantSlug', e.target.value)}
                      placeholder="crm-demo"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target tenant untuk intake data calon siswa/pelanggan di Nexa OS.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Meta CAPI Pixel ID (Opsional)
                    </label>
                    <input
                      type="text"
                      value={selectedBlock.metaPixelId || ''}
                      onChange={(e) => handleChange('metaPixelId', e.target.value)}
                      placeholder="Contoh: 123456789012345"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
                    />
                    <p className="text-xs text-slate-500 mt-0.5">
                      Event `Lead` dan UTM parameter akan dikirim otomatis ke Meta Ads.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* CTA Banner Specific */}
        {selectedBlock.type === 'cta-banner' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Headline CTA
              </label>
              <input
                type="text"
                value={selectedBlock.headline}
                onChange={(e) => handleChange('headline', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Sub-headline CTA
              </label>
              <textarea
                rows={2}
                value={selectedBlock.subheadline}
                onChange={(e) => handleChange('subheadline', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Teks Tombol
              </label>
              <input
                type="text"
                value={selectedBlock.buttonText}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nomor WhatsApp (62xxx)
              </label>
              <input
                type="text"
                value={selectedBlock.whatsappNumber}
                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        {/* Footer Specific */}
        {selectedBlock.type === 'footer' && (
          <>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nama Merek / Brand
              </label>
              <input
                type="text"
                value={selectedBlock.brandName}
                onChange={(e) => handleChange('brandName', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Tagline / Ringkasan Lembaga
              </label>
              <textarea
                rows={2}
                value={selectedBlock.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Alamat Kantor
              </label>
              <input
                type="text"
                value={selectedBlock.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Teks Hak Cipta
              </label>
              <input
                type="text"
                value={selectedBlock.copyrightText}
                onChange={(e) => handleChange('copyrightText', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
