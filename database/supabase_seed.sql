-- ==============================================================================
-- AlumniConnect: Sample Data for Supabase PostgreSQL
-- Run this in your Supabase SQL Editor after running supabase_schema.sql
-- ==============================================================================

-- 1. Insert Users (Admin + Alumni)
-- Admin Password: admin123
-- Alumni Passwords: alumni123
INSERT INTO users (id, email, password_hash, role) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@alumni.edu', '$2a$10$H8AI2Q9BnosfcNPDFo/0DegAFIbCoXTChZPwUalCgKTLxyuMXeqfW', 'admin'),
('b0000000-0000-0000-0000-000000000001', 'rahul.sharma@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000002', 'priya.patel@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000003', 'ananya.iyer@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000004', 'vikram.singh@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000005', 'sneha.reddy@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000006', 'arjun.mehta@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000007', 'kavya.nair@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni'),
('b0000000-0000-0000-0000-000000000008', 'rohit.verma@alumni.edu', '$2a$10$ECndJ0QO0n0Gq1v42fDh3uzIUe4qmjpjItkwaWFGfgm1HGHFtLdGO', 'alumni');

-- 2. Insert Alumni Profiles
INSERT INTO alumni_profiles (id, user_id, full_name, graduation_year, department, degree, current_company, job_title, location, phone, linkedin_url, github_url, bio, avatar_url, skills, is_verified, status) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Rahul Sharma', 2021, 'Computer Science', 'B.Tech', 'Google', 'Senior Software Engineer', 'Bengaluru, India', '+91 98765 43210', 'https://linkedin.com/in/rahulsharma', 'https://github.com/rahulsharma', 'Passionate about distributed systems, cloud architecture, and mentoring budding software engineers.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', ARRAY['Java', 'Kubernetes', 'Go', 'GCP', 'System Design'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Priya Patel', 2020, 'Information Technology', 'B.Tech', 'Microsoft', 'Product Manager', 'Hyderabad, India', '+91 98765 43211', 'https://linkedin.com/in/priyapatel', 'https://github.com/priyapatel', 'Leading product roadmaps for enterprise cloud solutions. Tech speaker and diversity advocate.', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', ARRAY['Product Strategy', 'Agile', 'UI/UX', 'Azure', 'Analytics'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Ananya Iyer', 2022, 'Electronics & Communication', 'B.Tech', 'Qualcomm', 'Hardware Design Engineer', 'Bengaluru, India', '+91 98765 43212', 'https://linkedin.com/in/ananyaiyer', 'https://github.com/ananyaiyer', 'Designing next-generation 5G chipsets and RF modules. Robotics enthusiast.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', ARRAY['VLSI', 'Verilog', 'Embedded C', 'RF Circuits', 'FPGA'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'Vikram Singh', 2019, 'Mechanical Engineering', 'B.Tech', 'Tesla', 'Automation Engineer', 'Berlin, Germany', '+49 151 23456789', 'https://linkedin.com/in/vikramsingh', 'https://github.com/vikramsingh', 'Working on Gigafactory manufacturing automation and robotic assembly lines.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', ARRAY['CAD/CAM', 'Robotics', 'SolidWorks', 'PLC Programming', 'Lean Mfg'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000005', 'Sneha Reddy', 2023, 'Computer Science', 'B.Tech', 'Amazon AWS', 'Cloud Solutions Architect', 'Seattle, USA', '+1 206 555 0192', 'https://linkedin.com/in/snehareddy', 'https://github.com/snehareddy', 'Building serverless microservices and high-availability multi-region backends.', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80', ARRAY['AWS', 'Terraform', 'Python', 'Node.js', 'Docker'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000006', 'Arjun Mehta', 2018, 'Civil Engineering', 'B.Tech', 'L&T Construction', 'Senior Project Manager', 'Mumbai, India', '+91 98765 43215', 'https://linkedin.com/in/arjunmehta', 'https://github.com/arjunmehta', 'Managing metro rail infrastructure projects and smart city transit hubs.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', ARRAY['Structural Engineering', 'AutoCAD', 'Primavera', 'BIM', 'Project Mgmt'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000007', 'Kavya Nair', 2024, 'Electrical & Electronics', 'B.Tech', 'Siemens Energy', 'Grid Systems Engineer', 'Pune, India', '+91 98765 43216', 'https://linkedin.com/in/kavyanair', 'https://github.com/kavyanair', 'Renewable energy integration, smart grids, and power converter designs.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', ARRAY['Power Electronics', 'MATLAB', 'Simulink', 'Renewable Energy', 'SCADA'], TRUE, 'Active'),
('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000008', 'Rohit Verma', 2022, 'Computer Science', 'B.Tech', 'Zomato', 'Full Stack Developer', 'Gurugram, India', '+91 98765 43217', 'https://linkedin.com/in/rohitverma', 'https://github.com/rohitverma', 'React, Next.js, and Node.js developer passionate about high-throughput food delivery systems.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80', ARRAY['React', 'Next.js', 'PostgreSQL', 'Redis', 'TypeScript'], TRUE, 'Active');

