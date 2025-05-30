import React from 'react';

const GuruKelas = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">DoClass</div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-gray-300">Ruang Kelas</a></li>
            <li><a href="#" className="hover:text-gray-300">Modul</a></li>
            <li><a href="#" className="hover:text-gray-300">Ujian</a></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <span>fan (guru)</span>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto mt-8 p-4">
        <div className="flex justify-end mb-4">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Buat Kelas</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Class Card Example */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">POLNES</h3>
            <p className="text-gray-600">Kode: 8PVH-X8BJ</p>
            <p className="text-gray-600">Jurusan: TI</p>
            <p className="text-gray-600">Siswa: 0 orang</p>
            <p className="text-gray-600">Dibuat: 26/5/2025</p>
            <div className="mt-4">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Kelola Kelas</button>
            </div>
          </div>

          {/* More Class Cards would go here */}

        </div>
      </main>
    </div>
  );
};

export default GuruKelas; 