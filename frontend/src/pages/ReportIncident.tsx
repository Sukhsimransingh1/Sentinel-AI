import { useEffect, useState } from "react";
import {
  createIncident
} from "../services/incidentService";
import { useNavigate } from "react-router-dom";

export default function ReportIncident() {

  const navigate =
    useNavigate();

  const [
    incidentType,
    setIncidentType
  ] = useState("");

  const [
    severity,
    setSeverity
  ] = useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    image,
    setImage
  ] = useState<File | null>(null);

  const [
    analyzing,
    setAnalyzing
  ] = useState(false);

  const [
    latitude,
    setLatitude
  ] = useState<number | null>(null);

  const [
    longitude,
    setLongitude
  ] = useState<number | null>(null);

  const [
    loading,
    setLoading
  ] = useState(false);

  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

      },

      (error) => {

        console.error(error);

        alert(
          "Location access denied"
        );

      }

    );

  }, []);

  const handleAnalyze =
    async () => {

      if (!image) {

        alert(
          "Please select an image first"
        );

        return;
      }

      try {

        setAnalyzing(true);

        const formData =
          new FormData();

        formData.append(
          "file",
          image
        );

        const response =
          await fetch(
            "http://127.0.0.1:8000/uploads/",
            {
              method: "POST",
              body: formData
            }
          );

        const data =
          await response.json();

        console.log(data);

        setIncidentType(
          data.incident_type || ""
        );

        if (
          data.severity ===
          "Catastrophic"
        ) {

          setSeverity(
            "High"
          );

        } else if (
          data.severity ===
          "Moderate"
        ) {

          setSeverity(
            "Medium"
          );

        } else {

          setSeverity(
            "Low"
          );
        }

        setDescription(
          data.summary || ""
        );

        alert(
          "AI Analysis Complete"
        );

      } catch (
        error
      ) {

        console.error(
          error
        );

        alert(
          "Analysis Failed"
        );

      } finally {

        setAnalyzing(
          false
        );
      }
    };

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      if (
        latitude === null ||
        longitude === null
      ) {

        alert(
          "Waiting for location..."
        );

        return;
      }

      try {

        setLoading(true);

        await createIncident({

          incident_type:
            incidentType,

          severity,

          latitude,

          longitude,

          description,

        });

        alert(
          "Incident Reported Successfully"
        );

        navigate(
          "/dashboard"
        );

      } catch(error: any) {

        console.error(error);

        alert(
          error?.response?.data?.detail ||
          "Failed To Report Incident"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <div className="max-w-3xl mx-auto p-8">

        <h1 className="text-3xl font-bold mb-8">
          Report Incident
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="block mb-2 text-slate-300">
                Upload Disaster Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {

                  if (
                    e.target.files?.[0]
                  ) {

                    setImage(
                      e.target.files[0]
                    );
                  }

                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
              />

            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={
                analyzing
              }
              className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 font-semibold"
            >

              {
                analyzing
                  ? "Analyzing..."
                  : "Analyze Image with AI"
              }

            </button>

            <div>

              <label className="block mb-2 text-slate-300">
                Incident Type
              </label>

              <input
                type="text"
                value={incidentType}
                onChange={(e) =>
                  setIncidentType(
                    e.target.value
                  )
                }
                placeholder="Fire, Flood, Earthquake..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                required
              />

            </div>

            <div>

              <label className="block mb-2 text-slate-300">
                Severity
              </label>

              <select
                value={severity}
                onChange={(e) =>
                  setSeverity(
                    e.target.value
                  )
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                required
              >

                <option value="">
                  Select Severity
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2 text-slate-300">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe the emergency..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3"
                required
              />

            </div>

            <div className="bg-slate-800 rounded-lg p-4 text-sm">

              <p>
                Latitude: {latitude ?? "Loading..."}
              </p>

              <p>
                Longitude: {longitude ?? "Loading..."}
              </p>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-3 font-semibold"
            >

              {
                loading
                  ? "Submitting..."
                  : "Report Incident"
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  );
}