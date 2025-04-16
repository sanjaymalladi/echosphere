"use client"

import type { Room } from "@/lib/data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()

  const handleJoinRoom = () => {
    router.push(`/room/${room.id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="room-card-hover cursor-pointer"
      onClick={handleJoinRoom}
    >
      <Card className={`overflow-hidden border-none ${room.theme}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                {room.name}
                {room.isAIRoom && (
                  <span className="inline-flex items-center bg-black/30 text-white text-xs px-2 py-1 rounded-full">
                    <Sparkles size={12} className="mr-1" /> AI
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-white/80">{room.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarImage src={room.host.avatar || "/placeholder.svg"} alt={room.host.name} />
              <AvatarFallback>{room.host.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-white">{room.host.name}</p>
              <p className="text-xs text-white/70">Host</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {room.participants.slice(0, 3).map((participant) => (
                <Avatar key={participant.id} className="border-2 border-white h-6 w-6">
                  <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                  <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm text-white/80">{room.participants.length} participants</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-0">
          <div className="flex items-center gap-2 text-white/80">
            <Users size={16} />
            <span className="text-sm">{room.participants.length}</span>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation()
              handleJoinRoom()
            }}
            className="bg-white text-gray-900 hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Join Room
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
