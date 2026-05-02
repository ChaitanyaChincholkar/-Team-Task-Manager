const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;

    if (req.user.role === 'Admin') {
      // Admin gets tasks for their projects
      const projects = await Project.find({ admin: req.user.id });
      const projectIds = projects.map(p => p._id);
      query.project = { $in: projectIds };
    } else {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query).populate('project').populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, project, assignedTo } = req.body;
    
    // Ensure the admin owns the project
    const projectExists = await Project.findOne({ _id: project, admin: req.user.id });
    if (!projectExists) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      project,
      assignedTo
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Member' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Members can only update status
    if (req.user.role === 'Member') {
      task.status = req.body.status || task.status;
    } else {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.assignedTo = req.body.assignedTo || task.assignedTo;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure the admin owns the project of the task
    const project = await Project.findOne({ _id: task.project, admin: req.user.id });
    if (!project) return res.status(403).json({ message: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
