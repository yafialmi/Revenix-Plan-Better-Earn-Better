import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";

function Laporan() {
  const navigate = useNavigate();

  // Data dummy laporan yang menjadi sumber kartu ringkasan dan daftar detail.
  const [dataLaporan] = useState([
    {
      id: 1,
      periode: "Januari 2026",
      target_revenue: "10.000.000",
      aov: "100.000",
      conversion_rate: 5,
      cost_per_lead: "20.000",
      total_biaya: "2.000.000",
      status: "Belum Tercapai",
    },
    {
      id: 2,
      periode: "Februari 2026",
      target_revenue: "15.000.000",
      aov: "120.000",
      conversion_rate: 6,
      cost_per_lead: "25.000",
      total_biaya: "3.000.000",
      status: "Tercapai",
    },
  ]);

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#f5f4ff] to-[#eef5fb] font-poppins overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-1">Laporan</h1>
          <p className="mt-1 text-sm text-gray-600">Selamat datang, User</p>
        </div>

        {/* Filter laporan disiapkan untuk mencari data berdasarkan periode. */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-lg font-bold mb-3">Filter Laporan</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Cari berdasarkan periode"
              className="w-full outline-none text-sm text-gray-500 bg-transparent border border-gray-300 rounded-xl px-4 py-2.5"
            />

            <button className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-gray-50">
              Reset
            </button>
          </div>
        </section>

        {/* Kartu ringkasan menampilkan metrik cepat dari data laporan. */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold mb-2">Total Perencanaan</h3>
            <p className="text-3xl font-bold">{dataLaporan.length}</p>
            <p className="text-xs text-gray-500">Data yang tersimpan</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold mb-2">
              Rata-Rata Target Revenue
            </h3>
            <p className="text-3xl font-bold">Rp 0</p>
            <p className="text-xs text-gray-500">Per Periode</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="text-base font-bold mb-2">Total Estimasi Laba</h3>
            <p className="text-3xl font-bold text-green-600">Rp 0</p>
            <p className="text-xs text-gray-500">Semua Periode</p>
          </div>
        </section>

        {/* Daftar detail laporan menampilkan setiap periode perencanaan yang tersimpan. */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col min-h-0">
          <div className="mb-3">
            <h2 className="text-lg font-bold">Detail Laporan</h2>
            <p className="text-sm text-gray-500">
              Daftar semua perencanaan yang tersimpan
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            {/* Empty state muncul ketika belum ada data laporan. */}
            {dataLaporan.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <p className="text-sm">Tidak ada data yang ditemukan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Setiap laporan ditampilkan sebagai kartu dengan ringkasan atribut perencanaan. */}
                {dataLaporan.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-base">{item.periode}</h3>
                        <p className="text-sm text-gray-500">
                          Data perencanaan marketing
                        </p>
                      </div>

                      <button
                        // Navigasi menuju detail perencanaan berdasarkan periode yang dipilih.
                        onClick={() =>
                          navigate(`/detail-perencanaan/${item.periode}`)
                        }
                        className="text-sm text-blue-500 font-semibold hover:underline"
                      >
                        Detail
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-10 text-sm">
                      <div>
                        <p className="text-gray-400">Target Revenue</p>
                        <p className="font-semibold">
                          Rp {item.target_revenue}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">AOV</p>
                        <p className="font-semibold">Rp {item.aov}</p>
                      </div>

                      <div>
                        <p className="text-gray-400">Conversion Rate</p>
                        <p className="font-semibold">
                          {item.conversion_rate}%
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Cost per Lead</p>
                        <p className="font-semibold">
                          Rp {item.cost_per_lead}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400">Total Biaya</p>
                        <p className="font-semibold">Rp {item.total_biaya}</p>
                      </div>

                      <div>
                        <p className="text-gray-400">Status</p>
                        {/* Warna status membantu membedakan laporan yang tercapai dan belum tercapai. */}
                        <p
                          className={`font-semibold ${
                            item.status === "Tercapai"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {item.status}
                        </p>
                      </div>
                    </div>
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

export default Laporan;
