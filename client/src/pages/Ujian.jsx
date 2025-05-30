import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useUser } from "../components/UserContext";

function Ujian() {
  const { user } = useUser();
  const [ujian, setUjian] = useState(null);
  const [jawaban, setJawaban] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadUjian();
  }, [user]);

  const loadUjian = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/ujian/${user.current_level}`);
      setUjian(res.data);
      // Initialize jawaban state with empty answers for each question
      const initialJawaban = {};
      res.data.soal.forEach((_, index) => {
        initialJawaban[index] = "";
      });
      setJawaban(initialJawaban);
    } catch (error) {
      console.error("Error loading ujian:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      let correct = 0;
      ujian.soal.forEach((soal, index) => {
        if (jawaban[index] === soal.jawaban_benar) {
          correct++;
        }
      });

      const finalScore = (correct / ujian.soal.length) * 100;
      setScore(finalScore);
      setSubmitted(true);

      if (finalScore >= 70) {
        // Update user data in localStorage with new score
        const updatedUser = { ...user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        setTimeout(() => {
          navigate("/beranda");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting ujian:", error);
    }
  };

  if (!ujian) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold mb-6">Ujian Level {user.current_level}</h1>
              {ujian.soal.map((soal, index) => (
                <div key={index} className="mb-6">
                  <p className="font-semibold mb-2">
                    {index + 1}. {soal.pertanyaan}
                  </p>
                  <div className="space-y-2">
                    {soal.opsi.map((opsi, opsiIndex) => (
                      <label key={opsiIndex} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={opsi}
                          checked={jawaban[index] === opsi}
                          onChange={(e) => setJawaban({ ...jawaban, [index]: e.target.value })}
                          className="form-radio"
                        />
                        <span>{opsi}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Submit Ujian
              </button>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Hasil Ujian</h2>
              <p className="text-4xl font-bold mb-4">{score.toFixed(1)}%</p>
              {score >= 70 ? (
                <div className="text-green-600">
                  <p className="text-xl mb-2">Selamat! Anda lulus ujian!</p>
                  <p>Anda akan naik ke level berikutnya...</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <p className="text-xl mb-2">Maaf, Anda belum lulus ujian.</p>
                  <p>Silakan pelajari kembali materi dan coba lagi nanti.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Ujian; 