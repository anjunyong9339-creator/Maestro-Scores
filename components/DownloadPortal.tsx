
import React, { useEffect, useState } from 'react';
import { PurchaseRecord, FileType } from '../types';
import { CheckCircle, Download, FileText, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { simulateWatermarking } from '../services/pdfService';

interface DownloadPortalProps {
  purchase: PurchaseRecord;
}

const DownloadPortal: React.FC<DownloadPortalProps> = ({ purchase }) => {
  const [status, setStatus] = useState<Record<string, 'idle' | 'processing' | 'ready'>>({});
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    // Automatically start "watermarking" for PDF items
    purchase.items.forEach(async (item) => {
      if (item.type === FileType.PDF || item.type === FileType.BUNDLE) {
        setStatus(prev => ({ ...prev, [item.id]: 'processing' }));
        const secureUrl = await simulateWatermarking(item.pdfUrl, purchase.email);
        setLinks(prev => ({ ...prev, [item.id]: secureUrl }));
        setStatus(prev => ({ ...prev, [item.id]: 'ready' }));
      } else {
        setStatus(prev => ({ ...prev, [item.id]: 'ready' }));
        setLinks(prev => ({ ...prev, [item.id]: '#' })); // Mock MIDI link
      }
    });
  }, [purchase]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="serif text-4xl font-bold mb-4">Thank you for your purchase!</h1>
        <p className="text-stone-500 max-w-lg mx-auto">
          We've sent a receipt to <span className="text-stone-900 font-semibold">{purchase.email}</span>. 
          Your unique, watermarked downloads are being prepared below.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Order ID</span>
            <div className="font-mono text-sm text-stone-600">{purchase.orderId}</div>
          </div>
          <div className="text-right">
             <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Date</span>
             <div className="text-sm text-stone-600">{new Date(purchase.timestamp).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="divide-y divide-stone-100">
          {purchase.items.map((item) => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.coverImage} className="w-full h-full object-cover" alt={item.title} />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">{item.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-semibold text-stone-500 uppercase">
                      {item.type}
                    </span>
                    {status[item.id] === 'ready' && (
                       <span className="text-[10px] flex items-center gap-1 text-green-600 font-bold uppercase tracking-tighter">
                         <Sparkles size={10} /> Watermarked for {purchase.email}
                       </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                {status[item.id] === 'processing' ? (
                  <div className="flex items-center gap-3 text-amber-600 font-medium">
                    <Loader2 className="animate-spin" size={20} />
                    Preparing Secure PDF...
                  </div>
                ) : (
                  <a 
                    href={links[item.id]} 
                    download={`${item.title.replace(/\s+/g, '_')}_Watermarked.pdf`}
                    className="flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors shadow-lg hover:shadow-stone-900/20 group"
                  >
                    <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    Download Now
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 p-6 bg-stone-900 text-white rounded-2xl flex items-start gap-4">
        <AlertCircle className="text-amber-400 shrink-0" size={24} />
        <div>
          <h4 className="font-bold mb-1">Important Security Note</h4>
          <p className="text-stone-400 text-sm leading-relaxed">
            Your unique email address has been embedded as a digital watermark throughout these files. 
            Distribution or unauthorized sharing of these files is strictly prohibited and can be traced 
            back to your account. Thank you for supporting independent composers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DownloadPortal;
