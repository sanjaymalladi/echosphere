"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RoomCard } from "@/components/room-card"
import { getAllRooms } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Mic, Music, Code, Coffee, Sparkles, Users } from "lucide-react"
import { PageLoading } from "@/components/page-loading"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rooms, setRooms] = useState(getAllRooms())

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Periodically refresh rooms to catch any new ones
  useEffect(() => {
    const interval = setInterval(() => {
      setRooms(getAllRooms())
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Filter rooms based on search query and category
  const filteredRooms = rooms.filter(
    (room) =>
      (searchQuery === "" ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === null ||
        selectedCategory === "All" ||
        (selectedCategory === "AI" && room.isAIRoom) ||
        room.name.toLowerCase().includes(selectedCategory.toLowerCase())),
  )

  // Separate AI rooms from regular rooms
  const aiRooms = filteredRooms.filter((room) => room.isAIRoom)
  const regularRooms = filteredRooms.filter((room) => !room.isAIRoom)

  // Category icons mapping
  const categoryIcons = {
    All: <Users size={16} />,
    Tech: <Code size={16} />,
    Music: <Music size={16} />,
    Business: <Coffee size={16} />,
    Casual: <Mic size={16} />,
    AI: <Sparkles size={16} />,
  }

  if (isLoading) {
    return <PageLoading />
  }

  return (
    <main className="min-h-screen pb-20 pt-16">
      <Navbar onSearch={setSearchQuery} />

      <div className="max-w-6xl mx-auto px-4 mt-8">
        <motion.div
          className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {Object.entries(categoryIcons).map(([category, icon]) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full ${
                selectedCategory === category ? "bg-primary" : "bg-transparent border-gray-700"
              }`}
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
            >
              {icon}
              <span className="ml-2">{category}</span>
            </Button>
          ))}
        </motion.div>

        {aiRooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Sparkles size={20} className="mr-2 text-accent" />
              Chat with AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Mic size={20} className="mr-2 text-primary" />
            Trending Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {regularRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No rooms found matching your search.</p>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
