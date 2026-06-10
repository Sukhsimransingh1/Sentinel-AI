import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { FaChartBar, FaExclamationTriangle, FaFire, FaUserMd } from "react-icons/fa";

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

const incidentTypeData = [
  { name: "Fire", count: 24, color: "#dc2626" },
  { name: "Flood", count: 18, color: "#0ea5e9" },
  { name: "Earthquake", count: 12, color: "#f59e0b" },
  { name: "Medical", count: 32, color: "#10b981" },
  { name: "Other", count: 15, color: "#6b7280" },
];

const trendData = [
  { month: "Jan", incidents: 45 },
  { month: "Feb", incidents: 52 },
  { month: "Mar", incidents: 38 },
  { month: "Apr", incidents: 65 },
  { month: "May", incidents: 48 },
  { month: "Jun", incidents: 72 },
];

const severityData = [
  { name: "High", value: 35, color: "#dc2626" },
  { name: "Medium", value: 45, color: "#f59e0b" },
  { name: "Low", value: 20, color: "#10b981" },
];

export default function Analytics() {
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

  const highSeverityCount = incidents.filter(i => i.severity === "High").length;
  const activeCount = incidents.length;

  return (
    <div className="min-h-screen bg-[#071226] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Analytics" />
        <div className="flex-1 p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">Comprehensive insights and statistics</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Incidents"
              value={incidents.length}
              icon={FaChartBar}
              color="text-cyan-500"
            />
            <StatCard
              title="Active Reports"
              value={activeCount}
              icon={FaExclamationTriangle}
              color="text-amber-500"
            />
            <StatCard
              title="High Severity"
              value={highSeverityCount}
              icon={FaFire}
              color="text-red-500"
            />
            <StatCard
              title="Avg Response"
              value="12m"
              icon={FaUserMd}
              color="text-green-500"
            />
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Incident Types */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#0B1D33] rounded-2xl p-6 border border-slate-800"
            >
              <h3 className="text-xl font-semibold mb-6">Incident Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentTypeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0B1D33", border: "1px solid #334155" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {incidentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Severity Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-[#0B1D33] rounded-2xl p-6 border border-slate-800"
            >
              <h3 className="text-xl font-semibold mb-6">Severity Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {severityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0B1D33", border: "1px solid #334155" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {severityData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-[#0B1D33] rounded-2xl p-6 border border-slate-800"
          >
            <h3 className="text-xl font-semibold mb-6">Incident Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0B1D33", border: "1px solid #334155" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke="#dc2626"
                    strokeWidth={3}
                    dot={{ fill: "#dc2626", r: 5 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
