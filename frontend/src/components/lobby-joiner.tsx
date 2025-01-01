import React, { useState, useEffect, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { socket } from "@/lib/socket.ts";

// --- Typen für Server-Events --- //
interface ServerError {
  message: string;
}

interface LobbyCreatedEvent {
  lobbyCode: string;
}

interface LobbyJoinedEvent {
  lobbyCode: string;
}

interface PlayerJoinedEvent {
  playerId: string;
}

// --- Komponente --- //
export const LobbyJoinerComponent: React.FC = (): ReactElement => {
  const [lobbyCode, setLobbyCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    // 1) Lobby wurde erfolgreich erstellt
    const handleLobbyCreated = ({ lobbyCode }: LobbyCreatedEvent) => {
      console.log("Lobby created:", lobbyCode);
      navigate(`/lobby/${lobbyCode}`);
    };

    // 2) Lobby wurde erfolgreich beigetreten
    const handleLobbyJoined = ({ lobbyCode }: LobbyJoinedEvent) => {
      console.log("Joined lobby:", lobbyCode);
      navigate(`/lobby/${lobbyCode}`);
    };

    // 3) Fehler vom Server empfangen
    const handleServerError = ({ message }: ServerError) => {
      setMessage(`Error: ${message}`);
    };

    // 4) Ein weiterer Spieler ist der Lobby beigetreten
    const handlePlayerJoined = ({ playerId }: PlayerJoinedEvent) => {
      console.log(`Player joined: ${playerId}`);
      // Falls du hier UI-Updates machen möchtest, könntest du das in einem State speichern
    };

    // Socket-Events registrieren
    socket.on("lobby_created", handleLobbyCreated);
    socket.on("lobby_joined", handleLobbyJoined);
    socket.on("error", handleServerError);
    socket.on("player_joined", handlePlayerJoined);

    // Cleanup beim Verlassen der Komponente
    return () => {
      socket.off("lobby_created", handleLobbyCreated);
      socket.off("lobby_joined", handleLobbyJoined);
      socket.off("error", handleServerError);
      socket.off("player_joined", handlePlayerJoined);
    };
  }, [navigate]);

  // Lobby erstellen
  const createLobby = (): void => {
    setMessage("");
    socket.emit("create_lobby");
  };

  // Lobby beitreten
  const joinLobby = (): void => {
    if (!lobbyCode.trim()) {
      setMessage("Please enter a valid lobby code.");
      return;
    }
    setMessage("");
    socket.emit("join_lobby", lobbyCode);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Higher Lower Game Multiplayer</CardTitle>
          <CardDescription>Join an existing lobby or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter lobby code"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              className="flex-grow"
              maxLength={6}
            />
            <Button onClick={joinLobby}>Join</Button>
          </div>
          {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={createLobby} variant="outline" className="w-full">
            Create New Lobby
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
