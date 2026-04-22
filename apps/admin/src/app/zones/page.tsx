'use client';

import { useState, useEffect } from 'react';
import { 
  Scan, 
  Plus, 
  MapPin, 
  Camera, 
  Navigation,
  Globe,
  Loader2,
  Settings2
} from 'lucide-react';
import api from '@/lib/api';

export default function ZoneManagement() {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (selectedSiteId) fetchZones(selectedSiteId);
  }, [selectedSiteId]);

  const fetchSites = async () => {
    const res = await api.get('/sites');
    setSites(res.data);
    if (res.data.length > 0) setSelectedSiteId(res.data[0].id.toString());
  };

  const fetchZones = async (siteId: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/zones/${siteId}`);
      setZones(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Scan className="text-blue-600 w-8 h-8" />
            Zone Intelligence
          </h1>
          <p className="text-slate-500 mt-1">Define internal site areas and AI-camera monitoring points</p>
        </div>
        <div className="flex gap-4">
           <select 
             value={selectedSiteId}
             onChange={(e) => setSelectedSiteId(e.target.value)}
             className="px-4 py-2 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 bg-white shadow-sm"
           >
             {sites.map((site: any) => (
               <option key={site.id} value={site.id}>{site.name}</option>
             ))}
           </select>
           <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
             <Plus className="w-5 h-5" />
             Add Zone
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
             <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
             <p className="text-slate-400">Scanning site zones...</p>
          </div>
        ) : zones.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
             <Scan className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-medium">No intelligence zones defined for this site.</p>
          </div>
        ) : zones.map((zone: any) => (
          <div key={zone.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 transition-all group relative overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                   <Navigation className="text-slate-400 group-hover:text-blue-600 w-6 h-6" />
                </div>
                {zone.cameraId && (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold">
                    <Camera className="w-3 h-3" />
                    AI ACTIVE
                  </div>
                )}
             </div>

             <h3 className="text-lg font-black text-slate-900 mb-1">{zone.name}</h3>
             <p className="text-xs text-slate-400 mb-6 uppercase tracking-widest font-bold">Boundary: {zone.radius}m Radius</p>

             <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-500 font-medium">GPS Precision</span>
                   <span className="text-slate-900 font-bold">High (3m)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                   <span className="text-slate-500 font-medium">Camera ID</span>
                   <span className="text-slate-900 font-mono font-bold text-xs">{zone.cameraId || 'Not Linked'}</span>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-slate-50 flex gap-2">
                <button className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-black transition-all">
                  Configure AI
                </button>
                <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-600">
                  <Settings2 className="w-5 h-5" />
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
