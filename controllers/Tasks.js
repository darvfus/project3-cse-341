const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Task = require('../models/Task');

const validateTask = (task) => {
  if (!task.title || typeof task.title !== 'string') return 'Invalid or missing title';
  if (!task.description || typeof task.description !== 'string') return 'Invalid or missing description';
  if (!task.status || typeof task.status !== 'string') return 'Invalid or missing status';
  if (task.assignedUser && typeof task.assignedUser !== 'string') return 'Invalid assignedUser';
  return null;
};

const getAll = async (req, res) => {
  try {
    const tasks = await mongodb.getDb().db().collection('tasks').find().toArray();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

const getSingle = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!ObjectId.isValid(taskId)) return res.status(400).json({ message: 'Invalid task ID' });

    const task = await mongodb.getDb().db().collection('tasks').findOne({ _id: new ObjectId(taskId) });
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
};

const createTask = async (req, res) => {
  const validationError = validateTask(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const task = new Task(req.body);
    const response = await mongodb.getDb().db().collection('tasks').insertOne(task);
    response.acknowledged
      ? res.status(201).json({ message: 'Created new task successfully', task })
      : res.status(500).json({ message: 'Error creating task' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  if (!ObjectId.isValid(taskId)) return res.status(400).json({ message: 'Invalid task ID' });

  const validationError = validateTask(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const response = await mongodb.getDb().db().collection('tasks').updateOne(
      { _id: new ObjectId(taskId) },
      { $set: req.body }
    );

    response.modifiedCount > 0
      ? res.status(200).json({ message: 'Updated task successfully', task: req.body })
      : res.status(404).json({ message: 'Task not found or no changes made' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!ObjectId.isValid(taskId)) return res.status(400).json({ message: 'Invalid task ID' });

    const response = await mongodb.getDb().db().collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
    response.deletedCount > 0
      ? res.status(200).json({ message: 'Deleted task successfully' })
      : res.status(404).json({ message: 'Task not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

module.exports = { getAll, getSingle, createTask, updateTask, deleteTask };
