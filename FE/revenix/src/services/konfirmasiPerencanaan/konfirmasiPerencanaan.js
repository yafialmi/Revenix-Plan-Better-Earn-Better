import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

// GET ALL PENDING

export const fetchPersetujuan =
  async () => {
    try {
      const response =
        await axiosInstanceAuthenticated.get(
          "/persetujuan/status"
        );

      return response.data;
    } catch (e) {
      throw e.message || e.detail;
    }
  };

// APPROVE
export const approvePersetujuan =
  async (hasil_id) => {
    try {
      const response =
        await axiosInstanceAuthenticated.post(
          `/persetujuan/approve/${hasil_id}`
        );

      return response.data;
    } catch (e) {
      throw e.message || e.detail;
    }
  };


// REJECT
export const rejectPersetujuan =
  async (hasil_id) => {
    try {
      const response =
        await axiosInstanceAuthenticated.post(
          `/persetujuan/reject/${hasil_id}`
        );

      return response.data;
    } catch (e) {
      throw e.message || e.detail;
    }
  };