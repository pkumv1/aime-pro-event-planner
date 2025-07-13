import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Message } from '@/types'

interface MessageBubbleProps {
  message: Message
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [displayedText, setDisplayedText] = useState('')
  
  useEffect(() => {
    if (message.animated && message.role === 'assistant') {
      let index = 0
      const timer = setInterval(() => {
        if (index < message.content.length) {
          setDisplayedText(message.content.slice(0, index + 1))
          index++
        } else {
          clearInterval(timer)
        }
      }, 15)
      
      return () => clearInterval(timer)
    } else {
      setDisplayedText(message.content)
    }
  }, [message])
  
  return (
    <div 
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
    >
      <div className={`max-w-[80%] ${
        message.role === 'user' 
          ? 'bg-purple-600 text-white' 
          : 'bg-gray-800 text-gray-100'
      } rounded-2xl px-4 py-3 shadow-lg`}>
        {message.role === 'assistant' && (
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-purple-400">AI Assistant</span>
          </div>
        )}
        <p className="text-sm whitespace-pre-line">{displayedText}</p>
        <p className={`text-xs mt-1 ${
          message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble