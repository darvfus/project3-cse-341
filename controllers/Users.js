const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const User = require('../models/User');


// Obtener todos los usuarios
const getAll = async (req, res) => {
  try {
    const users = await mongodb.getDb().db().collection('users').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Obtener un usuario por ID
const getSingle = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await mongodb.getDb().db().collection('users').findOne({ _id: new ObjectId(userId) });
    if (user) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  console.log('Request Body:', req.body); // Depuración
  const { username, email, password, roles } = req.body;

  if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid input: username, email, and password must be strings' });
  }

  try {
    const user = new User({
      username,
      email,
      password,
      roles: Array.isArray(roles) ? roles : []
    });

    const response = await mongodb.getDb().db().collection('users').insertOne(user);
    if (response.acknowledged) {
      res.status(201).json({
        message: 'Created new user successfully.',
        user: user
      });
    } else {
      res.status(500).json({ message: 'Error creating user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
  console.log('Request Body:', req.body); // Depuración
  const { username, email, password, roles } = req.body;
  const userId = req.params.id;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (password) updateFields.password = password;
  if (roles) updateFields.roles = Array.isArray(roles) ? roles : [];

  try {
    const response = await mongodb.getDb().db().collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields }
    );

    if (response.modifiedCount > 0) {
      const updatedUser = await mongodb.getDb().db().collection('users').findOne({ _id: new ObjectId(userId) });
      res.status(200).json({
        message: 'Updated user successfully.',
        user: updatedUser
      });
    } else {
      res.status(404).json({ message: 'User not found or no changes applied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const response = await mongodb.getDb().db().collection('users').deleteOne({ _id: new ObjectId(userId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
