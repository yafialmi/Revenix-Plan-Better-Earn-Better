import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";

function CardSummary({ title, subtitle }) {
  return (
    <div className="w-full rounded-xl border bg-white p-4 shadow-sm font-poppins">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <p className="mt-2 text-2xl font-bold">Rp 0</p>
      <span className="mt-1 block text-xs text-gray-500">{subtitle}</span>
    </div>
  );
}

function EmptyCard({ height = "h-full" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border bg-white text-gray-400 font-poppins ${height}`}
    >
      <svg width={42} height={42} viewBox="0 0 24 24">
        <path
          fill="#9CA3AF"
          d="M15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9zm4 16H5V5h9v5h5m-2 4H7v-2h10m-3 5H7v-2h7"
        />
      </svg>

      <p className="mt-3 text-sm text-gray-500">
        Tidak ada data yang ditemukan
      </p>
    </div>
  );
}

function Dashboard() {
const navigate  = useNavigate();
  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-100 to-blue-100 font-poppins overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        {" "}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Selamat datang, User/Admin
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow transition duration-200 hover:bg-blue-700 cursor-pointer" onClick={()=> navigate('/inputperencanaan')}>
            <svg width={20} height={20} viewBox="0 0 32 32">
              <path
                fill="white"
                d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
              />
            </svg>
            <span>Buat Perencanaan Baru</span>
          </button>
        </div>
        <div className="mb-4 grid grid-cols-4 gap-4">
          <CardSummary title="Total Pemasukkan" subtitle="Total keuangan" />
          <CardSummary
            title="Total Target Revenue"
            subtitle="Akumulasi semua periode"
          />
          <CardSummary
            title="Estimasi Pengeluaran"
            subtitle="Periode terbaru"
          />
          <CardSummary title="Estimasi Laba/Rugi" subtitle="Periode terbaru" />
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-4 min-h-0">
            <div className="h-[150px]">
              <EmptyCard />
            </div>
            <div className="flex-1 min-h-0">
              <EmptyCard />
            </div>
          </div>

          <div className="h-full min-h-0">
            <EmptyCard />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
