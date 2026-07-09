const request = require('supertest');
const app = require('./app');

describe('VenueMind AI Backend API', () => {
  describe('GET /api/crowd/density', () => {
    it('should return 200 and crowd density data', async () => {
      const res = await request(app).get('/api/crowd/density');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('zones');
      expect(res.body.zones.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/ops/telemetry', () => {
    it('should return 200 and ops telemetry data', async () => {
      const res = await request(app).get('/api/ops/telemetry');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('gateFlow');
      expect(res.body).toHaveProperty('activeStaff');
      expect(res.body).toHaveProperty('alerts');
      expect(Array.isArray(res.body.alerts)).toBe(true);
    });
  });

  describe('POST /api/chat', () => {
    it('should return 400 if message is missing', async () => {
      const res = await request(app).post('/api/chat').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Message must be a valid string');
    });

    it('should return 400 if message is empty', async () => {
      const res = await request(app).post('/api/chat').send({ message: '   ' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Message cannot be empty');
    });

    it('should return 400 if message is too long', async () => {
      const longMessage = 'a'.repeat(501);
      const res = await request(app).post('/api/chat').send({ message: longMessage });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Message exceeds maximum length of 500 characters');
    });

    it('should return 200 and a reply for valid message', async () => {
      const res = await request(app).post('/api/chat').send({ message: 'Hello AI' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('reply');
    });
  });
});
