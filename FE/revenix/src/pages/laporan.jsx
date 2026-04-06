import Sidebar from "./sidebar.jsx";

function Laporan() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="block text-sm mb-1 font-poppins">Ini Laporan</h1>
      </main>
    </div>
  );
}

export default Laporan;