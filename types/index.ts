export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  animated?: boolean
}

export interface ExtractedEntity {
  text: string
  type: string
  confidence: number
}

export interface SessionStats {
  entitiesExtracted: number
  confidenceScore: number
  responseTime: number
}

export interface EventDetails {
  event_id?: string
  full_name?: string
  email?: string
  phone?: string
  company_name?: string
  event_name?: string
  event_type?: string
  event_start_date?: Date
  event_end_date?: Date
  duration_days?: number
  primary_location?: string
  alternate_location?: string
  attendee_count?: number
  attendee_audience?: string
  event_goal?: string
  budget?: string
  meeting_space_needed?: boolean
  room_setup?: string[]
  breakout_rooms?: number
  hotel_room_block?: boolean
  breakfast?: boolean
  lunch?: boolean
  dinner?: boolean
  projector_screen?: boolean
  wifi?: boolean
  microphone?: boolean
  special_requirements?: string
}