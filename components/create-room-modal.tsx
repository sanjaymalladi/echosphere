"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockUsers, addNewRoom } from "@/lib/data"

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter()
  const [roomName, setRoomName] = useState("")
  const [roomDescription, setRoomDescription] = useState("")
  const [roomTheme, setRoomTheme] = useState("gradient-bg-1")
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRoom = () => {
    if (!roomName.trim()) return

    setIsCreating(true)

    // Create the current user as the host
    const currentUser = {
      id: "current-user",
      name: "You",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      isSpeaker: true,
      isMuted: false,
      isHandRaised: false,
      isActive: false,
    }

    // Get random participants (excluding the current user)
    const randomParticipants = [...mockUsers]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 6) + 2)

    // Create the new room with the current user as host
    const newRoom = {
      id: `room-${Date.now()}`,
      name: roomName,
      host: currentUser,
      participants: [currentUser, ...randomParticipants],
      theme: roomTheme,
      description: roomDescription || "Join this room to start a conversation.",
      isAIRoom: false,
    }

    // Add the new room to the mock data
    const newRoomId = addNewRoom(newRoom)

    // Reset form and close modal
    setRoomName("")
    setRoomDescription("")
    setRoomTheme("gradient-bg-1")
    setIsCreating(false)
    onClose()

    // Navigate to the new room
    router.push(`/room/${newRoomId}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Room</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Room Name</Label>
            <Input
              id="name"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What's this room about?"
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="theme">Room Theme</Label>
            <Select value={roomTheme} onValueChange={setRoomTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select a theme">
                  {roomTheme && (
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${roomTheme}`}></div>
                      <span>
                        {roomTheme === "gradient-bg-1" && "Purple Blue"}
                        {roomTheme === "gradient-bg-2" && "Orange Red"}
                        {roomTheme === "gradient-bg-3" && "Green Blue"}
                        {roomTheme === "gradient-bg-4" && "Purple Pink"}
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gradient-bg-1">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full gradient-bg-1"></div>
                    <span>Purple Blue</span>
                  </div>
                </SelectItem>
                <SelectItem value="gradient-bg-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full gradient-bg-2"></div>
                    <span>Orange Red</span>
                  </div>
                </SelectItem>
                <SelectItem value="gradient-bg-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full gradient-bg-3"></div>
                    <span>Green Blue</span>
                  </div>
                </SelectItem>
                <SelectItem value="gradient-bg-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full gradient-bg-4"></div>
                    <span>Purple Pink</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || isCreating}
            className={isCreating ? "opacity-70" : ""}
          >
            {isCreating ? "Creating..." : "Create Room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
