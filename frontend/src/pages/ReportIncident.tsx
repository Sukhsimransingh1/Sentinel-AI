import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUpload, FaImage, FaSpinner, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { createIncident } from "../services/incidentService";
import { useNavigate } from "react-router-dom";

export default function ReportIncident() {
  const navigate = useNavigate();
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        alert("Location access denied");
      }
    );
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    try {
      setAnalyzing(true);
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("http://127.0.0.1:8000/uploads/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);

      setIncidentType(data.incident_type || "");
      if (data.severity === "Catastrophic") {
        setSeverity("High");
      } else if (data.severity === "Moderate") {
        setSeverity("Medium");
      } else {
        setSeverity("Low");
      }
      setDescription(data.summary || "");
      setStep(2);
    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (latitude === null || longitude === null) {
      alert("Waiting for location...");
      return;
    }

    try {
      setLoading(true);
      await createIncident({
        incident_type: incidentType,
        severity,
        latitude,
        longitude,
        description,
      });

      alert("Incident Reported Successfully");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.detail || "Failed To Report Incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071226] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Report Incident" />
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold mb-2">Report an Emergency</h1>
              <p className="text-slate-400 mb-8">
                Provide details about the incident to help first responders
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-[#0B1D33] border border-slate-800 rounded-2xl p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block mb-3 text-slate-300 font-medium">
                    Upload Disaster Image
                  </label>
                  {!imagePreview ? (
                    <label className="block">
                      <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-500 transition-colors">
                        <FaUpload className="text-4xl text-slate-500 mx-auto mb-4" />
                        <p className="text-slate-400">Click to upload or drag and drop</p>
                        <p className="text-slate-500 text-sm mt-2">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-xl border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImage(null);
                          setImagePreview("");
                        }}
                        className="absolute top-4 right-4 bg-slate-900/80 p-2 rounded-lg hover:bg-slate-800"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  {image && step === 1 && (
                    <button
                      type="button"
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 rounded-lg py-3 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {analyzing ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <FaImage />
                          Analyze Image with AI
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Incident Type */}
                <div>
                  <label className="block mb-2 text-slate-300 font-medium">
                    Incident Type
                  </label>
                  <input
                    type="text"
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    placeholder="Fire, Flood, Earthquake..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>

                {/* Severity */}
                <div>
                  <label className="block mb-2 text-slate-300 font-medium">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  >
                    <option value="">Select Severity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-slate-300 font-medium">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the emergency in detail..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>

                {/* Location Info */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-cyan-500" />
                    <span className="font-medium">Location</span>
                  </div>
                  <div className="text-slate-400 text-sm space-y-1">
                    <p>Latitude: {latitude ?? "Loading..."}</p>
                    <p>Longitude: {longitude ?? "Loading..."}</p>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 rounded-lg py-4 font-semibold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Report Incident
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}