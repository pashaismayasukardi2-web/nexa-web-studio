import { PageConfig } from '../types/builder';

export const initialPageConfig: PageConfig = {
  id: 'page_default_lpk',
  title: 'LPK Cakrawala Global - Resmi Penyaluran Kerja Jepang & Jerman',
  tenantName: 'LPK Cakrawala Global',
  tenantType: 'LPK',
  theme: 'indigo',
  metaDescription: 'Program Pelatihan Kerja Terpadu & Penyaluran Resmi ke Jepang dan Jerman. Garansi Pembinaan Bahasa, Skill & Mental Bersertifikat.',
  blocks: [
    {
      id: 'blk_hero_1',
      type: 'hero',
      title: 'Header Hero Banner',
      badge: 'Pendaftaran Angkatan 2027 Dibuka',
      headline: 'Raih Karir Profesional & Masa Depan di Luar Negeri Bersama Lembaga Resmi',
      subheadline: 'Pembekalan intensif bahasa Jepang/Jerman, pelatihan vokasi terstandar industri, dan pendampingan visa kerja hingga penempatan kerja sah.',
      ctaText: 'Daftar Konsultasi Karir Sekarang',
      ctaWhatsapp: '6281234567890',
      secondaryCtaText: 'Lihat Pilihan Program',
      trustText: 'Terakreditasi Kemenaker RI • 1.200+ Alumni Ditempatkan',
    },
    {
      id: 'blk_stats_1',
      type: 'stats',
      title: 'Angka & Bukti Prestasi',
      items: [
        { label: 'Tingkat Kelulusan Visa', value: '98.4%', description: 'Dokumen & wawancara lolos tanpa kendala' },
        { label: 'Alumni Bekerja Aktif', value: '1.250+', description: 'Tersebar di Tokyo, Osaka, & Frankfurt' },
        { label: 'Rata-Rata Gaji Awal', value: 'Rp 22-38 Jt', description: 'Standar upah minimum resmi negara tujuan' },
        { label: 'Perusahaan Mitra Resmi', value: '85+', description: 'Kumiai & Asosiasi Industri terverifikasi' },
      ],
    },
    {
      id: 'blk_programs_1',
      type: 'programs',
      title: 'Pilihan Program Pelatihan',
      subtitle: 'Pilih jalur karir yang sesuai dengan minat dan kualifikasi pendidikan Anda',
      items: [
        {
          name: 'Program Tokutei Ginou (SSW) Jepang',
          duration: '4 - 6 Bulan Intensif',
          badge: 'Paling Populer',
          description: 'Jalur Pekerja Berketerampilan Khusus bidang Manufaktur, Kaigo (Perawat Lansia), Pengolahan Makanan, dan Pertanian.',
          price: 'Biaya Terbimbing',
          features: [
            'Bahasa Jepang N4 & JFT-Basic A2',
            'Sertifikasi Skill Ujian Resmi',
            'Asrama & Pengajar Native Speaker',
            'Matching Interview Langsung dengan User Jepang'
          ],
          isPopular: true
        },
        {
          name: 'Program Ausbildung Jerman',
          duration: '6 - 9 Bulan Persiapan',
          badge: 'Pendidikan Vokasi & Gaji',
          description: 'Program kuliah vokasi resmi gratis di Jerman sambil bekerja dengan gaji bulanan selama masa pelatihan industri.',
          price: 'Biaya Terbimbing',
          features: [
            'Bahasa Jerman Intensif hingga Level B1/B2',
            'Penyusunan Kontrak Kerja & Sekolah Vokasi (Berufsschule)',
            'Pendampingan Visa Kedutaan Besar Jerman',
            'Uang Saku Bulanan €1.000 - €1.300 selama sekolah'
          ],
          isPopular: false
        },
        {
          name: 'Program Magang Reguler (Ginou Jisshusei)',
          duration: '3 - 4 Bulan Persiapan',
          badge: 'Jalur Mandiri Cepat',
          description: 'Program magang industri resmi 3 tahun di berbagai prefektur Jepang dengan jaminan asuransi ketenagakerjaan penuh.',
          price: 'Biaya Terbimbing',
          features: [
            'Bahasa Jepang Dasar & Etika Kerja (Hou-Ren-So)',
            'Fisik, Mental, dan Kedisiplinan (FMD)',
            'Kontrak Kerja Resmi & Tiket Pesawat Ditanggung',
            'Bimbingan Modal Usaha Pasca Kembali ke Indonesia'
          ],
          isPopular: false
        }
      ]
    },
    {
      id: 'blk_leadform_1',
      type: 'lead-form',
      title: 'Formulir Pendaftaran & Konsultasi',
      badge: 'Konsultasi Gratis 1-on-1',
      headline: 'Mulai Langkah Pertama Anda Hari Ini',
      subheadline: 'Isi data singkat berikut untuk menerima panduan lengkap syarat dokumen, rincian biaya, dan jadwal tes seleksi terdekat.',
      submitButtonText: 'Kirim & Dapatkan Konsultasi via WhatsApp',
      whatsappDirectNumber: '6281234567890',
      showSchoolField: true,
      showProgramField: true,
      successMessage: 'Terima kasih! Konselor resmi kami akan segera menghubungi nomor WhatsApp Anda dalam waktu 1x24 jam.'
    },
    {
      id: 'blk_testimonials_1',
      type: 'testimonials',
      title: 'Cerita Sukses Alumni Kami',
      subtitle: 'Mereka telah membuktikan komitmen dan dedikasi belajar bersama kami',
      items: [
        {
          name: 'Rian Pratama',
          role: 'Alumni Angkatan 18 - Manufaktur Otomotif',
          content: 'Bimbingan sensei di LPK sangat sabar dari yang awalnya nol bahasa Jepang sampai bisa lolos N4 dalam 4 bulan. Sekarang sudah 2 tahun di Nagoya.',
          placement: 'Toyota City, Aichi - Jepang',
          rating: 5
        },
        {
          name: 'Siti Nurhaliza',
          role: 'Alumni Angkatan 21 - Caregiver (Kaigo)',
          content: 'Fasilitas asrama sangat mendukung dan latihannya terstruktur. Wawancara langsung diterima oleh panti lansia di Fukuoka dengan fasilitas apartemen sangat layak.',
          placement: 'Fukuoka - Jepang',
          rating: 5
        },
        {
          name: 'Budi Santoso',
          role: 'Alumni Ausbildung Gastronomi Jerman',
          content: 'Proses pencarian sekolah dan kontrak di Jerman transparan tanpa pungutan liar aneh-aneh. Sekarang saya kuliah gratis sambil dapat uang saku tiap bulan.',
          placement: 'Hamburg - Jerman',
          rating: 5
        }
      ]
    },
    {
      id: 'blk_faq_1',
      type: 'faq',
      title: 'Pertanyaan yang Sering Diajukan',
      subtitle: 'Jawaban lengkap mengenai proses, syarat, dan sistem pembiayaan',
      items: [
        {
          question: 'Apakah pemula yang belum pernah belajar bahasa asing bisa mendaftar?',
          answer: 'Sangat bisa! Metode pengajaran kami dirancang khusus dari level dasar (nol) dengan kurikulum intensif dan bimbingan guru berpengalaman serta native speaker.'
        },
        {
          question: 'Bagaimana jika belum memiliki biaya pendaftaran penuh?',
          answer: 'Kami menyediakan program talangan pembiayaan resmi melalui mitra perbankan berizin OJK, sehingga calon siswa dapat belajar terlebih dahulu dan pelunasan dapat diangsur setelah bekerja di negara tujuan.'
        },
        {
          question: 'Berapa lama rata-rata waktu tunggu hingga keberangkatan?',
          answer: 'Untuk program SSW Jepang rata-rata 5-8 bulan sejak awal belajar hingga turun Certificate of Eligibility (COE) dan visa kerja. Untuk Jerman sekitar 8-10 bulan.'
        },
        {
          question: 'Apakah ada batasan usia dan ijazah minimal?',
          answer: 'Syarat minimal usia adalah 18 tahun dengan ijazah minimal SMA/SMK sederajat untuk program Jepang, dan minimal SMA/SMK untuk Ausbildung Jerman.'
        }
      ]
    },
    {
      id: 'blk_cta_1',
      type: 'cta-banner',
      title: 'Banner Ajakan Bertindak',
      badge: 'Kuota Kelas Terbatas per Gelombang',
      headline: 'Wujudkan Impian Berkarir di Luar Negeri Sekarang',
      subheadline: 'Dapatkan sesi penilaian profil (FNAR) gratis bersama konselor karir bersertifikat kami langsung lewat WhatsApp.',
      buttonText: 'Konsultasi WhatsApp Sekarang',
      whatsappNumber: '6281234567890'
    },
    {
      id: 'blk_footer_1',
      type: 'footer',
      title: 'Bagian Footer',
      brandName: 'LPK Cakrawala Global',
      tagline: 'Lembaga Pelatihan Kerja & Penempatan Tenaga Kerja Luar Negeri Terverifikasi Resmi.',
      address: 'Jl. Raya Pendidikan No. 45, Jakarta Selatan 12340',
      whatsappNumber: '6281234567890',
      copyrightText: '© 2026 LPK Cakrawala Global. Powered by NexaMOS Web Studio.'
    }
  ]
};

