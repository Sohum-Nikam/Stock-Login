const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB successfully');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// API endpoint to store form data
app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json({ message: '✅ User data saved to MongoDB' });
    console.log('Received form data:', req.body);
  } catch (error) {
    console.error('❌ Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});