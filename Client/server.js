// client/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/LoginForm', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected!'))
.catch(err => console.error('❌ Connection error:', err));

// Schema and Model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', UserSchema);

// Route to Register
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Register route called:", req.body);
    const user = new User({ username, password });
    await user.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Listen
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});