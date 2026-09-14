/**
 * SWASTHYASETU - ROLE-BASED NOTIFICATIONS & ALERT REPOSITORY
 * Provides real-time and cached alerts for all 4 operational personas.
 */

export const notificationsData = {
  // 1. ASHA / ANM Field Worker Feeds
  worker: [
    {
      id: "notif_w1",
      priority: "urgent",
      type: "clinical_alert",
      title: "High-Risk Maternal Flag: Sunita Devi",
      message: "BP recorded at 145/95 mmHg in Harhua village. Preeclampsia protocol initiated. Referral slip routed to CHC.",
      time: "12 mins ago",
      isUnread: true,
      actionRoute: "triage",
    },
    {
      id: "notif_w2",
      priority: "urgent",
      type: "cold_chain",
      title: "Sub-Centre Ice-Lined Refrigerator Alert",
      message: "ILR unit at Cholapur Sub-Centre fluctuating above 7.8°C. Inspect secondary power backup.",
      time: "45 mins ago",
      isUnread: true,
      actionRoute: "facilities",
    },
    {
      id: "notif_w3",
      priority: "routine",
      type: "sync_success",
      title: "Batch Sync Completed",
      message: "14 offline screening records uploaded to Varanasi District Portal successfully.",
      time: "2 hours ago",
      isUnread: false,
      actionRoute: "sync",
    },
    {
      id: "notif_w4",
      priority: "routine",
      type: "immunization_due",
      title: "Immunization Camp: Ward 4",
      message: "Pentavalent-3 & MR dose session scheduled tomorrow at Shivpur Panchayat Bhawan.",
      time: "Yesterday",
      isUnread: false,
      actionRoute: "caregaps",
    },
  ],

  // 2. Medical Officer / Doctor Feeds
  doctor: [
    {
      id: "notif_d1",
      priority: "urgent",
      type: "emergency_referral",
      title: "Inbound Trauma / Acute Case",
      message: "Suspected STEMI referred from Phulpur PHC. Patient en route via 108 Ambulance (ETA: 18 mins).",
      time: "8 mins ago",
      isUnread: true,
      actionRoute: "incoming",
    },
    {
      id: "notif_d2",
      priority: "urgent",
      type: "tele_triage",
      title: "Urgent Tele-Triage Review (3 Cases)",
      message: "3 ANC patients with severe anemia (<7.5 g/dL Hb) flagged by field workers awaiting tele-prescription.",
      time: "32 mins ago",
      isUnread: true,
      actionRoute: "incoming",
    },
    {
      id: "notif_d3",
      priority: "routine",
      type: "lab_report",
      title: "Sputum AFB Test Results Ready",
      message: "Microscopy results uploaded for 4 presumptive TB patients from Kashi Vidyapeeth block.",
      time: "3 hours ago",
      isUnread: false,
      actionRoute: "patients",
    },
  ],

  // 3. Citizen / Patient Feeds
  patient: [
    {
      id: "notif_p1",
      priority: "urgent",
      type: "appointment_reminder",
      title: "Doctor Consultation Confirmed",
      message: "Your tele-consultation with Dr. R.K. Mishra is scheduled for today at 2:30 PM at Harhua PHC.",
      time: "25 mins ago",
      isUnread: true,
      actionRoute: "appointments",
    },
    {
      id: "notif_p2",
      priority: "routine",
      type: "medicine_pickup",
      title: "Free Medicine Dispensation Ready",
      message: "Iron Folic Acid (IFA) & Calcium tablets have arrived at your village Sub-Centre. Pick up from ASHA didi.",
      time: "Yesterday",
      isUnread: false,
      actionRoute: "reminders",
    },
    {
      id: "notif_p3",
      priority: "routine",
      type: "abha_linked",
      title: "ABHA Health Locker Linked",
      message: "Your Ayushman Bharat Health Account (91-2345-6789-0123) is verified and synced with Varanasi District records.",
      time: "3 days ago",
      isUnread: false,
      actionRoute: "records",
    },
  ],

  // 4. District Health Officer / Admin Feeds
  admin: [
    {
      id: "notif_a1",
      priority: "urgent",
      type: "epidemic_signal",
      title: "Acute Diarrheal Outbreak Cluster",
      message: "12 cases logged within 48 hrs in Cholapur block. Rapid response team dispatch recommended.",
      time: "15 mins ago",
      isUnread: true,
      actionRoute: "telemedicine",
    },
    {
      id: "notif_a2",
      priority: "urgent",
      type: "infrastructure",
      title: "Oxygen Plant Maintenance Due",
      message: "Pressure sensor calibration overdue at Shivpur CHC PSA Generator plant.",
      time: "1 hour ago",
      isUnread: true,
      actionRoute: "facilities",
    },
    {
      id: "notif_a3",
      priority: "routine",
      type: "cadre_attendance",
      title: "Cadre Sync Status (94% Connected)",
      message: "318 out of 338 ASHA field kits flushed offline queues within the last 24-hour cycle.",
      time: "4 hours ago",
      isUnread: false,
      actionRoute: "workers",
    },
  ],
};

/**
 * Returns unread count for the given user role
 */
export const getUnreadCount = (role = "worker") => {
  const items = notificationsData[role] || [];
  return items.filter((item) => item.isUnread).length;
};

export default {
  notificationsData,
  getUnreadCount,
};