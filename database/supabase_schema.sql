-- ==============================================================================
-- AlumniConnect: College Alumni Management System
-- Database Schema for Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable UUID Extension (standard in PostgreSQL / Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running migration (in reverse dependency order)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS event_rsvps CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS alumni_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Users Table (Authentication & Core Identity)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'alumni' CHECK (role IN ('admin', 'alumni')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Alumni Profiles Table (Detailed Alumni Records)
CREATE TABLE alumni_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    graduation_year INT NOT NULL CHECK (graduation_year >= 1970 AND graduation_year <= 2030),
    department VARCHAR(100) NOT NULL,
    degree VARCHAR(100) NOT NULL DEFAULT 'B.Tech',
    current_company VARCHAR(150),
    job_title VARCHAR(150),
    location VARCHAR(150),
    phone VARCHAR(30),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    skills TEXT[],
    is_verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Pending', 'Inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Events Table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time VARCHAR(50) NOT NULL,
    location VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL DEFAULT 'Reunion' CHECK (event_type IN ('Reunion', 'Webinar', 'Career Fair', 'Workshop', 'Networking', 'Homecoming')),
    capacity INT DEFAULT 100,
    banner_url TEXT,
    is_virtual BOOLEAN DEFAULT FALSE,
    meeting_link VARCHAR(255),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Event RSVPs Table (Many-to-Many between Events and Users)
CREATE TABLE event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'Attending' CHECK (status IN ('Attending', 'Interested', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);

-- 7. Jobs / Career Opportunities Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    company VARCHAR(150) NOT NULL,
    location VARCHAR(150) NOT NULL,
    job_type VARCHAR(50) NOT NULL DEFAULT 'Full-time' CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote')),
    experience_level VARCHAR(50) DEFAULT 'Mid-Level',
    salary_range VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT,
    apply_url VARCHAR(255),
    contact_email VARCHAR(255),
    posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Job Applications Table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    applicant_name VARCHAR(150) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(50),
    resume_url TEXT,
    cover_note TEXT,
    status VARCHAR(50) DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Reviewed', 'Shortlisted', 'Rejected')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Announcements Table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(250) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'News' CHECK (category IN ('News', 'Urgent', 'Achievement', 'Campus', 'Alumni Spotlight')),
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Activity Logs Table (Audit Trail for Admin Dashboard)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(150) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_alumni_profiles_dept ON alumni_profiles(department);
CREATE INDEX idx_alumni_profiles_batch ON alumni_profiles(graduation_year);
CREATE INDEX idx_alumni_profiles_company ON alumni_profiles(current_company);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_jobs_status ON jobs(status);
