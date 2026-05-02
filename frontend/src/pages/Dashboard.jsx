import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { isPast, parseISO } from 'date-fns';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/tasks${filter ? `?status=${filter}` : ''}`);
      setTasks(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const updateTaskStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
          >
            <option value="">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map(task => {
          const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && task.status !== 'Completed';
          return (
            <div key={task._id} className={`bg-white rounded-xl shadow-sm border ${isOverdue ? 'border-red-300 shadow-red-100' : 'border-gray-200'} p-6 transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className="font-medium mr-1">Project:</span> {task.project?.name || 'Unknown'}
              </div>

              <div className="flex gap-2 mt-auto">
                {task.status !== 'Completed' && (
                  <button
                    onClick={() => updateTaskStatus(task._id, 'Completed')}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 transition duration-150"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Complete
                  </button>
                )}
                {task.status === 'Pending' && (
                  <button
                    onClick={() => updateTaskStatus(task._id, 'In Progress')}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition duration-150"
                  >
                    <Clock className="w-4 h-4 mr-2" /> Start
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found. Try changing your filters.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
