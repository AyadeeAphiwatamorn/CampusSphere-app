const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('http://localhost:5050/api/signup', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('Signup Success:', response.data);
  } catch (error) {
    console.error('Signup Error:', error.response ? error.response.data : error.message);
  }
}

testSignup();
