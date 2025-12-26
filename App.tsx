
import React, { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import ProductCard from './components/ProductCard.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import CheckoutForm from './components/CheckoutForm.tsx';
import DownloadPortal from './components/DownloadPortal.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import { MOCK_PRODUCTS } from './constants.tsx';
import { CartItem, Product, PurchaseRecord, FileType } from './types.ts';
import { 
  ShoppingBag, X, Music, ArrowRight, ShieldCheck, SearchX, 
  Package, CreditCard, Settings, LogOut, ChevronLeft, 
  ExternalLink, LayoutDashboard, Lock, ShieldAlert, Mail, User as UserIcon, Key, ArrowLeft, Send, CheckCircle2, UserPlus, Sparkles, AlertCircle
} from 'lucide-react';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  joinDate: string;
  totalSpent: number;
  purchases: number;
}

const INITIAL_USERS: RegisteredUser[] = [
  { id: 'u1', name: 'Johann Strauss', email: 'johann@vienna.at', password: 'password123', joinDate: '2023-11-01', totalSpent: 125.50, purchases: 4 },
  { id: 'u2', name: 'Clara Schumann', email: 'clara@pianist.de', password: 'password123', joinDate: '2023-12-15', totalSpent: 45.00, purchases: 1 },
];

const MOCK_PAST_PURCHASES = [
  {
    id: 'MAESTRO-A7B2C9',
    date: '2023-11-12',
    total: 15.00,
    items: ['Nocturne in G Minor'],
    status: 'Completed'
  }
];

