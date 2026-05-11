import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

export const fetchDataLaporan = async () => {
  try {
    const response = await axiosInstanceAuthenticated.get("/laporan/");
    return response.data;
  } catch (e) {
    throw new Error(`${e.message || e.detail}`);
  }
};

export const fetchDataLaporanDetail = async (id_laporan) => {
  try {
    const response = await axiosInstanceAuthenticated.get(
      `/laporan/${id_laporan}`,
    );
    return response.data;
  } catch (e) {
    throw new Error(`${e.message || e.detail}`);
  }
};

export const fetchDataLaporanBySearch = async (periode) => {
  try {
    const response = await axiosInstanceAuthenticated.get(
      `/laporan/?periode=${periode}`,
    );
    return response.data;
  } catch (e) {
    throw new Error(`${e.message || e.detail}`);
  }
};
