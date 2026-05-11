import {
  axiosInstanceAuthenticated,
  axiosInstanceDefault,
} from "../../api/axiosInstance";

export const fetchDataDashboard = async () => {
  try {
    const response = await axiosInstanceAuthenticated.get("/dashboard/summary");
    return response.data;
  } catch (e) {
    throw e.message || e.detail;
  }
};
