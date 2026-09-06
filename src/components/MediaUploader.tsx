import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Film, X, Check, Loader2, Link as LinkIcon, Sparkles } from 'lucide-react';
import { uploadCompressedAsset } from '../utils/imageCompressor';
import { readFileAsDataUrl } from '../utils/mediaUpload';

interface MediaUploaderProps {
  label: string;
  mediaUrl: string;
  onMediaChange: (url: string) => void;
  accept?: 'image' | 'video' | 'both';
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'portrait';
  required?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  mediaUrl,
  onMediaChange,
  accept = 'image',
  helperText,
  aspectRatio = 'wide',
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [compressionSavings, setCompressionSavings] = useState<number | null>(null);

  const isVideo = mediaUrl && (
    mediaUrl.endsWith('.mp4') || 
    mediaUrl.endsWith('.webm') || 
    mediaUrl.endsWith('.mov') || 
    mediaUrl.startsWith('data:video')
  );

  const acceptMime = accept === 'image' 
    ? 'image/*' 
    : accept === 'video' 
      ? 'video/*' 
      : 'image/*,video/*';

  const handleFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);
    setCompressionSavings(null);

    try {
      if (file.type.startsWith('image/')) {
        // High-performance canvas WebP compression + Asset Upload Pipeline
        const result = await uploadCompressedAsset(file);
        if (result.success && result.url) {
          onMediaChange(result.url);
          if (typeof result.savingsPercent === 'number') {
            setCompressionSavings(result.savingsPercent);
          }
        } else {
          const fallbackDataUrl = await readFileAsDataUrl(file);
          onMediaChange(fallbackDataUrl);
        }
      } else if (file.type.startsWith('video/')) {
        const dataUrl = await readFileAsDataUrl(file);
        onMediaChange(dataUrl);
      }
    } catch (err) {
      console.error('File upload error:', err);
      alert('Could not upload selected file. Please select a standard image or video format.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onMediaChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
      setCompressionSavings(null);
    }
  };

  const aspectClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'portrait' ? 'aspect-[9/16]' :
    aspectRatio === 'video' ? 'aspect-video' : 'aspect-[16/9]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL Box' : 'Paste Link'}</span>
          </button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-2 bg-slate-900/90 rounded-xl border border-slate-700 animate-fadeIn">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMime}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview or Upload Zone */}
      {mediaUrl ? (
        <div className={`relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group ${aspectClass}`}>
          {isVideo ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              controls
              muted
              playsInline
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Media preview"
              className="w-full h-full object-cover"
            />
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 flex items-center gap-1.5 transition-all"
            >
              <Upload className="w-3.5 h-3.5 text-pine-700" />
              <span>Change Photo / Video</span>
            </button>
            <button
              type="button"
              onClick={() => { onMediaChange(''); setCompressionSavings(null); }}
              className="p-1.5 rounded-xl bg-rose-600/90 text-white font-bold text-xs shadow-lg hover:bg-rose-500 transition-all"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <div className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>Ready</span>
            </div>
            {compressionSavings !== null && compressionSavings > 0 && (
              <div className="px-2 py-0.5 rounded-md bg-pine-900/80 border border-pine-500/40 backdrop-blur-md text-[10px] text-pine-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-pine-400" />
                <span>WebP -{compressionSavings}%</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            dragOver 
              ? 'border-amber-400 bg-amber-500/10' 
              : 'border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-900'
          }`}
        >
          {isUploading ? (
            <div className="py-4 flex flex-col items-center gap-2 text-amber-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">Compressing to WebP & Uploading...</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                {accept === 'video' ? <Film className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Click to select from Camera Roll / Gallery
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {accept === 'video' ? 'Supports MP4, WebM, MOV' : 'Supports JPG, PNG, WEBP with auto-compression'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-slate-400 italic">
          {helperText}
        </p>
      )}
    </div>
  );
};
