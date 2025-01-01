// server.js
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { lobbyController } = require("./controllers/lobbyController");

const app = express();
const server = createServer(app);

// Socket.IO-Instanz mit CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Dein Frontend
    methods: ["GET", "POST"],
  },
});

// Socket-Verbindung
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  lobbyController(socket, io);
});

// (Optional) HTTP-Endpunkte
// app.get("/", (req, res) => { ... });

// Server starten
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
