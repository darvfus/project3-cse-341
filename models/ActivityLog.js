const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema({
  userId: { type: String, required: true },  // Referencia al usuario
  action: { type: String, required: true },  // Acción realizada
  details: { type: String, required: true },  // Detalles sobre la acción
  target: { type: String, required: true },  // Objetivo de la acción (puede ser taskId, projectId, etc.)
  timestamp: { type: Number, required: true },  // Fecha y hora en formato UNIX
  ipAddress: { type: String, required: true },  // IP del usuario
  status: { type: String, default: 'success' },
  location: { type: String, required: true }  // Ubicación del usuario al momento de la acción
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
