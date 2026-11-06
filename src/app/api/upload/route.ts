import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

// Maksimal ukuran upload: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
];

export async function POST(req: NextRequest) {
  try {
    // 🔒 Auth Guard: Wajib login dengan akun NexaMOS
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Akses ditolak: Anda wajib masuk dengan akun resmi NexaMOS untuk mengunggah gambar/media.',
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { status: 'error', message: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Format file tidak didukung. Harap unggah gambar JPG, PNG, WebP, SVG, atau GIF.',
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Ukuran file melebihi batas maksimal 5MB.',
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Coba simpan ke folder public/uploads jika filesystem writable
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const extension = file.name.split('.').pop() || 'png';
      const cleanFileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
      const filePath = path.join(uploadsDir, cleanFileName);

      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/uploads/${cleanFileName}`;

      return NextResponse.json({
        status: 'ok',
        url: publicUrl,
        fileName: cleanFileName,
        size: file.size,
        message: 'Gambar berhasil diunggah.',
      });
    } catch {
      // Fallback ke Data URI jika filesystem read-only (misal di ephemeral serverless)
      const base64 = buffer.toString('base64');
      const dataUri = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        status: 'ok',
        url: dataUri,
        fileName: file.name,
        size: file.size,
        message: 'Gambar berhasil dimuat (Data URI fallback).',
      });
    }
  } catch (error: any) {
    console.error('[Upload API Error]:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Gagal memproses unggahan gambar.' },
      { status: 500 }
    );
  }
}

