const prisma = require('../config/db');
const { getDistance } = require('../utils/geo');

// Create Intelligence Task
const createTask = async (req, res) => {
  const { 
    title, description, zoneId, 
    expectedStartTime, expectedEndTime, 
    expectedDuration, expectedFrequency,
    workerIds 
  } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        zoneId: parseInt(zoneId),
        expectedStartTime: expectedStartTime ? new Date(expectedStartTime) : null,
        expectedEndTime: expectedEndTime ? new Date(expectedEndTime) : null,
        expectedDuration: parseInt(expectedDuration),
        expectedFrequency,
        status: 'PENDING',
        assignedWorkers: {
          connect: workerIds.map(id => ({ id: parseInt(id) }))
        }
      }
    });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Transition: Start/Pause/Resume/End
const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status, lat, lng, fileUrl } = req.body; // Status coming from Mobile

  try {
    const task = await prisma.task.findUnique({ 
      where: { id: parseInt(taskId) },
      include: { zone: true }
    });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // 1. Manage Logs (Work Intervals)
    if (status === 'IN_PROGRESS') {
      await prisma.taskLog.create({
        data: { taskId: task.id, userId: req.user.id, type: 'WORK', startTime: new Date() }
      });
    } else if (status === 'PAUSED' || status === 'COMPLETED') {
      const activeLog = await prisma.taskLog.findFirst({
        where: { taskId: task.id, userId: req.user.id, endTime: null },
        orderBy: { startTime: 'desc' }
      });

      if (activeLog) {
        const endTime = new Date();
        const duration = Math.round((endTime - activeLog.startTime) / 60000);
        await prisma.taskLog.update({
          where: { id: activeLog.id },
          data: { endTime, duration }
        });
      }
    }

    // 2. Intelligence: Validation on Completion
    if (status === 'COMPLETED') {
      // a. Proof Check
      if (!fileUrl) {
         await createEvent(req.user.id, task.id, 'MISSING_PROOF', 'HIGH', 'Task completed without visual proof');
      }

      // b. Location Check (Zone Validation)
      const distance = getDistance(lat, lng, task.zone.lat, task.zone.lng);
      if (distance > task.zone.radius) {
        await createEvent(req.user.id, task.id, 'GEOFENCE_BREACH', 'CRITICAL', `Task completed outside zone ${task.zone.name}`);
      }

      // c. Duration Check
      const totalWorkLogs = await prisma.taskLog.findMany({ where: { taskId: task.id, userId: req.user.id, type: 'WORK' } });
      const actualDuration = totalWorkLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
      
      if (actualDuration < (task.expectedDuration || 0)) {
        await createEvent(req.user.id, task.id, 'LOW_DURATION', 'MEDIUM', `Actual work (${actualDuration}m) less than expected (${task.expectedDuration}m)`);
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: { status }
    });

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

async function createEvent(userId, taskId, type, severity, message) {
  await prisma.event.create({
    data: { userId, taskId, type, severity, message }
  });
}

const getMyTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assignedWorkers: { some: { id: req.user.id } } },
      include: { zone: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = { createTask, updateTaskStatus, getMyTasks };
