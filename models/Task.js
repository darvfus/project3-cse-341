const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
  assignedUser: { type: String, required: true },  // Referencia al usuario asignado
  priority: { type: String, required: true },
  deadline: { type: Number, required: true },  // Fecha límite en formato UNIX
  createdAt: { type: Number, required: true }  // Fecha de creación en formato UNIX
});

module.exports = mongoose.model('Task', taskSchema);
