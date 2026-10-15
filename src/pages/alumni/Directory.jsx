import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Building, 
  MapPin, 
  GraduationCap, 
  Linkedin, 
  Github, 
  Mail, 
  Phone, 
  ExternalLink,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import api from '../../api/client';
import { Badge, DepartmentBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const Directory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [batch, setBatch] = useState('All');
  const [selectedAlumnus, setSelectedAlumnus] = useState(null);

  useEffect(() => {
    fetchAlumni();
  }, [department, batch]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = {};
      if (department !== 'All') params.department = department;
      if (batch !== 'All') params.batch = batch;
      if (search) params.search = search;

      const res = await api.get('/alumni', { params });
      if (res.data?.success) {
        setAlumni(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch alumni directory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
          <Users className="w-3.5 h-3.5" />
          <span>Global Alumni Network</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Alumni Directory & Mentorship
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
          Connect with graduates across technical domains, top tech enterprises, and international research universities.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, title, or skills (e.g. Google, React)..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Find Alumni
          </button>
        </form>

        {/* Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
          </select>

          <select
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Batches</option>
            {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(yr => (
              <option key={yr} value={yr}>Batch of {yr}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading alumni directory...
        </div>
      ) : alumni.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-xl mx-auto">
          <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Alumni Matching Criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try broadening your search or resetting the branch/batch filters.</p>
          <button
            onClick={() => {
              setSearch('');
              setDepartment('All');
              setBatch('All');
            }}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={item.full_name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-xs flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-slate-900 truncate">{item.full_name}</h3>
                      {item.is_verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" title="Verified Graduate" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-blue-600 line-clamp-1">{item.job_title || 'Graduate'}</p>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{item.current_company || 'College Alumni'}</p>
                  </div>
                </div>

                {/* Department & Batch */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <DepartmentBadge department={item.department} />
                  <Badge variant="gray" size="sm">Batch '{String(item.graduation_year).slice(-2)}</Badge>
                </div>

                {/* Bio snippet */}
                {item.bio && (
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.bio}
                  </p>
                )}

                {/* Location */}
                {item.location && (
                  <p className="mt-3 text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </p>
                )}

                {/* Skills tags */}
                {item.skills && item.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(Array.isArray(item.skills) ? item.skills : item.skills.split(',')).slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {skill.trim()}
                      </span>
                    ))}
                    {(Array.isArray(item.skills) ? item.skills.length : item.skills.split(',').length) > 3 && (
                      <span className="text-[10px] text-slate-400 font-medium self-center">
                        +{(Array.isArray(item.skills) ? item.skills.length : item.skills.split(',').length) - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {item.linkedin_url && (
                    <a
                      href={item.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {item.email && (
                    <a
                      href={`mailto:${item.email}`}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedAlumnus(item)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-blue-600 font-bold text-xs rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                >
                  View Profile
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Alumni Detail Modal */}
      <Modal
        isOpen={Boolean(selectedAlumnus)}
        onClose={() => setSelectedAlumnus(null)}
        title="Alumni Profile Details"
      >
        {selectedAlumnus && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={selectedAlumnus.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={selectedAlumnus.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-100 shadow-sm"
              />
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedAlumnus.full_name}</h3>
                <p className="text-sm font-semibold text-blue-600">{selectedAlumnus.job_title} at {selectedAlumnus.current_company || 'College Alumni'}</p>
                <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <DepartmentBadge department={selectedAlumnus.department} />
                  <Badge variant="gray" size="sm">Batch of {selectedAlumnus.graduation_year}</Badge>
                  <Badge variant="indigo" size="sm">{selectedAlumnus.degree || 'B.Tech'}</Badge>
                </div>
              </div>
            </div>

            {selectedAlumnus.bio && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">About / Bio</h4>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedAlumnus.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Location</span>
                <span className="font-semibold text-slate-800">{selectedAlumnus.location || 'Not specified'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-400 block font-medium">Email</span>
                <span className="font-semibold text-slate-800">{selectedAlumnus.email || 'Contact via LinkedIn'}</span>
              </div>
            </div>

            {selectedAlumnus.skills && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Technical Skills & Expertise</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedAlumnus.skills) ? selectedAlumnus.skills : selectedAlumnus.skills.split(',')).map((s, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-lg border border-blue-100">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              {selectedAlumnus.linkedin_url && (
                <a
                  href={selectedAlumnus.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  Connect on LinkedIn
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelectedAlumnus(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
