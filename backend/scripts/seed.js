// utils/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Models
const User = require("../models/User");
const Admin = require("../models/Admin");
const Doctor = require("../models/Doctor");
const HealthWorker = require("../models/HealthWorker");
const Patient = require("../models/Patient");
const Facility = require("../models/Facility");
const Appointment = require("../models/Appointment");
const Availability = require("../models/Availability");
const CareGap = require("../models/CareGap");
const Diagnostic = require("../models/Diagnostic");
const FollowUp = require("../models/FollowUp");
const MedicalRecord = require("../models/MedicalRecord");
const Medicine = require("../models/Medicine");
const Notification = require("../models/Notification");
const Referral = require("../models/Referral");
const SyncQueue = require("../models/SyncQueue");
const Triage = require("../models/Triage");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/swasthyasetu");
    console.log("[Seeder] Connected to MongoDB...");

    // Clear existing data across all collections
    await Promise.all([
      User.deleteMany(),
      Admin.deleteMany(),
      Doctor.deleteMany(),
      HealthWorker.deleteMany(),
      Patient.deleteMany(),
      Facility.deleteMany(),
      Appointment.deleteMany(),
      Availability.deleteMany(),
      CareGap.deleteMany(),
      Diagnostic.deleteMany(),
      FollowUp.deleteMany(),
      MedicalRecord.deleteMany(),
      Medicine.deleteMany(),
      Notification.deleteMany(),
      Referral.deleteMany(),
      SyncQueue.deleteMany(),
      Triage.deleteMany(),
    ]);
    console.log("[Seeder] Existing database records cleared.");

    // 1. Create 1 Admin
    const adminUser = await User.create({
      name: "District Admin Varanasi",
      email: "admin@swasthyasetu.in",
      phone: "9876543210",
      password: "adminpass123",
      role: "admin",
    });
    await Admin.create({ 
      userId: adminUser._id, 
      department: "Administration",
      organization: "SwasthyaSetu Health",
      accessLevel: "Full",
    });

    // 2. Create 10 Facilities (Needed for relationships in Appointment, Diagnostic, Medicine, etc.)
    const facilityNames = [
      "Community Health Centre Choubeypur",
      "Rural Diagnostic Centre",
      "Jan Aushadhi Pharmacy",
      "Primary Health Centre Choubeypur",
      "Rural Multi-Specialty Hospital",
      "Choubeypur Pathology Lab",
      "Harhua Health Sub-Centre",
      "Varanasi North Medical Unit",
      "Ganga Rural Clinic",
      "Sarnath Primary Wellness Center",
    ];

    const facilities = [];
    for (let i = 0; i < facilityNames.length; i++) {
      const fac = await Facility.create({
        name: facilityNames[i],
        type: i % 3 === 0 ? "CHC" : i % 3 === 1 ? "PHC" : "Clinic",
        address: `Choubeypur Block Area ${i + 1}, Varanasi`,
        location: {
          type: "Point",
          coordinates: [82.9739 + i * 0.01, 25.3176 + i * 0.01], // [longitude, latitude]
        },
        phone: `+91 98765 4321${i}`,
        services: ["General Consultation", "Primary Care", "Emergency Care"],
        totalBeds: 50 + i * 10,
        availableBeds: 20 + i * 5,
      });
      facilities.push(fac);
    }

    // 3. Create 10 Unique Doctors
    const doctorDetails = [
      { name: "Dr. Alok Sharma", email: "dr.sharma@swasthyasetu.in", pass: "docpass001", phone: "9876543201", spec: "General Physician" },
      { name: "Dr. Priya Verma", email: "dr.verma@swasthyasetu.in", pass: "docpass002", phone: "9876543202", spec: "Cardiologist" },
      { name: "Dr. Rajesh Singh", email: "dr.singh@swasthyasetu.in", pass: "docpass003", phone: "9876543203", spec: "Pediatrician" },
      { name: "Dr. Neha Gupta", email: "dr.gupta@swasthyasetu.in", pass: "docpass004", phone: "9876543204", spec: "Gynecologist" },
      { name: "Dr. Manish Tiwari", email: "dr.tiwari@swasthyasetu.in", pass: "docpass005", phone: "9876543205", spec: "Orthopedic" },
      { name: "Dr. Sunita Mishra", email: "dr.mishra@swasthyasetu.in", pass: "docpass006", phone: "9876543206", spec: "Dermatologist" },
      { name: "Dr. Amit Patel", email: "dr.patel@swasthyasetu.in", pass: "docpass007", phone: "9876543207", spec: "Neurologist" },
      { name: "Dr. Pooja Pandey", email: "dr.pandey@swasthyasetu.in", pass: "docpass008", phone: "9876543208", spec: "Ophthalmologist" },
      { name: "Dr. Rakesh Yadav", email: "dr.yadav@swasthyasetu.in", pass: "docpass009", phone: "9876543209", spec: "ENT Specialist" },
      { name: "Dr. Anjali Dubey", email: "dr.dubey@swasthyasetu.in", pass: "docpass010", phone: "9876543211", spec: "General Physician" },
    ];

    const doctors = [];
    for (let i = 0; i < doctorDetails.length; i++) {
      const d = doctorDetails[i];
      const user = await User.create({
        name: d.name,
        email: d.email,
        phone: d.phone,
        password: d.pass,
        role: "doctor",
        isVerified: true,
      });
      const profile = await Doctor.create({
        userId: user._id,
        specialization: d.spec,
        qualification: "MBBS, MD",
        experience: `${i + 3} Years`,
        facility: facilities[i % facilities.length].name,
        consultationHours: "09:00 AM – 04:00 PM",
        registration: `MED-2026-7842${i}`,
        bio: "Dedicated healthcare professional serving rural community health continuity.",
      });
      doctors.push({ user, profile });
    }

    // 4. Create 10 Unique Health Workers
    const workerDetails = [
      { name: "Ravi Kumar", email: "ravi.worker@swasthyasetu.in", pass: "workpass001", phone: "9765432011" },
      { name: "Geeta Devi", email: "geeta.worker@swasthyasetu.in", pass: "workpass002", phone: "9765432012" },
      { name: "Suresh Kumar", email: "suresh.worker@swasthyasetu.in", pass: "workpass003", phone: "9765432013" },
      { name: "Anita Devi", email: "anita.worker@swasthyasetu.in", pass: "workpass004", phone: "9765432014" },
      { name: "Mukesh Kumar", email: "mukesh.worker@swasthyasetu.in", pass: "workpass005", phone: "9765432015" },
      { name: "Rekha Devi", email: "rekha.worker@swasthyasetu.in", pass: "workpass006", phone: "9765432016" },
      { name: "Dinesh Kumar", email: "dinesh.worker@swasthyasetu.in", pass: "workpass007", phone: "9765432017" },
      { name: "Sunita Devi", email: "sunita.worker@swasthyasetu.in", pass: "workpass008", phone: "9765432018" },
      { name: "Vijay Kumar", email: "vijay.worker@swasthyasetu.in", pass: "workpass009", phone: "9765432019" },
      { name: "Pushpa Devi", email: "pushpa.worker@swasthyasetu.in", pass: "workpass010", phone: "9765432020" },
    ];

    const workers = [];
    for (let i = 0; i < workerDetails.length; i++) {
      const w = workerDetails[i];
      const user = await User.create({
        name: w.name,
        email: w.email,
        phone: w.phone,
        password: w.pass,
        role: "worker",
      });
      const profile = await HealthWorker.create({
        userId: user._id,
        facility: facilities[i % facilities.length].name,
        department: "Community Health",
        employeeId: `HW-2026-00${i + 1}`,
        experience: `${i + 2} Years`,
      });
      workers.push({ user, profile });
    }

    // 5. Create 10 Unique Patients
    const patientDetails = [
      { name: "Shivam Kumar", email: "shivam@example.com", pass: "patpass001", phone: "9654321011", age: 21 },
      { name: "Rahul Gupta", email: "rahul.patient@swasthyasetu.in", pass: "patpass002", phone: "9654321012", age: 42 },
      { name: "Sunita Verma", email: "sunita.patient@swasthyasetu.in", pass: "patpass003", phone: "9654321013", age: 35 },
      { name: "Amit Singh", email: "amit.patient@swasthyasetu.in", pass: "patpass004", phone: "9654321014", age: 51 },
      { name: "Pooja Mishra", email: "pooja.patient@swasthyasetu.in", pass: "patpass005", phone: "9654321015", age: 28 },
      { name: "Ramesh Yadav", email: "ramesh.patient@swasthyasetu.in", pass: "patpass006", phone: "9654321016", age: 64 },
      { name: "Manoj Tiwari", email: "manoj.patient@swasthyasetu.in", pass: "patpass007", phone: "9654321017", age: 39 },
      { name: "Kiran Devi", email: "kiran.patient@swasthyasetu.in", pass: "patpass008", phone: "9654321018", age: 45 },
      { name: "Deepak Patel", email: "deepak.patient@swasthyasetu.in", pass: "patpass009", phone: "9654321019", age: 30 },
      { name: "Vandana Singh", email: "vandana.patient@swasthyasetu.in", pass: "patpass010", phone: "9654321020", age: 26 },
    ];

    const patients = [];
    for (let i = 0; i < patientDetails.length; i++) {
      const p = patientDetails[i];
      const user = await User.create({
        name: p.name,
        email: p.email,
        phone: p.phone,
        password: p.pass,
        role: "patient",
      });
      const profile = await Patient.create({
        userId: user._id,
        age: p.age,
        location: "Choubeypur, Varanasi",
        emergencyContact: "9876543210",
      });
      patients.push({ user, profile });
    }

    // 6. Create 10 Appointments
   for (let i = 0; i < 10; i++) {
  const targetDate = new Date(Date.now() + i * 86400000);
  
  await Appointment.create({
    patient: patients[i].user._id,
    facility: "Community Health Centre Choubeypur", // Must be a String per your schema
    doctor: "General Physician",                     // String per schema
    type: "General Consultation",                  // Must match enum values
    date: targetDate.toISOString().split("T")[0],    // Matches schema String
    time: "10:30 AM",                                // Matches schema String
    location: "Choubeypur",
    status: i % 2 === 0 ? "Confirmed" : "Upcoming",  // Must match enum values
  });
}

    // 7. Create 10 Availabilities
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for (let i = 0; i < 10; i++) {
      await Availability.create({
        doctor: doctors[i % doctors.length].user._id,
        facility: facilities[i % facilities.length]._id,
        dayOfWeek: daysOfWeek[i % daysOfWeek.length],
        startTime: "09:00",
        endTime: "17:00",
        slotDurationMinutes: 15,
        isAvailable: true,
      });
    }

    // 8. Create 10 CareGaps
    for (let i = 0; i < 10; i++) {
      await CareGap.create({
        patient: patients[i].user._id,
        gapType: i % 2 === 0 ? "Vaccination" : "Chronic Monitoring",
        description: `Scheduled checkup and follow-up screening task ${i + 1}.`,
        dueDate: new Date(Date.now() + (i + 5) * 86400000),
        status: "Open",
        identifiedBy: doctors[i % doctors.length].user._id,
      });
    }

    // 9. Create 10 Diagnostics
    for (let i = 0; i < 10; i++) {
      await Diagnostic.create({
        patient: patients[i].user._id,
        facility: facilities[i % facilities.length]._id,
        prescribedBy: doctors[i % doctors.length].user._id,
        testName: i % 2 === 0 ? "Complete Blood Count (CBC)" : "Blood Sugar Random",
        results: i % 2 === 0 ? "Normal Range Values" : "Pending Analysis",
        status: i % 2 === 0 ? "Completed" : "Ordered",
        notes: "Routine diagnostic tracking record.",
      });
    }

    // 10. Create 10 FollowUps
    for (let i = 0; i < 10; i++) {
      await FollowUp.create({
        patient: patients[i].user._id,
        assignedTo: workers[i % workers.length].user._id,
        facility: facilities[i % facilities.length]._id,
        scheduledDate: new Date(Date.now() + (i + 3) * 86400000),
        purpose: "Post-treatment vital signs monitoring and assessment.",
        status: "Scheduled",
        notes: "Field health worker assigned to visit.",
      });
    }

    // 11. Create 10 MedicalRecords
    for (let i = 0; i < 10; i++) {
      await MedicalRecord.create({
        patient: patients[i].user._id,
        doctor: doctors[i % doctors.length].user._id,
        facility: facilities[i % facilities.length]._id,
        diagnosis: "Primary rural health evaluation normal.",
        symptoms: "Mild discomfort, routine checkup request.",
        vitals: {
          bp: "120/80",
          temperature: "98.6°F",
          pulse: "72 bpm",
          spo2: "98%",
        },
        prescriptions: [
          { medicineName: "Multivitamin Capsule", dosage: "Once daily", duration: "10 days" }
        ],
        notes: "Patient advised on balanced nutrition and hydration.",
      });
    }

    // 12. Create 10 Medicines
    const medicineNames = ["Paracetamol 500mg", "ORS Sachets", "Amoxicillin 250mg", "Ibuprofen 400mg", "Metformin 500mg", "Amlodipine 5mg", "Azithromycin 500mg", "Cetirizine 10mg", "Omeprazole 20mg", "Pantoprazole 40mg"];
    for (let i = 0; i < 10; i++) {
      await Medicine.create({
        name: medicineNames[i],
        category: i % 2 === 0 ? "Analgesic" : "Antibiotic",
        facility: facilities[i % facilities.length]._id,
        stockQuantity: 150 + i * 15,
        unit: "strips",
        expiryDate: new Date(Date.now() + 365 * 86400000),
        reorderLevel: 20,
      });
    }

    // 13. Create 10 Notifications
    for (let i = 0; i < 10; i++) {
      await Notification.create({
        recipient: patients[i].user._id,
        title: `Care Portal Reminder ${i + 1}`,
        message: "You have an upcoming health screening or appointment scheduled.",
        type: "Appointment",
        isRead: false,
      });
    }

    // 14. Create 10 Referrals
    for (let i = 0; i < 10; i++) {
      await Referral.create({
        patient: patients[i].user._id,
        sourceFacility: facilities[i % facilities.length]._id,
        targetFacility: facilities[(i + 1) % facilities.length]._id,
        referredBy: doctors[i % doctors.length].user._id,
        reason: "Requires secondary clinical examination and specialized care.",
        urgency: "Routine",
        status: "Pending",
        notes: "Referred through regional SwasthyaSetu network.",
      });
    }

    // 15. Create 10 SyncQueues
    for (let i = 0; i < 10; i++) {
      await SyncQueue.create({
        user: patients[i].user._id,
        action: "CREATE_APPOINTMENT",
        payload: { appointmentIndex: i, offlineLogged: true },
        status: "Pending",
      });
    }

    // 16. Create 10 Triages
    const urgencyColors = ["Green", "Yellow", "Red"];
    for (let i = 0; i < 10; i++) {
      await Triage.create({
        patient: patients[i].user._id,
        healthWorker: workers[i % workers.length].user._id,
        facility: facilities[i % facilities.length]._id,
        symptoms: ["Fever", "Headache"],
        vitals: {
          temperature: "99.2°F",
          heartRate: "78 bpm",
          bloodPressure: "130/85",
          oxygenSaturation: "97%",
          respiratoryRate: "18 bpm",
        },
        urgencyLevel: urgencyColors[i % urgencyColors.length],
        notes: "Assessed via field health worker triage protocol.",
      });
    }

    console.log("[Seeder] Database successfully seeded with 1 Admin and exactly 10 unique records per model!");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder Error]:", error);
    process.exit(1);
  }
};

seedDatabase();