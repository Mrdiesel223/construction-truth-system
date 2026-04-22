'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  ClipboardCheck, 
  Clock, 
  MapPin, 
  Activity,
  ArrowUpRight,
  Bell,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeWorkers: 12,
    tasksInProgress: 8,
    todayAttendance: 24,
    pendingVerifications: 5,
  });

  useEffect(() => {
    // fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Real-time construction intelligence overview</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-slate-600">Live System Tracking</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={Users} 
          label="Active Workers" 
          value={stats.activeWorkers.toString()} 
          trend="+2 since 8 AM" 
          color="blue" 
        />
        <StatCard 
          icon={ClipboardCheck} 
          label="Tasks In Progress" 
          value={stats.tasksInProgress.toString()} 
          trend="4 completed today" 
          color="green" 
        />
        <StatCard 
          icon={Clock} 
          label="Attendance Today" 
          value={stats.todayAttendance.toString()} 
          trend="92% of workforce" 
          color="orange" 
        />
        <StatCard 
          icon={Activity} 
          label="Pending Proofs" 
          value={stats.pendingVerifications.toString()} 
          trend="Verification required" 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
          <div className="p-6 border-b border-red-50 flex justify-between items-center bg-red-50/30">
            <h2 className="font-bold text-red-900 flex items-center gap-2">
              <Bell className="text-red-600 w-5 h-5 animate-bounce" />
              Critical Truth Violations
            </h2>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">LIVE</span>
          </div>
          <div className="divide-y divide-slate-50">
            <AlertItem 
              user="Mike Ross" 
              type="GEOFENCE_BREACH" 
              message="Left Site Boundary (450m away)" 
              time="2m ago" 
              severity="HIGH"
            />
            <AlertItem 
              user="Sarah Chen" 
              type="OVERDUE_TASK" 
              message="Task 'Slab Curing' delayed by 45m" 
              time="15m ago" 
              severity="MEDIUM"
            />
          </div>
          <div className="p-4 bg-slate-50 text-center">
            <button className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">View All Intelligence Alerts</button>
          </div>
        </div>

        {/* Recent Activity / Proof of Truth */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="text-blue-600 w-5 h-5" />
              Recent Work Proofs
            </h2>
            <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-50 flex-1">
            <ActivityItem 
              worker="John Doe" 
              task="Curing - Pillar A" 
              time="10:30 AM" 
              status="Awaiting Verification" 
              hasImage={true}
            />
            <ActivityItem 
              worker="Mike Ross" 
              task="Shuttering - Slab 2" 
              time="09:15 AM" 
              status="Verified" 
              hasImage={true}
            />
            <ActivityItem 
              worker="Sarah Chen" 
              task="Site Cleaning" 
              time="08:45 AM" 
              status="Verified" 
              hasImage={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-200 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
      </div>
      <h3 className="text-slate-500 font-medium text-sm">{label}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      <p className="text-xs text-slate-400 mt-2">{trend}</p>
    </div>
  );
}

function ActivityItem({ worker, task, time, status, hasImage }: any) {
  return (
    <div className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
          {worker[0]}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{worker}</h4>
          <p className="text-xs text-slate-500">{task} • {time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {hasImage && <div className="w-8 h-8 bg-blue-50 rounded border border-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">IMG</div>}
        <span className={cn(
          "text-[10px] uppercase font-bold px-2 py-1 rounded",
          status === 'Verified' ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
        )}>
          {status}
        </span>
      </div>
    </div>
  );
}

function AlertItem({ user, type, message, time, severity }: any) {
  return (
    <div className="p-4 hover:bg-red-50/20 transition-colors flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          severity === 'HIGH' ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"
        )}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-sm">{user}</h4>
          <p className="text-xs text-red-600 font-medium">{message}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-slate-400 uppercase">{time}</p>
        <button className="text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1">RESOLVE</button>
      </div>
    </div>
  );
}
