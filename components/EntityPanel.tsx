import React from 'react'
import { Zap, Brain, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import { ExtractedEntity } from '@/types'

interface EntityPanelProps {
  entities: ExtractedEntity[]
  showExtraction: boolean
  isTyping: boolean
  aiThinking: boolean
}

const EntityPanel: React.FC<EntityPanelProps> = ({ entities, showExtraction, isTyping, aiThinking }) => {
  const getEntityGradient = (type: string) => {
    const gradients: { [key: string]: string } = {
      'EVENT_TYPE': 'from-purple-600 to-purple-800',
      'ATTENDEE_COUNT': 'from-blue-600 to-blue-800',
      'LOCATION': 'from-green-600 to-green-800',
      'BUDGET': 'from-red-600 to-red-800',
      'DATE': 'from-pink-600 to-pink-800',
      'SERVICES': 'from-yellow-600 to-yellow-800'
    }
    return gradients[type] || 'from-gray-600 to-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Real-time Entity Extraction */}
      <div className={`bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6 transition-all ${
        showExtraction ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            ML Entity Extraction
          </h3>
          {showExtraction && (
            <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>
        
        {entities.length > 0 ? (
          <div className="space-y-3">
            {entities.map((entity, idx) => (
              <div 
                key={idx} 
                className="animate-slide-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{entity.type}</span>
                  <span className="text-xs text-green-400">{entity.confidence}% confidence</span>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getEntityGradient(entity.type)}`}>
                  <p className="text-white font-medium">{entity.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Entities will appear here as you chat</p>
          </div>
        )}
      </div>

      {/* AI Processing Pipeline */}
      <div className="bg-black bg-opacity-30 backdrop-blur-lg rounded-2xl border border-purple-500/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Processing Pipeline
        </h3>
        
        <div className="space-y-3">
          <PipelineStep 
            name="Natural Language Understanding" 
            status={isTyping ? 'active' : entities.length > 0 ? 'complete' : 'waiting'} 
          />
          <PipelineStep 
            name="Entity Recognition (spaCy)" 
            status={aiThinking ? 'active' : entities.length > 0 ? 'complete' : 'waiting'} 
          />
          <PipelineStep 
            name="Intent Classification" 
            status={aiThinking ? 'active' : entities.length > 0 ? 'complete' : 'waiting'} 
          />
          <PipelineStep 
            name="Context Analysis" 
            status={isTyping && !aiThinking ? 'active' : entities.length > 0 ? 'complete' : 'waiting'} 
          />
          <PipelineStep 
            name="Response Generation (LLM)" 
            status={isTyping && !aiThinking ? 'active' : entities.length > 0 ? 'complete' : 'waiting'} 
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <h3 className="text-lg font-semibold mb-3">Demo Actions</h3>
        <div className="space-y-2">
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all text-left">
            🎯 Show Venue Recommendations
          </button>
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all text-left">
            📊 View Analytics Dashboard
          </button>
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all text-left">
            💾 Export Event Details
          </button>
        </div>
      </div>
    </div>
  )
}

const PipelineStep: React.FC<{ name: string; status: 'waiting' | 'active' | 'complete' }> = ({ name, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <div className="w-4 h-4 rounded-full border border-gray-600" />
    }
  }
  
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-yellow-900/30 border-yellow-500/50'
      case 'complete':
        return 'bg-green-900/30 border-green-500/50'
      default:
        return 'bg-gray-800/30 border-gray-700/50'
    }
  }
  
  return (
    <div className={`p-3 rounded-lg border ${getStatusColor()} transition-all`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">{name}</span>
        {getStatusIcon()}
      </div>
    </div>
  )
}

export default EntityPanel