# AIME Pro - AI Event Planning Assistant

🎉 An AI-powered event planning assistant that uses natural language processing to understand event requirements and provide intelligent recommendations.

![AIME Pro Demo](https://img.shields.io/badge/Demo-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC)

## 🚀 Features

- **Natural Language Processing**: Extract event details from conversational input
- **Real-time Entity Extraction**: See AI understanding in action
- **ML-Powered Recommendations**: Get venue and service suggestions
- **Smart Conversation Flow**: Context-aware follow-up questions
- **Beautiful UI**: Modern, responsive design with smooth animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **AI/ML**: Groq API (LLaMA 3.3), Custom NLP algorithms
- **State Management**: React Hooks
- **Deployment**: Vercel

## 📦 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/pkumv1/aime-pro-event-planner&env=GROQ_API_KEY&envDescription=API%20keys%20needed%20for%20AI%20functionality&envLink=https://console.groq.com)

## 🔧 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/pkumv1/aime-pro-event-planner.git
   cd aime-pro-event-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Your Groq API key for LLM |
| `OPENAI_API_KEY` | No | Fallback OpenAI API key |
| `DEMO_MODE` | No | Enable demo optimizations |
| `KV_*` | No | Vercel KV credentials for caching |

## 📚 API Documentation

### Chat Endpoint
```typescript
POST /api/chat
{
  "message": "I need to plan a tech conference for 500 people",
  "entities": [] // Optional: pre-extracted entities
}

Response:
{
  "response": "Great! A tech conference for 500 people...",
  "entities": [
    {
      "text": "tech conference",
      "type": "EVENT_TYPE",
      "confidence": 98
    }
  ]
}
```

## 🎯 Key Features Explained

### Entity Extraction
The app uses advanced NLP to extract:
- Event types (conference, kickoff, retreat, etc.)
- Attendee counts
- Locations
- Dates
- Budget information
- Service requirements

### Real-time Processing
- Sub-200ms response times
- Live entity highlighting
- Confidence scoring
- Processing pipeline visualization

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📈 Performance Optimization

- Client-side entity extraction for instant feedback
- Optimized bundle size with dynamic imports
- Edge runtime compatibility
- Efficient state management

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Groq for the amazing LLM API
- Next.js team for the fantastic framework
- The open-source community

---

**Built with ❤️ for the future of event planning**