'use client';

import { useState, useEffect } from 'react';
import { 
  Map as MapIcon, 
  User, 
  Navigation, 
  Clock,
  Loader2,
  RefreshCw,
  Search
} from 'lucide-react';
import api from '@/lib/api';

export default function LiveMap() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchLiveLocations = async () => {
    try {
      const res = await api.get('/location/live');
      setWorkers(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveLocations();
    const interval = setInterval(fetchLiveLocations, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <MapIcon className="text-blue-600 w-8 h-8" />
            Live Workforce Tracking
          </h1>
          <p className="text-slate-500 mt-1">Real-time GPS visualization of all field staff</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <button 
            onClick={fetchLiveLocations}
            className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-all active:scale-95"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar: Worker List */}
        <div className="w-80 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Find a worker..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                <p className="text-xs text-slate-400">Locating workers...</p>
              </div>
            ) : workers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No active workers found.
              </div>
            ) : (
              workers.map((worker: any) => (
                <div key={worker.id} className="p-4 hover:bg-slate-50 border-b border-slate-50 cursor-pointer group transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {worker.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate text-sm">{worker.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        {worker.locations?.[0] ? `${worker.locations[0].lat.toFixed(4)}, ${worker.locations[0].lng.toFixed(4)}` : 'Offline'}
                      </p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50 animate-pulse" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main: Map View Placeholder */}
        <div className="flex-1 bg-slate-900 rounded-2xl relative overflow-hidden group border border-slate-800 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.google.com/maps/vt/pb=!1m4!1m3!1i12!2i4!3i5!2m3!1e0!2sm!3i420120488!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i4111425')] opacity-40 grayscale contrast-125" />
          
          {/* Overlay Grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none opacity-20">
             {Array.from({ length: 144 }).map((_, i) => (
               <div key={i} className="border-[0.5px] border-slate-700" />
             ))}
          </div>

          {/* Simulated Map Markers */}
          {workers.map((worker: any, i) => worker.locations?.[0] && (
            <div 
              key={worker.id}
              className="absolute transition-all duration-1000"
              style={{ 
                top: `${20 + (i * 15)}%`, 
                left: `${30 + (i * 20)}%` 
              }}
            >
              <div className="relative flex flex-col items-center group/marker cursor-pointer">
                <div className="bg-white text-[10px] font-bold px-2 py-1 rounded-md shadow-xl border border-slate-200 mb-2 opacity-0 group-hover/marker:opacity-100 transition-opacity translate-y-2 group-hover/marker:translate-y-0">
                   {worker.name}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-25 scale-150" />
                  <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-lg relative z-10" />
                </div>
              </div>
            </div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-white hover:bg-white/20 transition-all">+</button>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-white hover:bg-white/20 transition-all">-</button>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-0">
             <MapIcon className="w-32 h-32 text-slate-800 opacity-20 mx-auto" />
             <p className="text-slate-700 font-bold tracking-widest uppercase text-xl">Tactical Map Alpha</p>
          </div>
        </div>
      </div>
    </div>
  );
}
