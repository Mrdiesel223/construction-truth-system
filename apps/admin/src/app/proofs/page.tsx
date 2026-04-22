'use client';

import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  User, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function ProofGallery() {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProofs();
  }, []);

  const fetchProofs = async () => {
    try {
      const res = await api.get('/media/all');
      setProofs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    try {
      await api.patch(`/media/${id}/verify`);
      setProofs((prev: any) => 
        prev.map((p: any) => p.id === id ? { ...p, verified: true } : p)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <ShieldCheck className="text-blue-600 w-8 h-8" />
          Evidence Verification
        </h1>
        <p className="text-slate-500 mt-1">Review and verify "Truth" uploads from site workers</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Fetching site evidence...</p>
          </div>
        ) : proofs.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border-2 border-dashed border-slate-200 py-20 text-center">
             <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-slate-300 w-8 h-8" />
             </div>
             <p className="text-slate-500 font-medium">No site proofs uploaded yet.</p>
          </div>
        ) : (
          proofs.map((proof: any) => (
            <div key={proof.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-blue-500/5 transition-all">
              {/* Image Container */}
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img 
                  src={proof.fileUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800'} 
                  alt="Proof"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                />
                <div className="absolute top-4 right-4">
                  {proof.verified ? (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED
                    </div>
                  ) : (
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      PENDING REVIEW
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg leading-tight">{proof.task?.title || 'General Visit'}</h3>
                    <p className="text-blue-600 text-sm font-medium flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {proof.task?.site || 'Main Site'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Uploaded by <strong>{proof.user?.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{format(new Date(proof.createdAt), 'PPp')}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex gap-3">
                  {!proof.verified ? (
                    <button 
                      onClick={() => handleVerify(proof.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      Verify Truth
                    </button>
                  ) : (
                    <div className="flex-1 bg-slate-50 text-slate-400 font-bold py-2.5 rounded-xl text-center text-sm border border-slate-100">
                      Already Verified
                    </div>
                  )}
                  <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all active:scale-95">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
