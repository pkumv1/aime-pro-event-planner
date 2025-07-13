import { NextRequest, NextResponse } from 'next/server'
import { getAIResponse } from '@/lib/nlp'

export async function POST(request: NextRequest) {
  try {
    const { message, entities } = await request.json()
    
    // If we have Groq API key, use it
    if (process.env.GROQ_API_KEY) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: 'You are AIME, a friendly AI event planning assistant. Help users plan their events by asking relevant questions and providing helpful suggestions.'
              },
              {
                role: 'user',
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 200
          })
        })
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            response: data.choices[0].message.content,
            entities
          })
        }
      } catch (error) {
        console.error('Groq API error:', error)
      }
    }
    
    // Fallback to local response generation
    const response = getAIResponse(entities || [])
    
    return NextResponse.json({
      response,
      entities
    })
    
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}