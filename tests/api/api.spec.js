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
// import { test, expect } from '@playwright/test';

// test.describe('Login API', () => {
//   test('should login successfully with valid credentials', async ({ request }) => {
//     const response = await request.post('/login', {
//       data: {
//         username: 'admin',
//         password: 'password123'
//       }
//     });

//     expect(response.status()).toBe(200);

//     const body = await response.json();
//     expect(body.message).toBe('Login successful');
//   });
// });



// 28-9-2025
// APIRequestContext-> tạo ra client để gọi API 
// DELETE : await apiRequestContext.delete(url);
import { test, expect, request } from '@playwright/test';

test('DELETE user example', async () => {
  const apiContext = await request.newContext();

  // 1. Tạo user mới
  const createRes = await apiContext.post('http://localhost:3000/register', {
    data: {
      username: `testuser_${Date.now()}`,
      password: 'secret123',
      email: `test_${Date.now()}@example.com`
    }
  });
  expect(createRes.status()).toBe(201);

  // Giả sử API /register trả về id user
  const newUser = await createRes.json();
  const userId = newUser.id;

  // 2. Login để lấy token
  const resLogin = await apiContext.post('http://localhost:300/login', {
    data: { username, password }
  });
  expect(resLogin.status()).toBe(200);
  const bodyLogin = await resLogin.json();
  const token = bodyLogin.token;
  expect(token).toBeTruthy();

  // 3. Xoá user vừa tạo
  const deleteRes = await apiContext.delete(`http://localhost:3000/users/${userId}`,{
 headers: {
      Authorization: `Bearer ${token}`
    }
  });
  // 4. Assert kết quả
 expect(resDelete.status()).toBe(200);
  const bodyDelete = await resDelete.json();
  expect(bodyDelete.message).toContain('deleted successfully');

  await apiContext.dispose();
});

// delete : await apiRequestContext.delete(url,options);
// test('DELETE user - success case', async ({ }) => {
//   // 1. Tạo request context
//   const apiContext = await request.newContext();

//   // 2. Gửi DELETE request kèm options 
//   const response = await apiContext.delete('http://localhost:3000/users/1', {
//     headers: {
//       'Accept': 'application/json'
//     }
//   });

//   // 3. In kết quả để xem
//   console.log('Status:', response.status());
//   console.log('Body:', await response.text());

//   // 4. Xác nhận API trả đúng
//   expect(response.status()).toBe(200);
//   // Giải phóng tài nguyên sau khi dùng
//   await apiContext.dispose();
// });


// fetch: = API request đa năng, GET/POST/PUT/DELETE/... đều được.
// Dùng data cho JSON, form hoặc multipart cho form data, params cho query string.


//HEAD: 
// Kiểm tra file có tồn tại trên server không mà không cần tải toàn bộ nội dung.
//Kiểm tra metadata của tài nguyên (ví dụ: Content-Length, Content-Type).
//Dùng để validate link còn sống (link checker).
test('Check file exists with HEAD', async ({ request }) => {
  const response = await request.head('https://example.com/logo.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
});
