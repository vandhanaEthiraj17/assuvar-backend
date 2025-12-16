const express = require('express');
const router = express.Router();
const { createProject, assignTask, updateTaskStatus, getProjects, getTasks } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createProject)
    .get(protect, getProjects); // Employees/Admin can see projects? Prompt says "Employee... Can view assigned tasks" nothing about projects. Let's keep strict.
// Actually, for now let's allow Admin only for projects list, and specialized Task list for employees.

// Refined Project Routes
router.post('/', protect, admin, createProject);
router.get('/', protect, admin, getProjects);

// Task Routes
router.post('/tasks', protect, admin, assignTask);
router.get('/tasks', protect, getTasks); // Authenticated users (Admin/Employee)
router.put('/tasks/:id/status', protect, updateTaskStatus);

module.exports = router;
