"use client"

import { motion } from "framer-motion"
import { Headphones } from "lucide-react"

export function PageLoading() {
  return (
    <div className="fixed inset-0 bg-[#101820] z-50 flex flex-col items-center justify-center" suppressHydrationWarning>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
          }}
          className="inline-block"
        >
          <Headphones size={80} className="text-primary mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">EchoSphere</h1>
        <p className="text-white/80">Where voices meet, and vibes flow.</p>

        <div className="mt-8 flex justify-center" suppressHydrationWarning>
          <div className="loading-dots" suppressHydrationWarning>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
