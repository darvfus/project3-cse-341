const mongoose = require('mongoose');

const collaborationSchema = mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },  // Referencia a la tarea
  collaborator: { type: String, required: true },  // Usuario colaborador
  permissions: { type: [String], required: true },  // Permisos de la colaboración
  collaborationDate: { type: Number, required: true },  // Fecha de la colaboración en formato UNIX
  status: { type: String, default: 'active' },
  role: { type: String, required: true },  // Rol del colaborador (por ejemplo, 'collaborator' o 'observer')
  taskTitle: { type: String, required: true },
  taskDescription: { type: String, required: true }
});

module.exports = mongoose.model('Collaboration', collaborationSchema);
