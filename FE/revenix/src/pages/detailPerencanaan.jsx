import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./sidebar";

function DetailPerencanaan() {
  const navigate = useNavigate();

  // Parameter route digunakan untuk menentukan periode/tahun yang sedang dibuka.
  const { periode } = useParams();

  // Data dummy detail perencanaan yang ditampilkan pada halaman ini.
  const detailData = {
    periode: periode || "2026",
    target_revenue: "10.000.000",
    aov: "100.000",
    conversion_rate: 5,
    cost_per_lead: "20.000",
    total_biaya: "2.000.000",
    status: "Belum Tercapai",
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-[#f5f4ff] to-[#eef5fb] font-poppins overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        <div className="mb-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Detail Perencanaan</h1>
              <p className="text-sm text-gray-500">
                Detail data perencanaan untuk periode {detailData.periode}
              </p>
            </div>

            <button
              // Mengembalikan user ke halaman sebelumnya.
              onClick={() => navigate(-1)}
              className="px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-white transition"
            >
              Kembali
            </button>
          </div>

          <section className="bg-white rounded-2xl shadow-sm p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Periode</p>
                <h2 className="text-2xl font-bold">{detailData.periode}</h2>
              </div>

              {/* Badge status memberi tanda visual apakah target periode sudah tercapai. */}
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                  detailData.status === "Tercapai"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {detailData.status}
              </span>
            </div>
          </section>

          {/* Kumpulan metrik utama dari detail perencanaan periode terpilih. */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">Target Revenue</p>
              <p className="text-2xl font-bold">
                Rp {detailData.target_revenue}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">AOV</p>
              <p className="text-2xl font-bold">Rp {detailData.aov}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {detailData.conversion_rate}%
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">Cost per Lead</p>
              <p className="text-2xl font-bold">
                Rp {detailData.cost_per_lead}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">Total Biaya</p>
              <p className="text-2xl font-bold">Rp {detailData.total_biaya}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm text-gray-400 mb-2">Estimasi Status</p>
              {/* Warna teks status membantu user membedakan kondisi tercapai dan belum tercapai. */}
              <p
                className={`text-2xl font-bold ${
                  detailData.status === "Tercapai"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {detailData.status}
              </p>
            </div>
          </section>

          {/* Ringkasan naratif dari semua metrik agar detail mudah dibaca sekaligus. */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-2">Ringkasan</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Perencanaan periode {detailData.periode} memiliki target revenue
              sebesar Rp {detailData.target_revenue}, dengan AOV sebesar Rp{" "}
              {detailData.aov}, conversion rate {detailData.conversion_rate}%,
              dan total biaya Rp {detailData.total_biaya}. Status saat ini
              adalah{" "}
              <span className="font-semibold text-black">
                {detailData.status}
              </span>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DetailPerencanaan;
