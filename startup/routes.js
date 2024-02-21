const express = require('express');
const cors = require('cors');

const authRoutes = require('../routes/auth.routes');
const userRoutes = require('../routes/user.routes');
const carRoutes = require('../routes/car.routes');
const rideRoutes = require('../routes/ride.routes');
const adminRoutes = require('../routes/admin.routes');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json({ limit: '25mb' }));
  app.use(cors());
  //   app.use(express.json());

  app.use('/auth', authRoutes);
  app.use('/car', carRoutes);
  app.use('/user', userRoutes);
  app.use('/ride', rideRoutes);
  app.use('/admin', adminRoutes);

  app.use(error);
};
