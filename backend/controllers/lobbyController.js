// controllers/lobbyController.js
const { createLobby, joinLobby, removePlayer } = require("../services/lobbyService");

function lobbyController(socket, io) {
  // Lobby erstellen
  socket.on("create_lobby", () => {
    const lobbyCode = createLobby(socket);
    socket.emit("lobby_created", { lobbyCode });
    console.log(`Lobby created: ${lobbyCode}`);
  });

  // Lobby beitreten
  socket.on("join_lobby", (lobbyCode) => {
    const success = joinLobby(socket, lobbyCode, io);
    if (success) {
      socket.emit("lobby_joined", { lobbyCode });
      console.log(`User ${socket.id} joined lobby ${lobbyCode}`);
    } else {
      socket.emit("error", { message: "Lobby not found" });
      console.log(`Failed join attempt for lobby ${lobbyCode}`);
    }
  });

  // Socket trennen
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    removePlayer(socket, io);
  });
  
  socket.on("player_message", ({ lobbyCode, message }) => {
      // An alle in der Lobby senden
      console.log("Sending message to lobby:");
      io.to(lobbyCode).emit("player_message_broadcast", {
        playerId: socket.id,
        message
      });
    });
}


module.exports = { lobbyController };
