import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../components/UserContext";

function Modul() {
  const [modul, setModul] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/modul/${user.current_level}`)
        .then(res => setModul(res.data));
    }
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Modul Belajar - {user?.current_level}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modul.map((item, i) => (
          <div key={i} className="bg-white rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">{item.judul}</h3>
            <p className="text-sm text-gray-700">{item.isi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Modul;

