const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./config/db');

dotenv.config();

// Production deploy trigger: Prisma 7 Compliance Fix
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/visits', require('./routes/visitRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/location', require('./routes/locationRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/zones', require('./routes/zoneRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/releases', require('./routes/releaseRoutes'));

app.get('/api/health', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    res.json({ 
      status: 'UP', 
      database: 'CONNECTED', 
      userCount,
      env: {
        node: process.version,
        port: process.env.PORT
      }
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'DOWN', 
      database: 'DISCONNECTED', 
      error: err.message 
    });
  }
});

app.get('/', (req, res) => {
  res.send(`Field Staff Management API is running... (Last Deploy: ${new Date().toISOString()})`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
