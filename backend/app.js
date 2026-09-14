// backend/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const env = require("./config/env");
const logger = require("./utils/logger");
const initAllCronJobs = require("./jobs/notificationJob");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === "development" || env.nodeEnv === "test") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "UP",
    service: "SwasthyaSetu API",
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/facilities", require("./routes/facilityRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/records", require("./routes/medicalRecordRoutes"));
app.use("/api/triage", require("./routes/triageRoutes"));
app.use("/api/referrals", require("./routes/referralRoutes"));
app.use("/api/followups", require("./routes/followUpRoutes"));
app.use("/api/caregaps", require("./routes/careGapRoutes"));
app.use("/api/availability", require("./routes/availabilityRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/worker", require("./routes/workerRoutes"));
app.use("/api/medicines", require("./routes/medicineRoutes"));
app.use("/api/diagnostics", require("./routes/diagnosticRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/sync", require("./routes/syncRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/consultations", require("./routes/consultationRoutes"));

if (env.nodeEnv !== "test") {
  initAllCronJobs();
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;