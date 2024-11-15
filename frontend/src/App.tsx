import { ThemeProvider } from "@/components/theme-provider"
import { LobbyJoinerComponent } from "./components/lobby-joiner"
import { DarkModeToggle } from "./components/dark-mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <DarkModeToggle />
      <LobbyJoinerComponent />
    </ThemeProvider>
  )
}

export default App
