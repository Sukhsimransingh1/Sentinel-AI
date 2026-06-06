import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

import {
  getIncidents
} from "../services/incidentService";

interface Incident {
  id: number;
  incident_type: string;
  severity: string;
  description: string;
  status: string;
}

export default function Dashboard() {

  const [
    incidents,
    setIncidents
  ] = useState<Incident[]>([]);

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const data =
            await getIncidents();

          setIncidents(data);

        } catch (
          error
        ) {

          console.error(
            error
          );
        }
      };

    fetchData();

  }, []);

  return (

    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <div className="grid grid-cols-3 gap-6">

            <StatCard
              title="Total Incidents"
              value={
                incidents.length.toString()
              }
            />

            <StatCard
              title="Active Emergencies"
              value={
                incidents.length.toString()
              }
            />

            <StatCard
              title="Resolved Cases"
              value="0"
            />

          </div>

          <div className="mt-8 bg-slate-900 rounded-xl p-6 border border-slate-800">

            <h3 className="text-xl font-semibold mb-6">
              Recent Incidents
            </h3>

            <div className="space-y-4">

              {
                incidents.map(
                  (
                    incident
                  ) => (

                    <div
                      key={
                        incident.id
                      }
                      className="border border-slate-800 rounded-lg p-4"
                    >

                      <div className="flex justify-between">

                        <h4 className="font-semibold">

                          {
                            incident.incident_type
                          }

                        </h4>

                        <span className="text-red-400">

                          {
                            incident.severity
                          }

                        </span>

                      </div>

                      <p className="text-slate-400 mt-2">

                        {
                          incident.description
                        }

                      </p>

                    </div>
                  )
                )
              }

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

