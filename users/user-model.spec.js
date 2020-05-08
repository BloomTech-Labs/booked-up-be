const db = require('../data/dbConfig.js');
const Users = require('./user-model.js');

describe('users model', () => {
    
})

beforeEach(async () => {
    await db('users').truncate();
})
