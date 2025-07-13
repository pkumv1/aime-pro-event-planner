import React, { useState } from 'react'

interface DemoScenariosProps {
  onSelectScenario: (starter: string) => void
}

const DemoScenarios: React.FC<DemoScenariosProps> = ({ onSelectScenario }) => {
  const [currentDemo, setCurrentDemo] = useState(0)
  
  const demoScenarios = [
    {
      name: "Tech Conference",
      starter: "I need to organize a tech conference for 500 developers in San Francisco"
    },
    {
      name: "Sales Kickoff",
      starter: "Planning our annual sales kickoff for 200 people, budget around $150k"
    },
    {
      name: "Executive Retreat",
      starter: "We want a 3-day executive retreat in Napa Valley for 25 leaders"
    }
  ]

  const handleScenarioClick = (scenario: typeof demoScenarios[0], idx: number) => {
    setCurrentDemo(idx)
    onSelectScenario(scenario.starter)
  }

  return (
    <div className="bg-purple-900/20 p-4 border-b border-purple-500/20">
      <p className="text-sm text-purple-300 mb-2">Quick Demo Scenarios:</p>
      <div className="flex gap-2 flex-wrap">
        {demoScenarios.map((scenario, idx) => (
          <button
            key={idx}
            onClick={() => handleScenarioClick(scenario, idx)}
            className={`px-3 py-1 rounded-lg text-sm transition-all ${
              currentDemo === idx 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-800/30 text-purple-300 hover:bg-purple-800/50'
            }`}
          >
            {scenario.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DemoScenarios