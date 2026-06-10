import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ReportIncident from "./pages/ReportIncident";
import MapPage from "./pages/MapPage";
import EmergencyAssistant from "./pages/EmergencyAssistant";
function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/report"
          element={<ReportIncident />}
        />
        <Route
          path="/map"
          element={<MapPage />}
        />
        <Route
          path="/assistant"
          element={
            <EmergencyAssistant />
          }
        />
      </Routes>

    </BrowserRouter>

  );
}

export default App;