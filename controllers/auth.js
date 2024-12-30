/* eslint-disable prefer-destructuring */
const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

const router = express.Router();

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.post('/sign-up', async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const username = req.body.username;

  // check the passwords for validity
  if (password !== confirmPassword) {
    return res.send('Passwords do not match');
  }

  // see if the user exists in the db
  const userInDatabase = await User.findOne({ username });

  if (userInDatabase) {
    return res.send('Username or Password is invalid');
  }

  // Create the new registration

  // 1.) encrypt password
  const hashedPassword = bcrypt.hashSync(password, 10);
  // 2.) replace the raw pw with encrypted pw
  req.body.password = hashedPassword;
  // 3.) save the user to the db
  const newUser = await User.create(req.body);

  res.send(newUser.username);
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs');
});

router.post('/sign-in', async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;

  // see if the user exists in the db
  const userInDatabase = await User.findOne({ username });

  if (!userInDatabase) {
    return res.send('Login failed. Please try again.');
  }

  const validPassword = bcrypt.compareSync(password, userInDatabase.password);

  if (!validPassword) {
    return res.send('Login failed. Please try again.');
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  res.redirect('/');
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
