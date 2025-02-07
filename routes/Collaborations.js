const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');

const collaborationsController = require("../controllers/Collaboration");

// Rutas para manejar las operaciones de las colaboraciones
router.get('/', collaborationsController.getAll); // Obtener todas las colaboraciones
router.get('/:id', collaborationsController.getSingle); // Obtener una colaboración por ID

router.post('/',isAuthenticated, collaborationsController.createCollaboration); // Crear una nueva colaboración
router.put('/:id',isAuthenticated, collaborationsController.updateCollaboration); // Actualizar una colaboración existente
router.delete('/:id',isAuthenticated, collaborationsController.deleteCollaboration); // Eliminar una colaboración por ID

module.exports = router;
