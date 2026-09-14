function StatusBadge({ status = "Unknown", className = "" }) {
  const safeStatus = typeof status === "string" ? status : "Unknown";
  const normalizedStatus = safeStatus
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");

  return (
    <>
      <style>{`
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          width: fit-content;
          background: #f1f5f9;
          color: #475569;
          font-family: inherit;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }

        /* Positive / Confirmed / Available / Completed */
        .status-badge.status-available,
        .status-badge.status-confirmed,
        .status-badge.status-completed,
        .status-badge.status-active,
        .status-badge.status-low {
          background: #edf8f3;
          color: #43896e;
        }

        /* Neutral / Scheduled / Upcoming */
        .status-badge.status-upcoming,
        .status-badge.status-scheduled {
          background: #e5f4f5;
          color: #087f8c;
        }

        /* Pending / In Progress / Moderate / Waiting */
        .status-badge.status-pending,
        .status-badge.status-in-progress,
        .status-badge.status-moderate,
        .status-badge.status-waiting,
        .status-badge.status-due-soon {
          background: #fff7e8;
          color: #b98232;
        }

        /* Urgent / High / Cancelled / Danger */
        .status-badge.status-urgent,
        .status-badge.status-high,
        .status-badge.status-emergency,
        .status-badge.status-cancelled {
          background: #fff0ef;
          color: #d65f5f;
        }
      `}</style>

      <span className={`status-badge status-${normalizedStatus} ${className}`.trim()}>
        <span className="status-dot" aria-hidden="true" />
        {safeStatus}
      </span>
    </>
  );
}

export default StatusBadge;