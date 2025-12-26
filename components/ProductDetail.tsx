
import React, { useState, useRef, useEffect } from 'react';
import { Product, FileType } from '../types';
import { ArrowLeft, Plus, Play, Pause, FileText, Music2, Layers, ShieldCheck, Star, Volume2, Share2, Info, CheckCircle2, Link, Check } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Fix: Added missing state for share functionality
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!product.previewAudioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(product.previewAudioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Fix: Added copy link functionality for the share button
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeLabel = (type: FileType) => {
    switch (type) {
      case FileType.PDF: return { label: 'Sheet Music (PDF)', icon: <FileText size={18} /> };
      case FileType.MIDI: return { label: 'MIDI File', icon: <Music2 size={18} /> };
      case FileType.BUNDLE: return { label: 'Full Bundle (PDF + MIDI)', icon: <Layers size={18} /> };
    }
  };

  const typeInfo = getTypeLabel(product.type);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-8 font-medium group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: Visuals */}
        <div className="space-y-6">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-100">
            <img 
              src={product.coverImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.previewAudioUrl && (
            <div className="bg-stone-900 text-white p-6 rounded-2xl flex items-center gap-6 shadow-xl shadow-stone-900/20">
              <button 
                onClick={toggleAudio}
                className="w-16 h-16 flex-shrink-0 bg-amber-500 rounded-full flex items-center justify-center hover:bg-amber-400 transition-all active:scale-95 text-stone-900"
              >
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Audio Preview</span>
                  <Volume2 size={16} className="text-stone-400" />
                </div>
                <div className="h-1 bg-stone-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-amber-500 ${isPlaying ? 'w-full transition-all duration-[30s] linear' : 'w-0'}`} />
                </div>
                <p className="text-[10px] mt-2 text-stone-500 uppercase tracking-tighter">Listen to the atmospheric theme of "{product.title}"</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
              {typeInfo.icon}
              {typeInfo.label}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star size={16} fill="currentColor" />
              <span className="text-sm font-bold text-stone-900">{product.rating}</span>
            </div>
          </div>

          <h1 className="serif text-4xl md:text-5xl font-bold mb-6 text-stone-900 leading-tight">
            {product.title}
          </h1>

          <p className="text-stone-600 text-lg leading-relaxed mb-8">
            {product.description}
          </p>

          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3 text-stone-700">
              <CheckCircle2 size={18} className="text-green-500" />
              <span className="text-sm font-medium">Instant Secure Digital Download</span>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <ShieldCheck size={18} className="text-amber-600" />
              <span className="text-sm font-medium">Personalized Anti-Piracy Watermarking</span>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <Info size={18} className="text-stone-400" />
              <span className="text-sm font-medium">Licensed for personal and educational use</span>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-stone-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="block text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Price</span>
                <span className="text-4xl font-bold text-stone-900">${product.price.toFixed(2)}</span>
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsShareOpen(!isShareOpen); }}
                  className="p-3 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-all"
                >
                  <Share2 size={24} />
                </button>
                {/* Fix: Added Share Menu UI */}
                {isShareOpen && (
                  <div className="absolute bottom-full right-0 mb-2 p-2 bg-white border border-stone-200 rounded-lg shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 z-50 flex gap-2">
                    <button 
                      onClick={copyLink}
                      className="p-2 hover:bg-stone-50 rounded-md text-stone-600 relative group/link"
                      title="Copy Link"
                    >
                      {copied ? <Check size={18} className="text-green-500" /> : <Link size={18} />}
                      {copied && (
                        <span className="absolute bottom-full mb-2 right-0 bg-stone-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">Copied!</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-2xl shadow-stone-900/10 active:scale-[0.98]"
            >
              <Plus size={24} />
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
