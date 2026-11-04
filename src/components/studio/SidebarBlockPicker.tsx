'use client';

import React from 'react';
import { 
  Plus, 
  Layers, 
  Layout, 
  BarChart2, 
  Briefcase, 
  Users, 
  HelpCircle, 
  MessageSquare, 
  Sliders, 
  Trash2, 
  ChevronUp, 
  ChevronDown 
} from 'lucide-react';
import { BlockItem, BlockType } from '../../types/builder';

interface SidebarBlockPickerProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onAddBlock: (type: BlockType) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDeleteBlock: (id: string) => void;
}

const AVAILABLE_BLOCKS: Array<{ type: BlockType; label: string; desc: string; icon: any }> = [
  { type: 'hero', label: 'Hero Banner', desc: 'Cover headline, CTA tombol WhatsApp', icon: Layout },
  { type: 'stats', label: 'Metrik & Bukti', desc: 'Angka statistik dan key metrics', icon: BarChart2 },
  { type: 'programs', label: 'Kartu Program / Produk', desc: 'Daftar penawaran dan spesifikasi', icon: Briefcase },
  { type: 'lead-form', label: 'Formulir Pendaftaran', desc: 'Lead capture terhubung ke WA / CRM', icon: MessageSquare },
  { type: 'testimonials', label: 'Testimoni & Alumni', desc: 'Bukti kepuasan dan review siswa/klien', icon: Users },
  { type: 'faq', label: 'Tanya Jawab (FAQ)', desc: 'Pertanyaan umum dan klarifikasi proses', icon: HelpCircle },
  { type: 'cta-banner', label: 'Banner Ajakan Bertindak', desc: 'CTA tegas penutup di bagian akhir', icon: Sliders },
];

export const SidebarBlockPicker: React.FC<SidebarBlockPickerProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onMoveBlock,
  onDeleteBlock,
}) => {
  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full select-none">
      {/* Tabs / Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Struktur Halaman ({blocks.length} Blok)</span>
        </div>
      </div>

      {/* Active Blocks List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 border-b border-slate-800">
        <div className="text-xs font-medium text-slate-400 px-1 pb-1">
          Urutan Susunan Bagian:
        </div>
        {blocks.map((blk, idx) => {
          const isSelected = blk.id === selectedBlockId;
          return (
            <div
              key={blk.id}
              onClick={() => onSelectBlock(blk.id)}
              className={`group flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition border ${
                isSelected
                  ? 'bg-indigo-600/20 text-white border-indigo-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-300 border-slate-800/80 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs w-4 text-slate-400 font-mono">
                  {idx + 1}.
                </span>
                <span className="truncate">{blk.title || blk.type}</span>
              </div>

              {/* Actions: Move Up, Move Down, Delete */}
              <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition">
                <button
                  disabled={idx === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveBlock(blk.id, 'up');
                  }}
                  className="p-1 hover:bg-slate-700/60 rounded disabled:opacity-20"
                  title="Pindah ke Atas"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  disabled={idx === blocks.length - 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveBlock(blk.id, 'down');
                  }}
                  className="p-1 hover:bg-slate-700/60 rounded disabled:opacity-20"
                  title="Pindah ke Bawah"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteBlock(blk.id);
                  }}
                  className="p-1 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded ml-1"
                  title="Hapus Bagian"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Block Section */}
      <div className="p-3 bg-slate-900/30">
        <div className="text-xs font-medium text-slate-400 px-1 pb-2 flex items-center justify-between">
          <span>Tambah Komponen Baru</span>
          <Plus className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {AVAILABLE_BLOCKS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => onAddBlock(item.type)}
                className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white transition group flex items-start gap-2.5"
              >
                <div className="p-1 rounded bg-slate-800 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition mt-0.5">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-xs text-slate-400 truncate">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