-- 3. Insert Events
INSERT INTO events (id, title, description, event_date, event_time, location, event_type, capacity, banner_url, is_virtual, meeting_link, created_by) VALUES
('d0000000-0000-0000-0000-000000000001', 'Annual Grand Alumni Reunion 2026', 'Welcome back to campus! Reconnect with batchmates, celebrate faculty milestones, and network during the gala dinner.', '2026-11-20', '05:00 PM IST', 'Campus Main Auditorium & Lawns', 'Reunion', 500, 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=80', FALSE, NULL, 'a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000002', 'Tech Leadership & AI Revolution Webinar', 'Industry leaders from Google, Microsoft, and Tesla share insights on Generative AI and career navigation for engineers.', '2026-10-28', '07:00 PM IST', 'Online via Zoom', 'Webinar', 1000, 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80', TRUE, 'https://zoom.us/j/alumniconnect-tech-ai', 'a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000003', 'Alumni Startup Pitch & Angel Investor Mixer', 'Showcase your startup to alumni angel investors, venture capitalists, and entrepreneurial mentors.', '2026-12-05', '02:00 PM IST', 'Incubation Center, Block C', 'Networking', 150, 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80', FALSE, NULL, 'a0000000-0000-0000-0000-000000000001'),
('d0000000-0000-0000-0000-000000000004', 'Global Alumni Mentorship Kickoff', '1-on-1 career mentorship bridging recent graduates and experienced alumni worldwide.', '2026-11-05', '06:30 PM IST', 'Virtual Conference Room', 'Workshop', 300, 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80', TRUE, 'https://meet.google.com/alm-ment-2026', 'a0000000-0000-0000-0000-000000000001');

-- 4. Insert Event RSVPs
INSERT INTO event_rsvps (event_id, user_id, status) VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Attending'),
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Attending'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Attending'),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'Attending');

