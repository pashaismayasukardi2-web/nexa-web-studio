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
  ChevronDown,
  Navigation,
  GripVertical,
  Copy,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockItem, BlockType } from '../../types/builder';

interface SidebarBlockPickerProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onAddBlock: (type: BlockType) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDeleteBlock: (id: string) => void;
  onReorderBlocks?: (newBlocks: BlockItem[]) => void;
  onDuplicateBlock?: (id: string) => void;
  onAuthRequired?: () => void;
}

const AVAILABLE_BLOCKS: Array<{ type: BlockType; label: string; desc: string; icon: any }> = [
  { type: 'header', label: 'Top Bar & Navigasi', desc: 'Logo, menu tautan, & tombol CTA', icon: Navigation },
  { type: 'hero', label: 'Hero Banner', desc: 'Cover headline, CTA tombol WhatsApp', icon: Layout },
  { type: 'stats', label: 'Metrik & Bukti', desc: 'Angka statistik dan key metrics', icon: BarChart2 },
  { type: 'programs', label: 'Kartu Program / Produk', desc: 'Daftar penawaran dan spesifikasi', icon: Briefcase },
  { type: 'lead-form', label: 'Formulir Pendaftaran', desc: 'Lead capture terhubung ke WA / CRM', icon: MessageSquare },
  { type: 'testimonials', label: 'Testimoni & Alumni', desc: 'Bukti kepuasan dan review siswa/klien', icon: Users },
  { type: 'faq', label: 'Tanya Jawab (FAQ)', desc: 'Pertanyaan umum dan klarifikasi proses', icon: HelpCircle },
  { type: 'cta-banner', label: 'Banner Ajakan Bertindak', desc: 'CTA tegas penutup di bagian akhir', icon: Sliders },
];

// Sub-komponen sortable untuk setiap blok
interface SortableBlockRowProps {
  blk: BlockItem;
  idx: number;
  totalBlocks: number;
  isSelected: boolean;
  isAuthenticated: boolean;
  onSelectBlock: (id: string) => void;
  onMoveBlock: (id: string, direction: 'up' | 'down') => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock?: (id: string) => void;
  onAuthRequired?: () => void;
}

const SortableBlockRow: React.FC<SortableBlockRowProps> = ({
  blk,
  idx,
  totalBlocks,
  isSelected,
  isAuthenticated,
  onSelectBlock,
  onMoveBlock,
  onDeleteBlock,
  onDuplicateBlock,
  onAuthRequired,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blk.id, disabled: !isAuthenticated });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleActionWithAuth = (action: () => void) => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    action();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelectBlock(blk.id)}
      className={`group flex items-center justify-between p-2 rounded-lg text-xs font-medium cursor-pointer transition border select-none ${
        isDragging
          ? 'opacity-60 bg-indigo-900/50 border-indigo-400 z-50 shadow-2xl scale-[1.02]'
          : isSelected
          ? 'bg-indigo-600/20 text-white border-indigo-500/50 shadow-xs'
          : 'bg-slate-900/60 text-slate-300 border-slate-800/80 hover:bg-slate-800/60 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
        {/* Drag Handle with Grip Icon */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => {
            e.stopPropagation();
            if (!isAuthenticated) onAuthRequired?.();
          }}
          className={`p-1 -ml-1 text-slate-500 rounded transition ${
            isAuthenticated
              ? 'hover:text-indigo-400 cursor-grab hover:bg-slate-800'
              : 'hover:text-amber-400 cursor-pointer'
          }`}
          title={!isAuthenticated ? 'Masuk akun NexaMOS untuk menggeser bagian' : 'Geser mouse untuk ubah urutan bagian'}
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <span className="text-xs w-4 text-slate-500 font-mono shrink-0">
          {idx + 1}.
        </span>
        <span className="truncate">{blk.title || blk.type}</span>
      </div>

      {/* Actions: Move Up, Move Down, Duplicate, Delete */}
      <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition shrink-0 ml-1">
        <button
          type="button"
          disabled={idx === 0}
          onClick={(e) => {
            e.stopPropagation();
            handleActionWithAuth(() => onMoveBlock(blk.id, 'up'));
          }}
          className="p-1 hover:bg-slate-700/60 rounded disabled:opacity-20"
          title="Pindah ke Atas"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          disabled={idx === totalBlocks - 1}
          onClick={(e) => {
            e.stopPropagation();
            handleActionWithAuth(() => onMoveBlock(blk.id, 'down'));
          }}
          className="p-1 hover:bg-slate-700/60 rounded disabled:opacity-20"
          title="Pindah ke Bawah"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        {onDuplicateBlock && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleActionWithAuth(() => onDuplicateBlock(blk.id));
            }}
            className="p-1 hover:bg-slate-700/60 text-slate-400 hover:text-indigo-300 rounded"
            title="Duplikasi Bagian"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleActionWithAuth(() => onDeleteBlock(blk.id));
          }}
          className="p-1 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded ml-0.5"
          title="Hapus Bagian"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const SidebarBlockPicker: React.FC<SidebarBlockPickerProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onAddBlock,
  onMoveBlock,
  onDeleteBlock,
  onReorderBlocks,
  onDuplicateBlock,
  onAuthRequired,
}) => {
  const { isAuthenticated, login } = useAuth();

  const authHandler = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      login();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // Aktif jika ditarik minimal 4px agar tidak bentrok dengan klik biasa
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isAuthenticated) {
      authHandler();
      return;
    }
    const { active, over } = event;
    if (over && active.id !== over.id && onReorderBlocks) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(blocks, oldIndex, newIndex);
        onReorderBlocks(reordered);
      }
    }
  };

  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full select-none">
      {/* Tabs / Header */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Struktur Halaman ({blocks.length} Bagian)</span>
        </div>
      </div>

      {/* Active Blocks List with DND Sortable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 border-b border-slate-800">
        <div className="text-xs font-medium text-slate-400 px-1 pb-1 flex items-center justify-between">
          <span>Urutan Susunan Bagian:</span>
          {isAuthenticated ? (
            <span className="text-xs text-indigo-400/80 font-mono">Tarik untuk geser</span>
          ) : (
            <span className="text-xs text-amber-400/90 font-mono flex items-center gap-1">
              <Lock className="w-3 h-3" /> Terkunci
            </span>
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocks.map((blk, idx) => (
              <SortableBlockRow
                key={blk.id}
                blk={blk}
                idx={idx}
                totalBlocks={blocks.length}
                isSelected={blk.id === selectedBlockId}
                isAuthenticated={isAuthenticated}
                onSelectBlock={onSelectBlock}
                onMoveBlock={onMoveBlock}
                onDeleteBlock={onDeleteBlock}
                onDuplicateBlock={onDuplicateBlock}
                onAuthRequired={authHandler}
              />
            ))}
          </SortableContext>
        </DndContext>
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
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    authHandler();
                    return;
                  }
                  onAddBlock(item.type);
                }}
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
