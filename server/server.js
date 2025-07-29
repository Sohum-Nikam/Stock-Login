require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const User = require('./models/User');

const app = express();


// 🌐 Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));


// 1️⃣ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


// 2️⃣ DigiLocker Auth Flow
app.get('/digilocker/auth', (req, res) => {
    const timestamp = Math.floor(Date.now() / 1000).toString();
  
    const clientId = process.env.CLIENT_ID;        // From your .env
    const clientSecret = process.env.CLIENT_SECRET; // From your .env
  
    const hashInput = clientSecret + clientId + timestamp;
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');
  
    const widget = `
      <html>
        <head><title>DigiLocker Authentication</title></head>
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
              if (response.uri) {
                window.location.href = '/digilocker/callback?docUri=' + encodeURIComponent(response.uri);
              } else {
                alert("DigiLocker failed to return a document URI.");
              }
            }
          </script>
        </body>
      </html>
    `;
  
    res.send(widget);
  });



// 3️⃣ DigiLocker Callback Handler
app.get('/digilocker/callback', (req, res) => {
  const { docUri } = req.query;

  if (!docUri) {
    return res.status(400).send('⚠️ DigiLocker callback missing docUri');
  }

  console.log('DigiLocker Document URI received:', docUri);

  // Optionally: Use DigiLocker Pull API here to fetch document content using docUri

  res.redirect(`/index.html?docUri=${encodeURIComponent(docUri)}`);
});

// 4️⃣ Registration API - Save Form Data
app.post('/register', async (req, res) => {
  try {
    const formData = req.body;
    console.log("Received registration data:", formData);

    const newUser = new User(formData);
    await newUser.save();

    res.status(200).json({ message: 'User registered and saved to MongoDB' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5️⃣ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});