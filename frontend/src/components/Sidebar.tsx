import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaRobot,
  FaShieldAlt,
  FaChartLine
} from "react-icons/fa";

const navItems = [
  { path: "/dashboard", icon: FaChartBar, label: "Dashboard" },
  { path: "/report", icon: FaExclamationTriangle, label: "Report Incident" },
  { path: "/map", icon: FaMapMarkedAlt, label: "Disaster Map" },
  { path: "/assistant", icon: FaRobot, label: "Emergency Assistant" },
  { path: "/analytics", icon: FaChartLine, label: "Analytics" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-[#071226] border-r border-slate-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
            <FaShieldAlt className="text-white" />
          </div>
          <h1 className="text-xl font-bold">Sentinel AI</h1>
        </div>
        <p className="text-slate-400 text-sm">Emergency Intelligence</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-red-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <item.icon />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}