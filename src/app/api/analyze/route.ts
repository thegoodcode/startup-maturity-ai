import { NextRequest, NextResponse } from 'next/server'
import { analyzeStartupIdea } from '@/lib/startup-chain'
import { StartupAnalysis } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { startupIdea } = body

    // Input validation
    if (!startupIdea || typeof startupIdea !== 'string') {
      return NextResponse.json(
        {
          error:
            'Missing or invalid startup idea. Please provide a description of your startup concept.',
          code: 'INVALID_INPUT',
        },
        { status: 400 }
      )
    }

    // Check for minimum length
    if (startupIdea.trim().length < 10) {
      return NextResponse.json(
        {
          error:
            'Startup idea description is too short. Please provide at least a few sentences describing your concept.',
          code: 'INPUT_TOO_SHORT',
        },
        { status: 400 }
      )
    }

    // Check for maximum length
    if (startupIdea.length > 2000) {
      return NextResponse.json(
        {
          error:
            'Startup idea description is too long. Please keep it under 2000 characters.',
          code: 'INPUT_TOO_LONG',
        },
        { status: 400 }
      )
    }

    // Validate environment configuration
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'Service configuration error. Please contact support.',
          code: 'CONFIGURATION_ERROR',
        },
        { status: 500 }
      )
    }

    // Execute the comprehensive startup analysis
    console.log(
      'Starting startup analysis for:',
      startupIdea.substring(0, 100) + '...'
    )

    const startTime = Date.now()

    // Execute the analysis with progress tracking
    const analysis: StartupAnalysis = await analyzeStartupIdea(
      startupIdea,
      (step: number, stepName: string) => {
        console.log(`Progress: Step ${step} - ${stepName}`)
        // In a streaming implementation, we could send these updates to the client
        // For now, we just log them for debugging purposes
      }
    )

    const processingTime = Date.now() - startTime
    console.log(`Analysis completed in ${processingTime}ms`)

    // Return the comprehensive analysis
    return NextResponse.json({
      success: true,
      analysis,
      metadata: {
        processingTime,
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
    })
  } catch (error) {
    console.error('Startup analysis failed:', error)

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          {
            error:
              'Analysis timed out. Please try again with a shorter description.',
            code: 'TIMEOUT_ERROR',
          },
          { status: 504 }
        )
      }

      if (error.message.includes('API key')) {
        return NextResponse.json(
          {
            error: 'Service temporarily unavailable. Please try again later.',
            code: 'API_KEY_ERROR',
          },
          { status: 503 }
        )
      }

      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          {
            error:
              'Too many requests. Please wait a moment before trying again.',
            code: 'RATE_LIMIT_ERROR',
          },
          { status: 429 }
        )
      }

      // Handle validation errors from our chain
      if (error.message.includes('failed at step')) {
        return NextResponse.json(
          {
            error: `Analysis encountered an error: ${error.message}`,
            code: 'CHAIN_ERROR',
          },
          { status: 422 }
        )
      }
    }

    return NextResponse.json(
      {
        error:
          'An unexpected error occurred during analysis. Please try again later.',
        code: 'UNKNOWN_ERROR',
        details:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Startup Maturity Engine API',
    version: '1.0',
    status: 'healthy',
    endpoints: {
      analyze: {
        method: 'POST',
        description: 'Analyze a startup idea with comprehensive AI evaluation',
        parameters: {
          startupIdea:
            'string (10-2000 characters) - Description of the startup concept',
        },
      },
    },
    rateLimit: {
      requests: '100 per hour per IP',
      burst: '10 per minute',
    },
    features: [
      'Input validation and sanitization',
      'Multi-dimensional scoring (market, competition, feasibility, etc.)',
      'Strategic improvement recommendations',
      'Investment and funding strategy',
      'Launch plan and growth tactics',
    ],
  })
}
