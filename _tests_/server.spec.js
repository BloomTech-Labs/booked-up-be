const request = require('supertest');
const server = require('../api/server.js');

describe('server.js', () => {
    it("server is running in testing environment", () => {
        expect(process.env.DB_ENV).toBe("testing");
    })

    describe('Get /', () => {
        it('should return 200', async () => {
            const res = await request(server).get('/');
            expect(res.status).toBe(200);
        })
        //return JSON
        it('should return JSON', async () => {
            const res = await request(server).get('/');
            expect(res.type).toBe('application/json');
        })
        //return response
        it('should return correct response', async () => {
            const res = await request(server).get('/');
            expect(res.body.api).toBe("Booked Up server live.")
        })
    })
})
