const express = require('express');
const port = process.env.PORT || 3000;
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');

// Configuración de dotenv
dotenv.config();

const app = express();

// Middlewares
app
  .use(logger('dev'))
  .use(bodyParser.json())
  .use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: true,
    })
  )
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
  })
  .use(cors()) // Configuración simplificada de CORS
  .use(passport.initialize())
  .use(passport.session())
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/', require('./routes/index.js')); // Rutas principales

// Configuración de Passport con GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile); // Pasa el perfil completo
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user); // Guarda el perfil en la sesión
});

passport.deserializeUser((user, done) => {
  done(null, user); // Recupera el perfil de la sesión
});

// Rutas de autenticación
app.get(
  '/login',
  passport.authenticate('github', { scope: ['user:email'] })
);

app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user; // Guarda el perfil en la sesión
    res.redirect('/'); // Redirige a la página principal
  }
);

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(); // Destruye la sesión
    res.redirect('/');
  });
});

// Ruta principal
app.get('/', (req, res) => {
  if (req.session.user) {
    const userName =
      req.session.user.displayName || req.session.user.username || 'Anonymous';
    res.send(`Logged in as ${userName}`);
  } else {
    res.send('Logged Out');
  }
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Inicialización de la base de datos
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on ${port}`);
      console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
    });
  }
});
