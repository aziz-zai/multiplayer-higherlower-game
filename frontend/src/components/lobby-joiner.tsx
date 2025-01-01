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

// --- Hilfsfunktion für Standard-Namen ---
function getRandomUsername(): string {
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return "GUEST" + randomNumber; // z. B. "GUEST0123"
}

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
  const [username, setUsername] = useState<string>(getRandomUsername());

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
    socket.emit("create_lobby", { username: username.trim() });
  };

  // Lobby beitreten
  const joinLobby = (): void => {
    if (!lobbyCode.trim()) {
      setMessage("Please enter a valid lobby code.");
      return;
    }
    setMessage("");

    // Prüfen, ob user etwas eingetragen hat; wenn nicht → Random-Name
    const finalUsername = username.trim() ;

    // Emit an den Server mit Code und Benutzername
    socket.emit("join_lobby", { lobbyCode, username: finalUsername });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Higher Lower Game Multiplayer</CardTitle>
          <CardDescription>Join an existing lobby or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter Your Name (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow"
              maxLength={12} // Erhöhe, wenn du längere Namen willst
            />
            <Input
              type="text"
              placeholder="Enter lobby code"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              className="flex-grow"
              maxLength={6}
            />
            {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col w-full gap-2">
            <Button onClick={joinLobby} className="w-full">
              Join
            </Button>
            <Button onClick={createLobby} variant="outline" className="w-full">
              Create New Lobby
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
