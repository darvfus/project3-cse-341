const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;
const Collaboration = require('../models/Collaboration');

const validateCollaboration = (taskId, userId, role, permissions) => {
  const errors = [];
  if (!taskId || typeof taskId !== 'string') errors.push('Invalid or missing taskId');
  if (!userId || typeof userId !== 'string') errors.push('Invalid or missing userId');
  if (!role || typeof role !== 'string') errors.push('Invalid or missing role');
  if (!Array.isArray(permissions) || permissions.length === 0) errors.push('Invalid or missing permissions');
  return errors;
};

// Obtener todas las colaboraciones
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection('collaboration').find();
    const collaboration = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(collaboration);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collaboration', error });
  }
};

// Obtener una colaboración por ID
const getSingle = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    if (!ObjectId.isValid(collaborationId)) {
      return res.status(400).json({ message: 'Invalid collaboration ID' });
    }

    const collaboration = await mongodb.getDb().db().collection('collaboration').findOne({ _id: new ObjectId(collaborationId) });
    if (collaboration) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(collaboration);
    } else {
      res.status(404).json({ message: 'Collaboration not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching collaboration', error });
  }
};

// Crear una nueva colaboración
const createCollaboration = async (req, res) => {
  const { taskId, userId, role, permissions } = req.body;
  const errors = validateCollaboration(taskId, userId, role, permissions);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation errors', errors });
  }

  try {
    const collaboration = new Collaboration({ taskId, userId, role, permissions });
    const response = await mongodb.getDb().db().collection('collaboration').insertOne(collaboration);
    if (response.acknowledged) {
      res.status(201).json({ message: "Created new collaboration successfully.", collaboration });
    } else {
      res.status(500).json({ message: 'Error creating collaboration', error: response.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating collaboration', error });
  }
};

// Actualizar una colaboración existente
const updateCollaboration = async (req, res) => {
  const { taskId, userId, role, permissions } = req.body;
  const errors = validateCollaboration(taskId, userId, role, permissions);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation errors', errors });
  }

  try {
    const collaborationId = req.params.id;
    if (!ObjectId.isValid(collaborationId)) {
      return res.status(400).json({ message: 'Invalid collaboration ID' });
    }

    const updatedCollaboration = { taskId, userId, role, permissions };
    const response = await mongodb.getDb().db().collection('collaboration').replaceOne({ _id: new ObjectId(collaborationId) }, updatedCollaboration);

    if (response.modifiedCount > 0) {
      const updatedCollaborationData = await mongodb.getDb().db().collection('collaboration').findOne({ _id: new ObjectId(collaborationId) });
      res.status(200).json({ message: 'Updated collaboration successfully.', collaboration: updatedCollaborationData });
    } else {
      res.status(500).json({ message: 'Error updating the collaboration', error: response.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating collaboration', error });
  }
};

// Eliminar una colaboración
const deleteCollaboration = async (req, res) => {
  try {
    const collaborationId = req.params.id;
    if (!ObjectId.isValid(collaborationId)) {
      return res.status(400).json({ message: 'Invalid collaboration ID' });
    }

    const response = await mongodb.getDb().db().collection('collaboration').deleteOne({ _id: new ObjectId(collaborationId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: "Deleted collaboration successfully.", response });
    } else {
      res.status(500).json({ message: 'Error deleting the collaboration', error: response.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting collaboration', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createCollaboration,
  updateCollaboration,
  deleteCollaboration,
};
