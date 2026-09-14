function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
}) {
  if (!title && !eyebrow) return null;

  return (
    <>
      <style>{`
        .section-heading {
          width: 100%;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
        }

        .section-heading-center {
          align-items: center;
          text-align: center;
        }

        .section-heading-left {
          align-items: flex-start;
          text-align: left;
        }

        .section-heading-right {
          align-items: flex-end;
          text-align: right;
        }

        .section-heading .section-eyebrow {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #087f8c;
          margin-bottom: 8px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: clamp(26px, 3.2vw, 36px);
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.6px;
          color: #17344c;
        }

        .section-heading p {
          margin: 10px 0 0;
          font-size: 15px;
          line-height: 1.6;
          color: #64748b;
          max-width: 620px;
        }

        @media (max-width: 640px) {
          .section-heading {
            margin-bottom: 24px;
          }

          .section-heading h2 {
            font-size: 24px;
          }

          .section-heading p {
            font-size: 14px;
          }
        }
      `}</style>

      <div className={`section-heading section-heading-${align} ${className}`.trim()}>
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        {title && <h2>{title}</h2>}
        {description && <p>{description}</p>}
      </div>
    </>
  );
}

export default SectionHeading;