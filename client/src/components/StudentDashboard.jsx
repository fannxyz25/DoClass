import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [showJoinClass, setShowJoinClass] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [error, setError] = useState('');

  const handleJoinClass = (e) => {
    e.preventDefault();
    setError('');

    // Here you would typically make an API call to validate and join the class
    // For now, we'll simulate it with a timeout
    setTimeout(() => {
      // Simulate successful join
      const newClass = {
        id: Date.now(),
        code: classCode,
        name: `Class ${classCode}`,
        subject: 'Sample Subject',
        teacher: 'Teacher Name'
      };

      setJoinedClasses([...joinedClasses, newClass]);
      setClassCode('');
      setShowJoinClass(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
            <button
              onClick={() => navigate('/')}
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
            onClick={() => setShowJoinClass(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Class
          </button>
        </div>

        {showJoinClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Join a Class</h3>
              <form onSubmit={handleJoinClass} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class Code
                  </label>
                  <input
                    type="text"
                    value={classCode}
                    onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                    placeholder="Enter class code"
                    required
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowJoinClass(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Join Class
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joinedClasses.map((classItem) => (
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
              <p className="text-gray-600 text-sm mb-4">
                Teacher: {classItem.teacher}
              </p>
              <div className="flex justify-end">
                <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                  View Class
                </button>
              </div>
            </div>
          ))}
        </div>

        {joinedClasses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">You haven't joined any classes yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Click "Join Class" to enter a class code
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard; 