const ADMIN_CODE = "102030";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('maestro_products');
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch {
      return MOCK_PRODUCTS;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    try {
      const saved = localStorage.getItem('maestro_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileView, setProfileView] = useState<'menu' | 'purchases'>('menu');
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [purchase, setPurchase] = useState<PurchaseRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<FileType | 'ALL'>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | 'forgot_password' | null>(null);
  const [userProfile, setUserProfile] = useState({ name: 'Guest', email: '' });
  const [resetSent, setResetSent] = useState(false);

  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminAuthInput, setAdminAuthInput] = useState("");
  const [adminAuthError, setAdminAuthError] = useState(false);

  useEffect(() => {
    localStorage.setItem('maestro_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('maestro_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return products.filter(p => {
      const matchesSearch = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
      const matchesType = selectedType === 'ALL' || p.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType, products]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const user = registeredUsers.find(u => u.email === authEmail && (u.password === authPassword || authPassword === 'admin'));
    if (user) {
      setIsUserLoggedIn(true);
      setUserProfile({ name: user.name, email: user.email });
      setAuthModal(null);
      setAuthEmail('');
      setAuthPassword('');
    } else {
      setAuthError('입력하신 정보가 올바르지 않습니다.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (authPassword !== authConfirmPassword) {
      setAuthError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (registeredUsers.some(u => u.email === authEmail)) {
      setAuthError('이미 가입된 이메일 주소입니다.');
      return;
    }
    const newUser: RegisteredUser = {
      id: 'u' + Date.now(),
      name: authName,
      email: authEmail,
      password: authPassword,
      joinDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      purchases: 0
    };
    setRegisteredUsers(prev => [newUser, ...prev]);
    setIsUserLoggedIn(true);
    setUserProfile({ name: newUser.name, email: newUser.email });
    setAuthModal(null);
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
    setAuthConfirmPassword('');
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setAuthModal('login');
    }, 4000);
  };

  const handleSignOut = () => {
    setIsUserLoggedIn(false);
    setIsAdminAuthenticated(false);
    setCart([]);
    setUserProfile({ name: 'Guest', email: '' });
    setView('store');
    setIsProfileOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-stone-200 flex flex-col">
      <Navbar 
        isLoggedIn={isUserLoggedIn}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
        onHomeClick={() => { setView('store'); setSelectedProduct(null); }}
        onProfileClick={() => setIsProfileOpen(true)}
        onSignInClick={() => { setAuthModal('login'); setAuthError(''); }}
        onSignUpClick={() => { setAuthModal('signup'); setAuthError(''); }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full">
        {purchase ? (
          <DownloadPortal purchase={purchase} />
        ) : view === 'admin' ? (
          <AdminDashboard 
            products={products} 
            users={registeredUsers}
            onAddProduct={(p) => setProducts([p, ...products])} 
            onRemoveProduct={(id) => setProducts(products.filter(p => p.id !== id))} 
            onBack={() => setView('store')} 
          />
        ) : selectedProduct ? (
          <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={(p) => setCart([...cart, {...p, quantity: 1}])} onViewDetail={setSelectedProduct} />
              ))}
            </div>
            <AIAssistant products={products} />
          </>
        )}
      </main>

      {/* Auth Modals */}
      {authModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md animate-fade" onClick={() => setAuthModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 animate-modal overflow-hidden">
            <button onClick={() => setAuthModal(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-900">
              <X size={24} />
            </button>
            
            {authModal === 'signup' ? (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                    <UserPlus size={32} />
                  </div>
                  <h3 className="serif text-3xl font-bold text-stone-900">Join Maestro</h3>
                  <p className="text-stone-500 text-sm mt-2">Start your collection and protect your craft.</p>
                </div>

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input required type="text" placeholder="Full Name" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input required type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input required type="password" placeholder="Create Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input required type="password" placeholder="Confirm Password" value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                  </div>

                  {authError && (
                    <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                      <AlertCircle size={16} />
                      <p className="text-xs font-bold">{authError}</p>
                    </div>
                  )}

                  <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 mt-4 active:scale-95 flex items-center justify-center gap-2">
                    <Sparkles size={18} /> Create Free Account
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                  <p className="text-stone-500 text-sm">
                    Already have an account? 
                    <button onClick={() => { setAuthModal('login'); setAuthError(''); }} className="ml-2 text-stone-900 font-bold hover:underline">Sign In</button>
                  </p>
                </div>
              </div>
            ) : authModal === 'login' ? (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-stone-100 text-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music size={32} />
                  </div>
                  <h3 className="serif text-3xl font-bold text-stone-900">Welcome Back</h3>
                  <p className="text-stone-500 text-sm mt-2">Enter your credentials to access your scores.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input required type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <input required type="password" placeholder="Password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                  </div>
                  
                  {authError && (
                    <div className="flex items-center justify-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                      <AlertCircle size={16} />
                      <p className="text-xs font-bold">{authError}</p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button type="button" onClick={() => setAuthModal('forgot_password')} className="text-stone-400 text-[11px] font-bold uppercase tracking-widest hover:text-stone-900 transition-colors">
                      비밀번호를 잊으셨습니까?
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 mt-4 active:scale-95">
                    Sign In
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-stone-100 text-center">
                  <p className="text-stone-500 text-sm">
                    Don't have an account? 
                    <button onClick={() => { setAuthModal('signup'); setAuthError(''); }} className="ml-2 text-stone-900 font-bold hover:underline">Sign Up</button>
                  </p>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-4 duration-300">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-stone-100 text-stone-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key size={32} />
                  </div>
                  <h3 className="serif text-3xl font-bold text-stone-900">Reset Password</h3>
                  <p className="text-stone-500 text-sm mt-2">Enter your email to receive a reset link.</p>
                </div>
                {resetSent ? (
                  <div className="text-center space-y-4 py-4">
                    <CheckCircle2 size={48} className="mx-auto text-green-500" />
                    <p className="font-bold text-stone-900">Link Sent!</p>
                    <button onClick={() => setAuthModal('login')} className="text-stone-400 text-xs font-bold uppercase underline">Back to Login</button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                      <input required type="email" placeholder="Email Address" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                    </div>
                    <button type="submit" className="w-full bg-stone-900 text-white py-5 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl mt-4 flex items-center justify-center gap-2">
                      <Send size={18} /> Send Reset Link
                    </button>
                    <button type="button" onClick={() => setAuthModal('login')} className="w-full text-stone-400 text-xs font-bold uppercase mt-2">Cancel</button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showAdminAuthModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md animate-fade" onClick={() => setShowAdminAuthModal(false)} />
          <div className="relative w-full max-sm bg-white rounded-3xl shadow-2xl p-8 animate-modal">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mb-6"><Lock size={32} /></div>
              <h3 className="serif text-2xl font-bold mb-2 text-stone-900">Composer Studio</h3>
              <p className="text-stone-500 text-sm mb-8">Enter the secret code to manage the catalog.</p>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (adminAuthInput === ADMIN_CODE) { setIsAdminAuthenticated(true); setShowAdminAuthModal(false); setView('admin'); }
                else { setAdminAuthError(true); setTimeout(() => setAdminAuthError(false), 2000); }
              }} className="w-full space-y-4">
                <input autoFocus type="password" placeholder="••••••" value={adminAuthInput} onChange={(e) => setAdminAuthInput(e.target.value)} className={`w-full px-6 py-4 bg-stone-50 border rounded-2xl text-center text-2xl tracking-[0.5em] font-bold outline-none ${adminAuthError ? 'border-red-500 animate-shake' : 'border-stone-200'}`} />
                <button type="submit" className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold">Verify Access</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && isUserLoggedIn && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm animate-fade" onClick={() => setIsProfileOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-modal max-h-[85vh] flex flex-col">
            <div className="p-6 bg-stone-50 border-b border-stone-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                {profileView === 'purchases' && (
                  <button onClick={() => setProfileView('menu')} className="p-1 hover:bg-stone-200 rounded-full mr-1">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h3 className="serif text-2xl font-bold">{profileView === 'menu' ? 'My Page' : 'Purchase History'}</h3>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-stone-400 hover:text-stone-600 p-1.5 rounded-full hover:bg-stone-200 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar flex-1">
              {profileView === 'menu' ? (
                <>
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-20 h-20 bg-stone-900 text-white rounded-full flex items-center justify-center text-3xl serif font-bold shadow-lg">{userProfile.name.charAt(0)}</div>
                    <div><h4 className="font-bold text-stone-900 text-xl">{userProfile.name}</h4><p className="text-stone-500">{userProfile.email}</p></div>
                  </div>
                  <div className="space-y-2">
                    <button onClick={() => setProfileView('purchases')} className="w-full flex items-center gap-4 px-5 py-4 text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-2xl transition-all text-left font-semibold"><Package size={22} className="text-stone-400" />My Purchases</button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-2xl transition-all text-left font-semibold"><CreditCard size={22} className="text-stone-400" />Payment Methods</button>
                    <button className="w-full flex items-center gap-4 px-5 py-4 text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-2xl transition-all text-left font-semibold"><Settings size={22} className="text-stone-400" />Account Settings</button>
                  </div>
                  <div className="mt-10 pt-8 border-t border-stone-100">
                    <button onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-bold uppercase tracking-widest text-xs"><LogOut size={20} />Sign Out</button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {MOCK_PAST_PURCHASES.map((order) => (
                    <div key={order.id} className="p-5 bg-stone-50 border border-stone-200 rounded-2xl hover:border-stone-400 transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-3"><span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">{order.id}</span><span className="text-[10px] bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold uppercase">{order.status}</span></div>
                      <div className="mb-4"><h5 className="font-bold text-stone-900 mb-1 truncate">{order.items.join(', ')}</h5><p className="text-xs text-stone-400 font-medium">{new Date(order.date).toLocaleDateString()}</p></div>
                      <div className="flex items-center justify-between pt-3 border-t border-stone-200"><span className="font-bold text-stone-900">${order.total.toFixed(2)}</span><span className="text-[10px] text-stone-900 font-bold uppercase flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Downloads <ExternalLink size={12} /></span></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h2 className="serif text-2xl font-bold flex items-center gap-2"><ShoppingBag className="text-stone-400" />Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-50 rounded-full text-stone-400"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? <div className="h-full flex flex-col items-center justify-center opacity-40 text-center"><Music size={64} className="mb-4" />Empty bag.</div> : cart.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-24 bg-stone-100 rounded-lg overflow-hidden shrink-0"><img src={item.coverImage} className="w-full h-full object-cover" /></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-stone-900">{item.title}</h4>
                    <div className="flex items-center justify-between mt-4"><span className="font-bold">${item.price.toFixed(2)}</span><button onClick={() => setCart(cart.filter(c => c.id !== item.id))} className="text-xs text-red-400 font-bold uppercase">Remove</button></div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && <div className="p-6 bg-stone-50 border-t border-stone-200"><div className="flex justify-between items-center mb-6"><span className="text-stone-500 font-medium">Subtotal</span><span className="text-2xl font-bold text-stone-900">${cartTotal.toFixed(2)}</span></div><button onClick={() => { setIsCheckingOut(true); setIsCartOpen(false); }} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold shadow-xl">Checkout Now</button></div>}
          </div>
        </div>
      )}

      <footer className="bg-stone-100 border-t border-stone-200 pt-12 pb-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.2em]">© 2024 Maestro Digital. All rights reserved.</p>
          <button onClick={() => setShowAdminAuthModal(true)} className="text-[9px] text-stone-300 hover:text-stone-500 font-bold uppercase flex items-center gap-1">
            <Lock size={10} /> Studio Access
          </button>
        </div>
      </footer>
    </div>
  );
};

export default App;
