import React, { useState } from "react";
import CallModal from "../components/CallModal";

export default function ConsultationRoom() {
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState("video"); // 'video' or 'voice'

  // Example IDs (In real app, get these from your auth context and appointment data)
  const currentUserId = "65a1b2c3d4e5f67890123456"; 
  const consultationRoomId = "appointment-room-101";

  const handleStartVideoCall = () => {
    setCallType("video");
    setIsInCall(true);
  };

  const handleStartVoiceCall = () => {
    setCallType("voice");
    setIsInCall(true);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Telemedicine Consultation Portal</h1>
      <p>Connect with your verified healthcare professional securely.</p>

      <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
        <button onClick={handleStartVideoCall} style={styles.videoBtn}>
          Start Video Consultation
        </button>
        <button onClick={handleStartVoiceCall} style={styles.voiceBtn}>
          Start Voice Consultation Only
        </button>
      </div>

      {/* Render the CallModal overlay when a call is active */}
      {isInCall && (
        <CallModal
          roomId={consultationRoomId}
          userId={currentUserId}
          callType={callType}
          onClose={() => setIsInCall(false)}
        />
      )}
    </div>
  );
}

const styles = {
  videoBtn: {
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  voiceBtn: {
    padding: "12px 20px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};