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

// ✅ 1. MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));



// ✅ 2. DigiLocker OAuth Initiation
app.get('/digilocker/auth', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send("DigiLocker credentials are not set in .env");
  }

  const hashInput = clientSecret + clientId + timestamp;
  const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

  const widgetHtml = `
    <html>
      <head><title>DigiLocker Auth</title></head>
      <body>
        <script src="https://devservices.digitallocker.gov.in/requester/api/2/dl.js"
                id="dlshare"
                data-app-id="${clientId}"
                data-app-hash="${hash}"
                time-stamp="${timestamp}"
                data-callback="dlCallback">
        </script>
        <script>
          function dlCallback(response) {
            if (response && response.uri) {
              window.location.href = '/digilocker/callback?docUri=' + encodeURIComponent(response.uri);
            } else {
              alert("DigiLocker authentication failed.");
            }
          }
        </script>
      </body>
    </html>
  `;

  res.send(widgetHtml);
});

// ✅ 3. DigiLocker Callback
app.get('/digilocker/callback', (req, res) => {
  const { docUri } = req.query;

  if (!docUri) {
    return res.status(400).send("Missing docUri in DigiLocker callback.");
  }

  // Redirect to frontend with docUri
  res.redirect(`/index.html?docUri=${encodeURIComponent(docUri)}`);
});

// ✅ 4. Form Submission
app.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    console.log("Received form data:", formData);

    const user = new User(formData);
    await user.save();

    res.status(200).json({ message: 'User registered and saved to MongoDB' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ 5. Server Launch
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});