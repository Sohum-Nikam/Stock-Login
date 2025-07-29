// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB successfully');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// 1️⃣ DigiLocker Auth Endpoint
app.get('/digilocker/auth', (req, res) => {
  const ts = Math.floor(Date.now() / 1000).toString();
  const hashInput = process.env.CLIENT_SECRET + process.env.CLIENT_ID + ts;
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

  const widget = `
    <html>
      <head><title>DigiLocker Auth</title></head>
      <body>
        <script src="https://devservices.digitallocker.gov.in/requester/api/2/dl.js"
          id="dlshare" data-app-id="${process.env.CLIENT_ID}"
          data-app-hash="${hash}" time-stamp="${ts}"
          data-callback="dlCallback">
        </script>
        <script>
          function dlCallback(response) {
            window.location = '/digilocker/callback?docUri=' + encodeURIComponent(response.uri);
          }
        </script>
      </body>
    </html>
  `;
  res.send(widget);
});

// 2️⃣ DigiLocker Callback Endpoint
app.get('/digilocker/callback', (req, res) => {
  const { docUri } = req.query;
  if (!docUri) {
    return res.status(400).send("Missing docUri from DigiLocker.");
  }

  // Ideally: Use access token to fetch document content from DigiLocker here
  // For now, redirect back to frontend with docUri as placeholder
  res.redirect(`/index.html?docUri=${encodeURIComponent(docUri)}`);
});

// 3️⃣ Register Form Endpoint
app.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    console.log('📥 Received form data:', req.body);
    res.status(200).json({ message: '✅ User data saved to MongoDB' });
  } catch (error) {
    console.error('❌ Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});