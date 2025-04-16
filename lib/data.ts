export type Room = {
  id: string
  name: string
  host: User
  participants: User[]
  theme: string
  description: string
  isAIRoom?: boolean
}

export type User = {
  id: string
  name: string
  avatar: string
  isSpeaker: boolean
  isMuted: boolean
  isHandRaised: boolean
  isActive: boolean
  isAI?: boolean
}

export type Message = {
  id: string
  userId: string
  text: string
  timestamp: Date
}

// User avatars
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isSpeaker: true,
    isMuted: false,
    isHandRaised: false,
    isActive: true,
  },
  {
    id: "user-2",
    name: "Maya Patel",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isSpeaker: true,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-3",
    name: "Sam Wilson",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: true,
    isActive: false,
  },
  {
    id: "user-4",
    name: "Zoe Chen",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-5",
    name: "Jordan Lee",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    isSpeaker: true,
    isMuted: false,
    isActive: true,
    isHandRaised: false,
  },
  {
    id: "user-6",
    name: "Taylor Kim",
    avatar: "https://randomuser.me/api/portraits/women/66.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-7",
    name: "Raj Patel",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-8",
    name: "Emma Watson",
    avatar: "https://randomuser.me/api/portraits/women/88.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: true,
    isActive: false,
  },
  {
    id: "ai-assistant",
    name: "Echo AI",
    avatar: "/ai-avatar.png",
    isSpeaker: true,
    isMuted: false,
    isHandRaised: false,
    isActive: false,
    isAI: true,
  },
  // Additional users
  {
    id: "user-9",
    name: "David Chen",
    avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-10",
    name: "Sophia Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    isSpeaker: true,
    isMuted: false,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-11",
    name: "Ethan Williams",
    avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-12",
    name: "Olivia Martinez",
    avatar: "https://randomuser.me/api/portraits/women/57.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-13",
    name: "Noah Thompson",
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-14",
    name: "Ava Garcia",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
  {
    id: "user-15",
    name: "Liam Brown",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    isSpeaker: false,
    isMuted: true,
    isHandRaised: false,
    isActive: false,
  },
]

// Create initial rooms with more participants
export const mockRooms: Room[] = [
  {
    id: "room-1",
    name: "Tech Talk: Future of AI",
    host: mockUsers[0],
    participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3], mockUsers[9], mockUsers[10]],
    theme: "gradient-bg-1",
    description: "Join us for a discussion on the latest AI trends and future predictions.",
  },
  {
    id: "room-2",
    name: "Music Vibes: Indie Discoveries",
    host: mockUsers[4],
    participants: [mockUsers[4], mockUsers[5], mockUsers[6], mockUsers[11], mockUsers[12]],
    theme: "gradient-bg-2",
    description: "Sharing our favorite indie music discoveries of the week.",
  },
  {
    id: "room-3",
    name: "Startup Founders Meetup",
    host: mockUsers[1],
    participants: [mockUsers[1], mockUsers[7], mockUsers[2], mockUsers[13], mockUsers[14]],
    theme: "gradient-bg-3",
    description: "Networking and advice sharing for startup founders.",
  },
  {
    id: "room-4",
    name: "Late Night Chill",
    host: mockUsers[3],
    participants: [mockUsers[3], mockUsers[5], mockUsers[6], mockUsers[7], mockUsers[9], mockUsers[11]],
    theme: "gradient-bg-4",
    description: "Just vibing and chatting about anything and everything.",
  },
  {
    id: "ai-room",
    name: "Chat with Echo AI",
    host: mockUsers[8],
    participants: [mockUsers[8]],
    theme: "gradient-bg-ai",
    description: "Have a conversation with our AI assistant about any topic.",
    isAIRoom: true,
  },
]

// Store for dynamically created rooms
const dynamicRooms: Room[] = []

// Function to add a new room
export function addNewRoom(room: Room): string {
  dynamicRooms.push(room)
  return room.id
}

// Function to get all rooms (mock + dynamic)
export function getAllRooms(): Room[] {
  return [...mockRooms, ...dynamicRooms]
}

// Function to get a room by ID
export function getRoomById(id: string): Room | undefined {
  return [...mockRooms, ...dynamicRooms].find((room) => room.id === id)
}

export const aiResponses = [
  "That's an interesting perspective! I'd love to hear more about your thoughts on this topic.",
  "I've been thinking about this a lot lately. The way technology is evolving is fascinating.",
  "Great question! From my analysis, there are several factors to consider here.",
  "I'm not sure I agree with that assessment. Let me share a different viewpoint.",
  "You've made some excellent points. I'd add that recent research suggests alternative approaches too.",
  "That reminds me of a similar discussion I had recently. The parallels are striking.",
  "I'm curious about how you came to that conclusion. Could you elaborate?",
  "From what I understand, the data shows a different trend emerging in that space.",
  "That's a creative solution! Have you considered how it might scale in different contexts?",
  "I appreciate you sharing that perspective. It's given me something new to consider.",
]

export const generateRandomActivity = () => {
  return Math.random() > 0.5
}

export const generateAudioWaveData = () => {
  return Array.from({ length: 5 }, () => Math.floor(Math.random() * 15) + 1)
}

export const getRandomAIResponse = () => {
  const randomIndex = Math.floor(Math.random() * aiResponses.length)
  return aiResponses[randomIndex]
}
