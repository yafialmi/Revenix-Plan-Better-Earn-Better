import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

export const fetchDataPerencanaan = async () => {
  try {
    const response = await axiosInstanceAuthenticated.get("/input/");
    return response.data;
  } catch (e) {
    throw e.message || e.detail;
  }
};

export const fetchDataPerencaanDetail = async (id_perencanaan) => {
  try {
    const response = await axiosInstanceAuthenticated.get(
      `/input/${id_perencanaan}`,
    );
    return response.data;
  } catch (e) {
    throw e.message || e.detail;
  }
};
