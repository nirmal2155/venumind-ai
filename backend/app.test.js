const request = require('supertest');
const app = require('./app');

describe('VenueMind AI Backend API', () => {
  describe('GET /api/health', () => {
    it('should return 200 and system health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('version');
    });
  });

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
      const longMessage = 'a'.repeat(1001);
      const res = await request(app).post('/api/chat').send({ message: longMessage });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Message exceeds maximum length');
    });

    it('should return 200 and a reply for valid message', async () => {
      const res = await request(app).post('/api/chat').send({ message: 'Hello AI' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('reply');
    });

    it('should return contextual reply for food query', async () => {
      const res = await request(app).post('/api/chat').send({ message: 'Where can I get food?' });
      expect(res.statusCode).toBe(200);
      expect(res.body.reply).toContain('Food');
    });

    it('should return contextual reply for parking query', async () => {
      const res = await request(app).post('/api/chat').send({ message: 'Where is parking?' });
      expect(res.statusCode).toBe(200);
      expect(res.body.reply).toContain('Parking');
    });
  });

  describe('Security Headers', () => {
    it('should set X-Content-Type-Options to nosniff', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should set X-Frame-Options to DENY', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-frame-options']).toBe('DENY');
    });

    it('should set X-XSS-Protection header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-xss-protection']).toBe('1; mode=block');
    });

    it('should set Referrer-Policy header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    });

    it('should set Permissions-Policy header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['permissions-policy']).toBe('camera=(), microphone=(self), geolocation=(self)');
    });

    it('should set Content-Security-Policy header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['content-security-policy']).toBe("default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'");
    });

    it('should set Strict-Transport-Security header', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['strict-transport-security']).toBe('max-age=63072000; includeSubDomains; preload');
    });
  });

});
