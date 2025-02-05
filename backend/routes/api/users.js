// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');

const { User } = require('../../db/models');
const { setTokenCookie } = require('../../utils/auth.js');
const { validateSignup } = require('../../utils/validators.js');

const router = express.Router();

//! Sign up
router.post('/', validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

  try {
    const userEmail = await User.findOne({
      where: { email: email },
      attributes: ['email'],
    });
    const userUsername = await User.findOne({
      where: { username: username },
      attributes: ['username'],
    });

    if (userEmail || userUsername) {
      const emailMessage = userEmail ? email : 'undefined';
      const usernameMessage = userUsername ? username : 'undefined';
      throw new Error(`${emailMessage},${usernameMessage}`);
    }
  } catch (error) {
    const [email, username] = error.message.split(',');
    const response = { message: 'User already exists' };
    const errors = {};

    if (email !== 'undefined')
      errors.email = 'User with that email already exists';
    if (username !== 'undefined')
      errors.username = 'User with that username already exists';
    if (errors) response.errors = errors;

    res.statusCode = 500;
    return res.json(response);
  }

  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };
  //! Set the token cookie asynchronously
  await setTokenCookie(res, safeUser);

  res.statusCode = 201;
  return res.json({
    user: safeUser,
  });
});

module.exports = router;