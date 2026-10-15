import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import supabase from './supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', 'data');
const storePath = path.join(dataDir, 'store.json');
const seedPath = path.join(dataDir, 'seed.json');

// Initialize local store from seed if it doesn't exist
function initLocalStore() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(storePath)) {
    if (fs.existsSync(seedPath)) {
      const seedContent = fs.readFileSync(seedPath, 'utf8');
      fs.writeFileSync(storePath, seedContent, 'utf8');
    } else {
      fs.writeFileSync(storePath, JSON.stringify({
        users: [],
        alumni_profiles: [],
        events: [],
        event_rsvps: [],
        jobs: [],
        job_applications: [],
        announcements: [],
        activity_logs: []
      }, null, 2), 'utf8');
    }
  }
}

initLocalStore();

function readLocalData() {
  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading store.json, re-initializing...', e);
    initLocalStore();
    return JSON.parse(fs.readFileSync(storePath, 'utf8'));
  }
}

function writeLocalData(data) {
  try {
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing store.json:', e);
  }
}

export const db = {
  // ----------------------------------------------------
  // USERS
  // ----------------------------------------------------
  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (supabase) {
      const { data, error } = await supabase.from('users').select('*').eq('email', normalized).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    const store = readLocalData();
    return store.users.find(u => u.email.toLowerCase() === normalized) || null;
  },

  async findUserById(id) {
    if (supabase) {
      const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    const store = readLocalData();
    return store.users.find(u => u.id === id) || null;
  },

  async createUser({ email, password_hash, role = 'alumni' }) {
    const normalized = email.toLowerCase().trim();
    const id = uuidv4();
    const user = {
      id,
      email: normalized,
      password_hash,
      role,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('users').insert([user]).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    store.users.push(user);
    writeLocalData(store);
    return user;
  },

  // ----------------------------------------------------
  // ALUMNI PROFILES
  // ----------------------------------------------------
  async getAlumniList({ search, department, batch, status } = {}) {
    if (supabase) {
      let query = supabase.from('alumni_profiles').select('*').order('created_at', { ascending: false });
      if (department && department !== 'All') query = query.eq('department', department);
      if (batch && batch !== 'All') query = query.eq('graduation_year', parseInt(batch, 10));
      if (status && status !== 'All') query = query.eq('status', status);
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,current_company.ilike.%${search}%,job_title.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    const store = readLocalData();
    let list = [...store.alumni_profiles];

    if (department && department !== 'All') {
      list = list.filter(a => a.department === department);
    }
    if (batch && batch !== 'All') {
      list = list.filter(a => String(a.graduation_year) === String(batch));
    }
    if (status && status !== 'All') {
      list = list.filter(a => a.status === status);
    }
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(a => 
        (a.full_name && a.full_name.toLowerCase().includes(term)) ||
        (a.current_company && a.current_company.toLowerCase().includes(term)) ||
        (a.job_title && a.job_title.toLowerCase().includes(term)) ||
        (a.email && a.email.toLowerCase().includes(term)) ||
        (a.location && a.location.toLowerCase().includes(term)) ||
        (a.skills && a.skills.some(s => s.toLowerCase().includes(term)))
      );
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getAlumniById(id) {
    if (supabase) {
      const { data, error } = await supabase.from('alumni_profiles').select('*').eq('id', id).maybeSingle();
      if (error) throw error;
      return data;
    }
    const store = readLocalData();
    return store.alumni_profiles.find(a => a.id === id) || null;
  },

  async getAlumniByUserId(userId) {
    if (supabase) {
      const { data, error } = await supabase.from('alumni_profiles').select('*').eq('user_id', userId).maybeSingle();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
    const store = readLocalData();
    return store.alumni_profiles.find(a => a.user_id === userId) || null;
  },

  async createAlumniProfile(profileData) {
    const id = profileData.id || uuidv4();
    const newProfile = {
      id,
      ...profileData,
      is_verified: profileData.is_verified ?? true,
      status: profileData.status || 'Active',
      skills: Array.isArray(profileData.skills) ? profileData.skills : (profileData.skills ? profileData.skills.split(',').map(s => s.trim()) : []),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('alumni_profiles').insert([newProfile]).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    store.alumni_profiles.push(newProfile);
    writeLocalData(store);
    return newProfile;
  },

  async updateAlumniProfile(id, updates) {
    if (updates.skills && typeof updates.skills === 'string') {
      updates.skills = updates.skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    updates.updated_at = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase.from('alumni_profiles').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    const idx = store.alumni_profiles.findIndex(a => a.id === id);
    if (idx === -1) return null;
    store.alumni_profiles[idx] = { ...store.alumni_profiles[idx], ...updates };
    writeLocalData(store);
    return store.alumni_profiles[idx];
  },

  async deleteAlumniProfile(id) {
    if (supabase) {
      const profile = await this.getAlumniById(id);
      const { error } = await supabase.from('alumni_profiles').delete().eq('id', id);
      if (error) throw error;
      if (profile && profile.user_id) {
        await supabase.from('users').delete().eq('id', profile.user_id);
      }
      return true;
    }

    const store = readLocalData();
    const profile = store.alumni_profiles.find(a => a.id === id);
    store.alumni_profiles = store.alumni_profiles.filter(a => a.id !== id);
    if (profile && profile.user_id) {
      store.users = store.users.filter(u => u.id !== profile.user_id);
    }
    writeLocalData(store);
    return true;
  },

  // ----------------------------------------------------
  // EVENTS & RSVPS
  // ----------------------------------------------------
  async getEvents({ userId } = {}) {
    if (supabase) {
      const { data: events, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
      if (error) throw error;

      const { data: rsvps } = await supabase.from('event_rsvps').select('*');
      return (events || []).map(event => {
        const eventRsvps = (rsvps || []).filter(r => r.event_id === event.id);
        return {
          ...event,
          attendee_count: eventRsvps.length,
          is_attending: userId ? eventRsvps.some(r => r.user_id === userId && r.status === 'Attending') : false
        };
      });
    }

    const store = readLocalData();
    return store.events.map(event => {
      const eventRsvps = store.event_rsvps.filter(r => r.event_id === event.id);
      return {
        ...event,
        attendee_count: eventRsvps.length,
        is_attending: userId ? eventRsvps.some(r => r.user_id === userId && r.status === 'Attending') : false
      };
    }).sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  },

  async createEvent(eventData) {
    const id = uuidv4();
    const newEvent = {
      id,
      ...eventData,
      capacity: parseInt(eventData.capacity, 10) || 100,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('events').insert([newEvent]).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    store.events.push(newEvent);
    writeLocalData(store);
    return newEvent;
  },

  async updateEvent(id, updates) {
    if (supabase) {
      const { data, error } = await supabase.from('events').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    const idx = store.events.findIndex(e => e.id === id);
    if (idx === -1) return null;
    store.events[idx] = { ...store.events[idx], ...updates };
    writeLocalData(store);
    return store.events[idx];
  },

  async deleteEvent(id) {
    if (supabase) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const store = readLocalData();
    store.events = store.events.filter(e => e.id !== id);
    store.event_rsvps = store.event_rsvps.filter(r => r.event_id !== id);
    writeLocalData(store);
    return true;
  },

  async toggleRsvp(eventId, userId) {
    if (supabase) {
      const { data: existing } = await supabase
        .from('event_rsvps')
        .select('*')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase.from('event_rsvps').delete().eq('id', existing.id);
        return { attending: false };
      } else {
        await supabase.from('event_rsvps').insert([{
          id: uuidv4(),
          event_id: eventId,
          user_id: userId,
          status: 'Attending',
          created_at: new Date().toISOString()
        }]);
        return { attending: true };
      }
    }

    const store = readLocalData();
    const idx = store.event_rsvps.findIndex(r => r.event_id === eventId && r.user_id === userId);
    if (idx !== -1) {
      store.event_rsvps.splice(idx, 1);
      writeLocalData(store);
      return { attending: false };
    } else {
      store.event_rsvps.push({
        id: uuidv4(),
        event_id: eventId,
        user_id: userId,
        status: 'Attending',
        created_at: new Date().toISOString()
      });
      writeLocalData(store);
      return { attending: true };
    }
  },

  // ----------------------------------------------------
  // JOBS & APPLICATIONS
  // ----------------------------------------------------
  async getJobs({ search, job_type } = {}) {
    if (supabase) {
      let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });
      if (job_type && job_type !== 'All') query = query.eq('job_type', job_type);
      if (search) {
        query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,location.ilike.%${search}%`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    const store = readLocalData();
    let list = [...store.jobs];
    if (job_type && job_type !== 'All') {
      list = list.filter(j => j.job_type === job_type);
    }
    if (search) {
      const term = search.toLowerCase();
      list = list.filter(j => 
        (j.title && j.title.toLowerCase().includes(term)) ||
        (j.company && j.company.toLowerCase().includes(term)) ||
        (j.location && j.location.toLowerCase().includes(term)) ||
        (j.description && j.description.toLowerCase().includes(term))
      );
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createJob(jobData) {
    const id = uuidv4();
    const newJob = {
      id,
      ...jobData,
      status: jobData.status || 'Active',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('jobs').insert([newJob]).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    store.jobs.push(newJob);
    writeLocalData(store);
    return newJob;
  },

  async updateJob(id, updates) {
    if (supabase) {
      const { data, error } = await supabase.from('jobs').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    const idx = store.jobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    store.jobs[idx] = { ...store.jobs[idx], ...updates };
    writeLocalData(store);
    return store.jobs[idx];
  },

  async deleteJob(id) {
    if (supabase) {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const store = readLocalData();
    store.jobs = store.jobs.filter(j => j.id !== id);
    writeLocalData(store);
    return true;
  },

  async applyToJob(applicationData) {
    const id = uuidv4();
    const newApp = {
      id,
      ...applicationData,
      status: 'Submitted',
      applied_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase.from('job_applications').insert([newApp]).select().single();
      if (error) throw error;
      return data;
    }

    const store = readLocalData();
    if (!store.job_applications) store.job_applications = [];
    store.job_applications.push(newApp);
    writeLocalData(store);
    return newApp;
  },

  // ----------------------------------------------------
  // ANNOUNCEMENTS
  // ----------------------------------------------------
  async getAnnouncements() {
    if (supabase) {
      const { data, error } = await supabase.from('announcements').select('*').order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }

    const store = readLocalData();
    return [...store.announcements].sort((a, b) => {
      if (b.is_pinned !== a.is_pinned) return b.is_pinned ? 1 : -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
  },

  async createAnnouncement(data) {
    const id = uuidv4();
    const item = {
      id,
      ...data,
      is_pinned: Boolean(data.is_pinned),
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data: created, error } = await supabase.from('announcements').insert([item]).select().single();
      if (error) throw error;
      return created;
    }

    const store = readLocalData();
    store.announcements.push(item);
    writeLocalData(store);
    return item;
  },

  async deleteAnnouncement(id) {
    if (supabase) {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const store = readLocalData();
    store.announcements = store.announcements.filter(a => a.id !== id);
    writeLocalData(store);
    return true;
  },

  // ----------------------------------------------------
  // ACTIVITY LOGS
  // ----------------------------------------------------
  async logActivity(userName, action, target) {
    const log = {
      id: uuidv4(),
      user_name: userName || 'User',
      action,
      target,
      created_at: new Date().toISOString()
    };

    try {
      if (supabase) {
        await supabase.from('activity_logs').insert([log]);
        return;
      }
      const store = readLocalData();
      if (!store.activity_logs) store.activity_logs = [];
      store.activity_logs.unshift(log);
      if (store.activity_logs.length > 50) store.activity_logs.pop();
      writeLocalData(store);
    } catch (err) {
      console.warn('Could not write activity log:', err.message);
    }
  },

  async getActivityLogs(limit = 10) {
    if (supabase) {
      const { data } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit);
      return data || [];
    }
    const store = readLocalData();
    return (store.activity_logs || []).slice(0, limit);
  },

  // ----------------------------------------------------
  // ANALYTICS & DASHBOARD STATS
  // ----------------------------------------------------
  async getDashboardStats() {
    const alumni = await this.getAlumniList();
    const events = await this.getEvents();
    const jobs = await this.getJobs();
    const activities = await this.getActivityLogs(8);

    const totalAlumni = alumni.length;
    const verifiedAlumni = alumni.filter(a => a.is_verified).length;
    const activeAlumni = alumni.filter(a => a.status === 'Active').length;
    const employedAlumni = alumni.filter(a => a.current_company && a.current_company.trim() !== '').length;

    // Department-wise distribution
    const departmentCounts = {};
    alumni.forEach(a => {
      const dept = a.department || 'Other';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    const departmentStats = Object.keys(departmentCounts).map(dept => ({
      name: dept,
      count: departmentCounts[dept],
      percentage: totalAlumni > 0 ? Math.round((departmentCounts[dept] / totalAlumni) * 100) : 0
    })).sort((a, b) => b.count - a.count);

    // Batch-wise distribution
    const batchCounts = {};
    alumni.forEach(a => {
      const batch = a.graduation_year || 'Unknown';
      batchCounts[batch] = (batchCounts[batch] || 0) + 1;
    });

    const batchStats = Object.keys(batchCounts).map(batch => ({
      batch: String(batch),
      count: batchCounts[batch]
    })).sort((a, b) => a.batch.localeCompare(b.batch));

    // Top Companies
    const companyCounts = {};
    alumni.forEach(a => {
      if (a.current_company) {
        const comp = a.current_company.trim();
        companyCounts[comp] = (companyCounts[comp] || 0) + 1;
      }
    });

    const topCompanies = Object.keys(companyCounts).map(comp => ({
      name: comp,
      count: companyCounts[comp]
    })).sort((a, b) => b.count - a.count).slice(0, 5);

    return {
      summary: {
        totalAlumni,
        verifiedAlumni,
        activeAlumni,
        employedAlumni,
        employmentRate: totalAlumni > 0 ? Math.round((employedAlumni / totalAlumni) * 100) : 0,
        totalEvents: events.length,
        totalJobs: jobs.length
      },
      departmentStats,
      batchStats,
      topCompanies,
      recentActivities: activities
    };
  }
};
