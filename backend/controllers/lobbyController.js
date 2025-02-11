// controllers/lobbyController.js
const { getLobbyState, createLobby, joinLobby, removePlayer } = require("../services/lobbyService");

function lobbyController(socket, io) {
  // Lobby erstellen
  socket.on("create_lobby", ({ username }) => {
    // Entweder username so übernehmen oder, wenn leer: GUEST...
    if(username){
        const lobbyCode = createLobby(socket, username, io);
        socket.emit("lobby_created", { lobbyCode });
        console.log(`Lobby created: ${lobbyCode} by user ${username} (${socket.id})`);
    }
    else{
        console.log("No username provided");
    }
  
  });

  // Spieler nach Reload wieder zur Lobby hinzufügen
  socket.on("rejoin_lobby", ({ lobbyCode, username }) => {
    const lobby = getLobbyState(lobbyCode);
    
    if (!lobby) {
        socket.emit("error", { message: "Lobby not found" });
        return;
    }

    // Prüfe, ob der Spieler bereits existiert (aber NUR DANN `socket.id` updaten)
    const existingPlayer = lobby.players.find((p) => p.username === username);

    if (existingPlayer) {
        console.log(`Spieler ${username} hat sich mit neuer ID ${socket.id} wieder verbunden.`);
        existingPlayer.socketId = socket.id; // **Nur ersetzen, wenn Username passt**
    } else {
        console.log(`Neuer Spieler ${username} tritt Lobby ${lobbyCode} bei.`);
        lobby.players.push({ socketId: socket.id, username });
    }

    socket.join(lobbyCode);
    io.to(lobbyCode).emit("lobby_update", { players: lobby.players });
});



  

  // Lobby beitreten
  socket.on("join_lobby", ({ lobbyCode, username }) => {
    // Beachte: Wir erwarten hier jetzt ein Objekt, also { lobbyCode, username }
    if (!lobbyCode) {
      socket.emit("error", { message: "No lobby code provided" });
      return;
    }

    // Hier Lobby beitreten
    // (Join-Logik kann direkt hier stehen oder du rufst eine Funktion aus lobbyService auf)
    const lobby = joinLobby(socket, lobbyCode, username, io);
    console.log("lobby", lobby);
    if (lobby) {
      // Meldung an den joinenden Client
      socket.emit("lobby_joined", { lobbyCode });

      console.log(`User ${socket.id} (${username}) joined lobby ${lobbyCode}`);
    } else {
      socket.emit("error", { message: "Lobby not found" });
      console.log(`Failed join attempt for lobby ${lobbyCode}`);
    }
  });

  // Socket trennen
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id} ()`);
    removePlayer(socket, io);
  });
  socket.on("get_lobby_state", ({ lobbyCode }) => {
    const lobby = getLobbyState(lobbyCode);
    if (lobby) {
      socket.emit("lobby_update", { players: lobby.players });
    }
  });
  
}

module.exports = { lobbyController };
