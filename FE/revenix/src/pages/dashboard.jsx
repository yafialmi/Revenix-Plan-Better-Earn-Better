import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { fetchDataDashboard } from "../services/dashboard/dashboardServices";
import toast from "react-hot-toast";

// Mengubah angka mentah menjadi format mata uang Rupiah agar konsisten di seluruh UI.
function formatRupiah(value) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

// Komponen kecil untuk menampilkan metrik utama pada bagian atas dashboard.
function CardSummary({ title, value, subtitle }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <span className="mt-1 block text-xs text-gray-500">{subtitle}</span>
    </div>
  );
}

function Dashboard() {
  const [dataDashboard, setDataDashboard] = useState(null);
  const [loading, setLoading] = useState(null);
  const username = localStorage.getItem("username");
  useEffect(() => {
    const getDashboard = async () => {
      try {
        const data = await fetchDataDashboard();
        setDataDashboard(data);
      } catch (error) {
        toast.error(`${error.message || error}`);
      }
    };

    getDashboard();
  }, []);

  const navigate = useNavigate();

  const calculateForecast = (data) => {
    const customer = data.target_revenue / data.aov;

    const leads = customer / (data.conversion_rate / 100);

    const budget = leads * data.cost_per_lead;

    const forecast = data.target_revenue - data.total_biaya_op - budget;

    return {
      status: forecast > 0 ? "Tercapai" : "Tidak Tercapai",
    };
  };

  // Menghitung jumlah periode yang sudah memenuhi target revenue.
  const totalTercapai =
    dataDashboard?.perencanaan_terbaru?.filter(
      (item) => calculateForecast(item).status === "Tercapai",
    ).length ?? 0;

  // Menghitung jumlah periode yang belum memenuhi target revenue.
  const totalBelumTercapai =
    dataDashboard?.perencanaan_terbaru?.filter(
      (item) => calculateForecast(item).status === "Tidak Tercapai",
    ).length ?? 0;

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-100 to-blue-100 font-poppins overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        <div className="mb-4 flex items-start justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">Selamat datang, </p>
          </div>

          <button
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow transition duration-200 hover:bg-blue-700 cursor-pointer"
            onClick={() => navigate("/inputperencanaan")}
          >
            <svg width={20} height={20} viewBox="0 0 32 32">
              <path
                fill="white"
                d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
              />
            </svg>
            <span>Buat Perencanaan Baru</span>
          </button>
        </div>

        {/* Ringkasan angka utama yang membantu user membaca kondisi keuangan secara cepat. */}
        <div className="mb-4 grid grid-cols-4 gap-4 shrink-0">
          <CardSummary
            title="Total Perencanaan"
            value={dataDashboard?.summary?.total_perencanaan}
            subtitle="Total Semua Perencanaan"
          />
          <CardSummary
            title="Total Target Revenue"
            value={formatRupiah(
              dataDashboard?.summary?.total_target_revenue ?? 0,
            )}
            subtitle="Akumulasi semua periode"
          />
          <CardSummary
            title="Estimasi Pengeluaran"
            value={formatRupiah(
              dataDashboard?.summary?.estimasi_pengeluaran ?? 0,
            )}
            subtitle="Total semua periode"
          />
          <CardSummary
            title="Estimasi Laba/Rugi"
            value={formatRupiah(
              dataDashboard?.summary?.estimasi_laba_rugi ?? 0,
            )}
            subtitle="Total semua periode"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-4 min-h-0">
            {/* Daftar perencanaan ditampilkan dari data terbaru ke terlama. */}
            <section className="rounded-xl border bg-white p-4 shadow-sm h-[58%] min-h-0 flex flex-col">
              <h2 className="text-base font-bold mb-3 shrink-0">
                Perencanaan Terbaru
              </h2>

              <div className="space-y-2 overflow-y-auto pr-2 min-h-0">
                {dataDashboard?.perencanaan_terbaru?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{item.periode}</p>
                      <p className="text-xs text-gray-500">
                        Target: {formatRupiah(item.target_revenue)}
                      </p>
                    </div>

                    {/* Warna status dibedakan agar kondisi target mudah dipindai. */}
                    <span
                      className={`text-xs font-semibold ${
                        calculateForecast(item).status === "Tercapai" // ← tambah .status
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {calculateForecast(item).status} {/* ← tambah .status */}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Status perencanaan merangkum jumlah periode yang tercapai dan belum tercapai. */}
            <section className="rounded-xl border bg-white p-4 shadow-sm flex flex-col">
              <h2 className="text-sm font-bold mb-3">Status Perencanaan</h2>

              <div className="flex gap-4">
                <div className="flex-1 flex items-center justify-between border rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500">Tercapai</p>
                    <p className="text-lg font-bold text-green-600">
                      {totalTercapai}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">periode</span>
                </div>

                <div className="flex-1 flex items-center justify-between border rounded-lg px-4 py-3">
                  <div>
                    <p className="text-xs text-gray-500">Belum</p>
                    <p className="text-lg font-bold text-red-500">
                      {totalBelumTercapai}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">periode</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {totalTercapai} dari{" "}
                {dataDashboard?.perencanaan_terbaru?.length ?? 0} periode sudah
                tercapai
              </p>
            </section>
          </div>

          {/* Grafik membandingkan target revenue dan total biaya untuk setiap periode. */}
          <section className="rounded-xl border bg-white p-4 shadow-sm min-h-0 flex flex-col">
            <div className="mb-3 shrink-0">
              <h2 className="text-base font-bold">
                Grafik Target Revenue vs Total Biaya
              </h2>
              <p className="text-sm text-gray-500">
                Perbandingan target dan biaya setiap periode
              </p>
            </div>

            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dataDashboard?.perencanaan_terbaru}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value / 1000000}jt`}
                  />
                  <Tooltip formatter={(value) => formatRupiah(value)} />
                  <Legend />
                  <Bar
                    dataKey="target_revenue"
                    name="Target Revenue"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="total_biaya_op"
                    name="Total Biaya Operasional"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
