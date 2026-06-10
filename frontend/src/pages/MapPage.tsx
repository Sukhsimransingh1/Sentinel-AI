import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { motion } from "framer-motion";
import { FaChartBar, FaExclamationTriangle, FaFire } from "react-icons/fa";

import {
  getIncidents,
} from "../services/incidentService";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

interface Incident {
  id: number;
  incident_type: string;
  severity: string;
  latitude: number;
  longitude: number;
  description: string;
}

const getDisasterIcon = (
  type: string
) => {
  switch (
    type.toLowerCase()
  ) {
    case "fire":
      return "🔥";

    case "flood":
      return "🌊";

    case "medical":
      return "🚑";

    case "earthquake":
      return "🌍";

    default:
      return "⚠️";
  }
};

export default function MapPage() {
  const [incidents, setIncidents] =
    useState<Incident[]>([]);

  const [filter, setFilter] =
    useState("All");

  const [
    userLocation,
    setUserLocation,
  ] = useState<
    [number, number] | null
  >(null);

  const indiaCenter: [
    number,
    number
  ] = [
    20.5937,
    78.9629,
  ];

  useEffect(() => {
    const fetchIncidents =
      async () => {
        try {
          const data =
            await getIncidents();

          setIncidents(data);
        } catch (error) {
          console.error(error);
        }
      };

    fetchIncidents();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      }
    );
  }, []);

  const filteredIncidents =
    filter === "All"
      ? incidents
      : incidents.filter(
          (incident) =>
            incident.incident_type
              .toLowerCase()
              .includes(
                filter.toLowerCase()
              )
        );

  const highSeverity =
    incidents.filter(
      (incident) =>
        incident.severity ===
        "High"
    ).length;

  return (
    <div className="min-h-screen bg-[#071226] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Disaster Map" />

        <div className="flex-1 flex flex-col">
          {/* Statistics */}
          <div className="p-4 border-b border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <StatCard
                title="Total Incidents"
                value={incidents.length}
                icon={FaChartBar}
              />
              <StatCard
                title="High Severity"
                value={highSeverity}
                icon={FaFire}
                color="text-red-500"
              />
              <StatCard
                title="Active Emergencies"
                value={incidents.length}
                icon={FaExclamationTriangle}
                color="text-amber-500"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="bg-[#0B1D33] p-4 flex gap-3 flex-wrap justify-center border-b border-slate-800">
            {[
              "All",
              "Fire",
              "Flood",
              "Medical",
              "Earthquake",
            ].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(item)}
                className={`px-6 py-2 rounded-xl transition ${
                  filter === item
                    ? "bg-red-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item}
              </motion.button>
            ))}
          </div>

          {/* Map */}
          <div className="flex-1">
            <MapContainer as="div" {...({
              center: indiaCenter,
              zoom: 6,
              style: { height: "100%", width: "100%" }
            } as any)}>
              <TileLayer as="div" {...({
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution: "&copy; OpenStreetMap contributors"
              } as any)} />

              {/* User Location */}
              {userLocation && (
                <CircleMarker as="div" {...({
                  center: userLocation,
                  radius: 10,
                  pathOptions: {
                    color: "#0ea5e9",
                    fillColor: "#0ea5e9",
                    fillOpacity: 0.5,
                  }
                } as any)}>
                  <Popup>
                    <div className="text-slate-900">
                      📍 Your Location
                    </div>
                  </Popup>
                </CircleMarker>
              )}

              {/* Incident Markers */}
              {filteredIncidents.map(
                (incident) => (
                  <Marker
                    key={incident.id}
                    position={[
                      incident.latitude,
                      incident.longitude,
                    ] as [
                      number,
                      number
                    ]}
                  >
                    <Popup>
                      <div className="min-w-[220px] text-slate-900">
                        <h3 className="font-bold text-lg">
                          {getDisasterIcon(
                            incident.incident_type
                          )}{" "}
                          {incident.incident_type
                            .charAt(0)
                            .toUpperCase() +
                            incident.incident_type.slice(
                              1
                            )}
                        </h3>
                        <div className="mt-2">
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              incident.severity ===
                              "High"
                                ? "bg-red-100 text-red-700"
                                : incident.severity ===
                                  "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {incident.severity}
                          </span>
                        </div>
                        <p className="mt-3">
                          {incident.description}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                )
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

