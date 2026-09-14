function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | secondary | outline | danger | text
  size = "medium",     // small | medium | large
  disabled = false,
  isLoading = false,
  icon = null,
  className = "",
  ...props
}) {
  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <>
      <style>{`
        .ss-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 10px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.2s ease;
          text-decoration: none;
          white-space: nowrap;
          user-select: none;
        }

        .ss-btn:focus-visible {
          outline: 2px solid #087f8c;
          outline-offset: 2px;
        }

        .ss-btn:disabled,
        .ss-btn-loading {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }

        /* Sizes */
        .ss-btn-small {
          height: 32px;
          padding: 0 12px;
          font-size: 12px;
        }
        .ss-btn-medium {
          height: 42px;
          padding: 0 18px;
          font-size: 14px;
        }
        .ss-btn-large {
          height: 48px;
          padding: 0 24px;
          font-size: 15px;
        }

        /* Variants */
        .ss-btn-primary {
          background: #087f8c;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(8, 127, 140, 0.2);
        }
        .ss-btn-primary:hover:not(:disabled) {
          background: #076f7b;
          transform: translateY(-1px);
        }

        .ss-btn-secondary {
          background: #f1f5f9;
          color: #334155;
        }
        .ss-btn-secondary:hover:not(:disabled) {
          background: #e2e8f0;
          color: #0f172a;
        }

        .ss-btn-outline {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #334155;
        }
        .ss-btn-outline:hover:not(:disabled) {
          border-color: #087f8c;
          color: #087f8c;
          background: #f0fdfa;
        }

        .ss-btn-danger {
          background: #ef4444;
          color: #ffffff;
        }
        .ss-btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .ss-btn-text {
          background: transparent;
          color: #087f8c;
          padding: 0 8px;
        }
        .ss-btn-text:hover:not(:disabled) {
          background: #e6f6f7;
        }

        /* Spinner */
        .ss-btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: ss-btn-spin 0.6s linear infinite;
        }

        @keyframes ss-btn-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <button
        type={type}
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`ss-btn ss-btn-${variant} ss-btn-${size} ${isLoading ? "ss-btn-loading" : ""} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="ss-btn-spinner" aria-hidden="true" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="ss-btn-icon">{icon}</span>}
            {children}
          </>
        )}
      </button>
    </>
  );
}

export default Button;