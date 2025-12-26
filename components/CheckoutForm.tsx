
import React, { useState } from 'react';
import { CreditCard, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface CheckoutFormProps {
  total: number;
  onSuccess: (email: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ total, onSuccess, onCancel }) => {
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(email);
    }, 2500);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="serif text-2xl font-bold">Secure Checkout</h2>
        <button onClick={onCancel} className="text-stone-400 hover:text-stone-600">Cancel</button>
      </div>

      <div className="mb-8 p-4 bg-stone-50 rounded-xl border border-stone-100">
        <div className="flex justify-between items-center text-sm font-medium text-stone-600 mb-1">
          <span>Amount due</span>
          <span>Order total</span>
        </div>
        <div className="text-3xl font-bold text-stone-900">
          ${total.toFixed(2)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              required
              type="email" 
              placeholder="composer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all"
            />
          </div>
          <p className="text-[10px] text-stone-400 mt-1">This email will be used for your watermarked PDF.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Card Details</label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              disabled
              type="text" 
              placeholder="4242 4242 4242 4242"
              className="w-full pl-10 pr-4 py-3 bg-stone-100 border border-stone-200 rounded-xl cursor-not-allowed outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <span className="text-xs text-stone-400">01/26</span>
              <span className="text-xs text-stone-400">123</span>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isProcessing}
          className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-stone-900/20"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing Payment...
            </>
          ) : (
            <>
              Pay ${total.toFixed(2)}
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-center gap-2 text-stone-400 text-xs font-medium uppercase tracking-widest">
        <Lock size={12} />
        Encrypted by Stripe
      </div>
    </div>
  );
};

export default CheckoutForm;
