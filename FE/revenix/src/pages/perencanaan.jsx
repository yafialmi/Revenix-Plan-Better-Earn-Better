import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

// Data dummy tahun perencanaan yang ditampilkan pada daftar.
const dummyData = [
  { id: 1, tahun: "2024" },
  { id: 2, tahun: "2025" },
  { id: 3, tahun: "2026" },
  { id: 4, tahun: "2027" },
  { id: 5, tahun: "2028" },
  { id: 6, tahun: "2029" },
];

function Perencanaan() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#f5f4ff] to-[#eef5fb] overflow-hidden font-poppins">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h1 className="text-3xl font-bold font-poppins mb-1">Perencanaan</h1>
          <p className="mt-1 text-sm text-gray-600">Selamat datang, User</p>
        </div>

        {/* Area pencarian disiapkan untuk memfilter daftar perencanaan berdasarkan tahun. */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold mb-3">Pencarian</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center flex-1 border border-gray-300 rounded-xl px-4 py-2.5">
              <input
                type="text"
                placeholder="Cari berdasarkan tahun"
                className="w-full outline-none text-sm text-gray-500 bg-transparent"
              />
            </div>

            <button className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
              Reset
            </button>
          </div>
        </section>

        {/* Daftar utama perencanaan yang berisi kartu per tahun. */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col min-h-0">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold font-poppins">Detail Laporan</h2>
              <p className="text-sm text-gray-500">
                Daftar perencanaan berdasarkan tahun
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            {/* Empty state ditampilkan jika tidak ada data perencanaan yang tersedia. */}
            {dummyData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="text-sm">Tidak ada data yang ditemukan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Setiap item tahun ditampilkan sebagai kartu dengan tombol menuju halaman detail. */}
                {dummyData.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-xl px-5 py-4 bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-base">
                        Perencanaan Tahun {item.tahun}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Klik detail untuk melihat data perencanaan
                      </p>
                    </div>

                    <button
                      // Navigasi ke halaman detail sesuai tahun yang dipilih.
                      onClick={() =>
                        navigate(`/detail-perencanaan/${item.tahun}`)
                      }
                      className="text-sm text-blue-500 font-semibold hover:underline"
                    >
                      Detail
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Perencanaan;
