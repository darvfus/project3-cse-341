const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); // Archivo de configuración de Swagger
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS manual
app.use((req, res, next) => {
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
});

// Middlewares
app
  .use(bodyParser.json())
  .use(logger('dev'))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)) // Documentación Swagger
  .use('/', require('./routes'));

// Conexión a la base de datos y inicio del servidor
mongodb.initDb((err) => {
  if (err) {
    console.log('Error al conectar a la base de datos:', err);
  } else {
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
      console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
    });
  }
});
