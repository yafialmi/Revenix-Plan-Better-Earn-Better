import Sidebar from "./sidebar";

function Perencanaan() {
  return (
    <div className="h-screen flex bg-gradient-to-br from-[#f5f4ff] to-[#eef5fb] overflow-hidden font-poppins">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        {" "}
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold font-poppins mb-1">Perencanaan</h1>
          <p className="text-base font-semibold">Selamat datang, User [ ]</p>
        </div>
        {/* Pencarian */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold mb-3">Pencarian</h2>

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
                placeholder="Cari Berdasarkan aksi, detail, atau periode"
                className="w-full outline-none text-sm text-gray-500 bg-transparent"
              />
            </div>

            <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
              Reset
            </button>
          </div>
        </section>
        {/* Detail Laporan */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold font-poppins">Detail Laporan</h2>
              <p className="text-sm text-gray-500">
                Daftar semua perencanaan yang tersimpan
              </p>
            </div>

            {/* Icon Pensil */}
            <button className="p-1 cursor-pointer hover:scale-110 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 24 24"
                className="text-black"
              >
                <path
                  fill="currentColor"
                  d="m14.06 9l.94.94L5.92 19H5v-.92zm3.6-6c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.2-.20-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"
                />
              </svg>
            </button>
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

            <p className="mt-2 text-sm">Tidak ada data yang ditemukan</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perencanaan;
