import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import Perencanaan from "./pages/perencanaan";
import Laporan from "./pages/laporan";
import InputPerencanaan from "./pages/InputPerencanaan";

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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perencanaan" element={<Perencanaan />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/InputPerencanaan" element={<InputPerencanaan />} />
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