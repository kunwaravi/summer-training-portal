/// <reference types="jest" />
import request from 'supertest';

// Mock Prisma Client to keep tests offline-friendly and database-agnostic (Issue #5)
jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    $queryRaw: jest.fn(),
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));

import prisma from '../lib/prisma';
import { app } from '../index';

describe('Auth & Health System Integration Tests', () => {
  beforeEach(() => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);
    (prisma.user.findUnique as jest.Mock).mockImplementation((args) => {
      if (args.where.email === 'duplicate@nexus.com') {
        return Promise.resolve({ id: 99, email: 'duplicate@nexus.com' });
      }
      return Promise.resolve(null);
    });
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      email: 'test@nexus.com',
      name: 'Test Student',
      progresses: [],
      results: []
    });
  });

  it('GET /health should return connected database status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.database).toBe('CONNECTED');
  });

  it('POST /api/auth/login should enforce input schema validation', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('x-requested-with', 'XMLHttpRequest')
      .send({ email: '' }); // Missing password

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Validation Error');
  });

  it('POST /api/auth/register should enforce anti-CSRF headers on state-modifying requests', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@nexus.com',
        password: 'password123',
        name: 'Test Student',
        fatherName: 'Father',
        collegeName: 'College',
        branchName: 'CSE'
      });

    // Since X-Requested-With header is missing, it must return 403 Forbidden (CSRF protection)
    expect(res.status).toBe(403);
    expect(res.body.message).toContain('CSRF');
  });

  it('POST /api/auth/register should register a user successfully when CSRF header is present', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('x-requested-with', 'XMLHttpRequest')
      .send({
        email: 'newuser@nexus.com',
        password: 'password123',
        name: 'New Student',
        fatherName: 'Father',
        collegeName: 'College',
        branchName: 'CSE'
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('test@nexus.com');
  });
});
