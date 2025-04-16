# Echosphere - Social Audio Platform

Echosphere is a modern social audio platform that allows users to join or create audio chat rooms. The platform includes AI-powered chat rooms where users can interact with an AI assistant.

## Features

- Create and join audio chat rooms
- Chat with AI using text or voice
- Real-time audio visualization
- User presence and status indicators
- Categorized rooms with search functionality
- Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd echosphere
```

2. Install dependencies
```bash
pnpm install
# or
npm install
```

3. Set up environment variables
   - Copy `.env.local.example` to `.env.local`
   - Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your Gemini API key to `.env.local`:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server
```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Using the AI Chat Feature

The AI chat feature uses Google's Gemini API to provide intelligent responses:

1. Join any AI chat room from the home page
2. Type your message or use the voice input button to speak
3. Get AI-generated responses in real-time

### Voice Chat

- Click the microphone button to start voice recognition
- Speak your message
- Click the microphone button again to stop recording and send
- Note: Voice recognition requires browser permission and is only supported in modern browsers

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Google Gemini API
- Web Speech API

## License

This project is licensed under the MIT License - see the LICENSE file for details. 