
// Importing Mongoose library
const mongoose = require('mongoose');

// Defining a new Mongoose schema for 'User'
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  }
});
// Creating a Mongoose model for 'User' using the defined schema
const User = mongoose.model('User', userSchema);
// Exporting the 'User' model to be used in other files
module.exports = User;
