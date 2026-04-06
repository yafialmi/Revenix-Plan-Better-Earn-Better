import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { authUser } from "../services/auth/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    {
      /* Berfungsi untuk memanggil melakukan handling login ke website, localStorage berfungsi untuk menyimpan data yang didapatkan ke cache. Apabila berhasil maka arahkan ke dashboard, sebaliknya akan tampilkan error */
    }
    try {
      const data = await authUser(email, password);
      localStorage.setItem("idToken", data.idToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("userEmail", data.email);
      toast.success(`Login Berhasil! Selamat datang ${email}`);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(`Login Gagal! ${error.message || error}`);
    }
  };
  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-purple-300 via-blue-200 to-blue-300 relative">
        {/* Logo (top-left) */}
        <div className="absolute top-6 left-6">
          <img src={logo} alt="logo" className="w-16 h-16 rounded-full" />
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-87.5">
          <h2 className="text-xl font-semibold text-center mb-6 font-poppins">
            Masuk ke Akun Anda
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-1 font-poppins">Email</label>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(value) => setEmail(value.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm mb-1 font-poppins">Password</label>
            <input
              type="password"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(value) => setPassword(value.target.value)}
              className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer ease-in-out duration-300"
          >
            LOGIN
          </button>
        </div>
      </div>

    </>
  );
}

export default Login;
