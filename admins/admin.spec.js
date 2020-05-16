const db = require('../data/dbConfig.js');
const Admins = require('./admin-model.js');

describe.skip('admins model', () => {
  describe('insert', () => {
    it('should insert the provided users into the db', async () => {
      await Admins.add({
        first_name: 'mathew1', last_name: 'herm', password: 'Herman16&', email: 'herm7@gmail.com', user_type: 'admin',
      });

      const users = await db('admins');
      expect(users).toHaveLength(6);
    });

    it('should return the inserted admin', async () => {
      const admin = await Admins.add({
        first_name: 'mathew1', last_name: 'herm', password: 'Herman16&', email: 'herm8@gmail.com', user_type: 'author',
      });
      expect(admin.last_name).toBe('herm');
    });
  });

  describe('get', () => {
    it('get', async () => {
      const res = await Admins.find();
      expect(res).toHaveLength(1);
    });
    it('find admin by Id', async () => {
      const res = await Admins.findById(2);
      expect(res).toEqual(expect.anything());
    });
    it('find admin by email', async () => {
      const res = await Admins.findByEmail('herm@gmail.com');
      expect(res).toEqual(expect.anything());
    });
    it('find admin by display name', async () => {
      const res = await Admins.findByDisplayName('herm');
      expect(res).toEqual(expect.anything());
    });
  });

  describe('remove', () => {
    it('should remove the admin from the db', async () => {
      await Admins.removeUser(1);

      const users = await db('users');
      expect(users).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update the admin from the db', async () => {
      const admin = await Admins.update(2, {
        first_name: 'Christian',
        last_name: 'herm',
        password: 'Herman16&',
        email: 'herm1@gmail.com',
        user_type: 'admin',
        display_name: 'herm',
      });

      expect(admin.first_name).toBe('Christian');
    });
  });
});
