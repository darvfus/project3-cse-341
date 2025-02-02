const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const ActivityLog = require('../models/ActivityLog');

// Función para validar los datos de entrada
const validateActivityLog = (data) => {
  const { userId, action, details, target, timestamp, ipAddress, status, location } = data;
  
  if (!ObjectId.isValid(userId)) return 'Invalid userId';
  if (typeof action !== 'string' || action.trim() === '') return 'Action must be a non-empty string';
  if (typeof details !== 'string' || details.trim() === '') return 'Details must be a non-empty string';
  if (typeof target !== 'string' || target.trim() === '') return 'Target must be a non-empty string';
  if (isNaN(Date.parse(timestamp))) return 'Invalid timestamp format';
  if (!/^\d+\.\d+\.\d+\.\d+$/.test(ipAddress)) return 'Invalid IP address format';
  if (typeof status !== 'string' || !['success', 'failure', 'pending'].includes(status.toLowerCase())) return 'Status must be success, failure, or pending';
  if (typeof location !== 'string' || location.trim() === '') return 'Location must be a non-empty string';
  
  return null;
};

// Obtener todos los logs de actividades
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('activitylogs').find();
    const activitylogs = await result.toArray();
    res.status(200).json(activitylogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error });
  }
};

// Obtener un log de actividad por ID
const getSingle = async (req, res) => {
  try {
    const logId = req.params.id;
    if (!ObjectId.isValid(logId)) {
      return res.status(400).json({ message: 'Invalid activity log ID' });
    }

    const activityLog = await mongodb.getDb().db().collection('activitylogs').findOne({ _id: new ObjectId(logId) });
    
    if (!activityLog) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    res.status(200).json(activityLog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity log', error });
  }
};

// Crear un nuevo log de actividad
const createActivityLog = async (req, res) => {
  const validationError = validateActivityLog(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const activityLog = new ActivityLog(req.body);
    const response = await mongodb.getDb().db().collection('activitylogs').insertOne(activityLog);
    
    if (response.acknowledged) {
      res.status(201).json({ message: 'Created new activity log successfully.', activityLog });
    } else {
      res.status(500).json({ message: 'Error creating activity log' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity log', error });
  }
};

// Actualizar un log de actividad
const updateActivityLog = async (req, res) => {
  const logId = req.params.id;
  if (!ObjectId.isValid(logId)) {
    return res.status(400).json({ message: 'Invalid activity log ID' });
  }

  const validationError = validateActivityLog(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  try {
    const logExists = await mongodb.getDb().db().collection('activitylogs').findOne({ _id: new ObjectId(logId) });
    if (!logExists) {
      return res.status(404).json({ message: 'Activity log not found' });
    }

    const response = await mongodb.getDb().db().collection('activitylogs').replaceOne({ _id: new ObjectId(logId) }, req.body);
    
    if (response.modifiedCount > 0) {
      const updatedActivityLog = await mongodb.getDb().db().collection('activitylogs').findOne({ _id: new ObjectId(logId) });
      res.status(200).json({ message: 'Updated activity log successfully.', activityLog: updatedActivityLog });
    } else {
      res.status(500).json({ message: 'Error updating the activity log' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating activity log', error });
  }
};

// Eliminar un log de actividad
const deleteActivityLog = async (req, res) => {
  try {
    const logId = req.params.id;
    if (!ObjectId.isValid(logId)) {
      return res.status(400).json({ message: 'Invalid activity log ID' });
    }

    const response = await mongodb.getDb().db().collection('activitylogs').deleteOne({ _id: new ObjectId(logId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Deleted activity log successfully.' });
    } else {
      res.status(404).json({ message: 'Activity log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting activity log', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createActivityLog,
  updateActivityLog,
  deleteActivityLog,
};
