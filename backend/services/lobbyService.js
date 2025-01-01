// services/lobbyService.js

// Interne Lobby-Datenbank (In-Memory)
const lobbies = {};

/**
 * Erzeugt eine neue Lobby, fügt den Spieler hinzu und gibt den Code zurück
 */
function createLobby(socket) {
  const lobbyCode = generateLobbyCode();
  lobbies[lobbyCode] = { players: [socket.id] };
  socket.join(lobbyCode);
  return lobbyCode;
}

/**
 * Fügt einen Spieler einer existierenden Lobby hinzu, wenn sie existiert
 */
function joinLobby(socket, lobbyCode, io) {
  if (lobbies[lobbyCode]) {
    lobbies[lobbyCode].players.push(socket.id);
    socket.join(lobbyCode);
    io.to(lobbyCode).emit("player_joined", { playerId: socket.id });
    return true;
  }
  return false;
}

/**
 * Entfernt den Spieler aus seiner Lobby und räumt ggf. auf
 */
function removePlayer(socket, io) {
  for (const [code, lobby] of Object.entries(lobbies)) {
    const index = lobby.players.indexOf(socket.id);
    if (index !== -1) {
      lobby.players.splice(index, 1);
      if (lobby.players.length === 0) {
        // Lobby löschen, wenn leer
        delete lobbies[code];
        console.log(`Lobby ${code} deleted`);
      } else {
        // Allen verbleibenden Spielern mitteilen, dass jemand ging
        io.to(code).emit("player_left", { playerId: socket.id });
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
  joinLobby,
  removePlayer,
};
