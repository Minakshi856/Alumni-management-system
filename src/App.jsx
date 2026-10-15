import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AdminSidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public & Alumni Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Directory } from './pages/alumni/Directory';
import { Events } from './pages/alumni/Events';
import { Jobs } from './pages/alumni/Jobs';
import { Profile } from './pages/alumni/Profile';
import { AlumniDashboard } from './pages/alumni/AlumniDashboard';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageAlumni } from './pages/admin/ManageAlumni';
import { ManageEvents } from './pages/admin/ManageEvents';
import { ManageJobs } from './pages/admin/ManageJobs';
import { Announcements } from './pages/admin/Announcements';

// Admin Layout wrapper
const AdminLayout = () => {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
      <AdminSidebar />
      <main className="flex-1 bg-slate-50/70 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/events" element={<Events />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Alumni Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AlumniDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes with Sidebar Layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="alumni" element={<ManageAlumni />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="jobs" element={<ManageJobs />} />
            <Route path="announcements" element={<Announcements />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
