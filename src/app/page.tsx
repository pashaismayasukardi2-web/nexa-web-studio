'use client';

import React, { useState } from 'react';
import { initialPageConfig } from '../data/templates';
import { BlockItem, BlockType, DeviceView, PageConfig, StudioTheme, TenantType } from '../types/builder';
import { TopNavbar } from '../components/studio/TopNavbar';
import { SidebarBlockPicker } from '../components/studio/SidebarBlockPicker';
import { CanvasArea } from '../components/studio/CanvasArea';
import { InspectorPanel } from '../components/studio/InspectorPanel';
import { ExportModal } from '../components/studio/ExportModal';

export default function WebStudioPage() {
  const [pageConfig, setPageConfig] = useState<PageConfig>(initialPageConfig);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('blk_hero_1');
  const [device, setDevice] = useState<DeviceView>('desktop');
  const [isLivePreview, setIsLivePreview] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Selected Block reference
  const selectedBlock = pageConfig.blocks.find((b) => b.id === selectedBlockId) || null;

  // Handlers
  const handleUpdateBlock = (updated: BlockItem) => {
    setPageConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === updated.id ? updated : b)),
    }));
  };

  const handleAddBlock = (type: BlockType) => {
    const newId = `blk_${type}_${Date.now()}`;
    let newBlock: BlockItem;

    switch (type) {
      case 'header':
        newBlock = {
          id: newId,
          type: 'header',
          title: 'Top Bar & Navigasi',
          brandName: pageConfig.tenantName,
          tagline: 'Lembaga Pelatihan & Penempatan Kerja Resmi',
          logoUrl: '',
          navItems: [
            { id: `nav_1_${Date.now()}`, label: 'Program', href: '#programs' },
            { id: `nav_2_${Date.now()}`, label: 'Prestasi', href: '#stats' },
            { id: `nav_3_${Date.now()}`, label: 'Testimoni', href: '#testimoni' },
            { id: `nav_4_${Date.now()}`, label: 'FAQ', href: '#faq' },
          ],
          ctaText: 'Konsultasi Gratis',
          ctaWhatsapp: '6281234567890',
          isSticky: true,
        };
        break;
      case 'hero':
        newBlock = {
          id: newId,
          type: 'hero',
          title: 'Hero Cover Baru',
          badge: 'Penawaran Spesial Terbatas',
          headline: 'Tingkatkan Peluang Karir Masa Depan Anda Hari Ini',
          subheadline: 'Program terstandar dengan kurikulum praktis dan bimbingan mentor berpengalaman.',
          ctaText: 'Daftar Konsultasi Sekarang',
          ctaWhatsapp: '6281234567890',
          secondaryCtaText: 'Pelajari Program',
          trustText: 'Terverifikasi Resmi & Berlisensi',
        };
        break;
      case 'stats':
        newBlock = {
          id: newId,
          type: 'stats',
          title: 'Pencapaian & Statistik',
          items: [
            { label: 'Tingkat Kepuasan', value: '99%', description: 'Penilaian positif alumni' },
            { label: 'Peserta Aktif', value: '500+', description: 'Tahun akademik ini' },
            { label: 'Mitra Industri', value: '40+', description: 'Perusahaan siap rekrut' },
            { label: 'Sertifikasi', value: '100%', description: 'Standar resmi diakui' },
          ],
        };
        break;
      case 'programs':
        newBlock = {
          id: newId,
          type: 'programs',
          title: 'Daftar Program / Layanan',
          subtitle: 'Pilihan paket yang disesuaikan dengan kebutuhan Anda',
          items: [
            {
              name: 'Paket Intensif Reguler',
              duration: '3 Bulan',
              badge: 'Pilihan Favorit',
              description: 'Kelas lengkap dengan bimbingan dari nol sampai siap kerja.',
              price: 'Terjangkau',
              features: ['Materi Lengkap', 'Ujian Sertifikasi', 'Asrama / Konsultasi'],
              isPopular: true,
            },
          ],
        };
        break;
      case 'lead-form':
        newBlock = {
          id: newId,
          type: 'lead-form',
          title: 'Formulir Kontak Cepat',
          badge: 'Pendaftaran Cepat',
          headline: 'Konsultasi Gratis dengan Tim Kami',
          subheadline: 'Isi nomor WhatsApp Anda dan dapatkan respon dalam 15 menit.',
          submitButtonText: 'Kirim Sekarang via WhatsApp',
          whatsappDirectNumber: '6281234567890',
          showSchoolField: true,
          showProgramField: true,
          successMessage: 'Pesan berhasil terkirim!',
        };
        break;
      case 'testimonials':
        newBlock = {
          id: newId,
          type: 'testimonials',
          title: 'Apa Kata Mereka',
          subtitle: 'Kisah nyata dari peserta yang telah bergabung bersama kami',
          items: [
            {
              name: 'Ahmad Fauzi',
              role: 'Peserta Angkatan 2026',
              content: 'Sangat terbantu dengan bimbingan yang ramah dan kurikulum yang jelas!',
              placement: 'Jakarta',
              rating: 5,
            },
          ],
        };
        break;
      case 'faq':
        newBlock = {
          id: newId,
          type: 'faq',
          title: 'Tanya Jawab',
          subtitle: 'Pertanyaan paling sering diajukan seputar pendaftaran',
          items: [
            {
              question: 'Kapan pendaftaran ditutup?',
              answer: 'Pendaftaran dibuka secara bertahap dan ditutup begitu kuota per angkatan terpenuhi.',
            },
          ],
        };
        break;
      case 'cta-banner':
        newBlock = {
          id: newId,
          type: 'cta-banner',
          title: 'Ajakan Penutup',
          badge: 'Ambil Peluangmu',
          headline: 'Jangan Tunda Kesuksesan Karir Anda',
          subheadline: 'Hubungi konselor kami untuk mendapatkan rincian program selengkapnya.',
          buttonText: 'Chat WhatsApp Sekarang',
          whatsappNumber: '6281234567890',
        };
        break;
      case 'footer':
      default:
        newBlock = {
          id: newId,
          type: 'footer',
          title: 'Footer Halaman',
          brandName: pageConfig.tenantName,
          tagline: 'Layanan Terpercaya Berbasis Solusi Nyata.',
          address: 'Jakarta, Indonesia',
          whatsappNumber: '6281234567890',
          copyrightText: `© 2026 ${pageConfig.tenantName}. Powered by NexaMOS.`,
        };
        break;
    }

    setPageConfig((prev) => ({
      ...prev,
      blocks: type === 'header' ? [newBlock, ...prev.blocks] : [...prev.blocks, newBlock],
    }));
    setSelectedBlockId(newId);
  };

  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    setPageConfig((prev) => {
      const idx = prev.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.blocks.length) return prev;

      const newBlocks = [...prev.blocks];
      const temp = newBlocks[idx];
      newBlocks[idx] = newBlocks[targetIdx];
      newBlocks[targetIdx] = temp;

      return { ...prev, blocks: newBlocks };
    });
  };

  const handleDeleteBlock = (id: string) => {
    setPageConfig((prev) => {
      const remaining = prev.blocks.filter((b) => b.id !== id);
      return { ...prev, blocks: remaining };
    });
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      {/* Top Navbar */}
      <TopNavbar
        device={device}
        setDevice={setDevice}
        isLivePreview={isLivePreview}
        setIsLivePreview={setIsLivePreview}
        theme={pageConfig.theme}
        setTheme={(t: StudioTheme) => setPageConfig((prev) => ({ ...prev, theme: t }))}
        tenantType={pageConfig.tenantType}
        setTenantType={(t: TenantType) => setPageConfig((prev) => ({ ...prev, tenantType: t }))}
        pageTitle={pageConfig.title}
        onOpenCodeModal={() => setIsExportModalOpen(true)}
        onExportHtml={() => setIsExportModalOpen(true)}
      />

      {/* Main Studio Body: Sidebar | Canvas | Inspector */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left: Section Block Picker & Reorder */}
        {!isLivePreview && (
          <SidebarBlockPicker
            blocks={pageConfig.blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={setSelectedBlockId}
            onAddBlock={handleAddBlock}
            onMoveBlock={handleMoveBlock}
            onDeleteBlock={handleDeleteBlock}
          />
        )}

        {/* Center: Responsive Canvas Area */}
        <CanvasArea
          blocks={pageConfig.blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          device={device}
          isLivePreview={isLivePreview}
          theme={pageConfig.theme}
          tenantType={pageConfig.tenantType}
        />

        {/* Right: Block Inspector & Settings */}
        {!isLivePreview && (
          <InspectorPanel
            selectedBlock={selectedBlock}
            onUpdateBlock={handleUpdateBlock}
            onClose={() => setSelectedBlockId(null)}
          />
        )}
      </div>

      {/* Export / Code Modal */}
      <ExportModal
        pageConfig={pageConfig}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}

