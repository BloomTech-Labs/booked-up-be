const server = require('../api/comments');
const request = require('supertest');

describe('Get /', () => {
    // :)
    // it('should return 200 with auth', async () => {
    //     const res = await request(server).get('/api/comments');
    //     expect(res.status).toBe(200);
    // })

    it("should return status 404 without auth", async () => {
        const res = await request(server)
            .get("/api/comments");
        expect(res.status).toBe(404);
    })

    it('should return JSON', async () => {
        const res = await request(server).get('/api/comments');
        expect(res.type).toBe('application/json');
    })
})