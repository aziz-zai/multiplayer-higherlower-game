import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "@/lib/socket";

export const LobbyPage: React.FC = () => {
  const { lobbyCode } = useParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Empfangen, wenn ein Spieler eine Nachricht schickt
    socket.on("player_message_broadcast", ({ playerId, message }) => {
      setMessages((prev) => [...prev, `${playerId}: ${message}`]);
    });

    // Aufräumen
    return () => {
      socket.off("player_message_broadcast");
    };
  }, []);

  const sendMessage = () => {
    if (!lobbyCode) return;
    if (message.trim().length === 0) return;
    console.log("Sending messageasds to lobby:", lobbyCode, message);
    socket.emit("player_message", {
      lobbyCode,
      message
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl">Welcome to Lobby {lobbyCode}</h1>
      <div>
        {/* Eingabefeld für Testnachricht */}
        <input
          type="text"
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Send
        </button>
      </div>
      <div className="border border-gray-300 p-2 w-1/2">
        {messages.map((msg, index) => (
          <div key={index} className="text-left">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};
