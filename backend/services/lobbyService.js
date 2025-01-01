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
    console.log("lobby", lobby, lobbyCode);
    if (!lobby) {
      return false; // Lobby existiert nicht
    }
  
    // Spieler zur Lobby hinzufügen
    lobby.players.push({ socketId: socket.id, username });
    socket.join(lobbyCode);
  
    // Alle in dieser Lobby über die neue Spielerliste informieren
    io.to(lobbyCode).emit("lobby_update", {
      players: lobby.players,
    });
  
    return true;
  }

/**
 * Entfernt den Spieler aus seiner Lobby und räumt ggf. auf
 */
function removePlayer(socket, io) {
    for (const [code, lobby] of Object.entries(lobbies)) {
      // Wir suchen den Index basierend auf 'socketId'
      const index = lobby.players.findIndex(
        (player) => player.socketId === socket.id
      );
      if (index !== -1) {
        lobby.players.splice(index, 1);
        if (lobby.players.length === 0) {
          // Lobby löschen, wenn leer
          delete lobbies[code];
          console.log(`Lobby ${code} deleted`);
        } else {
          // Allen verbleibenden Spielern mitteilen, dass jemand ging
          io.to(code).emit("player_left", { playerId: socket.id });
          // Zusätzlich könntest du ein "lobby_update" senden, um direkt die aktualisierte Liste zu pushen:
          io.to(code).emit("lobby_update", {
            players: lobby.players,
          });
        }
        break;
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
