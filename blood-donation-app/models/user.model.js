const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schema for storing user login credentials
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;

