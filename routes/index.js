const express = require('express');
const router = express.Router();
const passport = require('passport'); // Importa passport

// Ruta principal
//router.get('/', (req, res) => {
 // res.send('Hello World');
//});

// Rutas para Users
router.use('/users', require('./Users'));  // Asegúrate de que users.js exporte un router

// Rutas para Tasks
router.use('/tasks', require('./Tasks'));  // Asegúrate de que tasks.js exporte un router

// Rutas para Collaborations
router.use('/collaborations', require('./Collaborations'));  // Asegúrate de que collaborations.js exporte un router

// Rutas para ActivityLogs
router.use('/activitylogs', require('./ActivityLogs'));  // Asegúrate de que activityLogs.js exporte un router
router.use('/swagger', require('./swagger')); // Asegúrate de que el archivo swagger.js exista

// Rutas de autenticación
router.get('/login', passport.authenticate('github'), (req, res) => {});
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
