const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Task = require('../models/Task');

// Obtener todas las tareas
const getAll = async (req, res) => {
  try {
    const tasks = await mongodb.getDb().db().collection('tasks').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Obtener una tarea por ID
const getSingle = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    const task = await mongodb.getDb().db().collection('tasks').findOne({ _id: new ObjectId(taskId) });
    if (task) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
  console.log('Request Body:', req.body); // Depuración
  const { title, description, status, assignedUser, priority, deadline, createdAt } = req.body;

  if (
    typeof title !== 'string' ||
    typeof description !== 'string' ||
    typeof status !== 'string' ||
    typeof assignedUser !== 'string' ||
    typeof priority !== 'string' ||
    typeof deadline !== 'number' ||
    typeof createdAt !== 'number'
  ) {
    return res.status(400).json({ message: 'Invalid input: check field types' });
  }

  try {
    const task = new Task({
      title,
      description,
      status,
      assignedUser,
      priority,
      deadline,
      createdAt
    });

    const response = await mongodb.getDb().db().collection('tasks').insertOne(task);
    if (response.acknowledged) {
      res.status(201).json({
        message: 'Created new task successfully.',
        task: task
      });
    } else {
      res.status(500).json({ message: 'Error creating task' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
  console.log('Request Body:', req.body); // Depuración
  const { title, description, status, assignedUser, priority, deadline, createdAt } = req.body;
  const taskId = req.params.id;

  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const updateFields = {};
  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (status) updateFields.status = status;
  if (assignedUser) updateFields.assignedUser = assignedUser;
  if (priority) updateFields.priority = priority;
  if (deadline) updateFields.deadline = deadline;
  if (createdAt) updateFields.createdAt = createdAt;

  try {
    const response = await mongodb.getDb().db().collection('tasks').updateOne(
      { _id: new ObjectId(taskId) },
      { $set: updateFields }
    );

    if (response.modifiedCount > 0) {
      const updatedTask = await mongodb.getDb().db().collection('tasks').findOne({ _id: new ObjectId(taskId) });
      res.status(200).json({
        message: 'Updated task successfully.',
        task: updatedTask
      });
    } else {
      res.status(404).json({ message: 'Task not found or no changes applied' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  const taskId = req.params.id;
  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  try {
    const response = await mongodb.getDb().db().collection('tasks').deleteOne({ _id: new ObjectId(taskId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createTask,
  updateTask,
  deleteTask
};
