
import React from 'react';
import { ShoppingCart, Music, User, Search, FileText, Music2, Layers } from 'lucide-react';
import { FileType } from '../types';

interface NavbarProps {
  isLoggedIn: boolean;
  cartCount: number;
  onCartClick: () => void;
  onHomeClick: () => void;
  onProfileClick: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedType: FileType | 'ALL';
  onTypeChange: (type: FileType | 'ALL') => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isLoggedIn,
  cartCount, 
  onCartClick, 
  onHomeClick, 
  onProfileClick,
  onSignInClick,
  onSignUpClick,
  searchQuery, 
  onSearchChange,
  selectedType,
  onTypeChange
}) => {
  const filterOptions = [
    { label: 'All', value: 'ALL', icon: null },
    { label: 'PDF', value: FileType.PDF, icon: <FileText size={14} /> },
    { label: 'MIDI', value: FileType.MIDI, icon: <Music2 size={14} /> },
    { label: 'Bundle', value: FileType.BUNDLE, icon: <Layers size={14} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 pt-4 pb-3 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer group shrink-0"
          onClick={onHomeClick}
        >
          <div className="bg-stone-900 text-white p-2 rounded-lg group-hover:bg-stone-700 transition-colors">
            <Music size={24} />
          </div>
          <h1 className="serif text-2xl font-bold tracking-tight hidden sm:block">Maestro <span className="text-stone-400 font-light">Scores</span></h1>
        </div>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text"
              placeholder="Search scores, MIDI, collections..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 text-stone-600 hover:text-stone-900 transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            
            {isLoggedIn ? (
              <button 
                onClick={onProfileClick}
                className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                aria-label="My Account"
              >
                <User size={24} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onSignInClick}
                  className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 px-3 py-2 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={onSignUpClick}
                  className="bg-stone-900 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-stone-800 transition-all shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value as any)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
              selectedType === opt.value
                ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
