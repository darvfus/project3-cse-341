const express = require('express');
const router = express.Router();

const usersController = require("../controllers/Users ");

// Rutas para manejar las operaciones de los usuarios
router.get('/', usersController.getAll); // Obtener todos los usuarios
router.get('/:id', usersController.getSingle); // Obtener un usuario por ID

router.post('/', usersController.createUser); // Crear un nuevo usuario
router.put('/:id', usersController.updateUser); // Actualizar un usuario existente
router.delete('/:id', usersController.deleteUser); // Eliminar un usuario por ID

module.exports = router;
