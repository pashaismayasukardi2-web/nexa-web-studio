'use client';

/**
 * tracking.ts
 * Mesin Pelacak UTM, Injeksi Meta CAPI Pixel, & Sinkronisasi CRM Otomatis NexaMOS
 */

export interface UtmParameters {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  fbclid: string;
  gclid: string;
  referrer: string;
}

const STORAGE_KEY = 'nexamos_utm_params';

/**
 * Tangkap parameter UTM dari URL saat ini dan simpan di sessionStorage
 */
export function captureUtmParameters(): UtmParameters {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: '',
      fbclid: '',
      gclid: '',
      referrer: '',
    };
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const existingRaw = sessionStorage.getItem(STORAGE_KEY);
    const existing: Partial<UtmParameters> = existingRaw ? JSON.parse(existingRaw) : {};

    const utm_source = urlParams.get('utm_source') || existing.utm_source || (document.referrer.includes('instagram.com') ? 'instagram' : document.referrer.includes('facebook.com') ? 'facebook' : document.referrer.includes('tiktok.com') ? 'tiktok' : document.referrer.includes('google.com') ? 'google' : 'landing_page');
    const utm_medium = urlParams.get('utm_medium') || existing.utm_medium || (urlParams.get('fbclid') ? 'cpc' : 'organic');
    const utm_campaign = urlParams.get('utm_campaign') || existing.utm_campaign || 'web_studio_funnel';
    const utm_term = urlParams.get('utm_term') || existing.utm_term || '';
    const utm_content = urlParams.get('utm_content') || existing.utm_content || '';
    const fbclid = urlParams.get('fbclid') || existing.fbclid || '';
    const gclid = urlParams.get('gclid') || existing.gclid || '';
    const referrer = document.referrer || existing.referrer || '';

    const captured: UtmParameters = {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      fbclid,
      gclid,
      referrer,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(captured));
    return captured;
  } catch {
    return {
      utm_source: 'landing_page',
      utm_medium: 'organic',
      utm_campaign: 'web_studio_funnel',
      utm_term: '',
      utm_content: '',
      fbclid: '',
      gclid: '',
      referrer: '',
    };
  }
}

/**
 * Inisialisasi Meta Pixel di browser jika Pixel ID tersedia
 */
export function initMetaPixel(pixelId?: string): void {
  if (typeof window === 'undefined' || !pixelId || !pixelId.trim()) return;

  const cleanPixelId = pixelId.trim();

  // Guard agar tidak inject ganda
  const win = window as any;
  if (win.fbq) return;

  try {
    (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        if (n.callMethod) {
          n.callMethod.apply(n, arguments);
        } else {
          n.queue.push(arguments);
        }
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    win.fbq('init', cleanPixelId);
    win.fbq('track', 'PageView');
  } catch (err) {
    console.warn('[Tracking] Meta Pixel Init failed:', err);
  }
}

/**
 * Kirim event ke Meta Pixel (client-side)
 */
export function trackPixelLead(leadData?: { name?: string; phone?: string; program?: string; school?: string }, pixelId?: string): void {
  if (typeof window === 'undefined') return;

  const win = window as any;
  if (win.fbq) {
    try {
      win.fbq('track', 'Lead', {
        content_name: leadData?.program || 'Pendaftaran Konsultasi',
        content_category: leadData?.school || 'Umum',
        status: 'Submitted',
        value: 1,
        currency: 'IDR',
      });
    } catch (err) {
      console.warn('[Tracking] Meta Pixel Track failed:', err);
    }
  }
}

/**
 * Sinkronisasi Lead ke CRM NexaOS via Public Webhook
 */
export interface LeadSubmissionPayload {
  name: string;
  phone: string;
  school?: string;
  program?: string;
  email?: string;
  tenantSlug?: string;
  customApiUrl?: string;
}

export async function syncLeadToNexaCRM(payload: LeadSubmissionPayload): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const utms = captureUtmParameters();
    const tenantSlug = payload.tenantSlug || 'crm-demo';
    const baseUrl = payload.customApiUrl || 'https://crm.nexamos.cloud/api/public';
    const endpoint = `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(tenantSlug)}/register`;

    const body = {
      nama_lengkap: payload.name.trim(),
      no_wa: payload.phone.trim(),
      email: payload.email?.trim() || null,
      asal_sekolah: payload.school?.trim() || null,
      nama_program: payload.program?.trim() || null,
      kebutuhan_layanan: payload.program?.trim() || null,
      source_channel: utms.utm_source || 'landing_page',
      source_detail: `${utms.utm_campaign} | ${utms.utm_medium}`,
      consent_wa: true,
      opt_in_wa: 'Ya',
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: json.message || 'Gagal menyimpan ke CRM, namun pesan WhatsApp tetap siap dikirim.',
      };
    }

    return {
      success: true,
      message: 'Lead berhasil disinkronkan ke Nexa CRM.',
      data: json.data,
    };
  } catch (err: any) {
    console.warn('[Tracking] Nexa CRM sync warning:', err.message);
    return {
      success: false,
      message: err.message || 'Koneksi ke CRM offline, melanjutkan ke WhatsApp.',
    };
  }
}

