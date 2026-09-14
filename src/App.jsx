import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Landing from "./pages/Landing.jsx";
import RoleSelection from "./pages/Roleselection.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";

// Dashboards
import PatientDashboard from "./pages/patient/PatientDashboard.jsx";
import DoctorDashboard from "./pages/doctor/DoctorDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import WorkerDashboard from "./pages/worker/WorkerDashboard.jsx";

// Teleconsultation Room
import CallModal from "./components/CallModal.jsx";

// Security & Offline Engine
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { initOfflineSyncListener } from "./api/syncQueue.js";

function App() {
  // Read authenticated session or role from local state/storage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("swasthya_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const currentRole = currentUser?.role || localStorage.getItem("swasthya_role");
  const currentUserId = currentUser?.id || currentUser?._id || "guest-user";

  // Mount background offline sync listener (flushes Dexie queue on reconnect)
  useEffect(() => {
    const cleanup = initOfflineSyncListener(
      (item) => console.log("[Sync Success] Flushed queue item:", item.queueId),
      (item, conflict) => console.warn("[Sync Conflict] Manual review needed:", item.queueId, conflict)
    );
    return cleanup;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/roles" element={<RoleSelection />} />
        <Route path="/select-role" element={<Navigate to="/roles" replace />} />
        <Route path="/login" element={<Login onLogin={(user) => setCurrentUser(user)} />} />
        <Route path="/registration" element={<Registration />} />

        {/* Teleconsultation Room Route (Supports dynamic Room ID & Call Type query parameter or defaults) */}
        <Route
          path="/consultation/:roomId"
          element={
            <ProtectedRoute currentRole={currentRole} allowedRoles={["patient", "doctor", "worker"]}>
              <ConsultationRouteWrapper userId={currentUserId} />
            </ProtectedRoute>
          }
        />

        {/* Protected Patient Dashboard */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute currentRole={currentRole} allowedRoles={["patient"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Doctor Dashboard */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute currentRole={currentRole} allowedRoles={["doctor"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Worker Dashboard (ASHA / ANM) */}
        <Route
          path="/worker-dashboard"
          element={
            <ProtectedRoute currentRole={currentRole} allowedRoles={["worker"]}>
              <WorkerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute currentRole={currentRole} allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper wrapper to extract dynamic route parameters for CallModal
import { useParams, useNavigate, useSearchParams } from "react-router-dom";

function ConsultationRouteWrapper({ userId }) {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const callType = searchParams.get("type") || "video";

  return (
    <CallModal
      roomId={roomId}
      userId={userId}
      callType={callType}
      onClose={() => navigate(-1)} // Return back to previous dashboard on call end
    />
  );
}

export default App;