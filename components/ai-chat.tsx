"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Smile, RefreshCw, Volume2, Mic, MicOff, Pause, Play } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { generateAIResponse } from "@/lib/gemini"
import { ClientOnly } from "@/components/client-only"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  status?: "sending" | "sent" | "error"
}

interface AIChatProps {
  onAIActive: (isActive: boolean) => void
  isMuted?: boolean
}

export function AIChat({ onAIActive, isMuted = true }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm Echo AI. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
      status: "sent"
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [emoji, setEmoji] = useState<{ id: string; emoji: string; x: number; y: number } | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
  const [showVoiceNotification, setShowVoiceNotification] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const recognitionRef = useRef<any>(null) // SpeechRecognition reference

  // Add ref for tracking previous mute state
  const prevMutedRef = useRef(isMuted)

  // React to external mute/unmute
  useEffect(() => {
    // Only toggle speech recognition when mute state changes
    if (prevMutedRef.current !== isMuted) {
      // If we were muted and now unmuted, start listening
      if (prevMutedRef.current && !isMuted) {
        startSpeechRecognition()
      }
      // If we were unmuted and now muted, stop listening
      else if (!prevMutedRef.current && isMuted) {
        stopSpeechRecognition()
      }
      
      // Update the ref to current value
      prevMutedRef.current = isMuted;
    }
  }, [isMuted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Initialize speech recognition
  useEffect(() => {
    // Only run this code on the client side
    if (typeof window === 'undefined') return;
    
    let SpeechRecognition;
    try {
      // @ts-ignore - TypeScript doesn't know about webkitSpeechRecognition
      SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Use shorter segments for faster processing
        recognitionRef.current.interimResults = true;
        // Use English language to improve accuracy and speed
        recognitionRef.current.lang = 'en-US';
        
        // Smaller chunks for faster feedback
        recognitionRef.current.maxAlternatives = 1;
        
        recognitionRef.current.onresult = (event: any) => {
          const results = event.results;
          const latestResult = results[results.length - 1];
          
          // Process both interim and final results to show feedback faster
          const transcript = latestResult[0].transcript;
          
          if (transcript.trim()) {
            setInputValue(transcript);
            
            // If the result is final, auto-send the message after a short delay
            if (latestResult.isFinal) {
              // Avoid sending very short phrases immediately to prevent accidental sends
              if (transcript.length > 10) {
                setTimeout(() => {
                  if (recognitionRef.current && isListening) {
                    // Stop recognition before sending to reset for next input
                    try {
                      recognitionRef.current.stop();
                    } catch (e) {
                      console.error('Error stopping recognition:', e);
                    }
                    // Restart recognition after sending
                    setTimeout(() => {
                      if (isListening) {
                        try {
                          recognitionRef.current?.start();
                        } catch (e) {
                          console.error('Error restarting recognition:', e);
                        }
                      }
                    }, 500);
                    
                    // Send the message
                    handleSendMessage();
                  }
                }, 500);
              }
            }
          }
        };
        
        recognitionRef.current.onend = () => {
          // Only change state if this wasn't caused by us manually stopping
          if (isListening) {
            try {
              // Auto-restart if it stopped unexpectedly
              recognitionRef.current?.start();
            } catch (e) {
              console.error('Error auto-restarting recognition:', e);
              setIsListening(false);
            }
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          
          // Don't stop listening on all errors, only critical ones
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setIsListening(false);
            setApiError("Microphone access was denied. Please allow microphone access to use voice chat.");
          }
        };
      }
    } catch (e) {
      console.error('Speech recognition initialization error:', e);
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
    };
  }, []);

  // Initialize speech synthesis
  useEffect(() => {
    // Only run this code on the client side
    if (typeof window === 'undefined') return;
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      // Get available voices
      const loadVoices = () => {
        const voices = synthRef.current!.getVoices();
        setAvailableVoices(voices);
        
        // Try to find and set a more natural sounding voice
        // Look for voices that are known to sound more natural
        const naturalVoices = [
          // Common natural-sounding voices
          voices.find(voice => voice.name.includes('Google') && voice.name.includes('Natural')),
          voices.find(voice => voice.name.includes('Microsoft') && voice.name.includes('Neural')),
          voices.find(voice => voice.name.includes('Amazon') || voice.name.includes('Polly')),
          // Fallback to any English female voice
          voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female')),
          // Fallback to any English voice
          voices.find(voice => voice.lang.includes('en')),
          // Last resort - first available voice
          voices[0]
        ];
        
        // Use the first non-null voice from our preference list
        const selectedVoice = naturalVoices.find(voice => voice !== undefined);
        
        if (selectedVoice) {
          setSelectedVoice(selectedVoice);
        }
      };
      
      // Chrome loads voices asynchronously
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = loadVoices;
      }
      
      // Try to load voices immediately (works in Firefox)
      loadVoices();
      
      // Clean up
      return () => {
        if (synthRef.current && synthRef.current.speaking) {
          synthRef.current.cancel();
        }
      };
    }
  }, []);

  const startSpeechRecognition = () => {
    if (!recognitionRef.current) {
      console.warn('Speech recognition is not supported in your browser.');
      return;
    }
    
    try {
      // Cancel any ongoing TTS when starting to speak
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      
      // Clear any existing input before starting new recognition
      setInputValue('');
      setIsListening(true);
      
      // Start recognition
      recognitionRef.current.start();
      
      // Show guidance notification
      setShowVoiceNotification(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      
      // Show a helpful error message
      setApiError("Could not access microphone. Please check your browser permissions.");
    }
  };
  
  const stopSpeechRecognition = () => {
    if (!recognitionRef.current || !isListening) return;
    
    try {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // If we have input text from speech, send it
      if (inputValue.trim()) {
        handleSendMessage();
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      setIsListening(false);
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      // Set the specific message when starting voice recognition
      setInputValue("you can speak with ai in the future now you chat with ai and it can speak with you");
      
      // Use setTimeout to ensure the input value is set before sending the message
      setTimeout(() => {
        handleSendMessage();
        // Start speech recognition after sending the message
        startSpeechRecognition();
      }, 100);
    }
  };

  const pauseResumeAudio = () => {
    if (!synthRef.current) return;
    
    if (isSpeaking) {
      if (isPaused) {
        // Resume speaking
        synthRef.current.resume();
        setIsPaused(false);
      } else {
        // Pause speaking
        synthRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    if (synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
    
    try {
      // Create a new utterance
      utteranceRef.current = new SpeechSynthesisUtterance();
      
      // Set voice if available
      if (selectedVoice) {
        utteranceRef.current.voice = selectedVoice;
      }
      
      // Configure speech parameters for more natural sound
      utteranceRef.current.rate = 0.95; // Slightly slower rate sounds more natural
      utteranceRef.current.pitch = 1.05; // Slight pitch adjustment
      utteranceRef.current.volume = 1.0;
      
      // Add slight pauses at punctuation by adding extra spaces
      // This makes speech sound more natural
      const textWithPauses = text
        .replace(/\./g, '. ')
        .replace(/\,/g, ', ')
        .replace(/\?/g, '? ')
        .replace(/\!/g, '! ');
      
      utteranceRef.current.text = textWithPauses;
      
      // Set event handlers
      utteranceRef.current.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utteranceRef.current.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      utteranceRef.current.onpause = () => {
        setIsPaused(true);
      };
      
      utteranceRef.current.onresume = () => {
        setIsPaused(false);
      };
      
      utteranceRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
      };
      
      // Speak
      synthRef.current.speak(utteranceRef.current);
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    // Clear any previous API errors
    setApiError(null);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      status: "sent"
    }

    // Add AI message with "sending" status
    const aiMessageId = `ai-${Date.now()}`;
    const aiPendingMessage: Message = {
      id: aiMessageId,
      text: "...",
      sender: "ai",
      timestamp: new Date(),
      status: "sending"
    }

    setMessages((prev) => [...prev, userMessage, aiPendingMessage])
    const userInput = inputValue;
    setInputValue("")

    // Simulate AI typing
    setIsTyping(true)
    onAIActive(true)

    try {
      // Get response from Gemini API
      const aiResponseText = await generateAIResponse(userInput);
      
      // Update AI message with the response
      setMessages((prev) => 
        prev.map(message => 
          message.id === aiMessageId 
            ? { ...message, text: aiResponseText, status: "sent" } 
            : message
        )
      );
      
      // Auto-speak the response if we're in voice conversation mode
      if (isListening) {
        // We need a small delay to make sure the UI updates before speaking
    setTimeout(() => {
          speakText(aiResponseText);
        }, 500);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Update the pending message to show the error
      setMessages((prev) => 
        prev.map(message => 
          message.id === aiMessageId 
            ? { 
                ...message, 
                text: "Sorry, I couldn't process your request. Please try again.", 
                status: "error" 
              } 
            : message
        )
      );
      
      setApiError("Failed to connect to AI service. Please check your connection and try again.");
    } finally {
      setIsTyping(false)
      onAIActive(false)
    }
  }

  const retryMessage = async (messageId: string) => {
    // Find the failed message and its corresponding user message
    const failedMessage = messages.find(m => m.id === messageId);
    if (!failedMessage || failedMessage.sender !== "ai" || failedMessage.status !== "error") {
      return;
    }
    
    // Find the user message that came before this AI message
    const userMessageIndex = messages.findIndex(m => m.id === messageId) - 1;
    if (userMessageIndex < 0) return;
    
    const userMessage = messages[userMessageIndex];
    if (!userMessage || userMessage.sender !== "user") return;
    
    // Update the failed message to "sending" status
    setMessages((prev) => 
      prev.map(message => 
        message.id === messageId 
          ? { ...message, text: "...", status: "sending" } 
          : message
      )
    );
    
    setIsTyping(true);
    onAIActive(true);
    setApiError(null);
    
    try {
      // Retry getting response from Gemini API
      const aiResponseText = await generateAIResponse(userMessage.text);
      
      // Update the message with the new response
      setMessages((prev) => 
        prev.map(message => 
          message.id === messageId 
            ? { ...message, text: aiResponseText, status: "sent" } 
            : message
        )
      );
    } catch (error) {
      console.error("Error retrying AI response:", error);
      
      // Update the message to show the error again
      setMessages((prev) => 
        prev.map(message => 
          message.id === messageId 
            ? { 
                ...message, 
                text: "Sorry, I still couldn't process your request. Please try again later.", 
                status: "error" 
              } 
            : message
        )
      );
      
      setApiError("Failed to connect to AI service. Please check your connection and try again.");
    } finally {
      setIsTyping(false);
      onAIActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
      <div className="flex items-center justify-between bg-gray-800/80 p-3 border-b border-gray-700">
        <h3 className="text-sm font-medium">Chat with AI</h3>
        <ClientOnly>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm" 
              className={`rounded-full p-1 h-8 w-8 ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
              onClick={toggleSpeechRecognition}
              title={isListening ? "Stop voice input" : "Start voice conversation"}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </Button>
            
            {isSpeaking && (
              <Button
                variant="ghost"
                size="sm" 
                className={`rounded-full p-1 h-8 w-8 ${isPaused ? 'bg-accent' : 'text-accent'}`}
                onClick={pauseResumeAudio}
                title={isPaused ? "Resume speaking" : "Pause speaking"}
              >
                {isPaused ? <Play size={15} /> : <Pause size={15} />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm" 
              className={`rounded-full p-1 h-8 w-8 ${isSpeaking && !isPaused ? 'text-accent' : ''}`}
              onClick={() => speakText(messages[messages.length - 1]?.text || "")}
              title="Listen to last response"
            >
              <Volume2 size={15} />
            </Button>
          </div>
        </ClientOnly>
      </div>
      
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 relative">
        {apiError && (
          <div className="bg-red-900/30 text-white text-sm p-3 rounded-md mb-4 flex items-center justify-between">
            <span>{apiError}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-red-800/50 h-6 w-6 p-0 rounded-full"
              onClick={() => setApiError(null)}
            >
              ×
            </Button>
          </div>
        )}
        
        <ClientOnly>
          {!isListening && !isMuted && showVoiceNotification && (
            <div className="bg-green-900/30 text-white text-sm p-3 rounded-md mb-4 flex items-center justify-between">
              <span>
                <b>Voice chat active!</b> Speak and I'll listen. Your voice will be converted to text and I'll respond automatically.
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-green-800/50 h-6 w-6 p-0 rounded-full ml-2"
                onClick={() => setShowVoiceNotification(false)}
              >
                ×
              </Button>
            </div>
          )}
        </ClientOnly>

        <ClientOnly>
          {isMuted && (
            <div className="bg-gray-800/50 text-white text-sm p-3 rounded-md mb-4">
              <span>
                You can speak with ai in the future now you chat with ai and it can speak with you
              </span>
            </div>
          )}
        </ClientOnly>
        
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
            <div className={`message-bubble ${message.sender} ${message.status === "error" ? "error" : ""}`}>
              <span className="flex-1">{message.text}</span>
              <div className="flex gap-1 ml-2 shrink-0">
                {message.status === "error" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-6 w-6 rounded-full"
                    onClick={() => retryMessage(message.id)}
                    title="Retry"
                  >
                    <RefreshCw size={12} />
                  </Button>
                )}
                {message.sender === "ai" && message.status === "sent" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6 rounded-full speaker-btn"
                    onClick={() => speakText(message.text)}
                    title="Listen to response"
                  >
                    <Volume2 size={12} />
                  </Button>
                )}
              </div>
            </div>
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
            placeholder={isListening ? "Listening..." : "Type a message..."}
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
