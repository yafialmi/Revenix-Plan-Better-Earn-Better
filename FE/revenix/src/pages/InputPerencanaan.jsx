import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import Sidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
import { postInputPerencanaan } from "../services/input_perencanaan/inputPerencanaanService";

export default function InputPerencanaan() {
  const [periode, setPeriode] = useState(0);
  const [target_revenue, setTargetRevenue] = useState(0.0);
  const [aov, setAov] = useState(0.0);
  const [conversion_rate, setConversionRate] = useState(0.0);
  const [cost_per_lead, setCostPerLead] = useState(0.0);
  const [total_biaya_op, setTotalBiayaOperasional] = useState(0.0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await postInputPerencanaan(
        parseInt(periode),
        parseFloat(target_revenue),
        parseFloat(aov),
        parseFloat(cost_per_lead),
        parseFloat(conversion_rate),
        parseFloat(total_biaya_op),
      );
      toast.success(`${data["message"]}`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(`Input gagal! ${error.detail || error}`);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#f5f7fb] overflow-hidden font-poppins">
      <Sidebar />

      <main className="flex-1 min-w-0 px-10 py-10 bg-gradient-to-br from-[#f7f8fc] to-[#eeeffc] overflow-hidden">
        {" "}
        <div className="h-full">
          <h1 className="text-4xl font-bold text-black mb-10">
            Buat Perencanaan Baru
          </h1>

          <div className="max-w-5xl bg-white rounded-2xl shadow-sm border px-8 py-7">
            <h2 className="text-2xl font-bold text-black">Data Perencanaan</h2>
            <p className="text-gray-500 mt-1">
              Masukkan parameter perencanaan Anda
            </p>

            {/* 🔥 FORM */}
            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Periode (Tahun) *
                  </label>
                  <input
                    type="number"
                    value={periode}
                    onChange={(e) => setPeriode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border font-poppins bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 transition ease-in-out"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Target Revenue (Rp) *
                  </label>
                  <input
                    type="number"
                    value={target_revenue}
                    onChange={(e) =>
                      setTargetRevenue(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Masukkan Target Revenue"
                    className="w-full px-4 py-3 rounded-xl border font-poppins bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 transition ease-in-out"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Average Order Value / AOV (Rp) *
                  </label>
                  <input
                    type="number"
                    value={aov}
                    onChange={(e) => setAov(e.target.value.replace(/\D/g, ""))}
                    placeholder="Masukkan Average Order Value"
                    className="w-full px-4 py-3 rounded-xl border font-poppins bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 transition ease-in-out"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Conversion Rate (%) *
                  </label>
                  <input
                    type="number"
                    value={conversion_rate}
                    onChange={(e) => setConversionRate(e.target.value)}
                    placeholder="Masukkan Conversion Rate"
                    className="w-full px-4 py-3 rounded-xl border font-poppins bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 transition ease-in-out"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Cost Per Lead (Rp) *
                  </label>
                  <input
                    type="number"
                    value={cost_per_lead}
                    onChange={(e) =>
                      setCostPerLead(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Masukkan Cost Per Lead"
                    className="w-full px-4 py-3 rounded-xl border font-poppins bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 transition ease-in-out"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Total Biaya Operasional (Rp) *
                  </label>
                  <input
                    type="number"
                    value={total_biaya_op}
                    onChange={(e) =>
                      setTotalBiayaOperasional(
                        e.target.value.replace(/\D/g, ""),
                      )
                    }
                    placeholder="Total Biaya Operasional"
                    className="w-full px-4 py-3 rounded-xl border font-poppins bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 duration-300 transition ease-in-out"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="mt-8 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-poppins hover:bg-blue-700 transition ease-in-out"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6M7 4h6l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                  />
                </svg>
                Simpan Perencanaan
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
