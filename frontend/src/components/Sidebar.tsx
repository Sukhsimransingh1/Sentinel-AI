import {
  useNavigate
} from "react-router-dom";

export default function Sidebar() {

  const navigate =
    useNavigate();

  return (

    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800">

      <div className="p-6">

        <h1 className="text-2xl font-bold text-red-500">

          Sentinel AI

        </h1>

        <p className="text-slate-400 text-sm">

          Emergency Intelligence

        </p>

      </div>

      <nav className="mt-8">

        <button

          onClick={() =>

            navigate("/dashboard")

          }

          className="w-full text-left px-6 py-3 hover:bg-slate-800"

        >

          📊 Dashboard

        </button>

        <button

          onClick={() =>

            navigate("/report")

          }

          className="w-full text-left px-6 py-3 hover:bg-slate-800"

        >

          🚨 Report Incident

        </button>

        <button

          onClick={() =>

            navigate("/map")

          }

          className="w-full text-left px-6 py-3 hover:bg-slate-800"

        >

          🗺️ Disaster Map

        </button>

        <button

          onClick={() =>

            navigate("/assistant")

          }

          className="w-full text-left px-6 py-3 hover:bg-slate-800"

        >

          🤖 Emergency Assistant

        </button>

      </nav>

    </aside>

  );

}