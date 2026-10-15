import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Download, 
  Building, 
  GraduationCap, 
  Mail, 
  Phone, 
  MapPin,
  ExternalLink
} from 'lucide-react';
import api from '../../api/client';
import { Badge, DepartmentBadge, StatusBadge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

export const ManageAlumni = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: 'Computer Science',
    graduationYear: 2023,
    degree: 'B.Tech',
    currentCompany: '',
    jobTitle: '',
    location: '',
    phone: '',
    linkedinUrl: '',
    skills: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchAlumni();
  }, [departmentFilter, batchFilter, statusFilter]);

  const fetchAlumni = async () => {
    try {
      setLoading(true);
      const params = {};
      if (departmentFilter !== 'All') params.department = departmentFilter;
      if (batchFilter !== 'All') params.batch = batchFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/alumni', { params });
      if (res.data?.success) {
        setAlumni(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching alumni:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleOpenAddModal = () => {
    setFormData({
      fullName: '',
      email: '',
      department: 'Computer Science',
      graduationYear: 2024,
      degree: 'B.Tech',
      currentCompany: '',
      jobTitle: '',
      location: '',
      phone: '',
      linkedinUrl: '',
      skills: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setSelectedAlumni(item);
    setFormData({
      fullName: item.full_name || '',
      email: item.email || '',
      department: item.department || 'Computer Science',
      graduationYear: item.graduation_year || 2023,
      degree: item.degree || 'B.Tech',
      currentCompany: item.current_company || '',
      jobTitle: item.job_title || '',
      location: item.location || '',
      phone: item.phone || '',
      linkedinUrl: item.linkedin_url || '',
      skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || ''),
      status: item.status || 'Active'
    });
    setIsEditModalOpen(true);
  };

  const handleSaveAlumni = async (e) => {
    e.preventDefault();
    try {
      if (isEditModalOpen && selectedAlumni) {
        await api.put(`/alumni/${selectedAlumni.id}`, {
          full_name: formData.fullName,
          department: formData.department,
          graduation_year: formData.graduationYear,
          degree: formData.degree,
          current_company: formData.currentCompany,
          job_title: formData.jobTitle,
          location: formData.location,
          phone: formData.phone,
          linkedin_url: formData.linkedinUrl,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
          status: formData.status
        });
        setIsEditModalOpen(false);
      } else {
        await api.post('/alumni', formData);
        setIsAddModalOpen(false);
      }
      fetchAlumni();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving alumni record');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete alumni record for "${name}"?`)) {
      try {
        await api.delete(`/alumni/${id}`);
        fetchAlumni();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete alumni');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.patch(`/alumni/${id}/status`, { status: newStatus });
      fetchAlumni();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleExportCSV = () => {
    if (alumni.length === 0) return alert('No records to export');
    const headers = ['Full Name', 'Email', 'Department', 'Graduation Year', 'Company', 'Job Title', 'Location', 'Phone', 'Status'];
    const rows = alumni.map(a => [
      `"${a.full_name || ''}"`,
      `"${a.email || ''}"`,
      `"${a.department || ''}"`,
      `"${a.graduation_year || ''}"`,
      `"${a.current_company || ''}"`,
      `"${a.job_title || ''}"`,
      `"${a.location || ''}"`,
      `"${a.phone || ''}"`,
      `"${a.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `alumni_directory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Alumni Directory Records</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Manage College Alumni</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, verify, update, and manage all alumni profiles in the college system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Alumni
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, job title, skills..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">Electronics & Comm</option>
            <option value="Mechanical Engineering">Mechanical</option>
            <option value="Civil Engineering">Civil</option>
            <option value="Electrical & Electronics">Electrical</option>
          </select>

          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Batches</option>
            {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(yr => (
              <option key={yr} value={yr}>Batch of {yr}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>

          <span className="ml-auto text-slate-400 font-medium">
            Showing <strong className="text-slate-700">{alumni.length}</strong> records
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading alumni records...
          </div>
        ) : alumni.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="font-bold text-slate-700">No alumni records found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Alumnus Name & Email</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">Batch</th>
                  <th className="px-6 py-3.5">Employment</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alumni.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={item.full_name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{item.full_name}</p>
                          <p className="text-xs text-slate-500">{item.email || 'No email specified'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <DepartmentBadge department={item.department} />
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700 text-xs bg-slate-100 px-2.5 py-1 rounded-md">
                        {item.graduation_year}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {item.current_company ? (
                        <div>
                          <p className="font-bold text-xs text-slate-800">{item.current_company}</p>
                          <p className="text-[11px] text-slate-500">{item.job_title || 'Alumnus'}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not specified</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(item.id, item.status)}
                        title="Click to toggle status"
                        className="cursor-pointer"
                      >
                        <StatusBadge status={item.status} />
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit Alumni Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.full_name)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Alumni Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
        title={isEditModalOpen ? `Edit Record: ${selectedAlumni?.full_name}` : 'Add New College Alumni Record'}
      >
        <form onSubmit={handleSaveAlumni} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Comm</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="Civil Engineering">Civil</option>
                <option value="Electrical & Electronics">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Graduation Year *
              </label>
              <select
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017].map(yr => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Degree
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Company
              </label>
              <input
                type="text"
                value={formData.currentCompany}
                onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                placeholder="e.g. Google, TCS, Amazon"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="e.g. Lead Software Engineer"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="Java, React, Cloud, Python"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              {isEditModalOpen ? 'Save Changes' : 'Create Alumni Record'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
