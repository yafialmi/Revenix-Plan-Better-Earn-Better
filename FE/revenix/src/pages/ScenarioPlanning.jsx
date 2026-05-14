import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { TrendingUp, Wallet, Users, Target, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold mt-2">{value}</h2>
      </div>
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
        {icon}
      </div>
    </div>
  );
}

function ScenarioCard({ title, data, color }) {
  return (
    <div className="rounded-2xl border p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}
        >
          {data?.status}
        </span>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Revenue</span>
          <span className="font-semibold">
            {formatRupiah(data?.estimasi_revenue)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Cash Flow</span>
          <span className="font-semibold">{formatRupiah(data?.cash_flow)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Budget Promosi</span>
          <span className="font-semibold">
            {formatRupiah(data?.budget_promosi)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Leads Dibutuhkan</span>
          <span className="font-semibold">{data?.leads_dibutuhkan}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Conversion Rate</span>
          <span className="font-semibold">
            {data?.conversion_rate_digunakan}%
          </span>
        </div>
      </div>
    </div>
  );
}

function ScenarioPlanning() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { periode, id_laporan, data } = location.state;

  return (
    <div className="h-screen flex bg-linear-to-br from-gray-100 to-blue-100 overflow-hidden font-poppins">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Forecast & Scenario</h1>
            <p className="text-gray-600 mt-1 text-sm">
              Analisis forecast dan simulasi scenario bisnis
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

        {loading ? (
          <div className="h-[70vh] flex items-center justify-center">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <SummaryCard
                title="Estimasi Revenue"
                value={formatRupiah(
                  data?.data?.forecast?.estimasi_revenue ?? 0,
                )}
                icon={<TrendingUp size={24} />}
              />
              <SummaryCard
                title="Cash Flow"
                value={formatRupiah(data?.data?.forecast?.cash_flow ?? 0)}
                icon={<Wallet size={24} />}
              />
              <SummaryCard
                title="Budget Promosi"
                value={formatRupiah(data?.data?.forecast?.budget_promosi ?? 0)}
                icon={<Target size={24} />}
              />
              <SummaryCard
                title="Leads Dibutuhkan"
                value={data?.data?.forecast?.leads_dibutuhkan ?? 0}
                icon={<Users size={24} />}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <ScenarioCard
                title="Scenario Optimis"
                data={data?.data?.skenario?.optimis ?? 0}
                color="bg-green-100 text-green-700"
              />
              <ScenarioCard
                title="Scenario Normal"
                data={data?.data?.skenario?.normal ?? 0}
                color="bg-blue-100 text-blue-700"
              />
              <ScenarioCard
                title="Scenario Pesimis"
                data={data?.data?.skenario?.pesimis ?? 0}
                color="bg-red-100 text-red-700"
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ScenarioPlanning;
