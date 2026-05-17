import { axiosInstanceAuthenticated } from "../../api/axiosInstance";

const getErrorMessage = (e) => {
  const detail = e.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        const field = item.loc?.join(".");
        return field
          ? `${field}: ${item.msg}`
          : item.msg;
      })
      .join(", ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (detail) {
    return JSON.stringify(detail);
  }

  return (
    e.response?.data?.message ||
    e.message ||
    "Terjadi kesalahan"
  );
};

const getAuthorizationHeader = () => {
  const token = localStorage.getItem("idToken");

  if (!token) {
    throw new Error("Token login tidak ditemukan");
  }

  return {
    Authorization: token,
  };
};

//data perenencanaan
export const fetchDataPerencanaan =
  async () => {
    try {
      const response =
        await axiosInstanceAuthenticated.get(
          "/input/"
        );

      return response.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };


//detail perencanaan
export const fetchDataPerencaanDetail =
  async (id_perencanaan) => {
    try {
      const response =
        await axiosInstanceAuthenticated.get(
          `/input/${id_perencanaan}`
        );

      return response.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };


//perencanaan pending
export const fetchDataPerencanaanPending =
  async () => {
    try {
      const response =
        await axiosInstanceAuthenticated.get(
          "/persetujuan/pending"
        );

      return response.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };


  //approve persetujuan
export const approvePersetujuan =
  async (hasil_id) => {
    try {
      const response =
        await axiosInstanceAuthenticated.post(
          `/persetujuan/approve/${encodeURIComponent(hasil_id)}`,
          null,
          {
            headers: getAuthorizationHeader(),
          }
        );

      return response.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };

  //reject persetujuan
export const rejectPersetujuan =
  async (hasil_id) => {
    try {
      const response =
        await axiosInstanceAuthenticated.post(
          `/persetujuan/reject/${encodeURIComponent(hasil_id)}`,
          null,
          {
            headers: getAuthorizationHeader(),
          }
        );

      return response.data;
    } catch (e) {
      throw new Error(getErrorMessage(e));
    }
  };
