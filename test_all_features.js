import http from 'http';

const BASE_URL = 'http://localhost:5000';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting Full-Stack AlumniConnect End-to-End Tests');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'Health Check endpoint /api/health');

    // 2. Public stats
    const pubStats = await request('GET', '/api/stats/public');
    assert(pubStats.status === 200 && pubStats.data.data.totalAlumni >= 8, 'Public Statistics /api/stats/public');

    // 3. Alumni list
    const alumniList = await request('GET', '/api/alumni');
    assert(alumniList.status === 200 && Array.isArray(alumniList.data.data), 'Get Alumni Directory /api/alumni');

    // 4. Alumni Login
    const alumniLogin = await request('POST', '/api/auth/login', {
      email: 'rahul.sharma@alumni.edu',
      password: 'alumni123'
    });
    assert(alumniLogin.status === 200 && alumniLogin.data.token, 'Alumni Login authentication');
    const alumniToken = alumniLogin.data?.token;

    // 5. Auth Me
    const meCheck = await request('GET', '/api/auth/me', null, alumniToken);
    assert(meCheck.status === 200 && meCheck.data.user.role === 'alumni', 'Verify current user /api/auth/me');

    // 6. Admin Login
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@alumni.edu',
      password: 'admin123'
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'Admin Login authentication');
    const adminToken = adminLogin.data?.token;

    // 7. Admin Dashboard Stats
    const adminStats = await request('GET', '/api/stats/dashboard', null, adminToken);
    assert(adminStats.status === 200 && adminStats.data.data.departmentStats.length > 0, 'Admin Dashboard Stats & Charts Data');

    // 8. Admin Create Alumni Record (CRUD: Create)
    const createAlumni = await request('POST', '/api/alumni', {
      fullName: 'Test Alumnus Engineer',
      email: `test.${Date.now()}@alumni.edu`,
      department: 'Computer Science',
      graduationYear: 2024,
      degree: 'B.Tech',
      currentCompany: 'Infosys',
      jobTitle: 'Systems Engineer',
      location: 'Pune, India',
      status: 'Active'
    }, adminToken);
    assert(createAlumni.status === 201 && createAlumni.data.data.id, 'CRUD Create: Add new alumni record');
    const createdAlumniId = createAlumni.data?.data?.id;

    // 9. Update Alumni Record (CRUD: Update)
    if (createdAlumniId) {
      const updateAlumni = await request('PUT', `/api/alumni/${createdAlumniId}`, {
        job_title: 'Senior Systems Engineer',
        current_company: 'Infosys Ltd'
      }, adminToken);
      assert(updateAlumni.status === 200 && updateAlumni.data.data.job_title === 'Senior Systems Engineer', 'CRUD Update: Update alumni details');
    }

    // 10. Update Status (CRUD: Patch status)
    if (createdAlumniId) {
      const statusPatch = await request('PATCH', `/api/alumni/${createdAlumniId}/status`, {
        status: 'Active',
        is_verified: true
      }, adminToken);
      assert(statusPatch.status === 200 && statusPatch.data.data.is_verified === true, 'CRUD Status Toggle: Verify & Activate alumni');
    }

    // 11. Create Event
    const createEvent = await request('POST', '/api/events', {
      title: 'Automated Test Alumni Meet 2026',
      description: 'End to end testing campus event',
      event_date: '2026-12-15',
      event_time: '11:00 AM',
      location: 'Main Auditorium',
      event_type: 'Reunion'
    }, adminToken);
    assert(createEvent.status === 201 && createEvent.data.data.id, 'Events: Create college event');
    const createdEventId = createEvent.data?.data?.id;

    // 12. Toggle RSVP
    if (createdEventId) {
      const rsvp = await request('POST', `/api/events/${createdEventId}/rsvp`, null, alumniToken);
      assert(rsvp.status === 200 && rsvp.data.is_attending === true, 'Events: Alumni 1-Click RSVP toggle');
    }

    // 13. Create Job Opportunity
    const createJob = await request('POST', '/api/jobs', {
      title: 'Cloud Architect Test Position',
      company: 'Antigravity Tech',
      location: 'Remote',
      job_type: 'Full-time',
      description: 'Testing job applications workflow'
    }, alumniToken);
    assert(createJob.status === 201 && createJob.data.data.id, 'Careers: Post job opportunity');
    const createdJobId = createJob.data?.data?.id;

    // 14. Apply to Job
    if (createdJobId) {
      const applyJob = await request('POST', `/api/jobs/${createdJobId}/apply`, {
        applicant_name: 'Rahul Sharma',
        applicant_phone: '+91 98765 43210',
        resume_url: 'https://linkedin.com/in/rahulsharma',
        cover_note: 'Excited about this opening!'
      }, alumniToken);
      assert(applyJob.status === 201 && applyJob.data.success === true, 'Careers: Submit job application');
    }

    // 15. Create Announcement
    const createAnn = await request('POST', '/api/announcements', {
      title: 'Campus Hackathon 2026 Winners Announced',
      category: 'Achievement',
      content: 'Congratulations to our engineering students and alumni mentors.',
      is_pinned: true
    }, adminToken);
    assert(createAnn.status === 201 && createAnn.data.data.id, 'Announcements: Broadcast notice');
    const createdAnnId = createAnn.data?.data?.id;

    // 16. Cleanup test entities (CRUD: Delete)
    if (createdAlumniId) {
      const delAlumni = await request('DELETE', `/api/alumni/${createdAlumniId}`, null, adminToken);
      assert(delAlumni.status === 200, 'CRUD Delete: Delete test alumni record');
    }

    if (createdEventId) {
      const delEvent = await request('DELETE', `/api/events/${createdEventId}`, null, adminToken);
      assert(delEvent.status === 200, 'Events: Delete test event');
    }

    if (createdJobId) {
      const delJob = await request('DELETE', `/api/jobs/${createdJobId}`, null, adminToken);
      assert(delJob.status === 200, 'Careers: Delete test job');
    }

    if (createdAnnId) {
      const delAnn = await request('DELETE', `/api/announcements/${createdAnnId}`, null, adminToken);
      assert(delAnn.status === 200, 'Announcements: Delete test announcement');
    }

    console.log('\n====================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
