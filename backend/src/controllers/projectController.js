const Project = require('../models/Project');
const Task = require('../models/Task');

exports.getProjects = async (req, res) => {
  try {
    if (req.user.role === 'Admin') {
      const projects = await Project.find({ admin: req.user.id });
      res.json(projects);
    } else {
      // Members see projects where they are assigned tasks
      const tasks = await Task.find({ assignedTo: req.user.id }).populate('project');
      const projects = tasks.map(t => t.project).filter((p, index, self) => 
        p && self.findIndex(s => s._id.toString() === p._id.toString()) === index
      );
      res.json(projects);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      admin: req.user.id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, admin: req.user.id });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Also delete associated tasks
    await Task.deleteMany({ project: req.params.id });
    
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
