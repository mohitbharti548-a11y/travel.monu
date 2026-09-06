/**
 * High-performance browser-native media upload helper
 * Enables instant gallery/file uploads for images and videos with auto-preview Data URLs.
 */

export interface MediaUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  type: 'image' | 'video';
}

export const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as Data URL'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

/**
 * Compresses images if they are overly large to maintain responsive UI performance
 */
export const compressImageIfNeeded = async (file: File, maxDimension = 1920, quality = 0.85): Promise<string> => {
  const dataUrl = await readFileAsDataUrl(file);
  
  // If it's a SVG or already very small, return as is
  if (file.type === 'image/svg+xml' || file.size < 500 * 1024) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};
