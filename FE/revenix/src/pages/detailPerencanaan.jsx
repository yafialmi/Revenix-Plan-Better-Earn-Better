import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Sidebar from "./sidebar";

import {
  fetchDataPerencaanDetail,
  updatePerencanaan,
  deletePerencanaan,
} from "../services/perencanaan/perencanaan_services";

import toast from "react-hot-toast";

import { CircularProgress } from "@mui/material";

import { Pencil, Save, Trash2, ArrowLeft, X } from "lucide-react";

const EditableCard = ({
  title,
  name,
  value,
  suffix = "",
  isEdit,
  onChange,
  formatRupiah,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400">{title}</p>
      </div>

      {isEdit ? (
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border rounded-xl px-4 py-3 text-xl font-bold outline-none"
        />
      ) : (
        <p className="text-2xl font-bold">
          {suffix ? `${value}${suffix}` : formatRupiah(value)}
        </p>
      )}
    </div>
  );
};

function DetailPerencanaan() {
  const navigate = useNavigate();
  const location = useLocation();

  // GET PARAMETER

  const { periode, id_perencanaan } = location.state;

  // STATE

  const [dataDetail, setDataDetail] = useState(null);

  const [isLoading, setLoading] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [dataBeforeEdit, setDataBeforeEdit] = useState(null);

  const [forecast, setForecast] = useState(null);

  // FETCH DETAIL DATA

  useEffect(() => {
    const getDetailPerencanaan = async () => {
      try {
        setLoading(true);

        const data = await fetchDataPerencaanDetail(id_perencanaan);

        setDataDetail(data);

        setForecast(calculateForecast(data.data));
      } catch (e) {
        toast.error(`${e.message || e.detail}`);
      } finally {
        setLoading(false);
      }
    };

    getDetailPerencanaan();
  }, [id_perencanaan, location.key]);

  // FORMAT RUPIAH

  function formatRupiah(value) {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  }

  // FORECAST CALCULATION

  const calculateForecast = (d) => {
    const customer = d.target_revenue / d.aov;

    const leads = customer / (d.conversion_rate / 100);

    const budget = leads * d.cost_per_lead;

    const forecast = d.target_revenue - d.total_biaya_op - budget;

    return forecast > 0 ? "Untung" : "Rugi";
  };

  // HANDLE INPUT CHANGE

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDataDetail((prev) => {
      const updated = {
        ...prev,
        data: {
          ...prev.data,
          [name]: Number(value),
        },
      };

      setForecast(calculateForecast(updated.data));

      return updated;
    });
  };

  // HANDLE SAVE

  const handleSave = async () => {
    try {
      const payload = {
        target_revenue: dataDetail.data.target_revenue,

        aov: dataDetail.data.aov,

        conversion_rate: dataDetail.data.conversion_rate,

        cost_per_lead: dataDetail.data.cost_per_lead,

        total_biaya_op: dataDetail.data.total_biaya_op,
      };

      await updatePerencanaan(id_perencanaan, payload);

      toast.success("Data berhasil diupdate");

      setDataBeforeEdit(null);

      setIsEdit(false);
    } catch {
      toast.error("Gagal update data");
    }
  };

  // HANDLE CANCEL EDIT

  const handleCancelEdit = () => {
    if (dataBeforeEdit) {
      setDataDetail(dataBeforeEdit);
      setForecast(calculateForecast(dataBeforeEdit.data));
    }

    setDataBeforeEdit(null);
    setIsEdit(false);
  };

  // HANDLE DELETE

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");

    if (!confirmDelete) return;

    try {
      await deletePerencanaan(id_perencanaan);

      toast.success("Data berhasil dihapus");

      navigate("/perencanaan");
    } catch {
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <div className="h-screen flex bg-linear-to-br from-[#f5f4ff] to-[#eef5fb] font-poppins overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <main className="flex-1 min-w-0 p-6 flex flex-col overflow-y-auto">
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">Detail Perencanaan</h1>

            <p className="text-sm text-gray-500">
              Detail data perencanaan untuk periode {periode}
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

        {/* STATUS CARD */}
        <section className="bg-white rounded-2xl shadow-sm p-6 mb-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Periode</p>

              <h2 className="text-2xl font-bold">{periode}</h2>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                forecast === "Untung"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {forecast}
            </span>
          </div>
        </section>

        {/* CONTENT */}
        {isLoading ? (
          <div className="flex justify-center mt-20">
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* GRID */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-5">
              <EditableCard
                title="Target Revenue"
                name="target_revenue"
                value={dataDetail?.data?.target_revenue ?? 0}
                isEdit={isEdit}
                onChange={handleChange}
                formatRupiah={formatRupiah}
              />

              <EditableCard
                title="AOV"
                name="aov"
                value={dataDetail?.data?.aov ?? 0}
                isEdit={isEdit}
                onChange={handleChange}
                formatRupiah={formatRupiah}
              />

              <EditableCard
                title="Conversion Rate"
                name="conversion_rate"
                value={dataDetail?.data?.conversion_rate ?? 0}
                suffix="%"
                isEdit={isEdit}
                onChange={handleChange}
                formatRupiah={formatRupiah}
              />

              <EditableCard
                title="Cost per Lead"
                name="cost_per_lead"
                value={dataDetail?.data?.cost_per_lead ?? 0}
                isEdit={isEdit}
                onChange={handleChange}
                formatRupiah={formatRupiah}
              />

              <EditableCard
                title="Total Biaya"
                name="total_biaya_op"
                value={dataDetail?.data?.total_biaya_op ?? 0}
                isEdit={isEdit}
                onChange={handleChange}
                formatRupiah={formatRupiah}
              />

              {/* STATUS */}
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                <p className="text-sm text-gray-400 mb-3">Estimasi Status</p>

                <p
                  className={`text-2xl font-bold ${
                    forecast === "Untung" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {forecast}
                </p>
              </div>
            </section>

            {/* RINGKASAN */}
            <section className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold mb-2">Ringkasan</h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                Perencanaan periode {periode} memiliki target revenue sebesar{" "}
                {formatRupiah(dataDetail?.data?.target_revenue ?? 0)}, dengan
                AOV sebesar {formatRupiah(dataDetail?.data?.aov ?? 0)},
                conversion rate {dataDetail?.data?.conversion_rate ?? 0}
                %, dan total biaya{" "}
                {formatRupiah(dataDetail?.data?.total_biaya_op ?? 0)}. Status
                saat ini adalah{" "}
                <span className="font-semibold text-black">{forecast}</span>.
              </p>
            </section>

            {/* ACTION BUTTON */}
            <div className="flex justify-end gap-3 pb-10">
              {isEdit ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-white transition cursor-pointer"
                  >
                    <X size={18} />
                    Batal
                  </button>

                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition cursor-pointer"
                  >
                    <Save size={18} />
                    Simpan
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setDataBeforeEdit(dataDetail);
                    setIsEdit(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition cursor-pointer"
                >
                  <Pencil size={18} />
                  Edit
                </button>
              )}

              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition cursor-pointer"
              >
                <Trash2 size={18} />
                Hapus
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default DetailPerencanaan;
