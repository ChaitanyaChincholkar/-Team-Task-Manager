import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // For tasks
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (user.role === 'Admin') {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [user]);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name, description });
      setName('');
      setDescription('');
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        project: selectedProject,
        assignedTo: taskAssignee,
        dueDate: taskDueDate
      });
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
      setTaskAssignee('');
      setSelectedProject(null);
      alert('Task created successfully');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                  {user.role === 'Admin' && (
                    <button onClick={() => deleteProject(project._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-4 flex-1">{project.description}</p>
                {user.role === 'Admin' && (
                  <button 
                    onClick={() => setSelectedProject(project._id)}
                    className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition duration-150"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Task
                  </button>
                )}
              </div>
            ))}
          </div>
          {projects.length === 0 && (
            <p className="text-gray-500 text-center py-8">No projects available.</p>
          )}
        </div>

        {user.role === 'Admin' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Project</h2>
              <form onSubmit={createProject} className="space-y-4">
                <div>
                  <input type="text" placeholder="Project Name" required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <textarea placeholder="Description" rows="3" value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">Create Project</button>
              </form>
            </div>

            {selectedProject && (
              <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-4">New Task for Project</h2>
                <form onSubmit={createTask} className="space-y-4">
                  <div>
                    <input type="text" placeholder="Task Title" required value={taskTitle} onChange={e => setTaskTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <textarea placeholder="Task Description" rows="2" value={taskDesc} onChange={e => setTaskDesc(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"></textarea>
                  </div>
                  <div>
                    <input type="date" required value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <select required value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white">
                      <option value="" disabled>Assign to...</option>
                      {users.map(u => (
                        <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setSelectedProject(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition">Cancel</button>
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition">Save Task</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
