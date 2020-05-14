exports.seed = function (knex) {
  return knex('admins').insert([
    {
      user_type: 'admin',
      first_name: 'Ari',
      last_name: 'Emanuel',
      password: 'example',
      email: 'bookedup.pt9.test@gmail.com',
    },
  ]);
};
