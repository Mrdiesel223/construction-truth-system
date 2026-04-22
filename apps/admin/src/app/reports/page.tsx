'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Users,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSummary();
  }, [date]);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reports/summary?date=${date}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    window.open(`http://localhost:5000/api/reports/export`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FileText className="text-blue-600 w-8 h-8" />
            Intelligence Reports
          </h1>
          <p className="text-slate-500 mt-1">Audit-ready construction logs and daily summaries</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Download className="w-5 h-5" />
          Export All Truth Data (CSV)
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm w-fit">
         <CalendarIcon className="w-5 h-5 text-slate-400" />
         <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target Date:</span>
         <input 
          type="date" 
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="outline-none font-medium text-blue-600 bg-transparent cursor-pointer"
         />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium">Synthesizing daily data...</p>
        </div>
      ) : summary && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ReportCard 
              label="Staff Present" 
              value={summary.summary.totalAttendance} 
              icon={Users} 
              color="blue" 
            />
            <ReportCard 
              label="Tasks Verified" 
              value={summary.summary.tasksCompleted} 
              icon={CheckCircle2} 
              color="green" 
            />
            <ReportCard 
              label="Intelligence Alerts" 
              value={summary.summary.criticalAlerts} 
              icon={AlertCircle} 
              color="red" 
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
             {/* Details Table */}
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                   <h3 className="font-bold text-slate-900">Task Log Detail</h3>
                </div>
                <div className="divide-y divide-slate-50">
                   {summary.details.completedTasks.length === 0 ? (
                     <div className="p-10 text-center text-slate-400">No tasks completed on this date.</div>
                   ) : summary.details.completedTasks.map((task: any) => (
                     <div key={task.id} className="p-4 flex justify-between items-center">
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{task.title}</p>
                           <p className="text-xs text-slate-500">{task.site} • {task.assignedTo.name}</p>
                        </div>
                        <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded uppercase">Verified</span>
                     </div>
                   ))}
                </div>
             </div>

             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                   <h3 className="font-bold text-slate-900 text-red-600">Incident Log</h3>
                </div>
                <div className="divide-y divide-slate-50">
                   {summary.details.alerts.length === 0 ? (
                     <div className="p-10 text-center text-slate-400">No truth violations recorded.</div>
                   ) : summary.details.alerts.map((alert: any) => (
                     <div key={alert.id} className="p-4 flex gap-4 items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                           <p className="font-bold text-slate-900 text-sm">{alert.user.name}</p>
                           <p className="text-xs text-red-600">{alert.message}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </>
      )}
    </div>
  );
}

function ReportCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6">
      <div className={`p-4 rounded-xl ${colors[color]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
