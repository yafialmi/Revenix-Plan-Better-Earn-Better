import {
  axiosInstanceAuthenticated,
  axiosInstanceDefault,
} from "../../api/axiosInstance";

export const fetchDataDashboard = async () => {
  try {
    const response = await axiosInstanceAuthenticated.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
