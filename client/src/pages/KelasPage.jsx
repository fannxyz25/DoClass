import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Assuming UserContext and axios might be needed later for data fetching
// import { useUser } from '../components/UserContext';
// import axios from 'axios';

const KelasPage = () => {
  const navigate = useNavigate();
  // const { user } = useUser(); // Uncomment if UserContext is needed

  // Placeholder for class data
  const dummyClass = {
    name: 'dadw',
    code: 'IG6S-59B6',
    jurusan: '',
    guru: '',
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header - Assuming this is a separate component or layout */}
      {/* <Header /> */}

      <div className="max-w-[1256px] mx-auto mt-8 p-8 bg-white rounded-[40px] shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[32px] font-bold text-[#2D71A7]">Ruang Kelas</h2>
          <div className="flex gap-4">
            <button className="bg-[#0984E3] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#0672c7] transition-all transform hover:scale-[1.02] shadow-lg">
              Gabung dengan Kode
            </button>
            <button className="bg-[#0984E3] text-white px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#0672c7] transition-all transform hover:scale-[1.02] shadow-lg">
              Kelas Saya
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Single Class Card based on screenshot */}
          <div className="bg-white p-6 rounded-[20px] shadow-md border border-[#81C4FA]">
            <h3 className="text-xl font-semibold text-[#2D71A7] mb-2">{dummyClass.name}</h3>
            <p className="text-gray-700">Kode: {dummyClass.code}</p>
            <p className="text-gray-700">Jurusan: {dummyClass.jurusan}</p>
            <p className="text-gray-700 mb-4">Guru: {dummyClass.guru}</p>
            <button className="w-full bg-[#0984E3] text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#0672c7] transition-all transform hover:scale-[1.02] shadow-lg">
              Masuk Kelas
            </button>
          </div>

          {/* More class cards would go here */}
        </div>
      </div>
    </div>
  );
};

export default KelasPage; 