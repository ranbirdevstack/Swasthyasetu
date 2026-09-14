import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { facilities } from "../data/facilities.js";
import StatusBadge from "./StatusBadge.jsx";

// 1. Fix default Leaflet marker asset paths in modern bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 2. Custom SVG map markers for rural healthcare tiers
const createCustomPin = (color = "#087f8c", isEmergency = false) => {
  const svgHtml = `
    <div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      border: 2px solid #ffffff;
    ">
      <span style="
        transform: rotate(45deg);
        color: #ffffff;
        font-weight: 800;
        font-size: 15px;
        line-height: 1;
      ">${isEmergency ? "✚" : "●"}</span>
    </div>
  `;

  return L.divIcon({
    className: "custom-facility-pin",
    html: svgHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// 3. Map recenter controller
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.1 });
    }
  }, [center, zoom, map]);
  return null;
}

function FacilityMap({
  selectedFacilityId = null,
  onSelectFacility,
  userLocation = { lat: 25.352, lng: 82.964 }, // Varanasi District Rural Belt
  height = "440px",
}) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [forceListView, setForceListView] = useState(!navigator.onLine);
  const [activeCenter, setActiveCenter] = useState([userLocation.lat, userLocation.lng]);
  const [zoomLevel, setZoomLevel] = useState(12);

  // Monitor connectivity state to manage tile degradation
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setForceListView(true); // Auto-switch to offline card list to avoid grey grid frustration
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Update center when a facility is picked elsewhere
  useEffect(() => {
    if (selectedFacilityId) {
      const target = facilities.find((f) => f.id === selectedFacilityId);
      if (target?.coordinates) {
        setActiveCenter([target.coordinates.lat, target.coordinates.lng]);
        setZoomLevel(14);
      }
    }
  }, [selectedFacilityId]);

  return (
    <>
      <style>{`
        .facility-map-container {
          position: relative;
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(8, 127, 140, 0.08);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .map-canvas-inner {
          width: 100%;
          height: ${height};
        }

        .map-view-switcher {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 4px;
          display: flex;
          gap: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .map-view-btn {
          border: none;
          background: transparent;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .map-view-btn.active {
          background: #087f8c;
          color: #ffffff;
        }

        .map-offline-banner {
          position: absolute;
          top: 14px;
          left: 14px;
          z-index: 1000;
          background: #fff0ef;
          border: 1px solid #fecaca;
          color: #b91c1c;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .facility-popup-box {
          min-width: 220px;
          max-width: 270px;
          font-family: inherit;
        }

        .facility-popup-type {
          font-size: 11px;
          font-weight: 800;
          color: #087f8c;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
        }

        .facility-popup-name {
          font-size: 15px;
          font-weight: 700;
          color: #17344c;
          margin: 3px 0 6px;
        }

        .facility-popup-metrics {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
          margin: 8px 0 10px;
          border-top: 1px dashed #e2e8f0;
          padding-top: 6px;
        }

        .facility-popup-action {
          width: 100%;
          background: #087f8c;
          color: #ffffff;
          border: none;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .facility-popup-action:hover {
          background: #066670;
        }

        /* Offline Fallback List View */
        .offline-facility-fallback {
          height: ${height};
          overflow-y: auto;
          padding: 20px;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
        }

        .offline-fallback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .offline-facility-row {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .offline-facility-row:hover {
          border-color: #087f8c;
          box-shadow: 0 4px 14px rgba(8, 127, 140, 0.08);
        }

        .offline-legend-bar {
          position: absolute;
          bottom: 14px;
          left: 14px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          border-radius: 8px;
          display: flex;
          gap: 12px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          z-index: 1000;
        }
      `}</style>

      <div className="facility-map-container">
        {/* Connection Notice */}
        {!isOnline && (
          <div className="map-offline-banner">
            <span>● Offline Mode: Cached Facility Records</span>
          </div>
        )}

        {/* View Toggle: Map vs Offline List */}
        <div className="map-view-switcher">
          <button
            type="button"
            className={`map-view-btn ${!forceListView ? "active" : ""}`}
            onClick={() => setForceListView(false)}
            title="Interactive Spatial Map"
          >
            Map
          </button>
          <button
            type="button"
            className={`map-view-btn ${forceListView ? "active" : ""}`}
            onClick={() => setForceListView(true)}
            title="Sorted Offline Text Directory"
          >
            Offline List ({facilities.length})
          </button>
        </div>

        {!forceListView ? (
          /* 1. Spatial Leaflet Map Canvas */
          <MapContainer
            center={activeCenter}
            zoom={zoomLevel}
            scrollWheelZoom={false}
            className="map-canvas-inner"
          >
            <RecenterMap center={activeCenter} zoom={zoomLevel} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {facilities.map((fac) => {
              if (!fac.coordinates?.lat || !fac.coordinates?.lng) return null;

              const pinColor = fac.emergency ? "#d65f5f" : "#087f8c";
              const pinIcon = createCustomPin(pinColor, fac.emergency);

              return (
                <Marker
                  key={fac.id}
                  position={[fac.coordinates.lat, fac.coordinates.lng]}
                  icon={pinIcon}
                  eventHandlers={{
                    click: () => {
                      if (onSelectFacility) onSelectFacility(fac);
                    },
                  }}
                >
                  <Popup>
                    <div className="facility-popup-box">
                      <span className="facility-popup-type">{fac.type}</span>
                      <h4 className="facility-popup-name">{fac.name}</h4>

                      <div style={{ marginBottom: "6px" }}>
                        <StatusBadge status={fac.emergency ? "Urgent" : fac.openStatus} />
                      </div>

                      <div className="facility-popup-metrics">
                        <div><strong>Distance:</strong> {fac.distance}</div>
                        <div><strong>Est. Wait:</strong> {fac.wait}</div>
                        <div><strong>Doctor On Duty:</strong> {fac.doctor?.split("(")[0]}</div>
                        <div><strong>Contact:</strong> {fac.phone}</div>
                      </div>

                      <button
                        type="button"
                        className="facility-popup-action"
                        onClick={() => {
                          if (onSelectFacility) onSelectFacility(fac);
                        }}
                      >
                        Select & Route Patient →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            <div className="offline-legend-bar">
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d65f5f" }} />
                24/7 Emergency (CHC / DH)
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#087f8c" }} />
                PHC / Sub-Centre
              </span>
            </div>
          </MapContainer>
        ) : (
          /* 2. Resilient Offline List Fallback */
          <div className="offline-facility-fallback">
            <div className="offline-fallback-header">
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#17344c" }}>
                Offline Directory ({facilities.length} Centers Cached Locally)
              </span>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Sorted by proximity to current block
              </span>
            </div>

            {facilities.map((fac) => (
              <div
                key={fac.id}
                className="offline-facility-row"
                style={{
                  borderColor: selectedFacilityId === fac.id ? "#087f8c" : "#e2e8f0",
                }}
                onClick={() => {
                  if (onSelectFacility) onSelectFacility(fac);
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: "#087f8c" }}>
                      {fac.type}
                    </span>
                    <StatusBadge status={fac.emergency ? "Urgent" : fac.openStatus} />
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "14px", color: "#17344c" }}>
                    {fac.name}
                  </h4>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {fac.doctor} • Helpline: <strong>{fac.phone}</strong>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#087f8c" }}>
                    {fac.distance}
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748b" }}>
                    Wait: {fac.wait}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FacilityMap;