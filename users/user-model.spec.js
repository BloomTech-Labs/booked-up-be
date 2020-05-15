const server = require('../api/server');
const request = require('supertest')


describe('users model', () => {
  describe('insert', () => {
    it('should insert the provided users into the db', async () => {
      await Users.add({
        first_name: 'mathew1', last_name: 'herm', password: 'Herman16&', email: 'herm@gmail.com', user_type: 'author',
      });

      const users = await db('users');
      expect(users).toHaveLength(1);
    });

    it('should return the inserted user', async () => {
      const user = await Users.add({
        first_name: 'mathew1', last_name: 'herm', password: 'Herman16&', email: 'herm1@gmail.com', user_type: 'author',
      });
      expect(user.first_name).toBe('mathew1');
    });
  });

  describe('get', () => {
    it('get', async () => {
      const res = await Users.find();
      expect(res).toHaveLength(1);
    });
    it('find user by Id', async () => {
      const res = await Users.findById(22);
      expect(res).toEqual(expect.anything());
    });
    it('find user by email', async () => {
      const res = await Users.findByEmail('herm@gmail.com');
      expect(res).toEqual(expect.anything());
    });
    it('find user by display name', async () => {
      const res = await Users.findByDisplayName('herm');
      expect(res).toEqual(expect.anything());
    });
  });

  describe('remove', () => {
    it('should remove the user from the db', async () => {
      await Users.removeUser(21);

      const users = await db('users');
      expect(users).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update the user from the db', async () => {
      const user = await Users.update(22, {
        first_name: 'Christian',
        last_name: 'herm',
        password: 'Herman16&',
        email: 'herm1@gmail.com',
        user_type: 'author',
        display_name: 'herm',
      });

      expect(user.first_name).toBe('Christian');
    });
  });
});


// beforeEach(async () => {
//   await db('users').truncate();
// });

describe('Get /', () => {
  // it('should return 200 with auth', async () => {
    //     const res = await request(server).get('/api/author-content');
    //     expect(res.status).toBe(200);
    // })

    it("should return status 404 without auth", async () => {
        const res = await request(server)
        .get("/api/tickets");
        expect(res.status).toBe(404);
    })

    it('should return JSON', async () => {
        const res = await request(server).get('/api/author-content');
        expect(res.type).toBe('application/json');
    })
})


