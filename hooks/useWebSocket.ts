import { useEffect, useRef, useState, useCallback } from 'react'

export const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)
  
  useEffect(() => {
    try {
      ws.current = new WebSocket(url)
      
      ws.current.onopen = () => {
        console.log('WebSocket connected')
        setReadyState(WebSocket.OPEN)
      }
      
      ws.current.onmessage = (event) => {
        setLastMessage(event)
      }
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected')
        setReadyState(WebSocket.CLOSED)
      }
      
      return () => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.close()
        }
      }
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
    }
  }, [url])
  
  const sendMessage = useCallback((message: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message)
    }
  }, [])
  
  return {
    sendMessage,
    lastMessage,
    readyState
  }
}