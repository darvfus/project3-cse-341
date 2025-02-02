const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  roles: { type: [String], required: true },
  fullName: { type: String, required: true },
  profilePicture: { type: String, default: '' },
  status: { type: String, default: 'active' },
  createdAt: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);
