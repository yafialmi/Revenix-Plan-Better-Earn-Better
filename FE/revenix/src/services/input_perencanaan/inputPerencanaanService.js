import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

export const postInputPerencanaan = async (
  periode,
  target_revenue,
  aov,
  conversion_rate,
  cost_per_lead,
  total_biaya_op,
) => {
  try {
    const response = await axiosInstanceAuthenticated.post("/input/", {
      periode,
      target_revenue,
      aov,
      cost_per_lead,
      conversion_rate,
      total_biaya_op,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.detail;
  }
};
