import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  FaExclamationTriangle,
  FaFire,
  FaUser,
  FaExclamationCircle,
  FaChartBar
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

import { getIncidents } from "../services/incidentService";

interface Incident {
  id: number;
  incident_type: string;
  severity: string;
  description: string;
  status: string;
}

const chartData = [
  { name: "Fire", count: 12 },
  { name: "Flood", count: 8 },
  { name: "Earthquake", count: 5 },
  { name: "Medical", count: 15 },
  { name: "Other", count: 7 },
];

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getIncidents();
        setIncidents(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const activeCount = incidents.length;
  const highSeverityCount = incidents.filter((i) => i.severity === "High").length;

  return (
    <div className="min-h-screen bg-[#071226] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Dashboard" />
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Emergency Operations Center</h1>
          <p className="text-slate-400">Monitor and manage disaster incidents in real-time</p>
        </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Incidents"
              value={incidents.length}
              icon={FaChartBar}
            />
            <StatCard
              title="Active Reports"
              value={activeCount}
              icon={FaExclamationTriangle}
              color="text-amber-500"
            />
            <StatCard
              title="AI Analyses"
              value={incidents.length + 5}
              icon={FaFire}
              color="text-red-500"
            />
            <StatCard
              title="Users"
              value="247"
              icon={FaUser}
              color="text-cyan-500"
            />
            <StatCard
              title="High Risk Areas"
              value={highSeverityCount}
              icon={FaExclamationCircle}
              color="text-red-500"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-2 bg-[#0B1D33] rounded-2xl p-6 border border-slate-800"
            >
              <h3 className="text-xl font-semibold mb-6">Incident Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0B1D33", border: "1px solid #334155" }}
                    />
                    <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Incidents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#0B1D33] rounded-2xl p-6 border border-slate-800"
            >
              <h3 className="text-xl font-semibold mb-6">Recent Incidents</h3>
              <div className="space-y-4">
                {incidents.length === 0 ? (
                  <div className="text-slate-400 text-center py-8">No incidents reported</div>
                ) : (
                  incidents.slice(0, 5).map((incident) => (
                    <div
                      key={incident.id}
                      className="border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold capitalize">{incident.incident_type}</h4>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            incident.severity === "High"
                              ? "bg-red-500/20 text-red-400"
                              : incident.severity === "Medium"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {incident.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm">{incident.description}</p>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

