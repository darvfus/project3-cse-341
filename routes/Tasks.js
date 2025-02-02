const express = require('express');
const router = express.Router();

const tasksController = require("../controllers/Tasks");

// Rutas para manejar las operaciones de las tareas
router.get('/', tasksController.getAll); // Obtener todas las tareas
router.get('/:id', tasksController.getSingle); // Obtener una tarea por ID

router.post('/', tasksController.createTask); // Crear una nueva tarea
router.put('/:id', tasksController.updateTask); // Actualizar una tarea existente
router.delete('/:id', tasksController.deleteTask); // Eliminar una tarea por ID

module.exports = router;
