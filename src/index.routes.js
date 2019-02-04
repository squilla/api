const express = require('express');
const authRoutes = require('./server/auth/auth.route');
const artistRoutes = require('./server/artist/artist.route');
const userRoutes = require('./server/user/user.route');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/artists', artistRoutes);
router.use('/users', userRoutes);

module.exports = router;
