import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Calendar, 
  ShieldCheck, 
  ArrowRight, 
  Building2, 
  TrendingUp, 
  Award, 
  ChevronRight,
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import { Badge, DepartmentBadge } from '../components/Badge';

export const Home = () => {
  const [stats, setStats] = useState({
    totalAlumni: 8,
    employmentRate: 94,
    totalEvents: 4,
    totalJobs: 5,
    topCompanies: []
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, annRes] = await Promise.all([
          api.get('/stats/public'),
          api.get('/announcements')
        ]);
        if (statsRes.data?.data) {
          setStats(statsRes.data.data);
        }
        if (annRes.data?.data) {
          setAnnouncements(annRes.data.data.slice(0, 3));
        }
      } catch (err) {
        console.warn('Could not fetch landing stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white py-20 lg:py-28">
        {/* Background glow graphics */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200 mb-6 animate-in fade-in duration-300">
            <Award className="w-4 h-4 text-amber-300" />
            <span>Official College Alumni Network Portal</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Connecting Generations of <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-indigo-200 bg-clip-text text-transparent">Excellence & Leadership</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Welcome to <span className="text-white font-semibold">AlumniConnect</span>. Reconnect with fellow graduates, explore global career opportunities, attend reunions, and mentor the next generation of engineers.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/directory"
              className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4" />
              Explore Alumni Directory
            </Link>

            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              Join the Network <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Metric Highlights Strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-white">{stats.totalAlumni}+</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium mt-1">Registered Alumni</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">{stats.employmentRate || 92}%</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium mt-1">Employment Rate</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-amber-300">{stats.totalEvents}+</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium mt-1">College Events & Meets</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-indigo-300">{stats.totalJobs}+</p>
              <p className="text-xs sm:text-sm text-blue-200 font-medium mt-1">Active Career Openings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Notice Banner */}
      {announcements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <h3 className="text-sm font-extrabold text-amber-900 uppercase tracking-wider">
                Official Campus Notices & Bulletins
              </h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-4 rounded-xl border border-amber-100 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="warning" size="sm">{ann.category}</Badge>
                      <span className="text-[11px] text-slate-400">{new Date(ann.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="primary" size="md">Empowering Alumni & Students</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Everything You Need to Stay Engaged
          </h2>
          <p className="text-slate-500 mt-2 text-base">
            From batch reunions to job referrals, AlumniConnect bridges the gap between campus memories and career achievements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 border border-blue-100">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Searchable Alumni Directory</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Find alumni across batches (2018–2025), engineering branches, global companies, and technical domains in just a few clicks.
            </p>
            <Link to="/directory" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
              Browse Directory <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 border border-emerald-100">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Events & Reunions</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Register for upcoming campus homecomings, webinars with tech leaders, alumni golf meets, and startup pitch mixers.
            </p>
            <Link to="/events" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700">
              View Events <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 border border-purple-100">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Career & Job Referrals</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Explore exclusive career opportunities shared by alumni at Google, Microsoft, Tesla, AWS, Qualcomm, and Zomato.
            </p>
            <Link to="/jobs" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700">
              Find Opportunities <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Alumni Profiles Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <Badge variant="indigo" size="md">Spotlight</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Our Distinguished Alumni
            </h2>
            <p className="text-sm text-slate-500 mt-1">Graduates making an impact across premier global organizations</p>
          </div>
          <Link
            to="/directory"
            className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
          >
            View all alumni <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Rahul Sharma',
              batch: 2021,
              dept: 'Computer Science',
              company: 'Google',
              role: 'Senior Software Engineer',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              location: 'Bengaluru, India'
            },
            {
              name: 'Priya Patel',
              batch: 2020,
              dept: 'Information Technology',
              company: 'Microsoft',
              role: 'Product Manager',
              avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
              location: 'Hyderabad, India'
            },
            {
              name: 'Vikram Singh',
              batch: 2019,
              dept: 'Mechanical Engineering',
              company: 'Tesla',
              role: 'Automation Engineer',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
              location: 'Berlin, Germany'
            },
            {
              name: 'Sneha Reddy',
              batch: 2023,
              dept: 'Computer Science',
              company: 'Amazon AWS',
              role: 'Cloud Solutions Architect',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
              location: 'Seattle, USA'
            }
          ].map((alum) => (
            <div key={alum.name} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
              <img
                src={alum.avatar}
                alt={alum.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 shadow-sm mb-3"
              />
              <h3 className="font-bold text-slate-800 text-base">{alum.name}</h3>
              <p className="text-xs font-semibold text-blue-600 mt-0.5">{alum.role}</p>
              <p className="text-xs text-slate-500 font-medium">{alum.company}</p>
              
              <div className="mt-3 flex flex-wrap gap-1 justify-center">
                <DepartmentBadge department={alum.dept} />
                <Badge variant="gray" size="sm">'{String(alum.batch).slice(-2)}</Badge>
              </div>

              <span className="text-[11px] text-slate-400 mt-3">{alum.location}</span>
            </div>
          ))}
        </div>
      </section>

      {/* College Project Evaluation Note Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-300">
              College Mini Project Evaluation
            </span>
            <h3 className="text-2xl font-bold">Ready for Viva & Demonstration</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              This system comes pre-configured with instant demo credentials for both Administrator and Alumni roles, real-time statistics, REST APIs, and database migrations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-3 rounded-xl bg-white text-blue-900 font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
            >
              Launch Demo Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-12 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 text-base">AlumniConnect</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Comprehensive full-stack Alumni Management System designed for college departments, graduates, and administration.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/directory" className="hover:text-blue-600">Alumni Directory</Link></li>
              <li><Link to="/events" className="hover:text-blue-600">Campus Events</Link></li>
              <li><Link to="/jobs" className="hover:text-blue-600">Career Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-blue-600">Admin Control Center</Link></li>
              <li><Link to="/login" className="hover:text-blue-600">Alumni Member Sign In</Link></li>
              <li><Link to="/register" className="hover:text-blue-600">New Alumni Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 text-sm mb-3">Tech Stack</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              React 18 • Vite • Tailwind CSS • Node.js • Express • Supabase PostgreSQL • JWT Auth
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} AlumniConnect. Developed for College Mini Project Demonstration.
        </div>
      </footer>

    </div>
  );
};
