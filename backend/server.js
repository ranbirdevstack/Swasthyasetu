// backend/server.js
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

// 1. Create an explicit HTTP server wrapping your Express app
const server = http.createServer(app);

// 2. Initialize Socket.io on this server with CORS enabled
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// 3. WebRTC Signaling Socket Logic
io.on("connection", (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(`[Socket] User ${userId} joined room: ${roomId}`);
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected from room: ${roomId}`);
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("offer", (payload) => {
    io.to(payload.target).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    io.to(incoming.target).emit("ice-candidate", incoming);
  });
});

const PORT = process.env.PORT || 5003;

// 4. Listen using the wrapped HTTP server instead of app.listen()
server.listen(PORT);

server.on("listening", () => {
  const address = server.address();
  const activePort = typeof address === "string" ? address : address?.port;
  console.log(`[Server] SwasthyaSetu Server & Signaling running in development mode on port ${activePort}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`[Server] Port ${PORT} is busy, attempting to use a random available port...`);
    const fallbackServer = http.createServer(app);
    // Reattach socket io to fallback server if needed, or listen directly:
    fallbackServer.listen(0, () => {
      const fbAddress = fallbackServer.address();
      const fbPort = typeof fbAddress === "string" ? fbAddress : fbAddress?.port;
      console.log(`[Server] SwasthyaSetu Server fallback active on port ${fbPort}`);
    });
  } else {
    console.error("[Server Error]", err);
  }
});