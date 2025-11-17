const express = require('express');
const basicAuth = require('basic-auth');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.SERVER_PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic authentication middleware
const auth = (req, res, next) => {
  const credentials = basicAuth(req);
  
  // Credentials from environment variables
  const validUsername = process.env.AUTH_USERNAME || 'admin';
  const validPassword = process.env.AUTH_PASSWORD || 'admin';
  
  if (!credentials || credentials.name !== validUsername || credentials.pass !== validPassword) {
    res.set('WWW-Authenticate', 'Basic realm="Protected Area"');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

// Public endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString() 
  });
});

// Protected POST endpoint
app.post(process.env.PROMOTION_ENDPOINT || '/promotion', auth, (req, res) => {
  console.log('Received promotion data:', req.body);
  res.json({ 
    message: 'Promotion data received successfully',
    receivedData: req.body,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.SERVER_URL || `http://localhost:${PORT}`}`);
  console.log(`Protected endpoint: ${process.env.SERVER_URL || `http://localhost:${PORT}`}${process.env.PROMOTION_ENDPOINT || '/promotion'}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
