import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useUser } from "../components/UserContext";

function Kelas() {
  const { user, updateUser } = useUser();
  const [kelas, setKelas] = useState([]);
  const [pesan, setPesan] = useState("");
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      if (user && user._id) {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`http://localhost:5000/api/users/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCurrentUser(res.data);
          // Also update the user in the context and local storage
          updateUser(res.data);
        } catch (error) {
          console.error('Error fetching user data for Kelas:', error);
          // If fetching fails, use the user data from the context
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
    };

    fetchUser();

    if (user) {
      axios.get(`http://localhost:5000/api/kelas/${user.current_level}`)
        .then(res => setKelas(res.data));
    }
  }, [user, updateUser]); // Re-fetch if user in context changes

  const handleJoin = async (id_kelas) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/kelas/ikuti`, {
        id_murid: user._id,
        id_kelas
      });
      setPesan(res.data.message);
    } catch (err) {
      setPesan("Gagal join kelas");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Ruang Kelas - {currentUser?.current_level}</h2>
        {pesan && <div className="mb-4 text-green-700 font-medium">{pesan}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kelas.map((item, i) => (
            <div key={i} className="bg-white shadow p-4 rounded">
              <h3 className="text-lg font-semibold">{item.nama_kelas}</h3>
              <p className="text-sm text-gray-600">Jurusan: {item.jurusan}</p>
              <button onClick={() => handleJoin(item._id)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Join Kelas
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Kelas;
