
import React, { useState, useMemo } from 'react';
import { Product, FileType } from '../types.ts';
import { 
  ArrowLeft, Plus, Trash2, Package, Tag, FileText, 
  Music2, Layers, Image as ImageIcon, Save, AlertCircle, CheckCircle2,
  Users, Search, Calendar, CreditCard, Mail, ExternalLink, Filter
} from 'lucide-react';

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  totalSpent: number;
  purchases: number;
}

interface AdminDashboardProps {
  products: Product[];
  users: RegisteredUser[];
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, users, onAddProduct, onRemoveProduct, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'users' | 'add'>('inventory');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    type: FileType.PDF,
    price: 0,
    rating: 5.0,
    reviewsCount: 0
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      ...formData as Product,
      id: 'p' + Date.now(),
      rating: 5.0,
      reviewsCount: 0
    };
    onAddProduct(newProduct);
    setActiveTab('inventory');
    setFormData({ type: FileType.PDF, price: 0 });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const filteredUsers = useMemo(() => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(u => 
      u.name.toLowerCase().includes(q) || 
      u.email.toLowerCase().includes(q)
    );
  }, [userSearchQuery, users]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors mb-2 font-medium"
          >
            <ArrowLeft size={18} />
            Back to Store
          </button>
          <h1 className="serif text-4xl font-bold">Composer Studio</h1>
          <p className="text-stone-500">Manage your catalog and client database</p>
        </div>
        
        <div className="flex gap-2 bg-stone-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-stone-900 text-white hover:bg-stone-800 ml-2`}
          >
            <Plus size={14} className="inline mr-1" /> Add
          </button>
        </div>
      </div>

      {showSuccess && (activeTab === 'inventory') && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
          <CheckCircle2 size={20} />
          Product successfully registered to the catalog.
        </div>
      )}

      {activeTab === 'add' ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-stone-100 bg-stone-50">
            <h2 className="font-bold flex items-center gap-2">
              <Package size={20} className="text-stone-400" />
              Score Registration Form
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Score Title</label>
                <input required type="text" placeholder="e.g. Moonlight Sonata Remix" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Price ($)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required type="number" step="0.01" placeholder="25.00" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-3">
                  {[FileType.PDF, FileType.MIDI, FileType.BUNDLE].map(type => (
                    <button key={type} type="button" onClick={() => setFormData({...formData, type})} className={`py-3 rounded-xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${formData.type === type ? 'bg-stone-900 text-white border-stone-900 shadow-lg' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}>
                      {type === FileType.PDF && <FileText size={18} />}
                      {type === FileType.MIDI && <Music2 size={18} />}
                      {type === FileType.BUNDLE && <Layers size={18} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Description</label>
                <textarea required rows={4} placeholder="Describe the mood, instrumentation, and difficulty..." value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input required type="url" placeholder="https://picsum.photos/..." value={formData.coverImage || ''} onChange={e => setFormData({...formData, coverImage: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">PDF / Resource URL</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input type="url" placeholder="Link to file storage (mocked)" value={formData.pdfUrl || ''} onChange={e => setFormData({...formData, pdfUrl: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 pt-6 border-t border-stone-100 flex justify-end gap-4">
              <button type="button" onClick={() => setActiveTab('inventory')} className="px-8 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-50 transition-all">Cancel</button>
              <button type="submit" className="bg-stone-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-stone-800 shadow-xl shadow-stone-900/10 flex items-center gap-2"><Save size={18} />Save Product</button>
            </div>
          </form>
        </div>
      ) : activeTab === 'users' ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 border-b border-stone-100 bg-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Users size={14} /> {filteredUsers.length} Users Found</span>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">User Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Join Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Purchases</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Total Spent</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 font-bold serif text-lg shadow-inner group-hover:bg-stone-200 transition-colors">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-stone-900">{user.name}</span>
                          <span className="text-xs text-stone-400 flex items-center gap-1"><Mail size={10} /> {user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-600 text-sm">
                        <Calendar size={14} className="text-stone-300" />
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-stone-900 font-medium">
                        <Package size={14} className="text-stone-300" />
                        {user.purchases} orders
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-900">
                      <div className="flex items-center gap-1">
                        <CreditCard size={14} className="text-stone-400" />
                        ${user.totalSpent.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[10px] font-bold uppercase tracking-widest text-stone-300 hover:text-stone-900 flex items-center gap-1 ml-auto">
                        Details <ExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-stone-300">
                <Search size={48} className="mb-4 opacity-10" />
                <p className="font-medium">No users found matching "{userSearchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Score</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Price</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-stone-400">Inventory ID</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-stone-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-stone-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-stone-100 rounded overflow-hidden shrink-0">
                          <img src={product.coverImage} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-stone-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold px-2 py-1 bg-stone-100 rounded text-stone-600">
                        {product.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-stone-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-stone-400">{product.id}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => onRemoveProduct(product.id)} className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Product">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-stone-400">
              <Package size={48} className="mb-4 opacity-10" />
              <p className="font-medium">No products registered yet.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl shadow-stone-900/10">
          <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Total Revenue</h4>
          <span className="text-3xl font-bold">$1,420.00</span>
          <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-bold">
            <Plus size={12} /> 12% from last month
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
          <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Active Customers</h4>
          <span className="text-3xl font-bold">{users.length}</span>
          <div className="mt-4 flex items-center gap-2 text-stone-400 text-xs font-bold">
            Steady growth this week
          </div>
        </div>
        <div className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm">
          <h4 className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Watermarks Generated</h4>
          <span className="text-3xl font-bold">892</span>
          <div className="mt-4 flex items-center gap-2 text-amber-600 text-xs font-bold">
            <AlertCircle size={12} /> 2 pending review
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
