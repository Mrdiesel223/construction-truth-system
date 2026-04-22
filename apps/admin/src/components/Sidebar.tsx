'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Map as MapIcon, 
  History, 
  Settings, 
  LogOut,
  HardHat,
  ShieldCheck,
  Globe,
  FileText,
  Scan
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Globe, label: 'Project Sites', href: '/sites' },
  { icon: Scan, label: 'Zone Intelligence', href: '/zones' },
  { icon: ClipboardList, label: 'Task Management', href: '/tasks' },
  { icon: ShieldCheck, label: 'Evidence Vault', href: '/proofs' },
  { icon: FileText, label: 'Intelligence Reports', href: '/reports' },
  { icon: Users, label: 'Workforce', href: '/workers' },
  { icon: MapIcon, label: 'Live Map', href: '/map' },
  { icon: History, label: 'Activity Logs', href: '/logs' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <HardHat className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-white text-xl tracking-tight">Truth System</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
