import { ExtractedEntity } from '@/types'

// Client-side entity extraction for immediate feedback
export const extractEntities = async (text: string): Promise<ExtractedEntity[]> => {
  const entities: ExtractedEntity[] = []
  const input = text.toLowerCase()
  
  // Event type detection
  const eventTypes = {
    'conference': { text: 'conference', confidence: 98 },
    'kickoff': { text: 'sales kickoff', confidence: 96 },
    'retreat': { text: 'retreat', confidence: 95 },
    'workshop': { text: 'workshop', confidence: 94 },
    'training': { text: 'training', confidence: 93 },
    'launch': { text: 'product launch', confidence: 95 }
  }
  
  for (const [key, value] of Object.entries(eventTypes)) {
    if (input.includes(key)) {
      entities.push({
        text: value.text,
        type: 'EVENT_TYPE',
        confidence: value.confidence
      })
      break
    }
  }
  
  // Numbers detection
  const numberMatch = input.match(/(\d+)\s*(?:people|attendees|participants|developers|leaders|employees)/)
  if (numberMatch) {
    entities.push({
      text: `${numberMatch[1]} attendees`,
      type: 'ATTENDEE_COUNT',
      confidence: 99
    })
  }
  
  // Location detection
  const locations = [
    'san francisco', 'new york', 'chicago', 'napa valley', 
    'las vegas', 'miami', 'seattle', 'austin', 'boston'
  ]
  
  for (const location of locations) {
    if (input.includes(location)) {
      entities.push({
        text: location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type: 'LOCATION',
        confidence: 97
      })
      break
    }
  }
  
  // Budget detection
  const budgetMatch = input.match(/\$[\d,]+k?|\$[\d,]+(?:,\d{3})*(?:\.\d{2})?/)
  if (budgetMatch) {
    entities.push({
      text: budgetMatch[0],
      type: 'BUDGET',
      confidence: 95
    })
  }
  
  // Date detection
  const datePatterns = [
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:-\d{1,2})?/i,
    /\d{1,2}\/\d{1,2}(?:\/\d{2,4})?/,
    /\d+-day/,
    /next\s+(week|month|quarter)/
  ]
  
  for (const pattern of datePatterns) {
    const match = input.match(pattern)
    if (match) {
      entities.push({
        text: match[0],
        type: 'DATE',
        confidence: 93
      })
      break
    }
  }
  
  // Services detection
  const services = [
    { pattern: /breakout\s*rooms?/, text: 'breakout rooms' },
    { pattern: /av\s*equipment|audio\s*visual/, text: 'AV equipment' },
    { pattern: /catering|meals?|breakfast|lunch|dinner/, text: 'catering services' },
    { pattern: /hotel|accommodation|lodging/, text: 'hotel accommodations' }
  ]
  
  for (const service of services) {
    if (service.pattern.test(input)) {
      entities.push({
        text: service.text,
        type: 'SERVICES',
        confidence: 92
      })
    }
  }
  
  return entities
}

// Generate contextual AI response
export const getAIResponse = (entities: ExtractedEntity[]): string => {
  const foundTypes = new Set(entities.map(e => e.type))
  const responses: string[] = []
  
  // Acknowledge what was found
  if (foundTypes.has('EVENT_TYPE')) {
    const event = entities.find(e => e.type === 'EVENT_TYPE')
    responses.push(`Excellent choice! A ${event?.text} is a great way to bring your team together.`)
  }
  
  if (foundTypes.has('ATTENDEE_COUNT')) {
    const count = entities.find(e => e.type === 'ATTENDEE_COUNT')
    responses.push(`Planning for ${count?.text} - I'll help you find the perfect setup.`)
  }
  
  if (foundTypes.has('LOCATION')) {
    const location = entities.find(e => e.type === 'LOCATION')
    responses.push(`${location?.text} has fantastic venue options!`)
  }
  
  // Ask for missing information
  const missing: string[] = []
  if (!foundTypes.has('EVENT_TYPE')) {
    missing.push("What type of event are you planning?")
  } else if (!foundTypes.has('ATTENDEE_COUNT')) {
    missing.push("How many people will be attending?")
  } else if (!foundTypes.has('LOCATION')) {
    missing.push("Where would you like to host this event?")
  } else if (!foundTypes.has('DATE')) {
    missing.push("When are you planning to hold this event?")
  }
  
  let response = responses.join(' ')
  if (missing.length > 0) {
    response += `\n\n${missing[0]}`
  } else {
    response += "\n\n✨ I have all the key details! Let me recommend some excellent venues and create a comprehensive event plan for you."
  }
  
  return response
}