const express = require('express');
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const router = express.Router();
const auth = require('../middleware/auth');
const { signin } = require('../utils/functions');

const User = require('../models/user');

router.post('/signup', check('email', 'Please enter a valid email').isEmail(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;
    try {
      user = new User({
        username,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const token = await signin(user)
      res.status(200).json({
        token
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please enter a valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: 'User Not Exist'
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: 'Incorrect Password !'
        });

      const token = await signin(user)
      res.status(200).json({
        token
      });
    } catch (e) {
      console.log(e)
      res.status(500).json(e);
    }
  }
);

router.get('/me', auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: 'Error in Fetching user' });
  }
});

module.exports = router;
