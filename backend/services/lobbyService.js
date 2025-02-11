// services/lobbyService.js

// Interne Lobby-Datenbank (In-Memory)
const lobbies = {};

/**
 * Erzeugt eine neue Lobby, fügt den Spieler hinzu und gibt den Code zurück
 */
function createLobby(socket, username, io) {
    const lobbyCode = generateLobbyCode();
    
    // Erzeugt ein Player-Objekt
    lobbies[lobbyCode] = { 
      players: [
        { socketId: socket.id, username }
      ]
    };
    
    socket.join(lobbyCode);
  
    // Optional: direkt "lobby_update" broadcasten
    io.to(lobbyCode).emit("lobby_update", {
      players: lobbies[lobbyCode].players,
    });
  
    return lobbyCode;
  }
  
  function getLobbyState(lobbyCode) {
    return lobbies[lobbyCode];
  }

/**
 * Fügt einen Spieler einer existierenden Lobby hinzu, wenn sie existiert
 */
function joinLobby(socket, lobbyCode, username, io) {
  const lobby = lobbies[lobbyCode];

  if (!lobby) {
      return false;
  }

  // Prüfe, ob der Benutzer schon da ist → Falls ja, aktualisiere nur die `socket.id`
  let existingPlayer = lobby.players.find(p => p.username === username);
  
  if (existingPlayer) {
      console.log(`Spieler ${username} ist schon in der Lobby. Aktualisiere socketId.`);
      existingPlayer.socketId = socket.id; // **Hier updaten, falls Spieler existiert**
  } else {
      console.log(`Neuer Spieler ${username} tritt bei.`);
      lobby.players.push({ socketId: socket.id, username });
  }

  socket.join(lobbyCode);
  io.to(lobbyCode).emit("lobby_update", { players: lobby.players });

  return true;
}


/**
 * Entfernt den Spieler aus seiner Lobby und räumt ggf. auf
 */
function removePlayer(socket, io) {
  for (const [code, lobby] of Object.entries(lobbies)) {
      const index = lobby.players.findIndex((p) => p.socketId === socket.id);
      debugger;
      if (index !== -1) {
          const disconnectedPlayer = lobby.players[index];
          console.log(`Spieler ${disconnectedPlayer.username} (${socket.id}) hat die Verbindung verloren. Warte auf Reconnect...`);

          // Warte 5 Sekunden auf Reconnect
          setTimeout(() => {
              console.log(`Prüfe erneut, ob Spieler ${disconnectedPlayer.username} (${socket.id}) noch getrennt ist...`);
              
              const stillConnected = lobby.players.find((p) => p.username === disconnectedPlayer.username);
              console.log(`Spieler ${stillConnected.username}, ${stillConnected.socketId}, ${socket.id} stillConnected `); 
              
              if (!stillConnected) {
                  console.log(`Spieler ${disconnectedPlayer.username} wurde NICHT wieder verbunden. Entferne aus Lobby.`);
                  
                  lobby.players.splice(index, 1);
                  if (lobby.players.length === 0) {
                      delete lobbies[code]; // Lösche die Lobby, wenn leer
                      console.log(`Lobby ${code} gelöscht.`);
                  } else {
                      io.to(code).emit("lobby_update", { players: lobby.players });
                  }
              } else {
                  console.log(`Spieler ${disconnectedPlayer.username} hat sich wieder verbunden. Keine Entfernung.`);
              }
          }, 5000);
      }
  }
}


  

/**
 * Hilfsfunktion: generiert einen 6-stelligen Lobbycode
 */
function generateLobbyCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

// Wir exportieren Funktionen, die der Controller aufruft
module.exports = {
  createLobby,
  getLobbyState,
  joinLobby,
  removePlayer,
};
