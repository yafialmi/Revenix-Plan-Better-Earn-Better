import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";

import {
  fetchDataPerencanaan,
  fetchDataPerencanaanPending,
} from "../services/konfirmasiPerencanaan/konfirmasiPerencanaan";

import toast from "react-hot-toast";

import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function Perencanaan() {
  const navigate = useNavigate();

  // STATE

  const [data, setData] =
    useState(null);

  const [isLoading, setLoading] =
    useState(false);

  const location = useLocation();

  // Mengecek apakah user admin
  const isAdmin =
    localStorage.getItem("role") ===
    "admin";

  // State modal approve
  const [openApprove, setOpenApprove] =
    useState(false);

  // State modal reject
  const [openReject, setOpenReject] =
    useState(false);

  const [openSummarySection, setOpenSummarySection] =
    useState("parameter");

  // Menyimpan item yang dipilih
  const [selectedItem, setSelectedItem] =
    useState(null);

  const formatRupiah = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return Number(value).toLocaleString("id-ID");
  };

  const getParameter = (key) =>
    selectedItem?.parameter?.[key] ??
    selectedItem?.[key];

  const getForecast = (key) =>
    selectedItem?.forecast?.[key];

  const getHasilId = (item) =>
    item?.hasil_id ??
    item?.id_laporan ??
    item?.id_hasil ??
    item?.id ??
    item?._id;

  const approvalStatus =
    selectedItem?.status_persetujuan ?? "-";

  const forecastStatus =
    getForecast("status") ?? "-";

  const SummaryField = ({
    label,
    value,
    className = "",
  }) => (
    <label className={className}>
      <span className="block text-xs font-semibold text-gray-600 mb-1">
        {label}
      </span>

      <input
        readOnly
        value={value}
        className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none"
      />
    </label>
  );

  const SummarySection = ({
    id,
    number,
    title,
    children,
  }) => {
    const isOpen =
      openSummarySection === id;

    return (
      <div className="border-b border-gray-200 pb-3 last:border-b-0">
        <button
          type="button"
          onClick={() =>
            setOpenSummarySection(
              isOpen ? "" : id
            )
          }
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-semibold ${
                isOpen
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-gray-400 text-gray-600"
              }`}
            >
              {number}
            </span>

            <span
              className={`font-semibold ${
                isOpen
                  ? "text-teal-700"
                  : "text-gray-700"
              }`}
            >
              {title}
            </span>
          </div>

          <span className="text-xl text-gray-500 leading-none">
            {isOpen ? "v" : ">"}
          </span>
        </button>

        {isOpen && (
          <div className="pl-8 pt-1">
            {children}
          </div>
        )}
      </div>
    );
  };

  // FETCH DATA

  useEffect(() => {
    const getPerencanaan =
      async () => {
        try {
          setLoading(true);

          // Jika admin → ambil data pending
          // Jika user → ambil semua data
          const response =
            isAdmin
              ? await fetchDataPerencanaanPending()
              : await fetchDataPerencanaan();

          setData(response);
        } catch (e) {
          toast.error(
            e.message || e.detail
          );
        } finally {
          setLoading(false);
        }
      };

    getPerencanaan();
  }, [location.key]);

  // APPROVE HANDLER

  const handleApprove =
    async () => {
      const hasilId =
        getHasilId(selectedItem);

      if (!hasilId) {
        toast.error(
          "Gagal menyetujui: hasil_id tidak ditemukan"
        );
        return;
      }

      try {
        // TODO: Isi implementasi tombol Setuju di sini.
      } catch (e) {
        toast.error(
          e.message || e.detail
        );
      }
    };

  // REJECT HANDLER

  const handleReject =
    async () => {
      const hasilId =
        getHasilId(selectedItem);

      if (!hasilId) {
        toast.error(
          "Gagal menolak: hasil_id tidak ditemukan"
        );
        return;
      }

      try {
        // TODO: Isi implementasi tombol Tolak di sini.
      } catch (e) {
        toast.error(
          e.message || e.detail
        );
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
          <h1 className="text-3xl font-bold mb-1">
            Perencanaan
          </h1>

          <p className="text-sm text-gray-600">
            Selamat datang,{" "}
            {localStorage.getItem(
              "username"
            )}
          </p>
        </div>

        {/* CONTENT */}
        <section className="bg-white rounded-xl shadow-sm p-4 flex-1 flex flex-col min-h-0">
          {/* TITLE */}
          <div className="mb-4">
            <h2 className="text-lg font-bold">
              Detail Perencanaan
            </h2>

            <p className="text-sm text-gray-500">
              Daftar perencanaan berdasarkan
              tahun
            </p>
          </div>

          {/* LIST */}
          <div className="flex-1 overflow-y-auto pr-2 min-h-0">
            {/* LOADING */}
            {isLoading ? (
              <div className="flex justify-center mt-10">
                <CircularProgress />
              </div>
            ) : data?.data?.length ===
              0 ? (
              // EMPTY STATE
              <div className="h-full flex items-center justify-center text-gray-400">
                <p>
                  Tidak ada data ditemukan
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* LOOP DATA */}
                {data?.data?.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl px-5 py-4 bg-white shadow-sm hover:shadow-md transition flex items-center justify-between"
                    >
                      {/* INFORMASI */}
                      <div>
                        <h3 className="font-bold text-base">
                          Perencanaan Tahun{" "}
                          {item.periode}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Klik detail untuk
                          melihat data
                          perencanaan
                        </p>
                      </div>

                      {/* ADMIN BUTTON */}

                      {isAdmin ? (
                        <div className="flex items-center gap-2">
                          {/* BUTTON APPROVE */}
                          <button
                            onClick={() => {
                              setSelectedItem(
                                item
                              );

                              setOpenApprove(
                                true
                              );
                            }}
                            className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 flex items-center justify-center transition"
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

                          {/* BUTTON REJECT */}
                          <button
                            onClick={() => {
                              setSelectedItem(
                                item
                              );

                              setOpenReject(
                                true
                              );
                            }}
                            className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center transition"
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

                          {/* BUTTON DETAIL */}
                          <button
                            onClick={() =>
                              navigate(
                                `/detail-perencanaan/${item.periode}`,
                                {
                                  state:
                                    {
                                      periode:
                                        item.periode,
                                      id_perencanaan:
                                        item.input_id,
                                    },
                                }
                              )
                            }
                            className="w-10 h-10 rounded-lg bg-gray-400 hover:bg-gray-500 flex items-center justify-center transition"
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
                                d="M1 12s4-8 11-8s11 8 11 8s-4 8-11 8S1 12 1 12"
                              />

                              <circle
                                cx="12"
                                cy="12"
                                r="3"
                                fill="#fff"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        // BUTTON USER
                        <button
                          onClick={() =>
                            navigate(
                              `/detail-perencanaan/${item.periode}`,
                              {
                                state:
                                  {
                                    periode:
                                      item.periode,
                                    id_perencanaan:
                                      item.input_id,
                                  },
                              }
                            )
                          }
                          className="text-sm text-blue-500 font-semibold hover:underline"
                        >
                          Detail
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* MODAL APPROVE */}

        <Dialog
          open={openApprove}
          onClose={() =>
            setOpenApprove(false)
          }
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>
            Perencanaan
          </DialogTitle>

          <DialogContent>
            <div className="mt-1 border-t border-gray-200 pt-2">
              <SummarySection
                id="general"
                number="1"
                title="General Details"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SummaryField
                    label="Periode"
                    value={
                      selectedItem?.periode ??
                      "-"
                    }
                  />

                  <SummaryField
                    label="Status Persetujuan"
                    value={approvalStatus}
                  />

                  <SummaryField
                    label="Status Forecast"
                    value={forecastStatus}
                  />

                  <SummaryField
                    label="Hasil ID"
                    value={
                      selectedItem?.hasil_id ??
                      "-"
                    }
                  />
                </div>
              </SummarySection>

              <SummarySection
                id="parameter"
                number="2"
                title="Parameter Perencanaan"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SummaryField
                    label="Target Revenue"
                    value={formatRupiah(
                      getParameter(
                        "target_revenue"
                      )
                    )}
                  />

                  <SummaryField
                    label="AOV"
                    value={formatRupiah(
                      getParameter("aov")
                    )}
                  />

                  <SummaryField
                    label="Conversion Rate"
                    value={`${
                      getParameter(
                        "conversion_rate"
                      ) ?? "-"
                    }%`}
                  />

                  <SummaryField
                    label="Cost per Lead"
                    value={formatRupiah(
                      getParameter(
                        "cost_per_lead"
                      )
                    )}
                  />

                  <SummaryField
                    label="Total Biaya"
                    value={formatRupiah(
                      getParameter(
                        "total_biaya_op"
                      )
                    )}
                  />
                </div>
              </SummarySection>

              <SummarySection
                id="forecast"
                number="3"
                title="Forecast Result"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SummaryField
                    label="Estimasi Revenue"
                    value={formatRupiah(
                      getForecast(
                        "estimasi_revenue"
                      )
                    )}
                  />

                  <SummaryField
                    label="Cash Flow"
                    value={formatRupiah(
                      getForecast(
                        "cash_flow"
                      )
                    )}
                  />

                  <SummaryField
                    label="Budget Promosi"
                    value={formatRupiah(
                      getForecast(
                        "budget_promosi"
                      )
                    )}
                  />

                  <SummaryField
                    label="Leads Dibutuhkan"
                    value={formatNumber(
                      getForecast(
                        "leads_dibutuhkan"
                      )
                    )}
                  />
                </div>
              </SummarySection>

              <SummarySection
                id="approval"
                number="4"
                title="Approval Notes"
              >
                <div className="grid grid-cols-1 gap-3">
                  <SummaryField
                    label="Catatan Admin"
                    value={
                      selectedItem?.catatan_admin ??
                      "-"
                    }
                  />

                  <p className="text-sm text-gray-600 leading-relaxed">
                    Perencanaan periode{" "}
                    {selectedItem?.periode ??
                      "-"}{" "}
                    memiliki target revenue{" "}
                    {formatRupiah(
                      getParameter(
                        "target_revenue"
                      )
                    )}
                    , AOV{" "}
                    {formatRupiah(
                      getParameter("aov")
                    )}
                    , conversion rate{" "}
                    {getParameter(
                      "conversion_rate"
                    ) ?? "-"}
                    %, dan total biaya{" "}
                    {formatRupiah(
                      getParameter(
                        "total_biaya_op"
                      )
                    )}
                    . Estimasi status saat ini adalah{" "}
                    <span className="font-semibold text-black">
                      {forecastStatus}
                    </span>
                    .
                  </p>
                </div>
              </SummarySection>
            </div>
          </DialogContent>

          <DialogActions>
            {/* CANCEL */}
            <Button
              onClick={() =>
                setOpenApprove(false)
              }
            >
              Cancel
            </Button>

            {/* APPROVE */}
            <Button
              color="success"
              variant="contained"
              onClick={handleApprove}
            >
              Setuju
            </Button>
          </DialogActions>
        </Dialog>

        {/* MODAL REJECT */}

        <Dialog
          open={openReject}
          onClose={() =>
            setOpenReject(false)
          }
        >
          <DialogTitle>
            Tolak Perencanaan
          </DialogTitle>

          <DialogContent>
            <p className="text-sm text-gray-600">
              Apakah yakin ingin menolak
              perencanaan ini?
            </p>
          </DialogContent>

          <DialogActions>
            {/* CANCEL */}
            <Button
              onClick={() =>
                setOpenReject(false)
              }
            >
              Cancel
            </Button>

            {/* REJECT */}
            <Button
              color="error"
              variant="contained"
              onClick={handleReject}
            >
              Tolak
            </Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
}

export default Perencanaan;