-- 5. Insert Jobs
INSERT INTO jobs (id, title, company, location, job_type, experience_level, salary_range, description, requirements, apply_url, contact_email, posted_by, status) VALUES
('e0000000-0000-0000-0000-000000000001', 'Senior Full Stack Engineer', 'Google', 'Bengaluru, India (Hybrid)', 'Full-time', 'Senior (3-6 yrs)', '₹35 - 55 LPA', 'Join the core infrastructure team building next generation developer tooling and cloud interfaces.', '3+ years experience in React, Node.js or Go. Strong algorithms and system design skills.', 'https://careers.google.com/jobs/10293', 'rahul.sharma@alumni.edu', 'b0000000-0000-0000-0000-000000000001', 'Active'),
('e0000000-0000-0000-0000-000000000002', 'Associate Product Manager', 'Microsoft', 'Hyderabad, India', 'Full-time', 'Entry/Mid (1-3 yrs)', '₹22 - 32 LPA', 'Drive specifications, customer discovery, and telemetry analysis for Azure Cloud Tools.', 'B.Tech/BE in CS/IT/ECE. Passion for customer journeys, agile workflows, and data-driven prioritization.', 'https://careers.microsoft.com/apm', 'priya.patel@alumni.edu', 'b0000000-0000-0000-0000-000000000002', 'Active'),
('e0000000-0000-0000-0000-000000000003', 'Cloud DevOps & SRE Engineer', 'Amazon Web Services', 'Bengaluru / Remote', 'Full-time', 'Mid-Level (2-4 yrs)', '₹28 - 42 LPA', 'Manage high-throughput AWS infrastructure, automated CI/CD pipelines, and observability.', 'Hands-on experience with Terraform, Kubernetes, Docker, Prometheus, and Python/Bash scripting.', 'https://amazon.jobs/aws-sre', 'sneha.reddy@alumni.edu', 'b0000000-0000-0000-0000-000000000005', 'Active'),
('e0000000-0000-0000-0000-000000000004', 'Embedded Systems Firmware Intern', 'Qualcomm', 'Bengaluru, India', 'Internship', 'Fresh Graduate / Student', '₹45,000 / month stipend', 'Work alongside senior chip designers on ARM microcontrollers and low-level firmware drivers.', 'Strong proficiency in C/C++, microcontroller architecture, I2C, SPI, UART protocols.', 'https://qualcomm.com/internships', 'ananya.iyer@alumni.edu', 'b0000000-0000-0000-0000-000000000003', 'Active'),
('e0000000-0000-0000-0000-000000000005', 'Robotics & Automation Specialist', 'Tesla Gigafactory', 'Berlin, Germany', 'Full-time', 'Senior (4+ yrs)', '€75,000 - €95,000', 'Lead robotic cell integration, cycle time reduction, and preventative automation maintenance.', 'Degree in Mechanical or Mechatronics Engineering. Experience in Fanuc/KUKA robotics and PLC.', 'https://tesla.com/careers/rob-berlin', 'vikram.singh@alumni.edu', 'b0000000-0000-0000-0000-000000000004', 'Active');

-- 6. Insert Announcements
INSERT INTO announcements (id, title, category, content, is_pinned, created_by) VALUES
('f0000000-0000-0000-0000-000000000001', 'Alumni Endowment Fund reaches ₹2.5 Crores!', 'Achievement', 'Thanks to generous contributions from our worldwide alumni network, the 2026 Student Scholarship and Innovation Fund has surpassed ₹2.5 Crores. Over 50 deserving students have received merit-cum-need financial grants.', TRUE, 'a0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000002', 'Registrations Open for Annual Reunion 2026', 'Campus', 'We are delighted to welcome back all batches for the Grand Alumni Meet on November 20, 2026. Special batch anniversary felicitations for batches of 2016, 2020, and 2021. Register now under Events!', TRUE, 'a0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000003', 'Alumni Mentorship Program 2026-2027 Launched', 'News', 'Are you willing to mentor a pre-final or final year student for 1 hour every fortnight? Update your profile skills or reach out through the networking portal.', FALSE, 'a0000000-0000-0000-0000-000000000001'),
('f0000000-0000-0000-0000-000000000004', 'New Incubation & Research Wing Inaugurated', 'Campus', 'The college is proud to announce the opening of the State-of-the-Art AI & Hardware Innovation Wing sponsored partly by alumni corporate partners.', FALSE, 'a0000000-0000-0000-0000-000000000001');

-- 7. Insert Activity Logs
INSERT INTO activity_logs (user_name, action, target) VALUES
('System Admin', 'Created Event', 'Annual Grand Alumni Reunion 2026'),
('Rahul Sharma', 'Posted Job', 'Senior Full Stack Engineer at Google'),
('Priya Patel', 'Updated Profile', 'Promoted to Product Manager at Microsoft'),
('Sneha Reddy', 'Registered Account', 'Batch of 2023 - Computer Science'),
('Vikram Singh', 'RSVP Attending', 'Annual Grand Alumni Reunion 2026');
