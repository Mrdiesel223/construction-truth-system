const prisma = require('../config/db');
const { Parser } = require('json2csv');

const getDailySummary = async (req, res) => {
  const { date } = req.query; // Expects YYYY-MM-DD
  const targetDate = date ? new Date(date) : new Date();
  
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  try {
    // 1. Aggregate Attendance
    const attendance = await prisma.attendance.findMany({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      include: { user: { select: { name: true } } }
    });

    // 2. Aggregate Tasks Completed
    const completedTasks = await prisma.task.findMany({
      where: { 
        status: 'COMPLETED',
        updatedAt: { gte: startOfDay, lte: endOfDay }
      },
      include: { assignedTo: { select: { name: true } } }
    });

    // 3. Aggregate Alerts (Breaches)
    const alerts = await prisma.alert.findMany({
      where: { createdAt: { gte: startOfDay, lte: endOfDay } },
      include: { user: { select: { name: true } } }
    });

    res.json({
      date: startOfDay.toISOString().split('T')[0],
      summary: {
        totalAttendance: attendance.length,
        tasksCompleted: completedTasks.length,
        criticalAlerts: alerts.filter(a => a.severity === 'HIGH').length
      },
      details: {
        attendance,
        completedTasks,
        alerts
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const exportCSV = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: { assignedTo: { select: { name: true } } }
    });

    const fields = ['id', 'title', 'site', 'assignedTo.name', 'status', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(tasks);

    res.header('Content-Type', 'text/csv');
    res.attachment('site-truth-report.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Export failed');
  }
};

module.exports = { getDailySummary, exportCSV };
