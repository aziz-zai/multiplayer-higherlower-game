import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export function LobbyJoinerComponent() {
  const [lobbyCode, setLobbyCode] = useState('')

  const joinLobby = () => {
    // Placeholder: Implement lobby joining logic here
    console.log(`Joining lobby with code: ${lobbyCode}`)
  }

  const createLobby = () => {
    // Placeholder: Implement lobby creation logic here
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    console.log(`Creating new lobby with code: ${newCode}`)
    setLobbyCode(newCode)
  }

  return (
    <div className="flex justify-center items-center w-screen h-screen">
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lobby Joiner</CardTitle>
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
      </CardContent>
      <CardFooter>
        <Button onClick={createLobby} variant="outline" className="w-full">
          Create New Lobby
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}