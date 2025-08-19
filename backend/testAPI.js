import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testAdmissionView() {
  try {
    // First login as admin
    console.log('Logging in as admin...');
    const loginResponse = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@janashiri.edu',
        password: 'admin123'
      }),
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginData.success) {
      throw new Error('Login failed');
    }

    const token = loginData.data.token;
    console.log('Got token:', token ? 'YES' : 'NO');

    // Now test the get admissions endpoint
    console.log('\nTesting get admissions list...');
    const admissionsResponse = await fetch(`${API_BASE}/admin/admissions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const admissionsData = await admissionsResponse.json();
    console.log('Admissions list response:', admissionsData);

    if (admissionsData.success && admissionsData.data.admissions.length > 0) {
      const firstAdmissionId = admissionsData.data.admissions[0]._id;
      console.log('\nTesting get single admission for ID:', firstAdmissionId);

      // Test getting single admission
      const singleAdmissionResponse = await fetch(`${API_BASE}/admin/admissions/${firstAdmissionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const singleAdmissionData = await singleAdmissionResponse.json();
      console.log('Single admission response:', singleAdmissionData);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAdmissionView();
