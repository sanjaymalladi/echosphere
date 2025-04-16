"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile } from "lucide-react"
import { getRandomAIResponse } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

interface AIChatProps {
  onAIActive: (isActive: boolean) => void
}

export function AIChat({ onAIActive }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm Echo AI. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [emoji, setEmoji] = useState<{ id: string; emoji: string; x: number; y: number } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI typing
    setIsTyping(true)
    onAIActive(true)

    // Random delay between 1-3 seconds
    const typingDelay = Math.floor(Math.random() * 2000) + 1000

    setTimeout(() => {
      setIsTyping(false)
      onAIActive(false)

      // Add AI response
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: getRandomAIResponse(),
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    }, typingDelay)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const showRandomEmoji = () => {
    if (!chatContainerRef.current) return

    const emojis = ["👍", "❤️", "😊", "🎉", "👏", "🙌", "✨", "🔥", "💯", "🚀"]
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    const rect = chatContainerRef.current.getBoundingClientRect()
    const x = Math.random() * (rect.width - 40)
    const y = Math.random() * (rect.height - 100) + 50

    setEmoji({
      id: `emoji-${Date.now()}`,
      emoji: randomEmoji,
      x,
      y,
    })

    setTimeout(() => {
      setEmoji(null)
    }, 3000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-300px)] max-h-[500px] bg-gray-900/50 rounded-lg backdrop-blur-sm">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 relative">
        <AnimatePresence>
          {emoji && (
            <motion.div
              key={emoji.id}
              className="floating-emoji text-2xl"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: -100 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
              style={{ left: `${emoji.x}px`, top: `${emoji.y}px` }}
            >
              {emoji.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`message-bubble ${message.sender}`}>{message.text}</div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full" onClick={showRandomEmoji}>
            <Smile size={20} />
          </Button>
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-gray-800 border-gray-700"
          />
          <Button
            className="rounded-full bg-primary hover:bg-primary/90"
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}
