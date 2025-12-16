const Project = require('../models/Project');
const Task = require('../models/Task');
const Sale = require('../models/Sale');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
    const { saleId, name, endDate } = req.body;

    try {
        const sale = await Sale.findById(saleId);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        const project = await Project.create({
            saleId,
            name,
            endDate,
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Assign Task
// @route   POST /api/projects/tasks
// @access  Private/Admin
const assignTask = async (req, res) => {
    const { projectId, employeeId, name, description, deadline, salary } = req.body;

    try {
        const task = await Task.create({
            projectId,
            employeeId,
            name,
            description,
            deadline,
            salary,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update task status (e.g., COMPLETED)
// @route   PUT /api/projects/tasks/:id/status
// @access  Private (Admin or Employee)
const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Verify ownership if needed: if not admin, must be assigned employee
        if (req.user.role !== 'admin' && task.employeeId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        task.status = status;
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all projects (with tasks)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        // Simple fetch, can be enhanced with aggregation
        const projects = await Project.find({}).populate('saleId');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get tasks (optionally filter by employee)
// @route   GET /api/projects/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'employee') {
            query.employeeId = req.user._id;
        }

        // Admin can filter by passing ?employeeId=...
        if (req.user.role === 'admin' && req.query.employeeId) {
            query.employeeId = req.query.employeeId;
        }

        const tasks = await Task.find(query).populate('projectId').populate('employeeId', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProject, assignTask, updateTaskStatus, getProjects, getTasks };
