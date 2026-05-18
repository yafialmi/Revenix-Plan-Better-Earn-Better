import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import PlanningApprovalModals from "../components/modal";

import {
  fetchDataPerencanaan,
  fetchDataPerencanaanPending,
} from "../services/konfirmasiPerencanaan/konfirmasiPerencanaan";

import toast from "react-hot-toast";

import { CircularProgress } from "@mui/material";
import {
  postPersetujuanApproved,
  postPersetujuanRejected,
} from "../services/persetujuan/persetujuan_services";

function Perencanaan() {
  const navigate = useNavigate();

  // STATE

  const [data, setData] = useState(null);

  const [isLoading, setLoading] = useState(false);

  const location = useLocation();

  // Mengecek apakah user admin
  const isAdmin = localStorage.getItem("role") === "admin";

  // State modal approve
  const [openApprove, setOpenApprove] = useState(false);

  // Menyimpan item yang dipilih
  const [selectedItem, setSelectedItem] = useState(null);

  const [catatan_admin, setCatatanAdmin] = useState("");

  const getHasilId = (item) =>
    item?.hasil_id ??
    item?.id_laporan ??
    item?.id_hasil ??
    item?.id ??
    item?._id;

  // FETCH DATA

  useEffect(() => {
    const getPerencanaan = async () => {
      try {
        setLoading(true);

        // Jika admin → ambil data pending
        // Jika user → ambil semua data
        const response = isAdmin
          ? await fetchDataPerencanaanPending()
          : await fetchDataPerencanaan();

        setData(response);
      } catch (e) {
        toast.error(e.message || e.detail);
      } finally {
        setLoading(false);
      }
    };

    getPerencanaan();
  }, [location.key, isAdmin]);

  // APPROVE HANDLER

  const handleApprove = async () => {
    const hasilId = await getHasilId(selectedItem);
    if (!hasilId) {
      toast.error("Gagal menyetujui: hasil_id tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      const data = await postPersetujuanApproved(hasilId, catatan_admin);
      toast.success(`${data.message}`);
    } catch (e) {
      toast.error(e.message || e.detail);
    } finally {
      setOpenApprove(false);
      setLoading(false);
    }
  };

  // REJECT HANDLER

  const handleReject = async () => {
    const hasilId = getHasilId(selectedItem);

    if (!hasilId) {
      toast.error("Gagal menolak: hasil_id tidak ditemukan");
      return;
    }

    try {
      setLoading(true);
      const data = await postPersetujuanRejected(hasilId, catatan_admin);
      toast.success(`${data.message}`);
    } catch (e) {
      toast.error(e.message || e.detail);
    } finally {
      setLoading(false);
      setOpenApprove(false);
      s;
    }
  };

  return (
    <div className="h-screen flex bg-linear-to-br from-[#f5f4ff] to-[#eef5fb] overflow-hidden font-poppins">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-1">Perencanaan</h1>

          <p className="text-sm text-gray-600">
            Selamat datang, {localStorage.getItem("username")}
          </p>
        </div>

        {/* CONTENT */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col min-h-0">
          {/* TITLE */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">Detail Perencanaan</h2>

            <p className="text-sm text-gray-500">
              Daftar perencanaan berdasarkan tahun
            </p>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            {/* LOADING */}
            {isLoading ? (
              <div className="flex justify-center mt-10">
                <CircularProgress />
              </div>
            ) : data?.data?.length === 0 ? (
              // EMPTY STATE
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>Tidak ada data ditemukan</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* LOOP DATA */}
                {data?.data?.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl px-5 py-4 bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
                  >
                    {/* INFORMASI */}
                    <div>
                      <h3 className="font-bold text-base">
                        Perencanaan Tahun {item.periode}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Klik detail untuk melihat data perencanaan
                      </p>
                    </div>

                    {/* ADMIN BUTTON */}

                    {isAdmin ? (
                      <div className="flex items-center gap-2">
                        {/* BUTTON DETAIL */}
                        <button
                          onClick={() => {
                            setSelectedItem(item);

                            setOpenApprove(true);
                          }}
                          className="w-10 h-10 rounded-lg bg-gray-400 hover:bg-gray-500 flex items-center justify-center transition cursor-pointer"
                        >
                          <svg width={18} height={18} viewBox="0 0 24 24">
                            <path
                              fill="none"
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 12s4-8 11-8s11 8 11 8s-4 8-11 8S1 12 1 12"
                            />

                            <circle cx="12" cy="12" r="3" fill="#fff" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      // BUTTON USER
                      <button
                        onClick={() =>
                          navigate(`/detail-perencanaan/${item.periode}`, {
                            state: {
                              periode: item.periode,
                              id_perencanaan: item.input_id,
                            },
                          })
                        }
                        className="text-sm text-blue-500 font-semibold hover:underline cursor-pointer"
                      >
                        Detail
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <PlanningApprovalModals
          openApprove={openApprove}
          onCloseApprove={() => setOpenApprove(false)}
          selectedItem={selectedItem}
          catatan_admin={catatan_admin}
          setCatatanAdmin={setCatatanAdmin}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </main>
    </div>
  );
}

export default Perencanaan;
