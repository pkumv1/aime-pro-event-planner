import { NextRequest } from 'next/server'

// Note: WebSocket support in Next.js App Router is limited
// For production, consider using a separate WebSocket server or Vercel's Edge Functions

export async function GET(request: NextRequest) {
  return new Response('WebSocket endpoint - use a dedicated WS server for production', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

// For local development, you can use the API routes as fallback
// In production, consider:
// 1. Pusher/Ably for managed WebSockets
// 2. Socket.io with a separate server
// 3. Vercel Edge Functions with Server-Sent Events