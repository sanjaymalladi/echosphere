"use client"

import type { User } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Hand, Sparkles, Crown } from "lucide-react"
import { AudioWave } from "@/components/audio-wave"
import { motion } from "framer-motion"

interface ParticipantAvatarProps {
  user: User
  isHost?: boolean
}

export function ParticipantAvatar({ user, isHost = false }: ParticipantAvatarProps) {
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <Avatar
          className={`h-14 w-14 border-2 ${
            isHost
              ? "border-accent"
              : user.isActive && !user.isMuted
                ? "border-accent"
                : user.id === "current-user"
                  ? "border-primary"
                  : "border-transparent"
          } ${user.isActive && !user.isMuted ? "avatar-pulse" : ""}`}
        >
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        {isHost && (
          <div className="absolute -top-2 -left-2 bg-accent text-white rounded-full p-1">
            <Crown size={14} />
          </div>
        )}

        {user.isSpeaker && (
          <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1">
            {user.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
          </div>
        )}

        {user.isHandRaised && (
          <div className="absolute -top-1 -right-1 bg-accent text-white rounded-full p-1">
            <Hand size={14} />
          </div>
        )}

        {user.isAI && (
          <div className="ai-badge flex items-center">
            <Sparkles size={10} className="mr-1" /> AI
          </div>
        )}

        {user.id === "current-user" && !isHost && (
          <div className="absolute -bottom-1 left-0 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full">You</div>
        )}
      </div>

      <span className="text-xs font-medium truncate max-w-[80px] text-center">
        {isHost ? `${user.name} (Host)` : user.name}
      </span>

      {user.isSpeaker && !user.isMuted && <AudioWave isActive={user.isActive} />}
    </motion.div>
  )
}
