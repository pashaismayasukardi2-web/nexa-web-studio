'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  MessageCircle, 
  ChevronDown, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Calendar,
  Send,
  Menu,
  X,
  ChevronUp,
  Trash2,
  Copy,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Loader2,
  Layers,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  BlockItem, 
  DeviceView, 
  StudioTheme, 
  TenantType, 
  PageConfig,
  ProgramsBlock,
  StatsBlock,
  FeaturesBlock,
  TestimonialsBlock,
  FaqBlock
} from '../../types/builder';
import { InlineEditableText } from './InlineEditableText';
import { 
  captureUtmParameters, 
  initMetaPixel, 
  trackPixelLead, 
  syncLeadToNexaCRM 
} from '../../lib/tracking';

interface CanvasAreaProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  onSelectBlock?: (id: string) => void;
  onUpdateBlock?: (updated: BlockItem) => void;
  onMoveBlock?: (id: string, direction: 'up' | 'down') => void;
  onDeleteBlock?: (id: string) => void;
  onDuplicateBlock?: (id: string) => void;
  device?: DeviceView;
  isLivePreview?: boolean;
  theme: StudioTheme;
  tenantType: TenantType;
  isPublicPage?: boolean;
  pageConfig?: PageConfig;
  onAuthRequired?: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onMoveBlock,
  onDeleteBlock,
  onDuplicateBlock,
  device = 'desktop',
  isLivePreview = false,
  theme,
  tenantType,
  isPublicPage = false,
  pageConfig,
  onAuthRequired,
}) => {
  const { isAuthenticated, login } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', phone: '', school: '', program: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState<boolean>(false);
  const [leadSubmitResult, setLeadSubmitResult] = useState<{
    success: boolean;
    message: string;
    waUrl: string;
  } | null>(null);

  const mainRef = useRef<HTMLElement | null>(null);
  const blockRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Auto-scroll canvas to selected block when selected from sidebar or newly added
  useEffect(() => {
    if (selectedBlockId && blockRefs.current[selectedBlockId] && mainRef.current) {
      const target = blockRefs.current[selectedBlockId];
      if (target) {
        mainRef.current.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedBlockId]);

  // Inisialisasi Meta Pixel & Tangkap UTM saat kanvas dimuat
  useEffect(() => {
    captureUtmParameters();
    const pixelId = pageConfig?.tracking?.metaPixelId;
    if (pixelId) {
      initMetaPixel(pixelId);
    }
  }, [pageConfig?.tracking?.metaPixelId]);

  // Theme color maps
  const getThemeClasses = () => {
    switch (theme) {
      case 'emerald':
        return {
          btnPrimary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          accent: 'text-emerald-400',
        };
      case 'violet':
        return {
          btnPrimary: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          accent: 'text-purple-400',
        };
      case 'amber':
        return {
          btnPrimary: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/25',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          accent: 'text-amber-400',
        };
      case 'indigo':
      default:
        return {
          btnPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          accent: 'text-indigo-400',
        };
    }
  };

  const themeCls = getThemeClasses();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const isEditingDisabled = isLivePreview || isPublicPage || !isAuthenticated;

  const authHandler = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      login();
    }
  };

  const inlineAuthCallback = !isAuthenticated ? authHandler : undefined;

  // Width container per device
  const getDeviceWidthClass = () => {
    if (isPublicPage) {
      return 'w-full min-h-screen';
    }
    switch (device) {
      case 'mobile':
        return 'w-96 max-w-full shadow-2xl rounded-3xl border-8 border-slate-900 my-6';
      case 'tablet':
        return 'max-w-3xl w-full shadow-2xl rounded-2xl border-4 border-slate-900 my-6';
      case 'desktop':
      default:
        return 'w-full max-w-5xl my-4 rounded-xl';
    }
  };

  // NATIVE CRM & WHATSAPP SYNC HANDLER
  const handleFormSubmit = async (
    e: React.FormEvent, 
    waNumber: string, 
    syncToCRM?: boolean, 
    tenantSlug?: string,
    metaPixelId?: string
  ) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmittingLead(true);

    const utms = captureUtmParameters();
    const cleanWa = waNumber.replace(/[^0-9]/g, '');

    // Format attribution text
    const utmSummary = utms.utm_source 
      ? `\n[Sumber: ${utms.utm_source}${utms.utm_campaign ? ' / ' + utms.utm_campaign : ''}]` 
      : '';

    const msg = `Halo Admin, saya ingin mendaftar konsultasi:\nNama: ${formData.name}\nWhatsApp: ${formData.phone}\n${
      tenantType === 'LPK' ? 'Asal Sekolah' : 'Domisili/Instansi'
    }: ${formData.school || '-'}\nProgram: ${formData.program || '-'}${utmSummary}`;

    const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(msg)}`;

    // 1. Trigger Meta CAPI Pixel
    const targetPixel = metaPixelId || pageConfig?.tracking?.metaPixelId;
    trackPixelLead({
      name: formData.name,
      phone: formData.phone,
      school: formData.school,
      program: formData.program,
    }, targetPixel);

    // 2. Sinkronisasi ke Nexa CRM jika diaktifkan (Default: True)
    const shouldSync = syncToCRM ?? pageConfig?.crmConfig?.autoSync ?? true;
    if (shouldSync) {
      const targetSlug = tenantSlug || pageConfig?.crmConfig?.tenantSlug || 'crm-demo';
      const customApiUrl = pageConfig?.crmConfig?.crmApiUrl;

      await syncLeadToNexaCRM({
        name: formData.name,
        phone: formData.phone,
        school: formData.school,
        program: formData.program,
        tenantSlug: targetSlug,
        customApiUrl,
      });
    }

    setIsSubmittingLead(false);

    // 3. Tampilkan Banner Status & Buka WhatsApp
    setLeadSubmitResult({
      success: true,
      message: 'Pendaftaran Anda berhasil tercatat di sistem NexaMOS! Silakan lanjutkan percakapan dengan tim konselor.',
      waUrl,
    });

    // Otomatis buka WhatsApp di tab baru
    window.open(waUrl, '_blank');
  };

  return (
    <main
      ref={mainRef}
      className={
        isPublicPage
          ? 'w-full min-h-screen bg-slate-950 overflow-y-auto'
          : 'flex-1 bg-slate-900/60 overflow-y-auto flex flex-col items-center p-4 min-h-0'
      }
    >
      {/* Banner Mode Pratinjau Terkunci untuk Pengunjung Belum Login */}
      {!isAuthenticated && !isPublicPage && !isLivePreview && (
        <div className="w-full max-w-5xl mb-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400 shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold text-white flex items-center gap-2">
                <span>Akses Pengeditan Terkunci</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">
                  Login Required
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Masuk dengan akun resmi NexaMOS untuk mengedit teks komponen, menggeser urutan bagian, dan mengunggah media.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={authHandler}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white font-semibold shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Masuk NexaMOS</span>
          </button>
        </div>
      )}

      <div
        className={`${getDeviceWidthClass()} bg-slate-950 transition-all duration-300 overflow-hidden min-h-full shrink-0 text-slate-100 relative ${
          isPublicPage ? '' : 'shadow-2xl border border-slate-800/80'
        }`}
      >
        {/* Mobile Device Top Status Bar Mockup */}
        {isMobile && (
          <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-400 select-none border-b border-slate-900">
            <span className="font-semibold text-slate-300">09:41</span>
            <div className="w-16 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-slate-950 rounded-full border border-slate-800" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-bold">5G</span>
              <div className="w-5 h-2.5 border border-slate-500 rounded p-0.5 flex items-center">
                <div className="w-full h-full bg-slate-300 rounded-xs" />
              </div>
            </div>
          </div>
        )}

        {blocks.map((blk, idx) => {
          const isSelected = !isLivePreview && blk.id === selectedBlockId;

          return (
            <div
              key={blk.id}
              ref={(el) => {
                blockRefs.current[blk.id] = el;
              }}
              onClick={() => !isLivePreview && onSelectBlock?.(blk.id)}
              className={`relative transition group/section ${
                !isLivePreview ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500/50' : ''
              } ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950' : ''}`}
            >
              {/* Floating Section Action Toolbar (Level Carrd / GoHighLevel) */}
              {!isEditingDisabled && (
                <div className="absolute top-2 right-2 z-30 flex items-center gap-1 bg-slate-900/95 border border-slate-700/80 rounded-lg p-1 opacity-0 group-hover/section:opacity-100 transition shadow-xl backdrop-blur-md">
                  <span className="text-xs font-mono text-slate-300 px-2 border-r border-slate-800">
                    {idx + 1}. {blk.title || blk.type}
                  </span>
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveBlock?.(blk.id, 'up');
                    }}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-20"
                    title="Pindah ke Atas"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveBlock?.(blk.id, 'down');
                    }}
                    className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded disabled:opacity-20"
                    title="Pindah ke Bawah"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {onDuplicateBlock && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateBlock(blk.id);
                      }}
                      className="p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-300 rounded"
                      title="Duplikasi Bagian Ini"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {onDeleteBlock && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(blk.id);
                      }}
                      className="p-1 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded ml-0.5"
                      title="Hapus Bagian Ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* RENDER BLOCK: HEADER */}
              {blk.type === 'header' && (
                <header
                  id="header"
                  className={`w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md transition-all ${
                    blk.isSticky ? 'sticky top-0 z-20 shadow-md' : 'relative z-10'
                  }`}
                >
                  <div
                    className={`mx-auto flex items-center justify-between ${
                      isMobile ? 'px-4 py-3' : isTablet ? 'px-6 py-3.5' : 'px-8 py-4 max-w-6xl'
                    }`}
                  >
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-3">
                      {blk.logoUrl ? (
                        <img
                          src={blk.logoUrl}
                          alt={blk.brandName}
                          className="h-8 max-w-32 object-contain"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-xs shadow-md shadow-indigo-600/30">
                          {blk.brandName ? blk.brandName.charAt(0).toUpperCase() : 'N'}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <InlineEditableText
                          value={blk.brandName || 'Nama Brand'}
                          onChange={(val) => onUpdateBlock?.({ ...blk, brandName: val })}
                          disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                          as="span"
                          className="font-bold text-white text-sm tracking-tight truncate max-w-44 sm:max-w-xs"
                        />
                        {blk.tagline && (
                          <InlineEditableText
                            value={blk.tagline}
                            onChange={(val) => onUpdateBlock?.({ ...blk, tagline: val })}
                            disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                            as="span"
                            className="text-xs text-slate-400 truncate max-w-44 sm:max-w-xs hidden sm:block"
                          />
                        )}
                      </div>
                    </div>

                    {/* Desktop & Tablet Navigation Menu */}
                    {!isMobile && (
                      <nav className="flex items-center gap-6 text-xs font-medium text-slate-300">
                        {(blk.navItems || []).map((nav) => (
                          <a
                            key={nav.id}
                            href={nav.href}
                            className="hover:text-white transition hover:underline underline-offset-4"
                            onClick={(e) => {
                              if (!isLivePreview) {
                                e.preventDefault();
                              }
                            }}
                          >
                            {nav.label}
                          </a>
                        ))}
                      </nav>
                    )}

                    {/* Right Action: CTA Button on Desktop, Hamburger Button on Mobile */}
                    <div className="flex items-center gap-2">
                      {!isMobile ? (
                        <a
                          href={`https://wa.me/${blk.ctaWhatsapp}?text=Halo%20Admin%2C%20saya%20ingin%20konsultasi`}
                          target="_blank"
                          rel="noreferrer"
                          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs ${themeCls.btnPrimary}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <InlineEditableText
                            value={blk.ctaText}
                            onChange={(val) => onUpdateBlock?.({ ...blk, ctaText: val })}
                            disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                            as="span"
                          />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMobileMenuOpen(!isMobileMenuOpen);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
                          aria-label="Toggle Menu Navigasi"
                        >
                          {isMobileMenuOpen ? (
                            <X className="w-5 h-5" />
                          ) : (
                            <Menu className="w-5 h-5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Dropdown Drawer Menu */}
                  {isMobile && isMobileMenuOpen && (
                    <div className="border-t border-slate-800/80 bg-slate-950/98 px-4 py-4 space-y-3">
                      <nav className="flex flex-col space-y-1">
                        {(blk.navItems || []).map((nav) => (
                          <a
                            key={nav.id}
                            href={nav.href}
                            onClick={(e) => {
                              if (!isLivePreview) e.preventDefault();
                              setIsMobileMenuOpen(false);
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition flex items-center justify-between"
                          >
                            <span>{nav.label}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          </a>
                        ))}
                      </nav>
                      <div className="pt-2 border-t border-slate-900">
                        <a
                          href={`https://wa.me/${blk.ctaWhatsapp}?text=Halo%20Admin%2C%20saya%20ingin%20konsultasi`}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition ${themeCls.btnPrimary}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{blk.ctaText}</span>
                        </a>
                      </div>
                    </div>
                  )}
                </header>
              )}

              {/* RENDER BLOCK: HERO */}
              {blk.type === 'hero' && (
                <section
                  id="beranda"
                  className={`border-b border-slate-800/60 bg-linear-to-b from-slate-950 via-slate-900/40 to-slate-950 text-center relative overflow-hidden ${
                    isMobile ? 'px-4 py-12 space-y-5' : 'px-6 py-20 md:py-28 space-y-6'
                  }`}
                >
                  <div className="max-w-3xl mx-auto space-y-4">
                    {/* Badge */}
                    <div className="inline-block">
                      <span
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border shadow-xs inline-flex items-center gap-1.5 ${themeCls.badge}`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <InlineEditableText
                          value={blk.badge}
                          onChange={(val) => onUpdateBlock?.({ ...blk, badge: val })}
                          disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                          as="span"
                        />
                      </span>
                    </div>

                    {/* Headline */}
                    <InlineEditableText
                      value={blk.headline}
                      onChange={(val) => onUpdateBlock?.({ ...blk, headline: val })}
                      disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                      as="h1"
                      multiline
                      className={`font-black tracking-tight text-white leading-tight ${
                        isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'
                      }`}
                    />

                    {/* Subheadline */}
                    <InlineEditableText
                      value={blk.subheadline}
                      onChange={(val) => onUpdateBlock?.({ ...blk, subheadline: val })}
                      disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                      as="p"
                      multiline
                      className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    />

                    {/* Action Buttons */}
                    <div
                      className={`pt-3 flex items-center justify-center gap-3 ${
                        isMobile ? 'flex-col w-full' : 'flex-wrap'
                      }`}
                    >
                      <a
                        href={`https://wa.me/${blk.ctaWhatsapp}?text=Halo%20Admin%2C%20saya%20ingin%20konsultasi`}
                        target="_blank"
                        rel="noreferrer"
                        className={`font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                          isMobile ? 'w-full py-3 px-4' : 'px-6 py-3.5'
                        } ${themeCls.btnPrimary}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <InlineEditableText
                          value={blk.ctaText}
                          onChange={(val) => onUpdateBlock?.({ ...blk, ctaText: val })}
                          disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                          as="span"
                        />
                      </a>

                      <a
                        href="#programs"
                        className={`rounded-xl font-semibold text-xs border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 transition flex items-center justify-center gap-1.5 ${
                          isMobile ? 'w-full py-3 px-4' : 'px-5 py-3.5'
                        }`}
                      >
                        <InlineEditableText
                          value={blk.secondaryCtaText}
                          onChange={(val) => onUpdateBlock?.({ ...blk, secondaryCtaText: val })}
                          disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                          as="span"
                        />
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* Trust Proof */}
                    <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <InlineEditableText
                        value={blk.trustText}
                        onChange={(val) => onUpdateBlock?.({ ...blk, trustText: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="span"
                      />
                    </div>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: STATS */}
              {blk.type === 'stats' && (
                <section
                  id="stats"
                  className={`border-b border-slate-800/60 bg-slate-900/30 ${
                    isMobile ? 'px-4 py-8' : 'px-6 py-12'
                  }`}
                >
                  <div className="max-w-4xl mx-auto">
                    <div
                      className={`grid ${
                        isMobile
                          ? 'grid-cols-2 gap-3'
                          : isTablet
                          ? 'grid-cols-2 gap-4'
                          : 'grid-cols-2 md:grid-cols-4 gap-4'
                      }`}
                    >
                      {blk.items.map((stat, sIdx) => (
                        <div
                          key={sIdx}
                          className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl text-center space-y-1 hover:border-slate-700 transition"
                        >
                          <InlineEditableText
                            value={stat.value}
                            onChange={(val) => {
                              const newItems = [...blk.items];
                              newItems[sIdx] = { ...newItems[sIdx], value: val };
                              onUpdateBlock?.({ ...blk, items: newItems } as StatsBlock);
                            }}
                            disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                            as="div"
                            className={`text-xl md:text-2xl font-black ${themeCls.accent}`}
                          />
                          <InlineEditableText
                            value={stat.label}
                            onChange={(val) => {
                              const newItems = [...blk.items];
                              newItems[sIdx] = { ...newItems[sIdx], label: val };
                              onUpdateBlock?.({ ...blk, items: newItems } as StatsBlock);
                            }}
                            disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                            as="div"
                            className="text-xs font-semibold text-slate-200"
                          />
                          <InlineEditableText
                            value={stat.description}
                            onChange={(val) => {
                              const newItems = [...blk.items];
                              newItems[sIdx] = { ...newItems[sIdx], description: val };
                              onUpdateBlock?.({ ...blk, items: newItems } as StatsBlock);
                            }}
                            disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                            as="div"
                            className="text-xs text-slate-400 leading-tight"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: PROGRAMS */}
              {blk.type === 'programs' && (
                <section
                  id="programs"
                  className={`border-b border-slate-800/60 ${
                    isMobile ? 'px-4 py-10 space-y-6' : 'px-6 py-16 space-y-10'
                  }`}
                >
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                      <InlineEditableText
                        value={blk.title}
                        onChange={(val) => onUpdateBlock?.({ ...blk, title: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="h2"
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      />
                      <InlineEditableText
                        value={blk.subtitle}
                        onChange={(val) => onUpdateBlock?.({ ...blk, subtitle: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="p"
                        className="text-xs md:text-sm text-slate-400"
                      />
                    </div>

                    <div
                      className={`grid ${
                        isMobile
                          ? 'grid-cols-1 gap-4'
                          : isTablet
                          ? 'grid-cols-2 gap-4'
                          : 'grid-cols-1 md:grid-cols-3 gap-6'
                      }`}
                    >
                      {blk.items.map((prog, pIdx) => (
                        <div
                          key={pIdx}
                          className={`rounded-2xl p-6 border flex flex-col justify-between transition relative ${
                            prog.isPopular
                              ? 'bg-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                              : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                <InlineEditableText
                                  value={prog.badge}
                                  onChange={(val) => {
                                    const newItems = [...blk.items];
                                    newItems[pIdx] = { ...newItems[pIdx], badge: val };
                                    onUpdateBlock?.({ ...blk, items: newItems } as ProgramsBlock);
                                  }}
                                  disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                                  as="span"
                                />
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                <InlineEditableText
                                  value={prog.duration}
                                  onChange={(val) => {
                                    const newItems = [...blk.items];
                                    newItems[pIdx] = { ...newItems[pIdx], duration: val };
                                    onUpdateBlock?.({ ...blk, items: newItems } as ProgramsBlock);
                                  }}
                                  disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                                  as="span"
                                />
                              </span>
                            </div>

                            <InlineEditableText
                              value={prog.name}
                              onChange={(val) => {
                                const newItems = [...blk.items];
                                newItems[pIdx] = { ...newItems[pIdx], name: val };
                                onUpdateBlock?.({ ...blk, items: newItems } as ProgramsBlock);
                              }}
                              disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                              as="h3"
                              className="text-base font-bold text-white"
                            />

                            <InlineEditableText
                              value={prog.description}
                              onChange={(val) => {
                                const newItems = [...blk.items];
                                newItems[pIdx] = { ...newItems[pIdx], description: val };
                                onUpdateBlock?.({ ...blk, items: newItems } as ProgramsBlock);
                              }}
                              disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                              as="p"
                              multiline
                              className="text-xs text-slate-300 leading-relaxed"
                            />

                            <div className="space-y-2 pt-2 border-t border-slate-800">
                              {prog.features.map((feat, fIdx) => (
                                <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                  <span>{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-6">
                            <a
                              href={`https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20tanya%20detail%20mengenai%20${encodeURIComponent(
                                prog.name
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                                prog.isPopular
                                  ? themeCls.btnPrimary
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              }`}
                            >
                              <span>Daftar Program Ini</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: LEAD FORM (NATIVE CRM & WHATSAPP SYNC) */}
              {blk.type === 'lead-form' && (
                <section
                  id="daftar"
                  className={`border-b border-slate-800/60 bg-linear-to-b from-slate-950 via-slate-900/30 to-slate-950 ${
                    isMobile ? 'px-4 py-10 space-y-4' : 'px-6 py-16 space-y-6'
                  }`}
                >
                  <div className="max-w-xl mx-auto space-y-6 text-center">
                    <div className="space-y-2">
                      <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        <InlineEditableText
                          value={blk.badge}
                          onChange={(val) => onUpdateBlock?.({ ...blk, badge: val })}
                          disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                          as="span"
                        />
                      </span>
                      <InlineEditableText
                        value={blk.headline}
                        onChange={(val) => onUpdateBlock?.({ ...blk, headline: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="h2"
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      />
                      <InlineEditableText
                        value={blk.subheadline}
                        onChange={(val) => onUpdateBlock?.({ ...blk, subheadline: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="p"
                        className="text-xs md:text-sm text-slate-400"
                      />
                    </div>

                    {/* Success Notice Banner after sync */}
                    {leadSubmitResult && (
                      <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-xl text-left space-y-2 animate-in fade-in">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <CheckCircle className="w-4 h-4" />
                          <span>Sinkronisasi Nexa CRM Berhasil!</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          {leadSubmitResult.message}
                        </p>
                        <a
                          href={leadSubmitResult.waUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Lanjut ke WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <form
                      onSubmit={(e) => 
                        handleFormSubmit(
                          e, 
                          blk.whatsappDirectNumber, 
                          blk.syncToNexaCRM, 
                          blk.tenantSlug,
                          blk.metaPixelId
                        )
                      }
                      className={`bg-slate-900/90 border border-slate-800 shadow-xl text-left space-y-4 ${
                        isMobile ? 'p-4 rounded-xl' : 'p-6 rounded-2xl'
                      }`}
                    >
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nama Lengkap *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Contoh: Muhammad Pasha"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Nomor WhatsApp Aktif *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>

                      {blk.showSchoolField && (
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            {tenantType === 'LPK' ? 'Asal Sekolah / Almamater' : 'Nama Perusahaan / Domisili'}
                          </label>
                          <input
                            type="text"
                            value={formData.school}
                            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                            placeholder={tenantType === 'LPK' ? 'Contoh: SMKN 1 Surabaya' : 'Contoh: PT Sukses Mandiri'}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      )}

                      {blk.showProgramField && (
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Program yang Diminati
                          </label>
                          <select
                            value={formData.program}
                            onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">-- Pilih Program --</option>
                            <option value="Tokutei Ginou SSW Jepang">Tokutei Ginou (SSW) Jepang</option>
                            <option value="Ausbildung Jerman">Ausbildung Vokasi Jerman</option>
                            <option value="Magang Jepang Reguler">Magang Jepang Reguler</option>
                            <option value="Konsultasi Umum">Konsultasi / Tanya Syarat Dulu</option>
                          </select>
                        </div>
                      )}

                      {/* Consent Opt-In Checkbox (UU PDP Compliance) */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-300">
                          <input
                            type="checkbox"
                            required
                            defaultChecked
                            className="mt-0.5 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0 shrink-0"
                          />
                          <span>
                            Saya bersedia dihubungi oleh tim konselor resmi melalui WhatsApp sesuai kebijakan privasi.
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 disabled:opacity-50 ${themeCls.btnPrimary}`}
                      >
                        {isSubmittingLead ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Menghubungkan ke CRM...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <InlineEditableText
                              value={blk.submitButtonText}
                              onChange={(val) => onUpdateBlock?.({ ...blk, submitButtonText: val })}
                              disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                              as="span"
                            />
                          </>
                        )}
                      </button>

                      <div className="text-center pt-2 text-xs text-slate-400">
                        🔒 Data pribadi terenkripsi & tersinkronisasi otomatis via NexaMOS Evidence Engine (UU PDP).
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: TESTIMONIALS */}
              {blk.type === 'testimonials' && (
                <section
                  id="testimoni"
                  className={`border-b border-slate-800/60 ${
                    isMobile ? 'px-4 py-10 space-y-6' : 'px-6 py-16 space-y-10'
                  }`}
                >
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                      <InlineEditableText
                        value={blk.title}
                        onChange={(val) => onUpdateBlock?.({ ...blk, title: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="h2"
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      />
                      <InlineEditableText
                        value={blk.subtitle}
                        onChange={(val) => onUpdateBlock?.({ ...blk, subtitle: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="p"
                        className="text-xs md:text-sm text-slate-400"
                      />
                    </div>

                    <div
                      className={`grid ${
                        isMobile
                          ? 'grid-cols-1 gap-4'
                          : isTablet
                          ? 'grid-cols-2 gap-4'
                          : 'grid-cols-1 md:grid-cols-3 gap-6'
                      }`}
                    >
                      {blk.items.map((testi, tIdx) => (
                        <div
                          key={tIdx}
                          className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-1 text-amber-400">
                              {[...Array(testi.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                            </div>
                            <InlineEditableText
                              value={testi.content}
                              onChange={(val) => {
                                const newItems = [...blk.items];
                                newItems[tIdx] = { ...newItems[tIdx], content: val };
                                onUpdateBlock?.({ ...blk, items: newItems } as TestimonialsBlock);
                              }}
                              disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                              as="p"
                              multiline
                              className="text-xs text-slate-300 leading-relaxed italic"
                            />
                          </div>

                          <div className="pt-3 border-t border-slate-800">
                            <InlineEditableText
                              value={testi.name}
                              onChange={(val) => {
                                const newItems = [...blk.items];
                                newItems[tIdx] = { ...newItems[tIdx], name: val };
                                onUpdateBlock?.({ ...blk, items: newItems } as TestimonialsBlock);
                              }}
                              disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                              as="div"
                              className="text-xs font-bold text-white"
                            />
                            <InlineEditableText
                              value={testi.role}
                              onChange={(val) => {
                                const newItems = [...blk.items];
                                newItems[tIdx] = { ...newItems[tIdx], role: val };
                                onUpdateBlock?.({ ...blk, items: newItems } as TestimonialsBlock);
                              }}
                              disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                              as="div"
                              className="text-xs text-slate-400"
                            />
                            <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <InlineEditableText
                                value={testi.placement}
                                onChange={(val) => {
                                  const newItems = [...blk.items];
                                  newItems[tIdx] = { ...newItems[tIdx], placement: val };
                                  onUpdateBlock?.({ ...blk, items: newItems } as TestimonialsBlock);
                                }}
                                disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                                as="span"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: FAQ */}
              {blk.type === 'faq' && (
                <section
                  id="faq"
                  className={`border-b border-slate-800/60 bg-slate-900/20 ${
                    isMobile ? 'px-4 py-10 space-y-6' : 'px-6 py-16 space-y-8'
                  }`}
                >
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                      <InlineEditableText
                        value={blk.title}
                        onChange={(val) => onUpdateBlock?.({ ...blk, title: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="h2"
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      />
                      <InlineEditableText
                        value={blk.subtitle}
                        onChange={(val) => onUpdateBlock?.({ ...blk, subtitle: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="p"
                        className="text-xs md:text-sm text-slate-400"
                      />
                    </div>

                    <div className="space-y-2.5">
                      {blk.items.map((faq, fIdx) => {
                        const isOpen = openFaqIndex === fIdx;
                        return (
                          <div
                            key={fIdx}
                            className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition"
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                              className="w-full p-3.5 md:p-4 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                            >
                              <InlineEditableText
                                value={faq.question}
                                onChange={(val) => {
                                  const newItems = [...blk.items];
                                  newItems[fIdx] = { ...newItems[fIdx], question: val };
                                  onUpdateBlock?.({ ...blk, items: newItems } as FaqBlock);
                                }}
                                disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                                as="span"
                              />
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${
                                  isOpen ? 'rotate-180 text-indigo-400' : ''
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-3.5 md:px-4 pb-3.5 md:pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                                <InlineEditableText
                                  value={faq.answer}
                                  onChange={(val) => {
                                    const newItems = [...blk.items];
                                    newItems[fIdx] = { ...newItems[fIdx], answer: val };
                                    onUpdateBlock?.({ ...blk, items: newItems } as FaqBlock);
                                  }}
                                  disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                                  as="div"
                                  multiline
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: CTA BANNER */}
              {blk.type === 'cta-banner' && (
                <section
                  id="cta"
                  className={`border-b border-slate-800/60 bg-linear-to-r from-indigo-950 via-slate-900 to-violet-950 text-center ${
                    isMobile ? 'px-4 py-10 space-y-4' : 'px-6 py-16 space-y-5'
                  }`}
                >
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      <InlineEditableText
                        value={blk.badge}
                        onChange={(val) => onUpdateBlock?.({ ...blk, badge: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="span"
                      />
                    </span>
                    <InlineEditableText
                      value={blk.headline}
                      onChange={(val) => onUpdateBlock?.({ ...blk, headline: val })}
                      disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                      as="h2"
                      multiline
                      className={`font-extrabold text-white leading-tight ${
                        isMobile ? 'text-xl' : 'text-2xl md:text-4xl'
                      }`}
                    />
                    <InlineEditableText
                      value={blk.subheadline}
                      onChange={(val) => onUpdateBlock?.({ ...blk, subheadline: val })}
                      disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                      as="p"
                      multiline
                      className="text-xs md:text-sm text-slate-300"
                    />
                    <div className="pt-2">
                      <a
                        href={`https://wa.me/${blk.whatsappNumber}?text=Halo%20Admin,%20saya%20mau%20konsultasi%20sekarang`}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold text-sm shadow-xl transition active:scale-95 ${
                          isMobile ? 'w-full py-3.5' : 'px-8 py-3.5'
                        } ${themeCls.btnPrimary}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <InlineEditableText
                          value={blk.buttonText}
                          onChange={(val) => onUpdateBlock?.({ ...blk, buttonText: val })}
                          disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                          as="span"
                        />
                      </a>
                    </div>
                  </div>
                </section>
              )}

              {/* RENDER BLOCK: FOOTER */}
              {blk.type === 'footer' && (
                <footer
                  id="kontak"
                  className={`bg-slate-950 border-t border-slate-800 text-xs text-slate-400 ${
                    isMobile ? 'px-4 py-8' : 'px-6 py-12'
                  }`}
                >
                  <div
                    className={`max-w-4xl mx-auto flex gap-6 ${
                      isMobile
                        ? 'flex-col items-center text-center space-y-4'
                        : 'flex-col md:flex-row items-center justify-between text-center md:text-left'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <InlineEditableText
                        value={blk.brandName}
                        onChange={(val) => onUpdateBlock?.({ ...blk, brandName: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="div"
                        className="font-bold text-base text-white"
                      />
                      <InlineEditableText
                        value={blk.tagline}
                        onChange={(val) => onUpdateBlock?.({ ...blk, tagline: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="p"
                        className="max-w-sm text-slate-400 text-xs"
                      />
                      <InlineEditableText
                        value={blk.address}
                        onChange={(val) => onUpdateBlock?.({ ...blk, address: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="p"
                        className="text-xs text-slate-400"
                      />
                    </div>

                    <div
                      className={`space-y-2.5 ${
                        isMobile ? 'flex flex-col items-center w-full' : 'text-center md:text-right'
                      }`}
                    >
                      <a
                        href={`https://wa.me/${blk.whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 transition text-xs ${
                          isMobile ? 'w-full max-w-xs justify-center' : ''
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Hubungi via WhatsApp</span>
                      </a>
                      <InlineEditableText
                        value={blk.copyrightText}
                        onChange={(val) => onUpdateBlock?.({ ...blk, copyrightText: val })}
                        disabled={isEditingDisabled} onAuthRequired={inlineAuthCallback}
                        as="div"
                        className="text-xs text-slate-400"
                      />
                    </div>
                  </div>
                </footer>
              )}
            </div>
          );
        })}

        {/* Mobile Device Bottom Bar Mockup */}
        {isMobile && (
          <div className="bg-slate-950 py-2.5 flex justify-center border-t border-slate-900 select-none">
            <div className="w-28 h-1 bg-slate-700/70 rounded-full" />
          </div>
        )}
      </div>
    </main>
  );
};
