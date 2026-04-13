import axios from "axios";

{
  /* Berfungsi untuk memanggil fungsi Axios*/
}

var url = "http://127.0.0.1:8000";

const axiosInstanceDefault = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

{
  /* Berfungsi untuk memanggil fungsi Axios namun versi Authenticated, digunakan untuk fitur fitur yang membutuhkan header Authorization */
}
const axiosInstanceAuthenticated = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstanceAuthenticated.interceptors.request.use((config) => {
  const token = localStorage.getItem("idToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { axiosInstanceDefault, axiosInstanceAuthenticated };
