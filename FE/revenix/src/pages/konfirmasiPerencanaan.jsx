import { useEffect, useState } from "react";

import Sidebar from "./sidebar";

import toast from "react-hot-toast";

import { CircularProgress } from "@mui/material";

import {
  fetchPersetujuan,
  approvePersetujuan,
  rejectPersetujuan,
} from "../services/konfirmasiPerencanaan/konfirmasiPerencanaan";

function KonfirmasiPerencanaan() {
  // STATE

  const [dataRequest, setDataRequest] =
    useState([]);

  const [isLoading, setLoading] =
    useState(false);

  // FETCH DATA
  const getPersetujuan =
    async () => {
      try {
        setLoading(true);

        const data =
          await fetchPersetujuan();

        // FILTER PENDING ONLY
        const pendingData =
          data.filter(
            (item) =>
              item.status_persetujuan ===
              "pending"
          );

        setDataRequest(pendingData);
      } catch (e) {
        toast.error(
          `${e.message || e.detail}`
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    getPersetujuan();
  }, []);

  // APPROVE
  const handleApprove =
    async (hasil_id) => {
      try {
        await approvePersetujuan(
          hasil_id
        );

        toast.success(
          "Perencanaan berhasil diapprove"
        );

        // REMOVE DATA DARI UI
        setDataRequest((prev) =>
          prev.filter(
            (item) =>
              item.hasil_id !== hasil_id
          )
        );
      } catch (e) {
        toast.error(
          "Gagal approve data"
        );
      }
    };

  // REJECT
  const handleReject =
    async (hasil_id) => {
      try {
        await rejectPersetujuan(
          hasil_id
        );

        toast.success(
          "Perencanaan berhasil direject"
        );

        // REMOVE DATA DARI UI
        setDataRequest((prev) =>
          prev.filter(
            (item) =>
              item.hasil_id !== hasil_id
          )
        );
      } catch (e) {
        toast.error(
          "Gagal reject data"
        );
      }
    };

  return (
    <div className="h-screen flex bg-linear-to-br from-gray-100 to-blue-100 overflow-hidden font-poppins">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">
            Konfirmasi Perencanaan
            Baru
          </h1>
        </div>

        {/* CONTENT */}
        <section className="bg-white rounded-xl border shadow-sm p-5 flex-1 flex flex-col min-h-0">
          <h2 className="text-lg font-bold mb-4">
            Data Perencanaan
          </h2>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">
            {/* LOADING */}
            {isLoading ? (
              <div className="flex justify-center mt-10">
                <CircularProgress />
              </div>
            ) : dataRequest.length ===
              0 ? (
              // EMPTY STATE
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p>
                  Tidak ada data pending
                </p>
              </div>
            ) : (
              // LIST DATA
              dataRequest.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-xl px-5 py-4 shadow-sm bg-white"
                  >
                    {/* INFO */}
                    <div>
                      <p className="font-semibold text-base">
                        ID:{" "}
                        {
                          item.hasil_id
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        Status:{" "}
                        {
                          item.status_persetujuan
                        }
                      </p>

                      <p className="text-sm text-gray-500">
                        Catatan:{" "}
                        {item.catatan_admin ??
                          "-"}
                      </p>
                    </div>

                    {/* ACTION */}
                    <div className="flex gap-2">
                      {/* REJECT */}
                      <button
                        onClick={() =>
                          handleReject(
                            item.hasil_id
                          )
                        }
                        className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center hover:bg-red-600 transition"
                      >
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeWidth={2}
                            d="M6 18L18 6m0 12L6 6"
                          />
                        </svg>
                      </button>

                      {/* APPROVE */}
                      <button
                        onClick={() =>
                          handleApprove(
                            item.hasil_id
                          )
                        }
                        className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center hover:bg-green-600 transition"
                      >
                        <svg
                          width={18}
                          height={18}
                          viewBox="0 0 24 24"
                        >
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
                )
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default KonfirmasiPerencanaan;