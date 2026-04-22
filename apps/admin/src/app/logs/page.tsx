'use client';

import { useState, useEffect } from 'react';
import { 
  History, 
  AlertTriangle, 
  Info, 
  Search,
  User,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function EventLogs() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/alerts'); // Using alerts endpoint for now
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await api.patch(`/alerts/${id}/resolve`);
      setEvents(prev => prev.filter((e: any) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <History className="text-blue-600 w-8 h-8" />
          Intelligence Event Logs
        </h1>
        <p className="text-slate-500 mt-1">Audit trail of system awareness and truth violations</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Filter by worker or event type..." 
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
           </div>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-20 text-center">
               <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
               <p className="text-slate-400">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
               No active intelligence alerts.
            </div>
          ) : (
            events.map((event: any) => (
              <div key={event.id} className="p-6 flex items-start justify-between group hover:bg-slate-50/50 transition-all">
                <div className="flex gap-6">
                   <div className={cn(
                     "p-3 rounded-2xl",
                     event.severity === 'CRITICAL' ? "bg-red-50 text-red-600" : 
                     event.severity === 'HIGH' ? "bg-orange-50 text-orange-600" : "bg-blue-50 text-blue-600"
                   )}>
                      <AlertTriangle className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <span className="font-black text-slate-900">{event.type.replace('_', ' ')}</span>
                         <span className={cn(
                           "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                           event.severity === 'CRITICAL' ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
                         )}>
                           {event.severity}
                         </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-4 font-medium">{event.message}</p>
                      <div className="flex items-center gap-6 text-xs text-slate-400 font-bold uppercase tracking-widest">
                         <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            {event.user?.name}
                         </span>
                         <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {format(new Date(event.createdAt), 'PPp')}
                         </span>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => handleResolve(event.id)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                >
                  RESOLVE EVENT
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
