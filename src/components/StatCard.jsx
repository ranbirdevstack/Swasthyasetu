function StatCard({
  icon,
  value,
  label,
  description,
  trend,
  trendType = "positive", // positive | negative | neutral | urgent
  onClick,
  className = "",
}) {
  const isClickable = typeof onClick === "function";

  return (
    <>
      <style>{`
        .ss-stat-card {
          background: #ffffff;
          border: 1px solid #e6edf1;
          border-radius: 16px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 16px rgba(28, 54, 75, 0.035);
          transition: all 0.2s ease;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
          text-align: left;
        }

        .ss-stat-card * {
          box-sizing: border-box;
        }

        .ss-stat-card-clickable {
          cursor: pointer;
        }

        .ss-stat-card-clickable:hover {
          transform: translateY(-2px);
          border-color: #cfe2e5;
          box-shadow: 0 8px 24px rgba(8, 127, 140, 0.08);
        }

        .ss-stat-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .ss-stat-card-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #edf7f7;
          color: #087f8c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .ss-stat-trend {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border-radius: 20px;
          padding: 4px 8px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
        }

        .ss-stat-trend-positive {
          color: #43896e;
          background: #edf8f3;
        }

        .ss-stat-trend-negative,
        .ss-stat-trend-urgent {
          color: #d65f5f;
          background: #fff0ef;
        }

        .ss-stat-trend-neutral {
          color: #b98232;
          background: #fff7e8;
        }

        .ss-stat-card-value {
          font-size: clamp(26px, 2.5vw, 32px);
          font-weight: 800;
          color: #17344c;
          line-height: 1.15;
          margin-bottom: 6px;
        }

        .ss-stat-card-label {
          font-size: 13px;
          font-weight: 600;
          color: #53677b;
          line-height: 1.4;
        }

        .ss-stat-card-description {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #f1f5f9;
          font-size: 12px;
          color: #8a98a6;
          line-height: 1.4;
        }
      `}</style>

      <div
        className={`ss-stat-card ${isClickable ? "ss-stat-card-clickable" : ""} ${className}`.trim()}
        onClick={onClick}
        role={isClickable ? "button" : undefined}
        tabIndex={isClickable ? 0 : undefined}
        onKeyDown={
          isClickable
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        <div className="ss-stat-card-top">
          {icon && (
            <div className="ss-stat-card-icon" aria-hidden="true">
              {icon}
            </div>
          )}

          {trend && (
            <span className={`ss-stat-trend ss-stat-trend-${trendType}`}>
              {trend}
            </span>
          )}
        </div>

        <div className="ss-stat-card-value">{value}</div>

        {label && <div className="ss-stat-card-label">{label}</div>}

        {description && (
          <div className="ss-stat-card-description">{description}</div>
        )}
      </div>
    </>
  );
}

export default StatCard;