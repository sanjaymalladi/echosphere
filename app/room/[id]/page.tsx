"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getRoomById, type User } from "@/lib/data"
import { RoomHeader } from "@/components/room-header"
import { ParticipantsPanel } from "@/components/participants-panel"
import { RoomControls } from "@/components/room-controls"
import { AIChat } from "@/components/ai-chat"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { PageLoading } from "@/components/page-loading"

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string

  const [room, setRoom] = useState(getRoomById(roomId))
  const [participants, setParticipants] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [aiActive, setAIActive] = useState(false)

  // Check if the current user is already the host
  const isCurrentUserHost = room?.host.id === "current-user"

  // Define current user based on whether they're the host or not
  const [currentUser, setCurrentUser] = useState<User>(
    isCurrentUserHost
      ? room?.host || {
          id: "current-user",
          name: "You",
          avatar: "https://randomuser.me/api/portraits/men/11.jpg",
          isSpeaker: true,
          isMuted: false,
          isHandRaised: false,
          isActive: false,
        }
      : {
          id: "current-user",
          name: "You",
          avatar: "https://randomuser.me/api/portraits/men/11.jpg",
          isSpeaker: false,
          isMuted: true,
          isHandRaised: false,
          isActive: false,
        },
  )

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (room) {
      // If the current user is the host, we don't need to add them again
      let allParticipants: User[] = []

      if (isCurrentUserHost) {
        // The current user is already in the participants list as the host
        allParticipants = [...room.participants]

        // Make sure the host has the correct properties
        allParticipants = allParticipants.map((p) =>
          p.id === "current-user"
            ? {
                ...p,
                name: "You (Host)",
                isSpeaker: true,
                isMuted: currentUser.isMuted,
                isHandRaised: currentUser.isHandRaised,
                isActive: currentUser.isActive,
              }
            : p,
        )
      } else {
        // Add current user to participants if they're not the host
        allParticipants = [...room.participants]

        // Find if current user is already in the participants list
        const existingUserIndex = allParticipants.findIndex((p) => p.id === currentUser.id)

        // If user exists, update them, otherwise add them
        if (existingUserIndex >= 0) {
          allParticipants[existingUserIndex] = currentUser
        } else {
          allParticipants.push(currentUser)
        }
      }

      // Simulate random activity for speakers
      const interval = setInterval(() => {
        setParticipants((prev) =>
          prev.map((p) => {
            if (p.id === currentUser.id) {
              // Keep current user's state in sync
              return currentUser
            } else if (p.isAI && aiActive) {
              return { ...p, isActive: true }
            } else if (p.isSpeaker && !p.isMuted) {
              return { ...p, isActive: Math.random() > 0.7 }
            }
            return p
          }),
        )
      }, 1000)

      setParticipants(allParticipants)

      return () => clearInterval(interval)
    }
  }, [room, currentUser, aiActive, isCurrentUserHost])

  const handleToggleSpeaker = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isSpeaker: !prev.isSpeaker,
      isMuted: !prev.isSpeaker ? false : prev.isMuted,
    }))
  }

  const handleToggleMute = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
    }))
  }

  const handleToggleRaiseHand = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isHandRaised: !prev.isHandRaised,
    }))
  }

  const handleAIActive = (isActive: boolean) => {
    setAIActive(isActive)
  }

  if (isLoading) {
    return <PageLoading />
  }

  if (!room) {
    return <div className="flex items-center justify-center h-screen">Room not found</div>
  }

  return (
    <main className="min-h-screen pb-24 pt-16">
      <Navbar showBackButton={true} />

      <RoomHeader room={room} isCurrentUserHost={isCurrentUserHost} />

      <motion.div
        className="max-w-6xl mx-auto py-8 px-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {room.isAIRoom ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ParticipantsPanel participants={participants} />
            </div>
            <div className="md:col-span-2">
              <AIChat onAIActive={handleAIActive} />
            </div>
          </div>
        ) : (
          <ParticipantsPanel participants={participants} />
        )}
      </motion.div>

      <RoomControls
        isSpeaker={currentUser.isSpeaker}
        isMuted={currentUser.isMuted}
        isHandRaised={currentUser.isHandRaised}
        onToggleSpeaker={handleToggleSpeaker}
        onToggleMute={handleToggleMute}
        onToggleRaiseHand={handleToggleRaiseHand}
        isHost={isCurrentUserHost}
      />
    </main>
  )
}
