require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
// TODO: import other routes

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const apiRoutes = require('./routes/api');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
// Core API Routes

app.get('/', (req, res) => {
  res.send('Supply Chain API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
