import { ThemeProvider } from "@/components/theme-provider";
import { LobbyJoinerComponent } from "./components/lobby-joiner";
import { DarkModeToggle } from "./components/dark-mode-toggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <DarkModeToggle />
        <Routes>
          <Route path="/" element={<LobbyJoinerComponent />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
