import React, { useState, useRef } from 'react';
import { 
  Camera, Image as ImageIcon, Plus, Trash2, Star, Link2, 
  UploadCloud, AlertCircle, CheckCircle2, Video
} from 'lucide-react';
import { compressImageToWebp } from '../utils/imageCompressor';

interface HomestayGalleryUploaderProps {
  coverImage?: string;
  galleryImages?: string[];
  videoUrl?: string;
  onChange: (coverImage: string, galleryImages: string[], videoUrl?: string) => void;
  maxGalleryImages?: number;
}

export const HomestayGalleryUploader: React.FC<HomestayGalleryUploaderProps> = ({
  coverImage = '',
  galleryImages = [],
  videoUrl = '',
  onChange,
  maxGalleryImages = 12
}) => {
  const [activeCover, setActiveCover] = useState<string>(coverImage);
  const [gallery, setGallery] = useState<string[]>(galleryImages);
  const [video, setVideo] = useState<string>(videoUrl);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerChange = (newCover: string, newGallery: string[], newVideo: string) => {
    setActiveCover(newCover);
    setGallery(newGallery);
    setVideo(newVideo);
    onChange(newCover, newGallery, newVideo);
  };

  const processFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
      if (validFiles.length === 0) {
        setErrorMsg('Please select valid image files (JPG, PNG, WebP, etc.)');
        setIsProcessing(false);
        return;
      }

      const compressedBase64s: string[] = [];
      for (const file of validFiles) {
        try {
          const result = await compressImageToWebp(file, 1600, 0.82);
          const compressed = result.dataUrl;
          if (false) console.log({
            maxWidth: 1600,
            maxHeight: 1200,
            quality: 0.82
          });
          compressedBase64s.push(compressed);
        } catch (err) {
          console.error('Error compressing image:', err);
        }
      }

      let newCover = activeCover;
      let newGallery = [...gallery];

      if (!newCover && compressedBase64s.length > 0) {
        newCover = compressedBase64s[0];
        compressedBase64s.shift();
      }

      newGallery = [...newGallery, ...compressedBase64s].slice(0, maxGalleryImages);
      triggerChange(newCover, newGallery, video);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process images');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const cleanUrl = urlInput.trim();
    let newCover = activeCover;
    let newGallery = [...gallery];

    if (!newCover) {
      newCover = cleanUrl;
    } else {
      if (newGallery.length < maxGalleryImages) {
        newGallery.push(cleanUrl);
      } else {
        setErrorMsg(`Maximum ${maxGalleryImages} gallery images reached.`);
        return;
      }
    }
    triggerChange(newCover, newGallery, video);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const setAsCover = (imgUrl: string, indexInGallery: number) => {
    const oldCover = activeCover;
    const newGallery = [...gallery];
    newGallery.splice(indexInGallery, 1);
    if (oldCover) {
      newGallery.unshift(oldCover);
    }
    triggerChange(imgUrl, newGallery, video);
  };

  const removeCover = () => {
    if (gallery.length > 0) {
      const nextCover = gallery[0];
      const nextGallery = gallery.slice(1);
      triggerChange(nextCover, nextGallery, video);
    } else {
      triggerChange('', [], video);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = gallery.filter((_, i) => i !== index);
    triggerChange(activeCover, newGallery, video);
  };

  const totalPhotos = (activeCover ? 1 : 0) + gallery.length;

  return (
    <div className="space-y-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-emerald-400" />
          <h4 className="text-sm font-semibold text-stone-200">
            Handpicked Stay Gallery ({totalPhotos} Photos)
          </h4>
        </div>
        <span className="text-xs text-stone-400 bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">
          Max {maxGalleryImages + 1} photos
        </span>
      </div>

      {errorMsg && (
        <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
          isDragOver
            ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
            : 'border-stone-700 bg-stone-950/50 hover:border-emerald-500/50 hover:bg-stone-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-stone-200">
            {isProcessing ? 'Optimizing & Compressing to WebP...' : 'Click to upload multiple photos or drag and drop'}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Select room, balcony, mountain view, exterior & dining photos (JPEG, PNG, WebP)
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center space-x-1.5 text-xs text-stone-300 hover:text-emerald-400 bg-stone-800/80 hover:bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700 transition"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{showUrlInput ? 'Hide URL Input' : 'Add via Direct Image URL'}</span>
        </button>
      </div>

      {showUrlInput && (
        <div className="flex items-center space-x-2 bg-stone-950 p-2 rounded-xl border border-stone-800 animate-fadeIn">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or cloud image URL"
            className="flex-1 bg-transparent text-xs text-stone-200 placeholder-stone-500 px-2 py-1 outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="bg-emerald-500 hover:bg-emerald-600 text-stone-950 text-xs font-semibold px-3 py-1 rounded-lg transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Photo Grid Preview */}
      <div className="space-y-3">
        {/* Cover Photo Display */}
        {activeCover ? (
          <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/60 bg-stone-950">
            <img
              src={activeCover}
              alt="Main Homestay Cover"
              className="w-full h-44 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute top-2 left-2 bg-emerald-500 text-stone-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
              <Star className="w-3 h-3 fill-stone-950" />
              <span>MAIN COVER PHOTO</span>
            </div>
            <button
              type="button"
              onClick={removeCover}
              className="absolute top-2 right-2 bg-rose-500/80 hover:bg-rose-600 text-white p-1.5 rounded-lg shadow backdrop-blur transition opacity-90 group-hover:opacity-100"
              title="Remove Cover Photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-6 border border-stone-800 rounded-xl bg-stone-950/40 text-stone-500 text-xs">
            No cover photo selected yet. Upload photos above.
          </div>
        )}

        {/* Gallery Grid */}
        {gallery.length > 0 && (
          <div>
            <div className="text-xs font-medium text-stone-400 mb-2 flex items-center justify-between">
              <span>Additional Room & Scenic Photos ({gallery.length})</span>
              <span className="text-[11px] text-stone-500">Click ★ to set as cover</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {gallery.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden border border-stone-800 bg-stone-950 aspect-square"
                >
                  <img
                    src={img}
                    alt={`Stay photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1.5 p-1">
                    <button
                      type="button"
                      onClick={() => setAsCover(img, idx)}
                      title="Set as Main Cover"
                      className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-md transition shadow"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      title="Remove Photo"
                      className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-md transition shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video Tour Link (Optional) */}
      <div className="pt-2 border-t border-stone-800/80">
        <label className="block text-xs font-medium text-stone-400 mb-1 flex items-center space-x-1.5">
          <Video className="w-3.5 h-3.5 text-amber-400" />
          <span>Homestay Video / 360° Walkthrough Link (Optional YouTube / Cloud Video)</span>
        </label>
        <input
          type="url"
          value={video}
          onChange={(e) => {
            const val = e.target.value;
            setVideo(val);
            onChange(activeCover, gallery, val);
          }}
          placeholder="https://www.youtube.com/watch?v=... or .mp4 URL"
          className="w-full bg-stone-950 text-xs text-stone-200 placeholder-stone-600 px-3 py-2 rounded-xl border border-stone-800 focus:border-emerald-500 outline-none"
        />
      </div>
    </div>
  );
};
