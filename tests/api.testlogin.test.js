import { test, expect, request } from '@playwright/test';

test.describe('Login API', () => {
  let apiContext;

  test.beforeAll(async () => {
    apiContext = await request.newContext({
      baseURL: 'http://localhost:3000' // đổi nếu server bạn chạy port khác
    });
  });

  test('should login successfully with valid credentials', async () => {
    const response = await apiContext.post('/login', {
      data: {
        username: 'john_doe',        // user này phải tồn tại trong DB
        password: 'password123'   // và password phải đúng
      }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe('Login successful');
  });

  test('should fail with invalid password', async () => {
    const response = await apiContext.post('/login', {
      data: {
        username: 'admin',
        password: 'wrongpass'
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe('Invalid credentials');
  });

  test('should fail with non-existing user', async () => {
    const response = await apiContext.post('/login', {
      data: {
        username: 'notfound',
        password: 'password123'
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe('Invalid credentials');
  });
});
