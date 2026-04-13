import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { authUser } from "../services/auth/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    {
      /* Berfungsi untuk memanggil melakukan handling login ke website, localStorage berfungsi untuk menyimpan data yang didapatkan ke cache. Apabila berhasil maka arahkan ke dashboard, sebaliknya akan tampilkan error */
    }
    try {
      e.preventDefault();
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
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm mb-1 font-poppins">Email</label>
              <input
                type="email"
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
              />
            </div>

            {/* Password */}
            <div className="mb-6 relative">
              <label className="block text-sm mb-1 font-poppins">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-gray-500 hover:text-blue-600 transition duration-200"
              >
                {showPassword ? (
                  // Eye-off icon (hide password)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  // Eye icon (show password)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer ease-in-out duration-300"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
