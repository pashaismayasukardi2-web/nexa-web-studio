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
  X
} from 'lucide-react';
import { BlockItem, DeviceView, StudioTheme, TenantType } from '../../types/builder';

interface CanvasAreaProps {
  blocks: BlockItem[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  device: DeviceView;
  isLivePreview: boolean;
  theme: StudioTheme;
  tenantType: TenantType;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  device,
  isLivePreview,
  theme,
  tenantType,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: '', phone: '', school: '', program: '' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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

  // Width container per device
  const getDeviceWidthClass = () => {
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

  const handleFormSubmit = (e: React.FormEvent, waNumber: string) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    
    // Format message
    const msg = `Halo Admin, saya ingin mendaftar konsultasi:\nNama: ${formData.name}\nWhatsApp: ${formData.phone}\nAsal Sekolah: ${formData.school || '-'}\nProgram: ${formData.program || '-'}`;
    const cleanWa = waNumber.replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(msg)}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <main ref={mainRef} className="flex-1 bg-slate-900/60 overflow-y-auto flex flex-col items-center p-4 min-h-0">
      <div
        className={`${getDeviceWidthClass()} bg-slate-950 transition-all duration-300 overflow-hidden min-h-full shrink-0 text-slate-100 relative shadow-2xl border border-slate-800/80`}
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

        {blocks.map((blk) => {
          const isSelected = !isLivePreview && blk.id === selectedBlockId;

          return (
            <div
              key={blk.id}
              ref={(el) => {
                blockRefs.current[blk.id] = el;
              }}
              onClick={() => !isLivePreview && onSelectBlock(blk.id)}
              className={`relative transition ${
                !isLivePreview ? 'cursor-pointer hover:ring-2 hover:ring-indigo-500/50' : ''
              } ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950' : ''}`}
            >
              {/* Editor Label Overlay */}
              {!isLivePreview && (
                <div className="absolute top-2 left-2 z-20 bg-slate-900/90 border border-slate-800 text-xs text-slate-400 px-2 py-0.5 rounded font-mono pointer-events-none opacity-40 hover:opacity-100 transition">
                  {blk.title || blk.type}
                </div>
              )}

              {/* RENDER BLOCK TYPES */}
              {blk.type === 'header' && (
                <header
                  id="header"
                  className={`w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md transition-all ${
                    blk.isSticky ? 'sticky top-0 z-30 shadow-md' : 'relative z-10'
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
                        <span className="font-bold text-white text-sm tracking-tight truncate max-w-44 sm:max-w-xs">
                          {blk.brandName || 'Nama Brand'}
                        </span>
                        {blk.tagline && (
                          <span className="text-xs text-slate-400 truncate max-w-44 sm:max-w-xs hidden sm:block">
                            {blk.tagline}
                          </span>
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
                          className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-sm ${themeCls.btnPrimary}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{blk.ctaText}</span>
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
                          className={`w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition ${themeCls.btnPrimary}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{blk.ctaText}</span>
                        </a>
                      </div>
                    </div>
                  )}
                </header>
              )}

              {/* RENDER BLOCK TYPES */}
              {blk.type === 'hero' && (
                <section
                  id="beranda"
                  className={`relative text-center overflow-hidden border-b border-slate-800/60 bg-linear-to-b from-slate-900/40 to-slate-950 ${
                    isMobile ? 'px-4 py-12' : isTablet ? 'px-6 py-16' : 'px-6 py-20 md:py-28'
                  }`}
                >
                  <div className="max-w-3xl mx-auto space-y-5">
                    {/* Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${themeCls.badge}`}>
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      <span>{blk.badge}</span>
                    </div>

                    {/* Headline */}
                    <h1
                      className={`font-black tracking-tight text-white leading-tight ${
                        isMobile
                          ? 'text-2xl leading-snug'
                          : isTablet
                          ? 'text-3xl leading-snug'
                          : 'text-3xl md:text-5xl'
                      }`}
                    >
                      {blk.headline}
                    </h1>

                    {/* Subheadline */}
                    <p
                      className={`text-slate-300 mx-auto leading-relaxed ${
                        isMobile ? 'text-xs' : 'text-sm md:text-base max-w-2xl'
                      }`}
                    >
                      {blk.subheadline}
                    </p>

                    {/* CTA Buttons */}
                    <div
                      className={`pt-2 flex items-center justify-center gap-3 ${
                        isMobile ? 'flex-col w-full' : 'flex-col sm:flex-row'
                      }`}
                    >
                      <a
                        href={`https://wa.me/${blk.ctaWhatsapp}?text=Halo%20Admin,%20saya%20tertarik%20dengan%20program%20pelatihan`}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${themeCls.btnPrimary}`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{blk.ctaText}</span>
                      </a>
                      <a
                        href="#programs"
                        className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition text-center"
                      >
                        {blk.secondaryCtaText}
                      </a>
                    </div>

                    {/* Trust Text */}
                    {blk.trustText && (
                      <div className="pt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{blk.trustText}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {blk.type === 'stats' && (
                <section
                  id="stats"
                  className={`border-b border-slate-800/60 bg-slate-900/20 ${
                    isMobile ? 'px-4 py-8' : 'px-6 py-12'
                  }`}
                >
                  <div
                    className={`max-w-4xl mx-auto grid text-center ${
                      isMobile
                        ? 'grid-cols-2 gap-3'
                        : isTablet
                        ? 'grid-cols-2 gap-5'
                        : 'grid-cols-2 md:grid-cols-4 gap-6'
                    }`}
                  >
                    {blk.items.map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className={`space-y-1 p-3 rounded-xl border border-slate-800/60 bg-slate-900/40`}
                      >
                        <div
                          className={`font-extrabold text-white tracking-tight ${
                            isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                          }`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs font-semibold text-indigo-400">
                          {stat.label}
                        </div>
                        <div className="text-xs text-slate-400 leading-snug">
                          {stat.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {blk.type === 'programs' && (
                <section
                  id="programs"
                  className={`border-b border-slate-800/60 ${
                    isMobile ? 'px-4 py-10 space-y-6' : 'px-6 py-16 space-y-10'
                  }`}
                >
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                      <h2
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      >
                        {blk.title}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
                        {blk.subtitle}
                      </p>
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
                          className={`rounded-2xl p-5 md:p-6 flex flex-col justify-between border bg-slate-900/60 transition ${
                            prog.isPopular
                              ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                              : 'border-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                                {prog.badge}
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {prog.duration}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-white">
                              {prog.name}
                            </h3>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              {prog.description}
                            </p>

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
                        {blk.badge}
                      </span>
                      <h2
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      >
                        {blk.headline}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-400">
                        {blk.subheadline}
                      </p>
                    </div>

                    <form
                      onSubmit={(e) => handleFormSubmit(e, blk.whatsappDirectNumber)}
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

                      <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${themeCls.btnPrimary}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{blk.submitButtonText}</span>
                      </button>

                      <div className="text-center pt-2 text-xs text-slate-400">
                        🔒 Data pribadi aman sesuai kepatuhan UU Perlindungan Data Pribadi (UU PDP).
                      </div>
                    </form>
                  </div>
                </section>
              )}

              {blk.type === 'testimonials' && (
                <section
                  id="testimoni"
                  className={`border-b border-slate-800/60 ${
                    isMobile ? 'px-4 py-10 space-y-6' : 'px-6 py-16 space-y-10'
                  }`}
                >
                  <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center space-y-2">
                      <h2
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      >
                        {blk.title}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-400">
                        {blk.subtitle}
                      </p>
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
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                              "{testi.content}"
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-800">
                            <div className="text-xs font-bold text-white">{testi.name}</div>
                            <div className="text-xs text-slate-400">{testi.role}</div>
                            <div className="text-xs text-indigo-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span>{testi.placement}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {blk.type === 'faq' && (
                <section
                  id="faq"
                  className={`border-b border-slate-800/60 bg-slate-900/20 ${
                    isMobile ? 'px-4 py-10 space-y-6' : 'px-6 py-16 space-y-8'
                  }`}
                >
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                      <h2
                        className={`font-bold text-white ${
                          isMobile ? 'text-xl' : 'text-2xl md:text-3xl'
                        }`}
                      >
                        {blk.title}
                      </h2>
                      <p className="text-xs md:text-sm text-slate-400">
                        {blk.subtitle}
                      </p>
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
                              onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                              className="w-full p-3.5 md:p-4 text-left flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white"
                            >
                              <span>{faq.question}</span>
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform ${
                                  isOpen ? 'rotate-180 text-indigo-400' : ''
                                }`}
                              />
                            </button>
                            {isOpen && (
                              <div className="px-3.5 md:px-4 pb-3.5 md:pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                                {faq.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}

              {blk.type === 'cta-banner' && (
                <section
                  id="cta"
                  className={`border-b border-slate-800/60 bg-linear-to-r from-indigo-950 via-slate-900 to-violet-950 text-center ${
                    isMobile ? 'px-4 py-10 space-y-4' : 'px-6 py-16 space-y-5'
                  }`}
                >
                  <div className="max-w-2xl mx-auto space-y-4">
                    <span className="inline-block text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      {blk.badge}
                    </span>
                    <h2
                      className={`font-extrabold text-white leading-tight ${
                        isMobile ? 'text-xl' : 'text-2xl md:text-4xl'
                      }`}
                    >
                      {blk.headline}
                    </h2>
                    <p className="text-xs md:text-sm text-slate-300">
                      {blk.subheadline}
                    </p>
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
                        <span>{blk.buttonText}</span>
                      </a>
                    </div>
                  </div>
                </section>
              )}

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
                      <div className="font-bold text-base text-white">{blk.brandName}</div>
                      <p className="max-w-sm text-slate-400 text-xs">{blk.tagline}</p>
                      <p className="text-xs text-slate-400">{blk.address}</p>
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
                      <div className="text-xs text-slate-400">
                        {blk.copyrightText}
                      </div>
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
