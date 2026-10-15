import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  PlusCircle, 
  Download, 
  Megaphone,
  Building,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import { StatCard } from '../../components/StatCard';
import { DepartmentChart, BatchChart, TopCompaniesList } from '../../components/Charts';
import { Badge } from '../../components/Badge';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stats/dashboard');
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/alumni');
      const list = res.data?.data || [];
      if (list.length === 0) return alert('No alumni records to export');

      const headers = ['Full Name', 'Email', 'Department', 'Batch', 'Company', 'Job Title', 'Location', 'Status'];
      const rows = list.map(a => [
        `"${a.full_name || ''}"`,
        `"${a.email || ''}"`,
        `"${a.department || ''}"`,
        `"${a.graduation_year || ''}"`,
        `"${a.current_company || ''}"`,
        `"${a.job_title || ''}"`,
        `"${a.location || ''}"`,
        `"${a.status || ''}"`
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `alumni_database_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('Failed to export CSV: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-slate-500">Loading admin analytics...</p>
        </div>
      </div>
    );
  }

  const summary = stats?.summary || {};

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">College Admin Dashboard</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Overview & Alumni Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management for college alumni records, placement statistics, and events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/alumni"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Alumni
          </Link>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-600" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Metrics StatCards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Alumni"
          value={summary.totalAlumni || 0}
          subtitle={`${summary.verifiedAlumni || 0} verified accounts`}
          icon={Users}
          color="blue"
          trend="+12% YoY"
        />
        <StatCard
          title="Employment Rate"
          value={`${summary.employmentRate || 0}%`}
          subtitle={`${summary.employedAlumni || 0} working graduates`}
          icon={TrendingUp}
          color="emerald"
          trend="High"
        />
        <StatCard
          title="College Events"
          value={summary.totalEvents || 0}
          subtitle="Reunions & Webinars"
          icon={Calendar}
          color="purple"
        />
        <StatCard
          title="Career Opportunities"
          value={summary.totalJobs || 0}
          subtitle="Active job referrals"
          icon={Briefcase}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Department-wise Alumni Distribution</h3>
                <p className="text-xs text-slate-500">Graduates registered across engineering branches</p>
              </div>
              <Badge variant="indigo" size="sm">Branch Breakdown</Badge>
            </div>
            <DepartmentChart data={stats?.departmentStats || []} />
          </div>
        </div>

        {/* Graduation Batch Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Graduation Batch Trends</h3>
                <p className="text-xs text-slate-500">Alumni representation by graduation year</p>
              </div>
              <Badge variant="primary" size="sm">Batches</Badge>
            </div>
            <BatchChart data={stats?.batchStats || []} />
          </div>
        </div>

      </div>

      {/* Bottom Grid: Top Companies & Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top Companies */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Top Hiring Companies</h3>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-xs text-slate-500 mb-4">Organizations employing college alumni</p>
          <TopCompaniesList companies={stats?.topCompanies || []} />
        </div>

        {/* Recent Activity Audit Trail */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent System Activities</h3>
              <p className="text-xs text-slate-500">Audit trail of admin and alumni operations</p>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100">
            {(stats?.recentActivities || []).map((act) => (
              <div key={act.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                    {act.user_name ? act.user_name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {act.user_name}{' '}
                      <span className="font-normal text-slate-600">{act.action}</span>
                    </p>
                    <p className="text-[11px] font-medium text-blue-600 line-clamp-1">{act.target}</p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
