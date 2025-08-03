import Groq from 'groq-sdk'
import { StartupAnalysis, ChainContext, ChainStepResult } from './types'

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Model configuration
const MODEL_CONFIG = {
  // model: 'moonshotai/kimi-k2-instruct',
  model: 'deepseek-r1-distill-llama-70b',
  temperature: 0.7,
  max_tokens: 2048,
  stream: false,
}

// Modern Groq API call with JSON mode support
async function callGroq(
  prompt: string,
  variables: Record<string, any>
): Promise<string> {
  try {
    const jsonPrompt = `${prompt}\n\nRespond ONLY with valid JSON. Do not include markdown or any other formatting.`

    const finalPrompt = Object.entries(variables).reduce(
      (str, [key, value]) =>
        str.replace(
          new RegExp(`{${key}}`, 'g'),
          typeof value === 'string' ? value : JSON.stringify(value)
        ),
      jsonPrompt
    )

    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: finalPrompt }],
      ...MODEL_CONFIG,
      response_format: { type: 'json_object' },
    })

    // Handle both streaming and non-streaming response types
    if ('choices' in response) {
      // Non-streaming response (ChatCompletion)
      return response.choices[0]?.message.content || ''
    } else {
      // Streaming response (Stream) - we don't use this but need to handle types
      throw new Error('Streaming response not supported in this implementation')
    }
  } catch (error) {
    console.error('Groq API error:', error)
    throw new Error(
      `Groq API failure: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
  }
}

// Step Prompts ===============================================================

const VALIDATION_PROMPT = `
As a startup validation expert, analyze this input to determine if it's a legitimate startup idea or nonsense:

Input: {input}

Your task:
1. Determine if this is a real business idea worth analyzing
2. If nonsense, provide witty but professional satirical feedback
3. Clean and clarify valid inputs
4. Extract core business concept, target market, and value proposition

Respond in this JSON format:
{
  "isValid": boolean,
  "sanitizedInput": "cleaned version",
  "satiricalFeedback": "funny response or null",
  "coreBusinessConcept": "brief summary",
  "targetMarket": "customer description",
  "valueProposition": "unique value offered"
}`

const SCORING_PROMPT = `
As a venture capital analyst, provide comprehensive assessment of:

Startup Idea: {sanitizedInput}
Core Concept: {coreBusinessConcept}
Target Market: {targetMarket}
Value Proposition: {valueProposition}

Rate each dimension (0-10, 10=exceptional):
- Market Size: Addressable market size
- Competition: Competitive landscape favorability (10=low competition)
- Feasibility: Execution realism
- Monetization: Revenue potential
- Scalability: Growth potential

Provide detailed analysis in JSON:
{
  "scores": {
    "marketSize": number,
    "competition": number,
    "feasibility": number,
    "monetization": number,
    "scalability": number,
    "overall": number (weighted average)
  },
  "pros": ["4-6 specific strengths"],
  "cons": ["4-6 specific challenges"],
  "benchmarkComparison": "Comparison to successful startups"
}`

const IMPROVEMENT_PROMPT = `
As a startup strategy consultant, suggest improvements for:

Idea: {sanitizedInput}
Overall Score: {overallScore}/10
Strengths: {pros}
Challenges: {cons}

Provide strategic improvements in JSON:
{
  "improvements": {
    "productMarketFit": ["4-5 ways to better serve market"],
    "branding": ["4-5 positioning recommendations"],
    "pricing": ["3-4 pricing strategy options"],
    "mvpFeatures": ["5-6 must-have MVP features"]
  }
}`

const FUNDING_PROMPT = `
As a fundraising expert ($500M+ raised), create strategy for:

Idea: {sanitizedInput}
Overall Score: {overallScore}/10
Market Size: {marketSize}/10
Scalability: {scalability}/10
Strategic Focus: {improvements}

Respond in JSON:
{
  "fundingStrategy": {
    "investorTypes": ["specific investor types"],
    "pitchOutline": ["8-10 pitch deck elements"],
    "specificInvestors": ["5-7 named investors with reasoning"],
    "networkingTips": ["4-5 introduction strategies"],
    "timeline": "fundraising timeline with milestones"
  }
}`

const LAUNCH_PROMPT = `
As a growth marketing expert, create launch plan for:

Idea: {sanitizedInput}
Target Market: {targetMarket}
Value Proposition: {valueProposition}
Strategic Improvements: {improvements}
Funding Strategy: {fundingStrategy}

Respond in JSON:
{
  "launchPlan": {
    "earlyAdopters": ["5-6 channels for first 100 users"],
    "launchPlatforms": ["4-5 announcement platforms"],
    "communityBuilding": ["4-5 engagement strategies"],
    "keyMetrics": ["6-8 essential KPIs"],
    "ninetyDayPlan": ["10-12 action items with timelines"]
  }
}`

// Execution Utilities

async function executeChainStep(
  prompt: string,
  input: Record<string, any>,
  stepName: string,
  context: ChainContext
): Promise<ChainStepResult> {
  const startTime = Date.now()

  try {
    console.log(`Starting ${stepName}...`)

    const result = await Promise.race([
      callGroq(prompt, input),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout after 30 seconds')), 30000)
      ),
    ])

    // Parse JSON directly
    const parsedData = JSON.parse(result)

    console.log(`${stepName} completed in ${Date.now() - startTime}ms`)
    return {
      stepName,
      success: true,
      data: parsedData,
      processingTime: Date.now() - startTime,
    }
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error'
    console.error(`${stepName} failed:`, errorMsg)

    return {
      stepName,
      success: false,
      error: errorMsg,
      processingTime: Date.now() - startTime,
    }
  }
}

// Main Orchestrator

export async function analyzeStartupIdea(
  input: string,
  onProgress?: (step: number, stepName: string) => void
): Promise<StartupAnalysis> {
  const context: ChainContext = {
    originalInput: input.trim(),
    currentStep: 0,
    stepResults: [],
    startTime: Date.now(),
  }

  // Validate input
  if (context.originalInput.length < 10) {
    throw new Error(
      'Please provide a more detailed startup description (min 10 chars)'
    )
  }

  try {
    // Step 1: Validation
    context.currentStep = 1
    onProgress?.(1, 'Validating idea')
    const validationResult = await executeChainStep(
      VALIDATION_PROMPT,
      { input: context.originalInput },
      'Validation',
      context
    )
    if (!validationResult.success) throw validationResult.error
    context.stepResults.push(validationResult)

    // Handle invalid ideas early
    if (!validationResult.data.isValid) {
      return {
        isValid: false,
        sanitizedInput: context.originalInput,
        satiricalFeedback: validationResult.data.satiricalFeedback,
        scores: {
          marketSize: 0,
          competition: 0,
          feasibility: 0,
          monetization: 0,
          scalability: 0,
          overall: 0,
        },
        pros: [],
        cons: [],
        benchmarkComparison: '',
        improvements: {
          productMarketFit: [],
          branding: [],
          pricing: [],
          mvpFeatures: [],
        },
        fundingStrategy: {
          investorTypes: [],
          pitchOutline: [],
          specificInvestors: [],
          networkingTips: [],
          timeline: '',
        },
        launchPlan: {
          earlyAdopters: [],
          launchPlatforms: [],
          communityBuilding: [],
          keyMetrics: [],
          ninetyDayPlan: [],
        },
      }
    }

    // Step 2: Scoring
    context.currentStep = 2
    onProgress?.(2, 'Analyzing potential')
    const scoringResult = await executeChainStep(
      SCORING_PROMPT,
      {
        sanitizedInput: validationResult.data.sanitizedInput,
        coreBusinessConcept: validationResult.data.coreBusinessConcept,
        targetMarket: validationResult.data.targetMarket,
        valueProposition: validationResult.data.valueProposition,
      },
      'Scoring',
      context
    )
    if (!scoringResult.success) throw scoringResult.error
    context.stepResults.push(scoringResult)

    // Step 3: Improvements
    context.currentStep = 3
    onProgress?.(3, 'Generating improvements')
    const improvementResult = await executeChainStep(
      IMPROVEMENT_PROMPT,
      {
        sanitizedInput: validationResult.data.sanitizedInput,
        overallScore: scoringResult.data.scores.overall,
        pros: scoringResult.data.pros,
        cons: scoringResult.data.cons,
      },
      'Improvements',
      context
    )
    if (!improvementResult.success) throw improvementResult.error
    context.stepResults.push(improvementResult)

    // Step 4: Funding Strategy
    context.currentStep = 4
    onProgress?.(4, 'Planning funding')
    const fundingResult = await executeChainStep(
      FUNDING_PROMPT,
      {
        sanitizedInput: validationResult.data.sanitizedInput,
        overallScore: scoringResult.data.scores.overall,
        marketSize: scoringResult.data.scores.marketSize,
        scalability: scoringResult.data.scores.scalability,
        improvements: improvementResult.data.improvements,
      },
      'Funding',
      context
    )
    if (!fundingResult.success) throw fundingResult.error
    context.stepResults.push(fundingResult)

    // Step 5: Launch Plan
    context.currentStep = 5
    onProgress?.(5, 'Creating launch strategy')
    const launchResult = await executeChainStep(
      LAUNCH_PROMPT,
      {
        sanitizedInput: validationResult.data.sanitizedInput,
        targetMarket: validationResult.data.targetMarket,
        valueProposition: validationResult.data.valueProposition,
        improvements: improvementResult.data.improvements,
        fundingStrategy: fundingResult.data.fundingStrategy,
      },
      'Launch',
      context
    )
    if (!launchResult.success) throw launchResult.error
    context.stepResults.push(launchResult)

    // Final compilation
    console.log(`Analysis completed in ${Date.now() - context.startTime}ms`)
    return {
      isValid: true,
      sanitizedInput: validationResult.data.sanitizedInput,
      scores: scoringResult.data.scores,
      pros: scoringResult.data.pros,
      cons: scoringResult.data.cons,
      benchmarkComparison: scoringResult.data.benchmarkComparison,
      improvements: improvementResult.data.improvements,
      fundingStrategy: fundingResult.data.fundingStrategy,
      launchPlan: launchResult.data.launchPlan,
    }
  } catch (error: any) {
    const step = context.currentStep
    const stepName =
      ['Validation', 'Scoring', 'Improvements', 'Funding', 'Launch'][
        step - 1
      ] || 'Unknown'
    throw new Error(
      `[Step ${step} ${stepName}] ${error.message || 'Unknown error'}`
    )
  }
}
