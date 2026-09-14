import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// Default inactivity timeout for shared field tablets (15 minutes)
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

function ProtectedRoute({
  currentRole,
  allowedRoles = [],
  redirectPath = "/select-role",
  children,
}) {
  const location = useLocation();

  // 1. Shared Device Security: Inactivity Session Timeout Guard
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        console.warn("[ProtectedRoute] Inactivity timeout reached. Locking session for shared device security.");
        // Clear active session identifiers from memory/storage
        localStorage.removeItem("swasthya_user");
        window.location.href = "/login?sessionExpired=true";
      }, INACTIVITY_TIMEOUT_MS);
    };

    // User activity listeners
    const activityEvents = ["mousedown", "keydown", "touchstart", "scroll"];
    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  // 2. Unauthenticated check
  if (!currentRole) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 3. Unauthorized Role check (e.g., Patient trying to access /admin/dashboard)
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return (
      <Navigate
        to={redirectPath}
        replace
        state={{ unauthorized: true, attempted: location.pathname }}
      />
    );
  }

  // Render children or nested route Outlet
  return children ? children : <Outlet />;
}

export default ProtectedRoute;