#!/usr/bin/env node

/**
 * Gallery API Test Script
 * Tests the gallery endpoints to ensure they're working correctly
 */

const API_BASE = 'http://localhost:3001/api';

async function testGalleryAPI() {
  console.log('🧪 Testing Gallery API Endpoints...\n');

  try {
    // Test 1: Get public gallery images
    console.log('1️⃣ Testing public gallery endpoint...');
    const publicResponse = await fetch(`${API_BASE}/gallery`);
    const publicData = await publicResponse.json();
    
    if (publicResponse.ok) {
      console.log('✅ Public gallery endpoint working');
      console.log(`   Found ${publicData.data.images.length} images`);
    } else {
      console.log('❌ Public gallery endpoint failed:', publicData.message);
    }

    // Test 2: Test health check
    console.log('\n2️⃣ Testing server health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Server is healthy');
      console.log(`   Status: ${healthData.status}`);
    } else {
      console.log('❌ Server health check failed');
    }

    // Test 3: Test admin endpoint (should fail without token)
    console.log('\n3️⃣ Testing admin endpoint (without token)...');
    const adminResponse = await fetch(`${API_BASE}/gallery/admin`);
    const adminData = await adminResponse.json();
    
    if (adminResponse.status === 401) {
      console.log('✅ Admin endpoint properly protected');
      console.log('   Correctly requires authentication');
    } else {
      console.log('❌ Admin endpoint security issue');
    }

    console.log('\n🎉 Gallery API tests completed!');
    console.log('\n📌 Next steps:');
    console.log('   1. Visit http://localhost:5174/gallery to see the public gallery');
    console.log('   2. Login as admin and visit the gallery management');
    console.log('   3. Upload some test images via the admin interface');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
  }
}

// Run the tests
testGalleryAPI();
