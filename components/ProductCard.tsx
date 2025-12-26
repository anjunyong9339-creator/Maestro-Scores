
import React, { useState, useRef, useEffect } from 'react';
import { Product, FileType } from '../types';
import { Plus, Play, Pause, FileText, Music2, Share2, Facebook, Twitter, Link, MessageCircle, Check, Star, StarHalf, Volume2, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const getTypeIcon = () => {
    switch(product.type) {
      case FileType.PDF: return <FileText size={16} />;
      case FileType.MIDI: return <Music2 size={16} />;
      default: return <div className="flex gap-1"><FileText size={12} /><Music2 size={12} /></div>;
    }
  };

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={14} className="fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} size={14} className="fill-amber-400 text-amber-400" />);
      } else {
        stars.push(<Star key={i} size={14} className="text-stone-300" />);
      }
    }
    return stars;
  };

  const shareUrl = window.location.href;
  const shareText = `Check out this amazing score: ${product.title} by Maestro!`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'kakao':
        url = `https://sharer.kakao.com/talk/friends/picker/link?app_key=YOUR_KEY&short_url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div 
        className="relative aspect-[3/4] overflow-hidden bg-stone-100 cursor-pointer"
        onClick={() => onViewDetail(product)}
      >
        <img 
          src={product.coverImage} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Playback Controls Overlay */}
        {product.previewAudioUrl && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
            <button 
              onClick={toggleAudio}
              className={`p-5 rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-2xl ${isPlaying ? 'bg-amber-600 text-white' : 'bg-white/90 text-stone-900 hover:bg-white'}`}
              aria-label={isPlaying ? "Pause Preview" : "Play Preview"}
            >
              {isPlaying ? <Pause fill="currentColor" size={28} /> : <Play fill="currentColor" size={28} className="ml-1" />}
            </button>
            <span className="text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Volume2 size={12} />
              Audio Preview
            </span>
            
            {isPlaying && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                <div className="h-full bg-amber-500 animate-[progress_linear_infinite]" style={{ animationDuration: '30s' }}></div>
              </div>
            )}
          </div>
        )}

        {/* Share Button Overlay */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsShareOpen(!isShareOpen); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${isShareOpen ? 'bg-amber-600 text-white' : 'bg-white/80 text-stone-700 hover:bg-white'}`}
          >
            <Share2 size={18} />
          </button>
          
          {isShareOpen && (
            <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
              <button 
                onClick={() => handleShare('facebook')}
                className="p-2 bg-white/90 rounded-full text-blue-600 hover:bg-white shadow-sm transition-transform hover:scale-110"
                title="Share on Facebook"
              >
                <Facebook size={16} />
              </button>
              <button 
                onClick={() => handleShare('twitter')}
                className="p-2 bg-white/90 rounded-full text-sky-400 hover:bg-white shadow-sm transition-transform hover:scale-110"
                title="Share on Twitter"
              >
                <Twitter size={16} />
              </button>
              <button 
                onClick={() => handleShare('kakao')}
                className="p-2 bg-[#FEE500] rounded-full text-[#3C1E1E] hover:opacity-90 shadow-sm transition-transform hover:scale-110"
                title="Share on KakaoTalk"
              >
                <MessageCircle size={16} />
              </button>
              <button 
                onClick={copyLink}
                className="p-2 bg-white/90 rounded-full text-stone-600 hover:bg-white shadow-sm transition-transform hover:scale-110 relative"
                title="Copy Link"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Link size={16} />}
                {copied && (
                  <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="absolute bottom-3 left-3 flex gap-2 z-10">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
            {getTypeIcon()}
            {product.type}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <h3 
          className="serif text-xl font-bold mb-2 cursor-pointer group-hover:text-amber-800 transition-colors"
          onClick={() => onViewDetail(product)}
        >
          {product.title}
        </h3>
        
        <div className="relative mb-4">
          <div 
            className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96' : 'max-h-[2.5rem]'}`}
          >
            <p className={`text-stone-500 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {product.description}
            </p>
          </div>
          
          {product.description.length > 40 && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="mt-1.5 text-amber-700 hover:text-amber-900 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors group/btn"
            >
              <span className="group-hover/btn:underline decoration-amber-700/30 underline-offset-2">
                {isExpanded ? 'Close details' : 'View full details'}
              </span>
              {isExpanded ? (
                <ChevronUp size={10} className="transition-transform group-hover/btn:-translate-y-0.5" />
              ) : (
                <ChevronDown size={10} className="transition-transform group-hover/btn:translate-y-0.5" />
              )}
            </button>
          )}

          {/* Subtle fade effect when collapsed */}
          {!isExpanded && product.description.length > 40 && (
            <div className="absolute bottom-6 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none opacity-50" />
          )}
        </div>

        {/* Rating Section - Push to bottom to align grids */}
        <div className="flex items-center gap-2 mb-4 mt-auto pt-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs font-bold text-stone-700">{product.rating?.toFixed(1)}</span>
          <span className="text-[10px] text-stone-400 font-medium">({product.reviewsCount} reviews)</span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-lg font-semibold text-stone-900">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2.5 rounded-lg hover:bg-stone-800 active:scale-95 transition-all text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Plus size={16} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
