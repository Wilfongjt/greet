// Disclaimer: This is not ready for production, obviously.
const _ = require('lodash');

const UsersDB = [
  {
    username: 'guest',
    password: 'Guest.9182', // User password
    scopes: ['hello'], // Authorized actions
  },
  {
    username: 'AzureDiamond',
    password: '*********',
    scopes: [],
  },
];

/**
  * Returns a user, given a username and valid password.
  *
  * @method signin
  * @param {String} username - user id
  * @param {String} password  - Allow / Deny
  * @throws Will throw an error if a user is not found or if the password is wrong.
  * @returns {Object} user
  */
const signin = (username, password) => {
  const user = _.find(UsersDB, { username });
  if (!user) throw new Error('User not found!');

  const hasValidPassword = (user.password === password);
  if (!hasValidPassword) throw new Error('Invalid password');

  return _.omit(user, 'password');
};

module.exports = {
  signin,
};
