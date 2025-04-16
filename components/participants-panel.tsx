"use client"

import { useEffect, useState } from "react"
import type { User } from "@/lib/data"
import { ParticipantAvatar } from "@/components/participant-avatar"
import { motion, AnimatePresence } from "framer-motion"

interface ParticipantsPanelProps {
  participants: User[]
}

export function ParticipantsPanel({ participants }: ParticipantsPanelProps) {
  // Find the host (assuming the first speaker is the host)
  const host =
    participants.find((p) => p.id === "current-user" && p.name.includes("Host")) ||
    participants.find((p) => p.isSpeaker)

  // Separate speakers and listeners (excluding the host)
  const speakers = participants
    .filter((user) => user.isSpeaker && user !== host)
    .sort((a, b) => (a.id === "current-user" ? -1 : b.id === "current-user" ? 1 : 0))

  const listeners = participants
    .filter((user) => !user.isSpeaker && user !== host)
    .sort((a, b) => (a.id === "current-user" ? -1 : b.id === "current-user" ? 1 : 0))

  // Track previous state to detect changes
  const [prevParticipants, setPrevParticipants] = useState<User[]>([])
  const [statusChanges, setStatusChanges] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Check for status changes
    if (prevParticipants.length > 0) {
      const changes: { [key: string]: string } = {}

      participants.forEach((current) => {
        const prev = prevParticipants.find((p) => p.id === current.id)
        if (prev) {
          if (prev.isMuted !== current.isMuted) {
            changes[current.id] = current.isMuted ? "muted" : "unmuted"
          }
          if (prev.isHandRaised !== current.isHandRaised && current.isHandRaised) {
            changes[current.id] = "raised hand"
          }
          if (prev.isSpeaker !== current.isSpeaker) {
            changes[current.id] = current.isSpeaker ? "became speaker" : "became listener"
          }
        }
      })

      if (Object.keys(changes).length > 0) {
        setStatusChanges(changes)

        // Clear status changes after 2 seconds
        setTimeout(() => {
          setStatusChanges({})
        }, 2000)
      }
    }

    setPrevParticipants(participants)
  }, [participants])

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative">
      {/* Fixed position status notifications that don't affect layout */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md px-4">
        <AnimatePresence>
          {Object.entries(statusChanges).map(([userId, status]) => {
            const user = participants.find((p) => p.id === userId)
            if (!user) return null

            return (
              <motion.div
                key={`status-${userId}-${Date.now()}`}
                className="mb-2 p-2 bg-primary/20 backdrop-blur-md rounded-lg text-white text-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-medium">{user.name}</span> {status}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Host section */}
      {host && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4">Host</h3>
          <div className="flex justify-center mb-6">
            <ParticipantAvatar key={host.id} user={host} isHost={true} />
          </div>
        </motion.div>
      )}

      {/* Speakers section */}
      {speakers.length > 0 && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold mb-4">Speakers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {speakers.map((speaker) => (
              <ParticipantAvatar key={speaker.id} user={speaker} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Listeners section */}
      {listeners.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4">Listeners</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {listeners.map((listener) => (
              <ParticipantAvatar key={listener.id} user={listener} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
