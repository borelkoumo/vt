const express = require('express');
const basicAuth = require('basic-auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic authentication middleware
const auth = (req, res, next) => {
  const credentials = basicAuth(req);
  
  // Default credentials - change these in production
  const validUsername = 'admin';
  const validPassword = 'password123';
  
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
app.post('/promotion', auth, (req, res) => {
  const { data } = req.body;
  res.json({ 
    message: 'Data received successfully',
    receivedData: data,
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
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Protected endpoint: http://localhost:${PORT}/promotion`);
});
