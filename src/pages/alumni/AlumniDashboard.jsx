import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  User, 
  MapPin, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Megaphone,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { StatCard } from '../../components/StatCard';
import { Badge, DepartmentBadge } from '../../components/Badge';

export const AlumniDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [totalAlumni, setTotalAlumni] = useState(0);
  const [loading, setLoading] = useState(true);

  const profile = user?.profile || {};

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [eventsRes, jobsRes, annRes, alumniRes] = await Promise.all([
          api.get('/events'),
          api.get('/jobs'),
          api.get('/announcements'),
          api.get('/alumni')
        ]);

        if (eventsRes.data?.data) setEvents(eventsRes.data.data.slice(0, 3));
        if (jobsRes.data?.data) setJobs(jobsRes.data.data.slice(0, 3));
        if (annRes.data?.data) setAnnouncements(annRes.data.data.slice(0, 2));
        if (alumniRes.data?.data) setTotalAlumni(alumniRes.data.data.length);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleToggleRsvp = async (eventId) => {
    try {
      const res = await api.post(`/events/${eventId}/rsvp`);
      if (res.data?.success) {
        setEvents(events.map(e => {
          if (e.id === eventId) {
            const isAttending = res.data.is_attending;
            return {
              ...e,
              is_attending: isAttending,
              attendee_count: isAttending ? (e.attendee_count + 1) : Math.max(0, e.attendee_count - 1)
            };
          }
          return e;
        }));
      }
    } catch (err) {
      alert('Could not update RSVP status');
    }
  };

  const myRsvpsCount = events.filter(e => e.is_attending).length;

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Alumni Member Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.full_name || user.fullName || 'Alumnus'}!
            </h1>
            <p className="text-sm text-blue-100 max-w-xl">
              {profile.department ? `${profile.department} • Batch of ${profile.graduation_year}` : 'Stay connected with your alma mater, mentor students, and discover career milestones.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/profile"
              className="px-4 py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition-colors shadow-sm"
            >
              Update Profile
            </Link>
            <Link
              to="/directory"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
            >
              Find Batchmates
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Alumni Network"
          value={totalAlumni}
          subtitle="Registered graduates"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="My Event RSVPs"
          value={myRsvpsCount}
          subtitle="Events confirmed"
          icon={Calendar}
          color="emerald"
        />
        <StatCard
          title="Available Careers"
          value={jobs.length}
          subtitle="Opportunities posted"
          icon={Briefcase}
          color="purple"
        />
      </div>

      {/* Main Grid: Upcoming Events & Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Events Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Upcoming College Events</h3>
                <p className="text-xs text-slate-500">Reunions, workshops, and leadership webinars</p>
              </div>
              <Link to="/events" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" size="sm">{event.event_type}</Badge>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(event.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {event.event_time}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {event.location}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleRsvp(event.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs whitespace-nowrap ${
                      event.is_attending
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {event.is_attending ? '✓ Attending' : 'RSVP Now'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Jobs Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Career & Job Referrals</h3>
                <p className="text-xs text-slate-500">Opportunities shared directly by alumni recruiters</p>
              </div>
              <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="primary" size="sm">{job.job_type}</Badge>
                      <span className="text-xs font-semibold text-emerald-600">{job.salary_range || 'Competitive'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {job.company} • {job.location}
                    </p>
                  </div>

                  <Link
                    to="/jobs"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs whitespace-nowrap"
                  >
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Announcements Notice */}
      {announcements.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">
              College Notices & Updates
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-white p-4 rounded-xl border border-amber-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {ann.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{ann.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
