export interface StartupAnalysis {
  isValid: boolean
  sanitizedInput: string
  satiricalFeedback?: string

  scores: {
    marketSize: number
    competition: number
    feasibility: number
    monetization: number
    scalability: number
    overall: number
  }

  pros: string[]
  cons: string[]
  benchmarkComparison: string

  improvements: {
    productMarketFit: string[]
    branding: string[]
    pricing: string[]
    mvpFeatures: string[]
  }

  fundingStrategy: {
    investorTypes: string[]
    pitchOutline: string[]
    specificInvestors: string[]
    networkingTips: string[]
    timeline: string
  }

  launchPlan: {
    earlyAdopters: string[]
    launchPlatforms: string[]
    communityBuilding: string[]
    keyMetrics: string[]
    ninetyDayPlan: string[]
  }
}

export interface ChainStepResult {
  stepName: string
  success: boolean
  data?: any
  error?: string
  processingTime?: number
}

export interface ChainContext {
  originalInput: string
  currentStep: number
  stepResults: ChainStepResult[]
  startTime: number
}
