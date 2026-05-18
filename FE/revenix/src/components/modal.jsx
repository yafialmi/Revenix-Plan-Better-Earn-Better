import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const SummaryField = ({ label, value, className = "" }) => (
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

const SummaryFieldFillable = ({ label, value, onChange, className = "" }) => (
  <label className={className}>
    <span className="block text-xs font-semibold text-gray-600 mb-1">
      {label}
    </span>

    <input
      value={value}
      onChange={onChange}
      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none"
    />
  </label>
);

const SummarySection = ({
  id,
  number,
  title,
  children,
  openSummarySection,
  setOpenSummarySection,
}) => {
  const isOpen = openSummarySection === id;

  return (
    <div className="border-b border-gray-200 pb-3 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpenSummarySection(isOpen ? "" : id)}
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
              isOpen ? "text-teal-700" : "text-gray-700"
            }`}
          >
            {title}
          </span>
        </div>

        <span className="text-xl text-gray-500 leading-none">
          {isOpen ? "v" : ">"}
        </span>
      </button>

      {isOpen && <div className="pl-8 pt-1">{children}</div>}
    </div>
  );
};

function PlanningApprovalModals({
  openApprove,
  onCloseApprove,
  selectedItem,
  catatan_admin,
  setCatatanAdmin,
  onApprove,
  onReject,
}) {
  const [openSummarySection, setOpenSummarySection] = useState("parameter");

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
    selectedItem?.parameter?.[key] ?? selectedItem?.[key];

  const getForecast = (key) => selectedItem?.forecast?.[key];

  const approvalStatus = selectedItem?.status_persetujuan ?? "-";

  const forecastStatus = getForecast("status") ?? "-";

  return (
    <>
      <Dialog
        open={openApprove}
        onClose={onCloseApprove}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Perencanaan</DialogTitle>

        <DialogContent>
          <div className="mt-1 border-t border-gray-200 pt-2">
            <SummarySection
              id="general"
              number="1"
              title="General Details"
              openSummarySection={openSummarySection}
              setOpenSummarySection={setOpenSummarySection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SummaryField
                  label="Periode"
                  value={selectedItem?.periode ?? "-"}
                />

                <SummaryField
                  label="Status Persetujuan"
                  value={approvalStatus}
                />

                <SummaryField label="Status Forecast" value={forecastStatus} />

                <SummaryField
                  label="Hasil ID"
                  value={selectedItem?.hasil_id ?? "-"}
                />
              </div>
            </SummarySection>

            <SummarySection
              id="parameter"
              number="2"
              title="Parameter Perencanaan"
              openSummarySection={openSummarySection}
              setOpenSummarySection={setOpenSummarySection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SummaryField
                  label="Target Revenue"
                  value={formatRupiah(getParameter("target_revenue"))}
                />

                <SummaryField
                  label="AOV"
                  value={formatRupiah(getParameter("aov"))}
                />

                <SummaryField
                  label="Conversion Rate"
                  value={`${getParameter("conversion_rate") ?? "-"}%`}
                />

                <SummaryField
                  label="Cost per Lead"
                  value={formatRupiah(getParameter("cost_per_lead"))}
                />

                <SummaryField
                  label="Total Biaya"
                  value={formatRupiah(getParameter("total_biaya_op"))}
                />
              </div>
            </SummarySection>

            <SummarySection
              id="forecast"
              number="3"
              title="Forecast Result"
              openSummarySection={openSummarySection}
              setOpenSummarySection={setOpenSummarySection}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SummaryField
                  label="Estimasi Revenue"
                  value={formatRupiah(getForecast("estimasi_revenue"))}
                />

                <SummaryField
                  label="Cash Flow"
                  value={formatRupiah(getForecast("cash_flow"))}
                />

                <SummaryField
                  label="Budget Promosi"
                  value={formatRupiah(getForecast("budget_promosi"))}
                />

                <SummaryField
                  label="Leads Dibutuhkan"
                  value={formatNumber(getForecast("leads_dibutuhkan"))}
                />
              </div>
            </SummarySection>

            <SummarySection
              id="approval"
              number="4"
              title="Approval Notes"
              openSummarySection={openSummarySection}
              setOpenSummarySection={setOpenSummarySection}
            >
              <div className="grid grid-cols-1 gap-3">
                <SummaryFieldFillable
                  label="Catatan Admin"
                  value={catatan_admin}
                  onChange={(e) => setCatatanAdmin(e.target.value)}
                />

                <p className="text-sm text-gray-600 leading-relaxed">
                  Perencanaan periode {selectedItem?.periode ?? "-"} memiliki
                  target revenue {formatRupiah(getParameter("target_revenue"))},
                  AOV {formatRupiah(getParameter("aov"))}, conversion rate{" "}
                  {getParameter("conversion_rate") ?? "-"}%, dan total biaya{" "}
                  {formatRupiah(getParameter("total_biaya_op"))}. Estimasi
                  status saat ini adalah{" "}
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
          <Button color="inherit" variant="contained" onClick={onCloseApprove}>
            Cancel
          </Button>

          <Button color="error" variant="contained" onClick={onReject}>
            Tolak
          </Button>

          <Button color="success" variant="contained" onClick={onApprove}>
            Setuju
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PlanningApprovalModals;
