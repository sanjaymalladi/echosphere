"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Headphones, PlusCircle, ArrowLeft } from "lucide-react"
import { mockRooms } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { CreateRoomModal } from "@/components/create-room-modal"

interface NavbarProps {
  onSearch?: (query: string) => void
  showBackButton?: boolean
}

export function Navbar({ onSearch, showBackButton = false }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [surpriseMode, setSurpriseMode] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(searchQuery)
  }

  const handleJoinRandom = () => {
    setSurpriseMode(true)
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockRooms.length)
      router.push(`/room/${mockRooms[randomIndex].id}`)
      setSurpriseMode(false)
    }, 1500)
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  const isRoomPage = pathname?.includes("/room/")

  return (
    <>
      <AnimatePresence>
        {surpriseMode && (
          <motion.div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <Headphones size={80} className="text-accent" />
              <p className="text-white text-xl mt-4 text-center">Finding you a random room...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" size="icon" className="mr-2 text-white" onClick={handleBackToHome}>
                <ArrowLeft size={20} />
              </Button>
            )}
            <span className="text-xl font-bold text-white">🎧 EchoSphere</span>
          </div>

          <div className="flex items-center gap-3">
            {!isRoomPage && (
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.form
                    key="search-form"
                    className="relative"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "250px", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                  >
                    <Input
                      placeholder="Search rooms..."
                      className="pr-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      onBlur={() => {
                        if (!searchQuery) setIsSearchOpen(false)
                      }}
                    />
                    <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                      <Search size={18} />
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div key="search-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsSearchOpen(true)}>
                      <Search size={20} />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            <Button variant="ghost" size="sm" className="text-white" onClick={handleJoinRandom}>
              <Headphones size={20} className="mr-2" />
              <span className="hidden sm:inline">Join Random</span>
            </Button>

            <Button className="bg-primary hover:bg-primary/90" size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <PlusCircle size={18} className="mr-2" />
              <span className="hidden sm:inline">Create Room</span>
            </Button>
          </div>
        </div>
      </div>

      <CreateRoomModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  )
}
