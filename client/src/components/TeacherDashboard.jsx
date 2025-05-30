import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    description: '',
    subject: ''
  });

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateClass = (e) => {
    e.preventDefault();
    const classCode = generateUniqueCode();
    const newClassData = {
      ...newClass,
      id: Date.now(),
      code: classCode,
      students: [],
      createdAt: new Date().toISOString()
    };

    setClasses([...classes, newClassData]);
    setNewClass({ name: '', description: '', subject: '' });
    setShowCreateClass(false);
  };

  const handleInputChange = (e) => {
    setNewClass({
      ...newClass,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Teacher Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-700">My Classes</h2>
          <button
            onClick={() => setShowCreateClass(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Class
          </button>
        </div>

        {showCreateClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create New Class</h3>
              <form onSubmit={handleCreateClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newClass.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={newClass.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newClass.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateClass(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-500">{classItem.subject}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {classItem.code}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{classItem.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {classItem.students.length} Students
                </span>
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No classes created yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Create New Class" to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard; 