const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "Users API",
    description: "API for managing cinema Rommero"
  },
 //host: "localhost:3000", // o la URL de tu servidor
  //schemes: ["http"]
  host: 'project3-cse-341.onrender.com', // URL pública de tu servidor en producción
  schemes: ["https"], // Usar HTTPS en producción
};

const outputFile = "./swagger.json"; // El archivo Swagger generado
const endpointFiles = ["./routes/index.js"]; // Las rutas de tu API

swaggerAutogen(outputFile, endpointFiles, doc); // Genera el swagger.json automáticamente