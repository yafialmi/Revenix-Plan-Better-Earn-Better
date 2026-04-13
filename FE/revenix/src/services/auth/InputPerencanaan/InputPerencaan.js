import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

export const postInputPerencanaan = async (
  periode,
  target_revenue,
  aov,
  conversion_rate,
  cost_per_lead,
  total_biaya,
) => {
  try {
    const response = await axiosInstanceAuthenticated.post("/", {
      periode,
      target_revenue,
      aov,
      conversion_rate,
      cost_per_lead,
      total_biaya,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

