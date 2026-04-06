import Sidebar from "./sidebar";

function Laporan() {
  return (
    <div className="h-screen flex bg-gradient-to-br from-[#f5f4ff] to-[#eef5fb] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold font-poppins text-black mb-1">
            Laporan
          </h1>
          <p className="text-base font-semibold text-black">
            Selamat datang, User [ ]
          </p>
        </div>

        {/* Filter */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold font-poppins mb-3">
            Filter Laporan
          </h2>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center flex-1 border border-gray-300 rounded-xl px-4 py-2.5">
              <svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                className="text-gray-400 mr-2"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21l-4.34-4.34m1.84-5.16a7 7 0 1 1-14 0a7 7 0 0 1 14 0"
                />
              </svg>

              <input
                type="text"
                placeholder="Cari Berdasarkan Periode (YYYY - MM)"
                className="w-full outline-none text-sm text-gray-500 bg-transparent"
              />
            </div>

            <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
              Reset
            </button>
          </div>
        </section>

        {/* Statistik */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold font-poppins mb-2">
              Total Perencanaan
            </h3>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-gray-500">Data yang tersimpan</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold font-poppins mb-2">
              Rata-Rata Target Revenue
            </h3>
            <p className="text-3xl font-bold">Rp 0</p>
            <p className="text-xs text-gray-500">Per Periode</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold font-poppins mb-2">
              Total Estimasi Laba
            </h3>
            <p className="text-3xl font-bold text-green-600">Rp 0</p>
            <p className="text-xs text-gray-500">Semua Periode</p>
          </div>
        </section>

        {/* Detail Laporan */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col overflow-hidden">
          <div className="mb-3">
            <h2 className="text-lg font-bold font-poppins">
              Detail Laporan
            </h2>
            <p className="text-sm text-gray-500">
              Daftar semua perencanaan yang tersimpan
            </p>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={48}
              height={48}
              viewBox="0 0 24 24"
              className="text-gray-300 opacity-80"
            >
              <path
                fill="currentColor"
                d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9zm4 16H5V5h9v5h5m-2 4H7v-2h10m-3 5H7v-2h7"
              />
            </svg>

            <p className="mt-2 text-sm text-gray-400">
              Tidak ada data yang ditemukan
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Laporan;