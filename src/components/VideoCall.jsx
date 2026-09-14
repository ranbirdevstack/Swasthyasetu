// src/components/VideoCall.jsx
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5003");

export default function VideoCall({ roomId, userId, onClose }) {
  const [stream, setStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    // 1. Access camera and microphone for video consultation
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error("Error accessing media devices:", err));

    // 2. Join signaling room
    socket.emit("join-room", roomId, userId);

    socket.on("user-connected", (id) => {
      console.log(`[Socket] Participant joined video call: ${id}`);
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
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = null;
      }
      setCallActive(false);
      alert("The participant has left the video call.");
    });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      socket.disconnect();
    };
  }, [roomId, userId]);

  const createPeerConnection = (targetId) => {
    const pc = new RTCPeerConnection(iceServers);
    peerConnection.current = pc;

    if (stream) {
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    }

    pc.ontrack = (event) => {
      const inboundStream = event.streams[0];
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = inboundStream;
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
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (onClose) onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h2>SwasthyaSetu Video Consultation</h2>

        <div style={styles.statusBox}>
          <div
            style={{
              ...styles.indicator,
              backgroundColor: callActive ? "#28a745" : "#ffc107",
            }}
          />
          <p>
            {callActive ? "Video Call Active" : "Waiting for participant..."}
          </p>
        </div>

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

        <div style={styles.controls}>
          <button onClick={toggleAudio} style={styles.actionBtn}>
            {isMuted ? "Unmute Mic" : "Mute Mic"}
          </button>
          <button onClick={toggleVideo} style={styles.actionBtn}>
            {isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
          </button>
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