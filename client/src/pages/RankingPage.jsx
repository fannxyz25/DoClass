import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../components/UserContext';
import ClassRanking from '../components/ranking/ClassRanking';
import TopStudents from '../components/ranking/TopStudents';

const RankingPage = () => {
    const [classRankings, setClassRankings] = useState([]);
    const [topStudents, setTopStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [availableClasses, setAvailableClasses] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        console.log('User data in RankingPage:', user);
        const fetchData = async () => {
            try {
                // Fetch top students
                const topStudentsRes = await axios.get('http://localhost:5000/api/ranking/top-students', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Top students data:', topStudentsRes.data);
                setTopStudents(topStudentsRes.data);

                // If user is a teacher, fetch their classes and populate dropdown
                if (user?.role === 'guru') {
                    console.log('Fetching classes for guru:', user._id);
                    const classesRes = await axios.get(`http://localhost:5000/api/kelas?userId=${user._id}&role=guru`, {
                         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    console.log('Classes data received:', classesRes.data);
                    setAvailableClasses(classesRes.data);
                    // Optionally set the first class as selected by default
                    if (classesRes.data.length > 0) {
                         handleClassChange(classesRes.data[0]._id);
                    } else {
                         console.log('No classes found for this guru.');
                    }
                }

                // If user is a student, fetch their class rankings
                if (user?.role === 'siswa' && user?.class) {
                    console.log('Fetching ranking for student class:', user.class);
                    const classRankingsRes = await axios.get(`http://localhost:5000/api/ranking/class/${user.class}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    });
                    console.log('Student class ranking data:', classRankingsRes.data);
                    setClassRankings(classRankingsRes.data);
                    setSelectedClass(user.class);
                }
            } catch (error) {
                console.error('Error fetching data for ranking page:', error);
                // Log more details about the error response if available
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setClassRankings([]); // Clear rankings on error
            }
        };

        // Only fetch data if user object is available
        if (user) {
             fetchData();
        }
       
    }, [user]); // Depend on user object

    const handleClassChange = async (classId) => {
        console.log('Handling class change to:', classId);
        if (!classId) {
            setClassRankings([]);
            setSelectedClass(null);
            return;
        }
        try {
            const response = await axios.get(`http://localhost:5000/api/ranking/class/${classId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            console.log('Rankings for class received:', response.data);
            setClassRankings(response.data);
            setSelectedClass(classId);
        } catch (error) {
            console.error('Error fetching class rankings:', error);
            setClassRankings([]); // Clear rankings on error
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Student Rankings</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Class Rankings Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Class Rankings</h2>
                    {user?.role === 'guru' && (
                        <div className="mb-4">
                            <select
                                className="w-full p-2 border rounded"
                                onChange={(e) => handleClassChange(e.target.value)}
                                value={selectedClass || ''}
                            >
                                <option value="">Select a class</option>
                                {availableClasses.map(kelas => (
                                    <option key={kelas._id} value={kelas._id}>
                                        {kelas.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                     {user?.role === 'siswa' && !classRankings.length && (
                         <div className="text-center text-gray-500 py-4">
                             Your class ranking is not available yet or you are not enrolled in a class.
                         </div>
                     )}
                    <ClassRanking rankings={classRankings} />
                </div>

                {/* Top Students Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Top Students</h2>
                    <TopStudents students={topStudents} />
                </div>
            </div>
        </div>
    );
};

export default RankingPage; 