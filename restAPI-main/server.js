require('dotenv').config({path:'./config/.env'}); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');// Import the User model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const app = express();
const PORT = process.env.PORT || 3000;  // Set the port for the server to run on

app.use(express.json()); // Parse JSON request bodies

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();  // Retrieve all users from the database 
    res.json(users);  // Send the users as JSON response
  } catch (err) {
    res.status(500).json({ message: err.message });  // Send error message if there's an error
  }
});

// Route to add a new user
app.post("/users", async (req, res) => {
  try {
    const { name, age } = req.body;  // Extract name and age from request body
    if (!name || !age) {
      return res.status(400).json({ message: "Name and age are required" });  // Return error response if name and age are not provided
    }
    const user = new User({ name, age });
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to edit a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const { name, age } = req.body;
    if (!name || !age) {
      return res.status(400).json({ message: "Name and age are required" });
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      age: req.body.age
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route to remove a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
