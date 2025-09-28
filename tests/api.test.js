// // api.test.js
// const { test, expect } = require('@playwright/test');
// const supertest = require('supertest');

// // Khởi tạo client với URL của API
// const request = supertest('http://localhost:3000');

// // Test API login
// test('POST /login should return success with valid credentials', async () => {
//     const response = await request
//         .post('/login')
//         .send({ username: 'admin', password: 'password123' })  // Gửi thông tin đăng nhập hợp lệ
//         .expect(200);  // Kiểm tra mã trạng thái HTTP trả về

//     expect(response.body.message).toBe('Login successful');
// });

// test('POST /login should return error with invalid credentials', async () => {
//     const response = await request
//         .post('/login')
//         .send({ username: 'admin', password: 'wrongpassword' })  // Gửi thông tin đăng nhập sai
//         .expect(401);  // Kiểm tra mã trạng thái HTTP trả về

//     expect(response.body.message).toBe('Invalid credentials');
// });
// //Test API login
// // Test API status
// test('GET /status should return API status', async () => {
//     const response = await request
//         .get('/status')
//         .expect(200);  // Kiểm tra mã trạng thái HTTP trả về

//     expect(response.body.status).toBe('API is up and running');
// });
import { test, expect } from '@playwright/test';

test.describe('Login API', () => {
  test('should login successfully with valid credentials', async ({ request }) => {
    const response = await request.post('/login', {
      data: {
        username: 'admin',
        password: 'password123'
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe('Login successful');
  });
});
