// src/components/CallModal.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/axiosClient.js"; // Ensure path matches your project structure

const socket = io("http://localhost:5003");

export default function CallModal({ roomId, userId, callType = "video", onClose }) {
  const [stream, setStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeMode, setActiveMode] = useState(callType);

  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const remoteAudio = useRef(null);
  const peerConnection = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    startMediaStream(activeMode);

    socket.emit("join-room", roomId, userId);

    socket.on("user-connected", (id) => {
      console.log(`[Socket] Participant joined: ${id}`);
      startCall(id);
    });

    socket.on("offer", async (payload) => {
      const pc = createPeerConnection(payload.caller);
      await pc.setRemoteDescription(new RTCSessionDescription(payload.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { answer, target: payload.caller });
      setCallActive(true);
    });

    socket.on("answer", async (payload) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(payload.answer)
        );
      }
    });

    socket.on("ice-candidate", async (incoming) => {
      if (peerConnection.current && incoming.candidate) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(incoming.candidate)
        );
      }
    });

    socket.on("user-disconnected", () => {
      cleanupRemoteStream();
      setCallActive(false);
      alert("The other participant has left the call.");
    });

    return () => {
      stopMediaTracks();
      socket.disconnect();
    };
  }, [roomId, userId, activeMode]);

  const startMediaStream = (mode) => {
    stopMediaTracks();

    const constraints = {
      video: mode === "video",
      audio: true,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((currentStream) => {
        setStream(currentStream);
        if (mode === "video" && myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  };

  const stopMediaTracks = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const cleanupRemoteStream = () => {
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
    if (remoteAudio.current) remoteAudio.current.srcObject = null;
  };

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection(iceServers);
    peerConnection.current = pc;

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    pc.ontrack = (event) => {
      const inboundStream = event.streams[0];
      if (activeMode === "video" && remoteVideo.current) {
        remoteVideo.current.srcObject = inboundStream;
      } else if (activeMode === "voice" && remoteAudio.current) {
        remoteAudio.current.srcObject = inboundStream;
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          candidate: event.candidate,
          target: targetId,
        });
      }
    };

    return pc;
  };

  const startCall = async (targetId) => {
    const pc = createPeerConnection(targetId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("offer", { offer, target: targetId, caller: userId });
    setCallActive(true);
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (activeMode === "video" && stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const switchMode = (mode) => {
    setActiveMode(mode);
  };

  const handleEndCall = async () => {
    try {
      await api.post("/api/consultations/end-call", {
        roomId,
        patientId: userId,
        doctorId: userId,
        callType: activeMode,
        clinicalNotes: "Teleconsultation session completed successfully.",
      });
    } catch (err) {
      console.warn("Failed to log session on backend:", err);
    }

    stopMediaTracks();
    if (onClose) onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2>SwasthyaSetu Consultation Room</h2>

        <div style={styles.modeSelector}>
          <button
            onClick={() => switchMode("video")}
            style={{
              ...styles.modeBtn,
              background: activeMode === "video" ? "#007bff" : "#6c757d",
            }}
          >
            Video Call
          </button>
          <button
            onClick={() => switchMode("voice")}
            style={{
              ...styles.modeBtn,
              background: activeMode === "voice" ? "#007bff" : "#6c757d",
            }}
          >
            Voice Call Only
          </button>
        </div>

        <div style={styles.statusBox}>
          <div
            style={{
              ...styles.indicator,
              backgroundColor: callActive ? "#28a745" : "#ffc107",
            }}
          />
          <p>
            {callActive
              ? `${activeMode === "video" ? "Video" : "Voice"} Call Active`
              : "Waiting for participant..."}
          </p>
        </div>

        {activeMode === "video" ? (
          <div style={styles.videoGrid}>
            <div style={styles.mediaCard}>
              <p style={styles.label}>My Video {isMuted && "(Muted)"}</p>
              <video
                ref={myVideo}
                autoPlay
                muted
                playsInline
                style={styles.videoElement}
              />
            </div>
            <div style={styles.mediaCard}>
              <p style={styles.label}>Participant Video</p>
              <video
                ref={remoteVideo}
                autoPlay
                playsInline
                style={styles.videoElement}
              />
            </div>
          </div>
        ) : (
          <audio ref={remoteAudio} autoPlay playsInline />
        )}

        <div style={styles.controls}>
          <button onClick={toggleAudio} style={styles.actionBtn}>
            {isMuted ? "Unmute Mic" : "Mute Mic"}
          </button>
          {activeMode === "video" && (
            <button onClick={toggleVideo} style={styles.actionBtn}>
              {isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
            </button>
          )}
          <button onClick={handleEndCall} style={styles.endCallBtn}>
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "25px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
    fontFamily: "Arial, sans-serif",
    maxWidth: "900px",
    width: "90%",
  },
  modeSelector: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  modeBtn: {
    padding: "8px 16px",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  statusBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f8f9fa",
    padding: "8px 16px",
    borderRadius: "20px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    margin: "10px 0",
  },
  indicator: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },
  videoGrid: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "10px",
  },
  mediaCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#f0f2f5",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  videoElement: {
    width: "350px",
    height: "240px",
    backgroundColor: "#111",
    borderRadius: "6px",
    objectFit: "cover",
  },
  label: {
    margin: "0 0 8px 0",
    fontWeight: "bold",
    color: "#333",
    fontSize: "14px",
  },
  controls: {
    marginTop: "20px",
    display: "flex",
    gap: "15px",
  },
  actionBtn: {
    padding: "10px 18px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },
  endCallBtn: {
    padding: "10px 18px",
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
  },
};