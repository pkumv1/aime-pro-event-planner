'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Send, Sparkles, Brain, Zap, CheckCircle, ArrowRight, Loader2, MessageSquare } from 'lucide-react'
import { extractEntities, getAIResponse } from '@/lib/nlp'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Message, ExtractedEntity, SessionStats } from '@/types'
import EntityPanel from './EntityPanel'
import MessageBubble from './MessageBubble'
import DemoScenarios from './DemoScenarios'

const ChatDemo = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([])
  const [showExtraction, setShowExtraction] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    entitiesExtracted: 0,
    confidenceScore: 0,
    responseTime: 0
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { sendMessage: wsSendMessage, lastMessage, readyState } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/api/ws'
  )

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm AIME, your AI event planning assistant. I use advanced NLP to understand your needs and help create amazing events. What kind of event are you planning?",
      timestamp: new Date(),
      animated: true
    }
    setMessages([welcomeMessage])
  }, [])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data)
        if (data.type === 'response') {
          setIsTyping(false)
          setAiThinking(false)
          
          const aiMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.text,
            timestamp: new Date(),
            animated: true
          }
          
          setMessages(prev => [...prev, aiMessage])
          
          if (data.entities) {
            setExtractedEntities(data.entities)
            setSessionStats(data.stats || sessionStats)
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }, [lastMessage])

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    
    // Show AI thinking state
    setIsTyping(true)
    setAiThinking(true)
    setShowExtraction(true)
    
    // Extract entities locally for immediate feedback
    const entities = await extractEntities(inputValue)
    setExtractedEntities(entities)
    
    // Update stats
    setSessionStats(prev => ({
      entitiesExtracted: prev.entitiesExtracted + entities.length,
      confidenceScore: entities.length > 0 
        ? Math.floor(entities.reduce((acc, e) => acc + e.confidence, 0) / entities.length) 
        : 0,
      responseTime: 150 + Math.random() * 100
    }))
    
    // Send via WebSocket if connected, otherwise use API
    if (readyState === WebSocket.OPEN) {
      wsSendMessage(JSON.stringify({ text: inputValue }))
    } else {
      // Fallback to REST API
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputValue, entities })
        })
        
        const data = await response.json()
        setIsTyping(false)
        setAiThinking(false)
        
        const aiMessage: Message = {
          id: Date.now().toString() + '-ai',
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          animated: true
        }
        
        setMessages(prev => [...prev, aiMessage])
      } catch (error) {
        console.error('Error sending message:', error)
        setIsTyping(false)
        setAiThinking(false)
      }
    }
    
    // Hide extraction visualization after 3 seconds
    setTimeout(() => setShowExtraction(false), 3000)
  }

  const loadDemoScenario = (starter: string) => {
    setInputValue(starter)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black bg-opacity-50 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">AIME Pro - Live Demo</h1>
                <p className="text-purple-300 text-sm">AI-Powered Event Planning Assistant</p>
              </div>
            </div>
            
            {/* Live Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{sessionStats.entitiesExtracted}</p>
                <p className="text-xs text-gray-400">Entities Extracted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{sessionStats.confidenceScore}%</p>
                <p className="text-xs text-gray-400">Confidence</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{sessionStats.responseTime.toFixed(0)}ms</p>
                <p className="text-xs text-gray-400">Response Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl border border-purple-500/20 overflow-hidden">
            {/* Demo Scenarios Bar */}
            <DemoScenarios onSelectScenario={loadDemoScenario} />

            {/* Messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-800 rounded-2xl px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-2">
                      {aiThinking ? (
                        <>
                          <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-sm text-purple-400">AI is analyzing your request...</span>
                        </>
                      ) : (
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-purple-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Try: 'I need to plan a tech conference for 300 people in Miami'"
                  className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-500"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Entity Extraction Visualization */}
        <EntityPanel 
          entities={extractedEntities} 
          showExtraction={showExtraction}
          isTyping={isTyping}
          aiThinking={aiThinking}
        />
      </div>
    </div>
  )
}

export default ChatDemo