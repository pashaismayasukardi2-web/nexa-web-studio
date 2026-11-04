'use client';

import React from 'react';
import { 
  Sliders, 
  X
} from 'lucide-react';
import { BlockItem } from '../../types/builder';

interface InspectorPanelProps {
  selectedBlock: BlockItem | null;
  onUpdateBlock: (updated: BlockItem) => void;
  onClose: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  onClose,
}) => {
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
