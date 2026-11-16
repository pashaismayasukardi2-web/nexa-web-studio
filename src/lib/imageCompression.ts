/**
 * Utilitas Kompresi Gambar Otomatis untuk Nexa Web Studio
 * Mengompresi gambar client-side (mengurangi resolusi berlebih & mengoptimasi kualitas)
 * menggunakan HTML5 Canvas API agar ukuran file ringan dan loading halaman secepat kilat.
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 s/d 1.0 (default: 0.82)
  targetFormat?: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface CompressImageResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  width: number;
  height: number;
  wasCompressed: boolean;
}

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export async function compressImage(
  file: File,
  options: CompressImageOptions = {}
): Promise<CompressImageResult> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    targetFormat = 'image/webp',
  } = options;

  // Jika bukan di browser atau bukan tipe gambar, kembalikan file asli
  if (typeof window === 'undefined' || !file || !file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file?.size || 0,
      compressedSize: file?.size || 0,
      savedPercentage: 0,
      width: 0,
      height: 0,
      wasCompressed: false,
    };
  }

  // SVG dan GIF dipertahankan agar tidak merusak vector / animasi frame
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savedPercentage: 0,
      width: 0,
      height: 0,
      wasCompressed: false,
    };
  }

  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      let targetWidth = originalWidth;
      let targetHeight = originalHeight;

      // Hitung dimensi proporsional jika melampaui batas maksimal
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = targetWidth / targetHeight;
        if (targetWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = Math.round(targetWidth / ratio);
        }
        if (targetHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = Math.round(targetHeight * ratio);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          savedPercentage: 0,
          width: originalWidth,
          height: originalHeight,
          wasCompressed: false,
        });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Cek apakah browser mendukung WebP encoding
      let outputMime = targetFormat;
      try {
        const testData = canvas.toDataURL('image/webp');
        if (!testData.startsWith('data:image/webp')) {
          outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        }
      } catch {
        outputMime = 'image/jpeg';
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              file,
              originalSize: file.size,
              compressedSize: file.size,
              savedPercentage: 0,
              width: originalWidth,
              height: originalHeight,
              wasCompressed: false,
            });
            return;
          }

          // Jika ukuran hasil kompresi malah lebih besar (misal gambar sangat kecil) dan dimensi sama, pakai file asli
          if (blob.size >= file.size && targetWidth === originalWidth && targetHeight === originalHeight) {
            resolve({
              file,
              originalSize: file.size,
              compressedSize: file.size,
              savedPercentage: 0,
              width: originalWidth,
              height: originalHeight,
              wasCompressed: false,
            });
            return;
          }

          const ext = outputMime === 'image/webp' ? '.webp' : outputMime === 'image/jpeg' ? '.jpg' : '.png';
          const newFileName = file.name.replace(/\.[^/.]+$/, '') + ext;
          const compressedFile = new File([blob], newFileName, {
            type: blob.type || outputMime,
            lastModified: Date.now(),
          });

          const savedPercentage = Math.max(
            0,
            Math.round(((file.size - compressedFile.size) / file.size) * 100)
          );

          resolve({
            file: compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            savedPercentage,
            width: targetWidth,
            height: targetHeight,
            wasCompressed: true,
          });
        },
        outputMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        savedPercentage: 0,
        width: 0,
        height: 0,
        wasCompressed: false,
      });
    };

    img.src = objectUrl;
  });
}
