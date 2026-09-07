import React, { useState, useRef } from 'react';
import { Destination, ReelPost } from '../types';
import { 
  X, 
  UploadCloud, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Film,
  Play,
  Trash2,
  FileVideo
} from 'lucide-react';

interface PostMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostSubmitted: (post: Partial<ReelPost>) => void;
  destinations: Destination[];
}

export const PostMemoryModal: React.FC<PostMemoryModalProps> = ({
  isOpen,
  onClose,
  onPostSubmitted,
  destinations
}) => {
  const [authorName, setAuthorName] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Spiti Valley');
  const [destinationId, setDestinationId] = useState('spiti');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Real Local File Upload & Blob URL State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (file) {
      // Revoke previous blob if any
      if (previewBlobUrl && previewBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewBlobUrl);
      }
      const blobUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setPreviewBlobUrl(blobUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = () => {
    if (previewBlobUrl && previewBlobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewBlobUrl);
    }
    setSelectedFile(null);
    setPreviewBlobUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default fallback video if no custom file selected
    const videoUrl = previewBlobUrl || 'https://assets.mixkit.co/videos/preview/mixkit-flying-over-snow-capped-mountains-41566-large.mp4';
    const posterImage = 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80';

    onPostSubmitted({
      authorName: authorName || 'Himalayan Explorer',
      authorHandle: authorHandle ? (authorHandle.startsWith('@') ? authorHandle : `@${authorHandle}`) : '@mountain_nomad',
      caption,
      location,
      destinationId: destinationId as any,
      isVerifiedTraveler: true,
      posterImage,
      videoUrl,
      likes: 1,
      commentsCount: 0,
      datePosted: 'Just now',
      audioTrack: 'Original Sound • ' + (authorName || 'Explorer')
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slatehimachal-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Memory Uploaded to The Peak Feed!
            </h4>
            <p className="text-xs text-slate-500">
              Your video story is now live in the Peak Feed community stream.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-pine-700 dark:text-goldenhour-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Share Your Mountain Memory
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload your raw mountain video clip directly to the community feed.
            </p>

            {/* Direct Video File Picker & Live Browser Blob Preview */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="video/*,image/*" 
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {previewBlobUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-pine-600 bg-slate-950 p-2 space-y-2">
                <div className="relative aspect-video max-h-48 w-full rounded-xl overflow-hidden bg-black">
                  <video 
                    src={previewBlobUrl} 
                    controls 
                    playsInline 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between px-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <FileVideo className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate font-bold text-[11px]">{selectedFile?.name || 'Uploaded Video'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({Math.round(((selectedFile?.size || 0) / 1024 / 1024) * 10) / 10} MB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 transition-colors flex items-center gap-1 font-bold text-[10px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDragging 
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' 
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slatehimachal-900/60 hover:border-pine-600 dark:hover:border-goldenhour-500'
                }`}
              >
                <UploadCloud className="w-8 h-8 text-pine-600 dark:text-goldenhour-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Click or Drag & Drop Mountain Video / Reel
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Supports MP4, MOV, WebM with instant browser blob preview
                </p>
              </div>
            )}

            {/* Author details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Instagram Handle</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={authorHandle}
                  onChange={(e) => setAuthorHandle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900 font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Destination Tag */}
            <div className="text-xs">
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Tag Location Hub</label>
              <select
                value={destinationId}
                onChange={(e) => {
                  setDestinationId(e.target.value);
                  const found = destinations.find(d => d.id === e.target.value);
                  if (found) setLocation(found.name);
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900 font-bold focus:outline-none"
              >
                {destinations.map(d => (
                  <option key={d.id} value={d.id} className="dark:bg-slate-900">{d.name} ({d.hindiName})</option>
                ))}
              </select>
            </div>

            {/* Caption */}
            <div className="text-xs">
              <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Caption / Field Advice</label>
              <textarea
                rows={2}
                required
                placeholder="What was the weather like? Any secret chai stall or photography advice?"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900 font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-pine-700 hover:bg-pine-800 dark:bg-goldenhour-500 dark:hover:bg-goldenhour-600 text-white dark:text-slate-950 shadow-lg transition-all cursor-pointer"
            >
              Post Video to Community Peak Feed
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
