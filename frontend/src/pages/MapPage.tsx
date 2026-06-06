import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";

import {
  getIncidents,
} from "../services/incidentService";

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
    <div className="h-screen flex flex-col bg-slate-950">

      {/* Header */}

      <div className="bg-slate-950 text-white px-6 py-4 border-b border-slate-800">

        <h1 className="text-2xl font-bold">
          Sentinel AI
          Disaster Monitoring Map
        </h1>

      </div>

      {/* Statistics */}

      <div className="bg-slate-900 border-b border-slate-800 p-4">

        <div className="grid grid-cols-3 gap-4">

          <div className="bg-slate-800 rounded-lg p-4">

            <p className="text-slate-400">
              Total Incidents
            </p>

            <h2 className="text-2xl font-bold text-white">
              {incidents.length}
            </h2>

          </div>

          <div className="bg-slate-800 rounded-lg p-4">

            <p className="text-slate-400">
              High Severity
            </p>

            <h2 className="text-2xl font-bold text-red-400">
              {highSeverity}
            </h2>

          </div>

          <div className="bg-slate-800 rounded-lg p-4">

            <p className="text-slate-400">
              Active Emergencies
            </p>

            <h2 className="text-2xl font-bold text-orange-400">
              {incidents.length}
            </h2>

          </div>

        </div>

      </div>

      {/* Filter Buttons */}

      <div className="bg-slate-950 p-4 flex gap-3 flex-wrap">

        {[
          "All",
          "Fire",
          "Flood",
          "Medical",
          "Earthquake",
        ].map((item) => (
          <button
            key={item}
            onClick={() =>
              setFilter(item)
            }
            className={`px-4 py-2 rounded-lg transition ${
              filter === item
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {item}
          </button>
        ))}

      </div>

      {/* Map */}

      <div className="flex-1">

        <MapContainer
          center={indiaCenter}
          zoom={6}
          style={{
            height: "100%",
            width: "100%",
          }}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* User Location */}

          {userLocation && (

            <CircleMarker
              center={userLocation}
              radius={10}
              pathOptions={{
                color: "blue",
              }}
            >

              <Popup>
                📍 Your Location
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

                  <div className="min-w-[220px]">

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

                        {
                          incident.severity
                        }

                      </span>

                    </div>

                    <p className="mt-3">

                      {
                        incident.description
                      }

                    </p>

                  </div>

                </Popup>

              </Marker>

            )
          )}

        </MapContainer>

      </div>

    </div>
  );
}

