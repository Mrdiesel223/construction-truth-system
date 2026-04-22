'use client';

import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Settings,
  Users,
  Navigation,
  Globe,
  Loader2,
  Trash2
} from 'lucide-react';
import api from '@/lib/api';

export default function SiteManagement() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get('/sites');
      setSites(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Globe className="text-blue-600 w-8 h-8" />
            Project Sites
          </h1>
          <p className="text-slate-500 mt-1">Define geofences and site boundaries for automatic verification</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-5 h-5" />
          Create New Site
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
            <p className="text-slate-500 font-medium">Loading project sites...</p>
          </div>
        ) : sites.length === 0 ? (
          <SitePlaceholder />
        ) : (
          sites.map((site: any) => (
            <div key={site.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <MapPin className="text-blue-600 w-6 h-6" />
                </div>
                <button className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">{site.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" />
                {site.address || 'Location defined by coordinates'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Radius</p>
                  <p className="font-bold text-slate-700">{site.radius}m</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workers</p>
                  <p className="font-bold text-slate-700">{site._count?.workers || 0}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-slate-900 text-white text-sm font-bold py-2 rounded-lg hover:bg-slate-800 transition-colors">
                  Edit Boundary
                </button>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Users className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SitePlaceholder() {
  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 opacity-60">
        <div className="w-12 h-12 bg-slate-100 rounded-xl mb-6" />
        <div className="h-6 w-3/4 bg-slate-100 rounded mb-2" />
        <div className="h-4 w-1/2 bg-slate-100 rounded mb-6" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-slate-50 rounded-xl" />
          <div className="h-12 bg-slate-50 rounded-xl" />
        </div>
      </div>
      <div className="col-span-full border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center">
        <Globe className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-400 font-medium text-lg">No project sites created yet.</p>
        <p className="text-slate-400 text-sm">Start by defining your first construction site boundary.</p>
      </div>
    </>
  );
}
