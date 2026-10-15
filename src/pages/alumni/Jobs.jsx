import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  Search, 
  Plus, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  FileText,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const Jobs = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('All');

  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState('');

  // Post Job form
  const [postFormData, setPostFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    experience_level: 'Mid-Level',
    salary_range: '',
    description: '',
    requirements: '',
    apply_url: '',
    contact_email: ''
  });

  // Apply form
  const [applyFormData, setApplyFormData] = useState({
    applicantName: '',
    applicantPhone: '',
    resumeUrl: '',
    coverNote: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [jobTypeFilter]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (jobTypeFilter !== 'All') params.job_type = jobTypeFilter;
      if (search) params.search = search;

      const res = await api.get('/jobs', { params });
      if (res.data?.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleOpenApply = (job) => {
    if (!isAuthenticated) {
      alert('Please log in to apply for career opportunities.');
      return;
    }
    setSelectedJob(job);
    setApplyFormData({
      applicantName: user?.fullName || '',
      applicantPhone: user?.profile?.phone || '',
      resumeUrl: user?.profile?.linkedin_url || '',
      coverNote: ''
    });
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    try {
      await api.post(`/jobs/${selectedJob.id}/apply`, {
        applicant_name: applyFormData.applicantName,
        applicant_phone: applyFormData.applicantPhone,
        resume_url: applyFormData.resumeUrl,
        cover_note: applyFormData.coverNote
      });

      setIsApplyModalOpen(false);
      setToast('Application submitted successfully! The recruiter has been notified.');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to post job opportunities.');
      return;
    }

    try {
      await api.post('/jobs', postFormData);
      setIsPostModalOpen(false);
      setPostFormData({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        experience_level: 'Mid-Level',
        salary_range: '',
        description: '',
        requirements: '',
        apply_url: '',
        contact_email: ''
      });
      fetchJobs();
      setToast('Job opening posted successfully!');
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error posting job');
    }
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-200">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Alumni Referral & Career Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Career Opportunities & Referrals
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-2xl mx-auto">
          Browse jobs shared by alumni working at tier-1 technology giants, startups, and research corporations.
        </p>

        {/* Action button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                alert('Please sign in to post job referrals.');
                return;
              }
              setIsPostModalOpen(true);
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post a Job Opening / Referral
          </button>
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by job title, company (Google, AWS...), or location..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            Search
          </button>
        </form>

        {/* Job Type Pills */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {['All', 'Full-time', 'Internship', 'Remote', 'Part-time'].map((type) => (
            <button
              key={type}
              onClick={() => setJobTypeFilter(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                jobTypeFilter === type
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {type === 'All' ? 'All Roles' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading career opportunities...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-md mx-auto">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No Job Openings Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filters or check back later.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h3>
                    <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {job.company}
                    </p>
                  </div>
                  <Badge variant="primary" size="sm">{job.job_type}</Badge>
                </div>

                <div className="space-y-1.5 my-3 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location}</span>
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  <div className="text-[11px] text-slate-400 pt-1">
                    Level: <strong className="text-slate-600">{job.experience_level}</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {job.description}
                </p>

                {job.requirements && (
                  <div className="p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Key Requirements:</p>
                    <p className="text-xs text-slate-600 line-clamp-2">{job.requirements}</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                {job.apply_url ? (
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    Portal Link <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">Direct College Referral</span>
                )}

                <button
                  onClick={() => handleOpenApply(job)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors"
                >
                  Easy Apply
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Easy Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for: ${selectedJob?.title} at ${selectedJob?.company}`}
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Applicant Full Name *
            </label>
            <input
              type="text"
              required
              value={applyFormData.applicantName}
              onChange={(e) => setApplyFormData({ ...applyFormData, applicantName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              value={applyFormData.applicantPhone}
              onChange={(e) => setApplyFormData({ ...applyFormData, applicantPhone: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Resume Link or LinkedIn Profile URL *
            </label>
            <input
              type="url"
              required
              value={applyFormData.resumeUrl}
              onChange={(e) => setApplyFormData({ ...applyFormData, resumeUrl: e.target.value })}
              placeholder="https://drive.google.com/... or https://linkedin.com/in/..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Paste your shareable Google Drive, GitHub, or LinkedIn URL.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brief Note / Cover Message
            </label>
            <textarea
              rows={3}
              value={applyFormData.coverNote}
              onChange={(e) => setApplyFormData({ ...applyFormData, coverNote: e.target.value })}
              placeholder="Briefly state why you're a great fit for this opening..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Submit Application
            </button>
          </div>
        </form>
      </Modal>

      {/* Post Job Modal */}
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        title="Share Job Opening / Referral"
      >
        <form onSubmit={handlePostSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={postFormData.title}
                onChange={(e) => setPostFormData({ ...postFormData, title: e.target.value })}
                placeholder="e.g. Frontend Engineer"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={postFormData.company}
                onChange={(e) => setPostFormData({ ...postFormData, company: e.target.value })}
                placeholder="e.g. Microsoft, Google"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Type
              </label>
              <select
                value={postFormData.job_type}
                onChange={(e) => setPostFormData({ ...postFormData, job_type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Level
              </label>
              <select
                value={postFormData.experience_level}
                onChange={(e) => setPostFormData({ ...postFormData, experience_level: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Entry-Level">Entry-Level</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Fresh Graduate">Intern / Student</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Salary (Optional)
              </label>
              <input
                type="text"
                value={postFormData.salary_range}
                onChange={(e) => setPostFormData({ ...postFormData, salary_range: e.target.value })}
                placeholder="e.g. ₹20 LPA"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Location *
            </label>
            <input
              type="text"
              required
              value={postFormData.location}
              onChange={(e) => setPostFormData({ ...postFormData, location: e.target.value })}
              placeholder="e.g. Bengaluru, India or Remote"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description *
            </label>
            <textarea
              rows={3}
              required
              value={postFormData.description}
              onChange={(e) => setPostFormData({ ...postFormData, description: e.target.value })}
              placeholder="Describe the opportunity and project responsibilities..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Post Opportunity
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
