# NexaMOS Web Studio 🎨

> **Official Visual Landing Page & Web Component Builder for NexaMOS Marketing Operating System.**

🌐 **Live Production:** [https://studio.nexamos.cloud](https://studio.nexamos.cloud)

---

## 🚀 Fitur Utama

- **Live Responsive Canvas**: Pratinjau langsung tampilan desktop (1024px), tablet (768px), dan mobile (384px).
- **Komponen Blok Terpadu**:
  - Header Hero Banner dengan Call-to-Action WhatsApp
  - Angka & Bukti Prestasi (Key Metrics & Proof)
  - Pilihan Program / Produk Pelatihan
  - Formulir Pendaftaran Cepat terhubung ke WhatsApp & CRM (UU PDP compliant)
  - Testimoni Siswa & Klien
  - Tanya Jawab Interaktif (FAQ)
  - Banner Ajakan Bertindak (CTA Banner)
  - Footer Resmi
- **Multi-Tenant Adaptive**: Mendukung profil tenant LPK / Vokasi dan Bisnis Umum secara dinamis.
- **Auto-Scroll Navigation**: Sinkronisasi navigasi halus saat memilih blok di sidebar editor.
- **Ekspor Mandiri**: Ekspor kode mandiri siap host (HTML + Tailwind CDN atau konfigurasi JSON).
- **Single Sign-On (SSO)**: Terintegrasi dengan Nexa ID Identity Platform (OAuth 2.0 PKCE via Keycloak).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)

---

## 💻 Pengembangan Lokal

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browsermu.

---

## 📦 Deployment

Project ini terintegrasi otomatis dengan Vercel melalui GitHub CI/CD:
- Setiap push ke branch `main` pada `pashaismayasukardi2-web/nexa-web-studio` akan memicu deployment otomatis ke `https://studio.nexamos.cloud`.

