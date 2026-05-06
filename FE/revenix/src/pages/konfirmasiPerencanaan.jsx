import Sidebar from "./sidebar";

function KonfirmasiPerencanaan() {

  // Dummy data request perencanaan
  const dataRequest = [
    {
      id: 1,
      periode: "2026",
      target: "Rp 15.000.000",
      aov: "Rp 120.000",
      status: "Pending",
    },
    {
      id: 2,
      periode: "2025",
      target: "Rp 20.000.000",
      aov: "Rp 150.000",
      status: "Pending",
    },
  ];

  // Fungsi untuk approve perencanaan
  const handleApprove = (id) => {
    console.log("Approve ID:", id);
  };

  // Fungsi untuk reject perencanaan
  const handleReject = (id) => {
    console.log("Reject ID:", id);
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-100 to-blue-100 overflow-hidden font-poppins">
      
      {/* Sidebar navigasi utama */}
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col overflow-hidden">

        {/* Judul halaman */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">
            Konfirmasi Perencanaan Baru
          </h1>
        </div>

        {/* Container utama */}
        <section className="bg-white rounded-xl border shadow-sm p-5 flex-1 flex flex-col min-h-0">

          {/* Judul section */}
          <h2 className="text-lg font-bold mb-4">Data Perencanaan</h2>

          {/* List container (scrollable jika data banyak) */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">

            {/* Jika tidak ada data */}
            {dataRequest.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>Tidak ada data yang ditemukan</p>
              </div>
            ) : (

              // Loop data perencanaan menjadi card
              dataRequest.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-xl px-5 py-4 shadow-sm"
                >

                  {/* Informasi perencanaan */}
                  <div>
                    <p className="font-semibold text-base">
                      Perencanaan Tahun {item.periode}
                    </p>
                    <p className="text-sm text-gray-500">
                      Target: {item.target}
                    </p>
                    <p className="text-sm text-gray-500">
                      AOV: {item.aov}
                    </p>
                  </div>

                  {/* Tombol aksi (approve / reject) */}
                  <div className="flex gap-2">

                    {/* Tombol reject */}
                    <button
                      onClick={() => handleReject(item.id)}
                      className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center hover:bg-red-600"
                    >
                      <svg width={18} height={18} viewBox="0 0 24 24">
                        <path
                          fill="none"
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeWidth={2}
                          d="M6 18L18 6m0 12L6 6"
                        />
                      </svg>
                    </button>

                    {/* Tombol approve */}
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center hover:bg-green-600"
                    >
                      <svg width={18} height={18} viewBox="0 0 24 24">
                        <path
                          fill="none"
                          stroke="#fff"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m5 14l4 4L19 8"
                        />
                      </svg>
                    </button>

                  </div>
                </div>
              ))
            )}

          </div>
        </section>
      </main>
    </div>
  );
}

export default KonfirmasiPerencanaan;