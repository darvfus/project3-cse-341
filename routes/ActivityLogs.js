const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authenticate');


const activityLogsController = require("../controllers/ActivityLog");

// Rutas para manejar las operaciones de los logs de actividad
router.get('/', activityLogsController.getAll); // Obtener todos los logs de actividad
router.get('/:id', activityLogsController.getSingle); // Obtener un log de actividad por ID

router.post('/',isAuthenticated, activityLogsController.createActivityLog); // Crear un nuevo log de actividad
router.put('/:id',isAuthenticated, activityLogsController.updateActivityLog); // Actualizar un log de actividad existente
router.delete('/:id',isAuthenticated, activityLogsController.deleteActivityLog); // Eliminar un log de actividad por ID

module.exports = router;
