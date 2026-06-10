import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { FaShieldAlt, FaUserCircle } from "react-icons/fa";

interface Props {
  title?: string;
}

export default function Navbar({ title }: Props) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-[#0B1D33] border-b border-slate-800 p-4 flex justify-between items-center px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
          <FaShieldAlt className="text-white text-sm" />
        </div>
        <h2 className="text-xl font-semibold">
          {title || "Sentinel AI"}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <FaUserCircle className="text-lg" />
          <span className="text-sm hidden sm:block">Welcome Back</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}