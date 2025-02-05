const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');

const collaborationsController = require("../controllers/Collaboration");

// Rutas para manejar las operaciones de las colaboraciones
router.get('/', collaborationsController.getAll); // Obtener todas las colaboraciones
router.get('/:id', collaborationsController.getSingle); // Obtener una colaboración por ID

router.post('/', collaborationsController.createCollaboration); // Crear una nueva colaboración
router.put('/:id', collaborationsController.updateCollaboration); // Actualizar una colaboración existente
router.delete('/:id', collaborationsController.deleteCollaboration); // Eliminar una colaboración por ID

module.exports = router;
