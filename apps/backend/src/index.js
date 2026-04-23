const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

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

app.get('/', (req, res) => {
  res.send('Field Staff Management API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
