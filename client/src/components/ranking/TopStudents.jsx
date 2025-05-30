import React from 'react';

const TopStudents = ({ students }) => {
    if (!students || students.length === 0) {
        return (
            <div className="text-center text-gray-500 py-4">
                No top students data available.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {students.map((student, index) => (
                <div
                    key={student._id}
                    className={`flex items-center p-4 rounded-lg ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-100 to-yellow-200' :
                        index === 1 ? 'bg-gradient-to-r from-gray-100 to-gray-200' :
                        index === 2 ? 'bg-gradient-to-r from-amber-100 to-amber-200' :
                        'bg-gray-50'
                    }`}
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-4">
                        <span className="text-lg font-semibold">{index + 1}</span>
                    </div>
                    
                    <div className="flex-grow">
                        <h3 className="font-semibold">
                            {student.student?.name || 'Unknown Student'}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {student.class?.name || 'Unknown Class'}
                        </p>
                    </div>
                    
                    <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                            {student.points} pts
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopStudents; 