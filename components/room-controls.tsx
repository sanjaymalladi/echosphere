"use client"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Hand, LogOut, Users, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface RoomControlsProps {
  isSpeaker: boolean
  isMuted: boolean
  isHandRaised: boolean
  isHost?: boolean
  onToggleSpeaker: () => void
  onToggleMute: () => void
  onToggleRaiseHand: () => void
}

export function RoomControls({
  isSpeaker,
  isMuted,
  isHandRaised,
  isHost = false,
  onToggleSpeaker,
  onToggleMute,
  onToggleRaiseHand,
}: RoomControlsProps) {
  const router = useRouter()

  const handleLeaveRoom = () => {
    router.push("/")
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-4 flex justify-center gap-3 sm:gap-6"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isHost && (
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 bg-accent/20 text-accent border-accent"
          disabled
        >
          <Crown />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        className={`rounded-full h-12 w-12 ${isMuted ? "bg-red-500/20 text-red-500 border-red-500" : "bg-green-500/20 text-green-500 border-green-500"}`}
        onClick={onToggleMute}
      >
        {isMuted ? <MicOff /> : <Mic />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className={`rounded-full h-12 w-12 ${isHandRaised ? "bg-accent/20 text-accent border-accent" : "bg-white/10 text-white border-white/20"}`}
        onClick={onToggleRaiseHand}
      >
        <Hand />
      </Button>

      {!isHost && (
        <Button
          variant="outline"
          size="icon"
          className={`rounded-full h-12 w-12 ${isSpeaker ? "bg-primary/20 text-primary border-primary" : "bg-white/10 text-white border-white/20"}`}
          onClick={onToggleSpeaker}
        >
          <Users />
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12 bg-red-500/20 text-red-500 border-red-500"
        onClick={handleLeaveRoom}
      >
        <LogOut />
      </Button>
    </motion.div>
  )
}
