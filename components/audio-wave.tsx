"use client"

import { useEffect, useState } from "react"
import { generateAudioWaveData } from "@/lib/data"

interface AudioWaveProps {
  isActive: boolean
}

export function AudioWave({ isActive }: AudioWaveProps) {
  const [heights, setHeights] = useState<number[]>([])

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setHeights(generateAudioWaveData())
      }, 200)
      return () => clearInterval(interval)
    } else {
      setHeights([1, 1, 1, 1, 1])
    }
  }, [isActive])

  return (
    <div className="audio-wave">
      {heights.map((height, index) => (
        <span
          key={index}
          style={{
            height: isActive ? `${height}px` : "2px",
            opacity: isActive ? 1 : 0.5,
          }}
          className="transition-all duration-200"
        ></span>
      ))}
    </div>
  )
}
