import Button from "./Button.jsx";
import StatusBadge from "./StatusBadge.jsx";

function FacilityCard({
  facility = {},
  rank,
  onViewDetails,
  onDirections,
}) {
  const {
    name = "Healthcare Facility",
    type = "Health Centre",
    distance = "N/A",
    score = 0,
    doctor = "Available on duty",
    diagnostics = "Standard",
    medicine = "Stocked",
    wait = "15-20 mins",
    status = "Available",
  } = facility;

  return (
    <>
      <style>{`
        .facility-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
        }

        .facility-card:hover {
          border-color: #cfe2e5;
          box-shadow: 0 8px 24px rgba(8, 127, 140, 0.08);
          transform: translateY(-2px);
        }

        .facility-card-header {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .facility-logo {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #e5f4f5;
          color: #087f8c;
          font-size: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .facility-main-info {
          flex: 1;
          min-width: 0;
        }

        .facility-rank {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #087f8c;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .facility-main-info h3 {
          margin: 0;
          font-size: 17px;
          color: #17344c;
          font-weight: 700;
          line-height: 1.3;
        }

        .facility-main-info p {
          margin: 3px 0 6px;
          color: #64748b;
          font-size: 12px;
        }

        .facility-distance {
          display: inline-block;
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }

        .facility-score {
          text-align: right;
          flex-shrink: 0;
        }

        .facility-score strong {
          display: block;
          font-size: 19px;
          color: #087f8c;
          line-height: 1;
        }

        .facility-score span {
          display: block;
          font-size: 9px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 3px;
        }

        .facility-services {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
        }

        .facility-service {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }

        .facility-service .service-icon {
          font-size: 16px;
          line-height: 1;
        }

        .facility-service div {
          min-width: 0;
        }

        .facility-service small {
          display: block;
          font-size: 10px;
          color: #94a3b8;
        }

        .facility-service strong {
          display: block;
          font-size: 12px;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .facility-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 6px;
          margin-top: auto;
          flex-wrap: wrap;
        }

        .facility-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }
      `}</style>

      <article className="facility-card">
        <div className="facility-card-header">
          <div className="facility-logo" aria-hidden="true">
            🏥
          </div>

          <div className="facility-main-info">
            {rank && (
              <span className="facility-rank">
                #{rank} RECOMMENDED
              </span>
            )}

            <h3>{name}</h3>
            <p>{type}</p>
            <span className="facility-distance">📍 {distance} away</span>
          </div>

          {score > 0 && (
            <div className="facility-score">
              <strong>{score}%</strong>
              <span>suitability</span>
            </div>
          )}
        </div>

        <div className="facility-services">
          <div className="facility-service">
            <span className="service-icon" aria-hidden="true">👨‍⚕️</span>
            <div>
              <small>Doctor</small>
              <strong>{doctor}</strong>
            </div>
          </div>

          <div className="facility-service">
            <span className="service-icon" aria-hidden="true">🧪</span>
            <div>
              <small>Diagnostics</small>
              <strong>{diagnostics}</strong>
            </div>
          </div>

          <div className="facility-service">
            <span className="service-icon" aria-hidden="true">💊</span>
            <div>
              <small>Medicines</small>
              <strong>{medicine}</strong>
            </div>
          </div>

          <div className="facility-service">
            <span className="service-icon" aria-hidden="true">⏱</span>
            <div>
              <small>Waiting time</small>
              <strong>{wait}</strong>
            </div>
          </div>
        </div>

        <div className="facility-card-footer">
          <StatusBadge status={status} />

          <div className="facility-actions">
            {onViewDetails && (
              <Button
                variant="outline"
                size="small"
                onClick={onViewDetails}
                aria-label={`View details for ${name}`}
              >
                View Details
              </Button>
            )}

            {onDirections && (
              <Button
                size="small"
                onClick={onDirections}
                aria-label={`Get directions to ${name}`}
              >
                Get Directions →
              </Button>
            )}
          </div>
        </div>
      </article>
    </>
  );
}

export default FacilityCard;