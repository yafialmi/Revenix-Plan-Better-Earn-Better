import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Perencanaan from "./pages/perencanaan";
import Laporan from "./pages/laporan";
import InputPerencanaan from "./pages/InputPerencanaan";
import KonfirmasiPerencanaan from "./pages/konfirmasiPerencanaan";
import ProtectedRoute from "./components/protected_routes";
import DashboardAdm from "./pages/dashboardAdm";
import DetailPerencanaan from "./pages/detailPerencanaan";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
      />

      <Routes>
        {/*
          Routes berfungsi untuk inisiasi link navigasi yang ada pada web.
          Contoh: www.website.com/(path)
          Element berfungsi untuk memberi tahu React, isi konten halaman yang kita navigasikan itu yang mana sebagai contoh element Login akan ngeload function Login.
        */}
        <Route
          path="/"
          element={
            localStorage.getItem("idToken") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboardAdm"
          element={
            <ProtectedRoute>
              <DashboardAdm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perencanaan"
          element={
            <ProtectedRoute>
              <Perencanaan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/laporan"
          element={
            <ProtectedRoute>
              <Laporan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InputPerencanaan"
          element={
            <ProtectedRoute>
              <InputPerencanaan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/konfirmasiPerencanaan"
          element={
            <ProtectedRoute>
              <KonfirmasiPerencanaan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detail-perencanaan/:tahun"
          element={
            <ProtectedRoute>
              <DetailPerencanaan />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

{
  /*
    Selalu definisikan export pada js, agar fungsinya dapat dikenali, export terbagi dua yaitu default (nama fungsi) atau {(nama fungsi), (nama fungsi)}, array digunakan apabila kita ingin menggunakan lebih dari satu function pada page tersebut.
  */
}

export default App;
