import { data, useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { fetchDataPerencaanDetail } from "../services/perencanaan/perencanaan_services";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { fetchDataLaporanDetail } from "../services/laporan/laporan_services";
import { ArrowLeft } from "lucide-react";

function DetailLaporan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dataDetail, setDataDetail] = useState(null);
  const [isLoading, setLoading] = useState(false);
  // Parameter route digunakan untuk menentukan periode/tahun yang sedang dibuka.
  const { periode, id_laporan } = location.state;
  // Request GET Handler, paramnya menggunakan id_laporan
  useEffect(() => {
    const getDetailLaporan = async () => {
      try {
        setLoading(true);
        const data = await fetchDataLaporanDetail(id_laporan);
        setDataDetail(data);
      } catch (e) {
        toast.error(`${e.message || e.detail}`);
      } finally {
        setLoading(false);
      }
    };
    getDetailLaporan();
  }, [location.key]);

  // Mengubah angka mentah menjadi format mata uang Rupiah agar konsisten di seluruh UI.
  function formatRupiah(value) {
    return `Rp ${value.toLocaleString("id-ID")}`;
  }

  return (
    <div className="h-screen flex bg-linear-to-br from-[#f5f4ff] to-[#eef5fb] font-poppins overflow-hidden">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        <div className="mb-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Detail Laporan</h1>
              <p className="text-sm text-gray-500">
                Detail data laporan untuk periode {periode}
              </p>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2 border border-gray-300 rounded-xl text-sm hover:bg-white transition cursor-pointer"
            >
              <ArrowLeft size={18} />
              Kembali
            </button>
          </div>

          <section className="bg-white rounded-2xl shadow-sm p-6 mb-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Periode</p>
                <h2 className="text-2xl font-bold">{periode}</h2>
              </div>

              {/* Badge status memberi tanda visual apakah target periode sudah tercapai. */}
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                  dataDetail?.data?.forecast?.status === "Untung"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {dataDetail?.data?.forecast?.status ?? ""}
              </span>
            </div>
          </section>

          {/* Kumpulan metrik utama dari detail perencanaan periode terpilih. */}
          {isLoading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-400 mb-2">Target Revenue</p>
                <p className="text-2xl font-bold">
                  {formatRupiah(
                    dataDetail?.data?.parameter?.target_revenue ?? 0,
                  )}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-400 mb-2">AOV</p>
                <p className="text-2xl font-bold">
                  {formatRupiah(dataDetail?.data?.parameter?.aov ?? 0)}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-400 mb-2">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {dataDetail?.data?.parameter?.conversion_rate ?? 0}%
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-400 mb-2">Cost per Lead</p>
                <p className="text-2xl font-bold">
                  {formatRupiah(
                    dataDetail?.data?.parameter?.cost_per_lead ?? 0,
                  )}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-400 mb-2">Total Biaya</p>
                <p className="text-2xl font-bold">
                  {formatRupiah(
                    dataDetail?.data?.parameter?.total_biaya_op ?? 0,
                  )}
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-400 mb-2">Estimasi Status</p>
                {/* Warna teks status membantu user membedakan kondisi tercapai dan belum tercapai. */}
                <p
                  className={`text-2xl font-bold ${
                    dataDetail?.data?.forecast?.status === "Untung"
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {dataDetail?.data?.forecast?.status ?? ""}
                </p>
              </div>
            </section>
          )}
          {/* Ringkasan naratif dari semua metrik agar detail mudah dibaca sekaligus. */}
          {isLoading ? (
            <CircularProgress></CircularProgress>
          ) : (
            <section className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-2">Ringkasan</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Perencanaan periode {periode} memiliki target revenue sebesar{" "}
                {formatRupiah(dataDetail?.data?.parameter?.target_revenue ?? 0)}
                , dengan AOV sebesar {formatRupiah(dataDetail?.data?.aov ?? 0)},
                conversion rate{" "}
                {dataDetail?.data?.parameter?.conversion_rate ?? 0}%, dan total
                biaya
                {formatRupiah(dataDetail?.data?.parameter?.total_biaya_op ?? 0)}
                . Status saat ini adalah{" "}
                <span className="font-semibold text-black">
                  {dataDetail?.data?.forecast?.status ?? ""}
                </span>
                .
              </p>
            </section>
          )}

          {/* Button menuju Scenario Planning */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                navigate("/ScenarioPlanning", {
                  state: {
                    id_laporan: id_laporan,
                    periode: periode,
                    data: dataDetail,
                  },
                })
              }
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition duration-300 shadow-sm cursor-pointer"
            >
              Scenario dan Planning pada tahun {periode}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetailLaporan;
