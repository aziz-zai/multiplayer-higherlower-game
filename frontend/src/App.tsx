// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { DarkModeToggle } from "./components/dark-mode-toggle";
import { LobbyJoinerComponent } from "./components/lobby-joiner";
import { LobbyPage } from "@/components/lobby/lobbyPage";  // z@ B. eine Komponente für die Lobby

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <DarkModeToggle />
        <Routes>
          <Route path="/" element={<LobbyJoinerComponent />} />
          {/* Neue Route mit Parameter :lobbyCode */}
          <Route path="/lobby/:lobbyCode" element={<LobbyPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
