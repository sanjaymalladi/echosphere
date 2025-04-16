import type { Room } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RoomHeaderProps {
  room: Room
  isCurrentUserHost?: boolean
}

export function RoomHeader({ room, isCurrentUserHost = false }: RoomHeaderProps) {
  // Determine the host display name
  const hostName = isCurrentUserHost ? "You" : room.host.name

  return (
    <div className={`w-full ${room.theme} py-6 px-4 rounded-b-lg`}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">{room.name}</h1>
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6 border border-white">
            <AvatarImage src={room.host.avatar || "/placeholder.svg"} alt={hostName} />
            <AvatarFallback>{hostName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-white/90">
            Hosted by <span className="font-semibold">{hostName}</span>
            {isCurrentUserHost && " (You)"}
          </span>
        </div>
      </div>
    </div>
  )
}
