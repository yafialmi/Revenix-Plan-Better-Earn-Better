import Sidebar from "./sidebar.jsx";

function CardSummary({ title, subtitle }) {
  return (
    <div className="w-full rounded-xl border bg-white p-5 shadow-sm font-poppins">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <p className="mt-3 text-3xl font-bold">Rp 0</p>
      <span className="mt-2 block text-xs text-gray-500">{subtitle}</span>
    </div>
  );
}

function EmptyCard({ height = "h-[220px]" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border bg-white text-gray-400 font-poppins ${height}`}
    >
      <svg width={50} height={50} viewBox="0 0 24 24">
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
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 to-blue-100 font-poppins">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Selamat datang, User/Admin
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow transition duration-200 hover:bg-blue-700">
            <svg width={20} height={20} viewBox="0 0 32 32">
              <path
                fill="white"
                d="M16 3C8.832 3 3 8.832 3 16s5.832 13 13 13s13-5.832 13-13S23.168 3 16 3m0 2c6.087 0 11 4.913 11 11s-4.913 11-11 11S5 22.087 5 16S9.913 5 16 5m-1 5v5h-5v2h5v5h2v-5h5v-2h-5v-5z"
              />
            </svg>
            <span>Buat Perencanaan Baru</span>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-5">
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

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <EmptyCard height="h-[180px]" />
            <EmptyCard height="h-[260px]" />
          </div>

          <div>
            <EmptyCard height="h-[446px]" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;