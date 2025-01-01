// src/components/LobbyPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "@/lib/socket.ts";

interface Player {
  socketId: string;
  username: string;
}

export function LobbyPage() {
  const { lobbyCode } = useParams();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const handleLobbyUpdate = ({ players }: { players: Player[] }) => {
      setPlayers(players);
    };
  
    socket.on("lobby_update", handleLobbyUpdate);
  
    // Beim Mount nach der aktuellen Liste fragen
    if (lobbyCode) {
      socket.emit("get_lobby_state", { lobbyCode });
    }
  
    return () => {
      socket.off("lobby_update", handleLobbyUpdate);
    };
  }, [lobbyCode]);
  

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl">Lobby: {lobbyCode}</h1>

      <div>
        <h2 className="text-lg mb-2">Players in Lobby:</h2>
        <ul className="list-disc list-inside">
          {players.map((player) => (
            <li key={player.socketId}>
              {player.username} ({player.socketId})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
