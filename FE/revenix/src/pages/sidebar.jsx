import logo from "../assets/logo2.png";
import { NavLink } from "react-router-dom";
import Dashboard from "./dashboard";

function Sidebar() {
  const navigation = [
    {
        /* Sidebar Dashboard */
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <rect width={7} height={9} x={3} y={3} rx={1}></rect>
            <rect width={7} height={5} x={14} y={3} rx={1}></rect>
            <rect width={7} height={9} x={14} y={12} rx={1}></rect>
            <rect width={7} height={5} x={3} y={16} rx={1}></rect>
          </g>
        </svg>
      ),
    },
    {
        /* Sidebar Perencanaan */
      name: "Perencanaan",
      path: "/perencanaan",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2"
            ></path>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          </g>
        </svg>
      ),
    },
    {
        /* Sidebar Laporan */
      name: "Laporan",
      path: "/laporan",
      icon: (
        <svg width={20} height={20} viewBox="0 0 24 24">
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-[250px] h-screen bg-white border-r flex flex-col justify-between p-6">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <img src={logo} alt="logo" className="w-16 h-16 rounded-full" />
          <div>
            <h1 className="block text-base mb-1 font-poppins font-bold tracking-wide">Revenix</h1>
            <p className="text-sm text-gray-500">Planning & Forecasting</p>
          </div>
        </div>
        {/* Menu */}
        <nav className="space-y-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 cursor-pointer transition duration-200 ${
            isActive
            ? "text-blue-600 font-bold"
            : "text-gray-600 hover:text-blue-600 font-medium"                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    {/* LOGOUT */}
      <button className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-2 rounded-lg hover:bg-blue-50 hover:scale-105 transition duration-200 cursor-pointer">
        <svg width={20} height={20} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
          />
        </svg>
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;