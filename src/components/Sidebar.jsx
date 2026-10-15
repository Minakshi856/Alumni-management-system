import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Briefcase, 
  Megaphone, 
  FileSpreadsheet, 
  Database,
  ArrowUpRight
} from 'lucide-react';

export const AdminSidebar = () => {
  const links = [
    { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/alumni', label: 'Manage Alumni', icon: Users },
    { to: '/admin/events', label: 'College Events', icon: Calendar },
    { to: '/admin/jobs', label: 'Job Opportunities', icon: Briefcase },
    { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-slate-100 bg-slate-50/60">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Admin Control Center
        </span>
        <p className="text-sm font-extrabold text-slate-800 mt-0.5">College Administration</p>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Database / System Status Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700">System Connected</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            PostgreSQL & REST API active
          </p>
          <a
            href="/api/health"
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            Check API Health <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </aside>
  );
};
