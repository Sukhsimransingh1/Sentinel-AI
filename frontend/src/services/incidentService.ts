
import axios from "axios";

const API_URL =
  "http://127.0.0.1:8000";

export const createIncident =
  async (incident: any) => {

    const token =
      localStorage.getItem(
        "sentinel_token"
      );

    const response =
      await axios.post(
        `${API_URL}/incidents/`,
        incident,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
  };

export const getIncidents =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/incidents/`
      );

    return response.data;
  };

