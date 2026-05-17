import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

export const fetchDataPerencanaanPending = async () => {
  try {
    const response = await axiosInstanceAuthenticated.get(
      "/persetujuan/pending",
    );
    return response.data;
  } catch (e) {
    throw new Error(`${e.message || e.detail}`);
  }
};

export const postPersetujuanApproved = async (id_laporan) => {
  try {
    const response = await axiosInstanceAuthenticated.post(
      `/persetujuan/approve/${id_laporan}`,
    );
    return response.data;
  } catch (e) {
    throw new Error(`${e.message || e.detail}`);
  }
};

export const postPersetujuanRejected = async (id_laporan) => {
  try {
    const response = await axiosInstanceAuthenticated.post(
      `/persetujuan/reject/${id_laporan}`,
    );
    return response.data;
  } catch (e) {
    throw new Error(`${e.message || e.detail}`);
  }
};
