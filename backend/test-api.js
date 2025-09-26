// Simple API testing script
// Run with: node test-api.js

const axios = require('axios');

const BASE_URL = 'http://localhost:2000';

async function testUserAuth() {
  console.log('🧪 Testing User Authentication API...\n');

  try {
    // Test 1: User Signup
    console.log('1️⃣ Testing User Signup...');
    const signupResponse = await axios.post(`${BASE_URL}/user-auth/signup`, {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      city: 'Mumbai',
      phone: '+91-9876543210'
    });
    
    console.log('✅ Signup Success:', {
      status: signupResponse.status,
      message: signupResponse.data.message,
      hasToken: !!signupResponse.data.token,
      userId: signupResponse.data.user._id
    });

    const token = signupResponse.data.token;

    // Test 2: User Login
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/user-auth/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login Success:', {
      status: loginResponse.status,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.token,
      userEmail: loginResponse.data.user.email
    });

    // Test 3: Get Profile (Protected Route)
    console.log('\n3️⃣ Testing Get Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/user-auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile Success:', {
      status: profileResponse.status,
      userName: profileResponse.data.user.name,
      userCity: profileResponse.data.user.city
    });

    // Test 4: Update Profile
    console.log('\n4️⃣ Testing Update Profile...');
    const updateResponse = await axios.put(`${BASE_URL}/user-auth/profile`, {
      name: 'Updated Test User',
      phone: '+91-9876543211'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Update Success:', {
      status: updateResponse.status,
      message: updateResponse.data.message,
      updatedName: updateResponse.data.user.name
    });

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

// Test error cases
async function testErrorCases() {
  console.log('\n🧪 Testing Error Cases...\n');

  try {
    // Test duplicate email
    console.log('1️⃣ Testing Duplicate Email...');
    await axios.post(`${BASE_URL}/user-auth/signup`, {
      name: 'Another User',
      email: 'testuser@example.com', // Same email
      password: 'password123',
      city: 'Delhi'
    });
  } catch (error) {
    console.log('✅ Duplicate email handled:', error.response?.data?.message);
  }

  try {
    // Test invalid login
    console.log('\n2️⃣ Testing Invalid Login...');
    await axios.post(`${BASE_URL}/user-auth/login`, {
      email: 'testuser@example.com',
      password: 'wrongpassword'
    });
  } catch (error) {
    console.log('✅ Invalid login handled:', error.response?.data?.message);
  }

  try {
    // Test protected route without token
    console.log('\n3️⃣ Testing Protected Route Without Token...');
    await axios.get(`${BASE_URL}/user-auth/profile`);
  } catch (error) {
    console.log('✅ No token handled:', error.response?.data?.message);
  }
}

async function runTests() {
  await testUserAuth();
  await testErrorCases();
}

// Only run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testUserAuth, testErrorCases };
