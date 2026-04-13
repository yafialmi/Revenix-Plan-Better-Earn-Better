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

{
  /* Logic untuk pengecekan headers Authorization, meminta localStorage (cache) dari website untuk pengecekan apakah user memiliki token atau tidak, apabila tidak maka akan dialihkan ke reject */
}
axiosInstanceAuthenticated.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export { axiosInstanceDefault, axiosInstanceAuthenticated };
