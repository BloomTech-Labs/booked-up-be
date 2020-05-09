const content = require('../author-content/content-model');
const request = require('supertest');

describe('Get /', () => {
    it('should return 200', async () => {
        const res = await request(content).get('/');
        expect(res.status).toBe(200);
    })

    it('should return JSON', async () => {
        const res = await request(content).get('/');
        expect(res.type).toBe('application/json');
    })

    it('should return JSON', async () => {
        const res = await request(content).get('/');
        expect(res.type).toBe('application/json');
    })
})