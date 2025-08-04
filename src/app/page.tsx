'use client'

import React, { useState } from 'react'
import { StartupAnalysis } from '@/lib/types'
import { Loading } from '@/components/ui/loading'
import { motion, AnimatePresence } from 'framer-motion'
import { div } from 'framer-motion/client'

type PlanAction =
  | string
  | {
      timeline: string
      actions: string
    }

// Type guard for PlanAction
const isDetailed = (
  a: PlanAction
): a is { timeline: string; actions: string } =>
  typeof a !== 'string' && 'timeline' in a && 'actions' in a

export default function StartupMaturityEngine() {
  const [startupIdea, setStartupIdea] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<StartupAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const handleAnalyze = async () => {
    setError(null)
    setAnalysis(null)
    setIsAnalyzing(true)
    setCurrentStep(1)

    try {
      const progressInterval = setInterval(() => {
        setCurrentStep(prev => (prev < 5 ? prev + 1 : prev))
      }, 3000)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startupIdea }),
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setAnalysis(data.analysis)
      setCurrentStep(5)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    if (score >= 4) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 8) return '🚀'
    if (score >= 6) return '👍'
    if (score >= 4) return '⚠️'
    return '❌'
  }

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      {/* Header Section */}
      <motion.div
        className='container mx-auto px-4 py-8'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
      >
        {!analysis && (
          <motion.div
            className='text-center mb-12'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h1 className='text-5xl font-bold text-gray-900 mb-4'>
              🚀 Startup Maturity Engine
            </h1>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              Transform your raw startup idea into a comprehensive business
              analysis with AI-powered insights, investment strategies, and
              actionable launch plans.
            </p>
          </motion.div>
        )}

        {!analysis && !isAnalyzing && (
          <>
            {/* Input Section */}
            <motion.div
              className='max-w-4xl mx-auto mb-12'
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
            >
              <div className='bg-white rounded-2xl shadow-xl p-8'>
                <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
                  📝 Describe Your Startup Idea
                </h2>

                <textarea
                  value={startupIdea}
                  onChange={e => setStartupIdea(e.target.value)}
                  placeholder="Describe your startup idea in detail. Include what problem it solves, who your target customers are, how it works, and what makes it unique. The more detail you provide, the better analysis you'll receive.

Example: 'A mobile app that uses AI to help people meal plan based on their dietary restrictions, budget, and local grocery store prices. Users can scan receipts to track spending and get personalized recipe recommendations that minimize food waste...'"
                  className='w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500'
                  disabled={isAnalyzing}
                />

                <div className='flex justify-between items-center mt-4'>
                  <span className='text-sm text-gray-900'>
                    {startupIdea.length}/2000 characters
                  </span>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || startupIdea.trim().length < 10}
                    className='px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                  >
                    {isAnalyzing ? 'Analyzing...' : '🔍 Analyze My Startup'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Loading Section */}
        {isAnalyzing && (
          <motion.div
            className='max-w-4xl mx-auto mb-12'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <Loading currentStep={currentStep} totalSteps={5} />
          </motion.div>
        )}

        {/* Error Section */}
        {error && (
          <motion.div
            className='max-w-4xl mx-auto mb-12'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
          >
            <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
              <div className='flex items-center'>
                <span className='text-2xl mr-3'>❌</span>
                <div>
                  <h3 className='text-lg font-semibold text-red-800'>
                    Analysis Failed
                  </h3>
                  <p className='text-red-600 mt-1'>{error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        <AnimatePresence mode='popLayout'>
          {analysis && (
            <motion.div
              className='max-w-6xl mx-auto space-y-8'
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, y: 40, transition: { duration: 0.2 } }}
              transition={{ duration: 0.3 }}
              key='results-section'
            >
              {/* Satirical Feedback for Invalid Ideas */}
              {!analysis.isValid && analysis.satiricalFeedback && (
                <motion.div
                  className='bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8'
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fadeInUp}
                >
                  <div className='text-center'>
                    <span className='text-6xl mb-4 block'>🎭</span>
                    <h2 className='text-2xl font-bold text-purple-800 mb-4'>
                      Well, That is... Creative! 🎨
                    </h2>
                    <p className='text-lg text-purple-700 italic'>
                      {analysis.satiricalFeedback}
                    </p>
                    <div className='mt-6 p-4 bg-white rounded-lg'>
                      <p className='text-gray-600'>
                        💡 Ready to try again with a real startup idea? We are
                        here to help you build the next unicorn! 🦄
                      </p>
                    </div>
                    {/* add a button to try again */}
                    <button
                      onClick={() => {
                        setAnalysis(null)
                        setStartupIdea('')
                      }}
                      className='px-8 py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Valid Analysis Results */}
              {analysis.isValid && (
                <>
                  {/* Executive Summary */}
                  <motion.div
                    className='bg-white rounded-2xl shadow-xl p-8'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    <h2 className='text-3xl font-bold text-gray-800 mb-6'>
                      📊 Executive Summary
                    </h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                      {Object.entries(analysis.scores).map(([key, score]) => {
                        if (key === 'overall') return null // Handle overall separately
                        const formattedKey = key
                          .replace(/([A-Z])/g, ' $1')
                          .replace(/^./, str => str.toUpperCase())

                        return (
                          <div key={key} className='text-center'>
                            <div
                              className={`inline-flex items-center px-4 py-2 rounded-full ${getScoreColor(
                                score
                              )}`}
                            >
                              <span className='text-2xl mr-2'>
                                {getScoreEmoji(score)}
                              </span>
                              <span className='font-bold text-lg'>
                                {score.toFixed(1)}/10
                              </span>
                            </div>
                            <p className='text-sm text-gray-600 mt-2 font-medium'>
                              {formattedKey}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Overall Score */}
                    <div className='text-center mb-8'>
                      <div className='inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-2xl'>
                        <div className='text-4xl font-bold'>
                          {getScoreEmoji(analysis.scores.overall)}{' '}
                          {analysis.scores.overall.toFixed(1)}/10
                        </div>
                        <div className='text-lg font-medium mt-2'>
                          Overall Startup Score
                        </div>
                      </div>
                    </div>

                    {/* Benchmark Comparison */}
                    <div className='bg-gray-50 rounded-lg p-6'>
                      <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                        🏆 Benchmark Analysis
                      </h3>
                      <p className='text-gray-700'>
                        {analysis.benchmarkComparison}
                      </p>
                    </div>
                  </motion.div>

                  {/* Pros and Cons */}
                  <motion.div
                    className='grid grid-cols-1 lg:grid-cols-2 gap-8'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    {/* Pros */}
                    <div className='bg-green-50 rounded-2xl shadow-xl p-8'>
                      <h2 className='text-2xl font-bold text-green-800 mb-6'>
                        ✅ Strengths & Opportunities
                      </h2>
                      <div className='space-y-4'>
                        {analysis.pros.map((pro, index) => (
                          <div key={index} className='flex items-start'>
                            <span className='text-green-500 text-xl mr-3 mt-1'>
                              🌟
                            </span>
                            <p className='text-green-700'>{pro}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cons */}
                    <div className='bg-red-50 rounded-2xl shadow-xl p-8'>
                      <h2 className='text-2xl font-bold text-red-800 mb-6'>
                        ⚠️ Challenges & Risks
                      </h2>
                      <div className='space-y-4'>
                        {analysis.cons.map((con, index) => (
                          <div key={index} className='flex items-start'>
                            <span className='text-red-500 text-xl mr-3 mt-1'>
                              🔍
                            </span>
                            <p className='text-red-700'>{con}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Strategic Improvements */}
                  <motion.div
                    className='bg-white rounded-2xl shadow-xl p-8'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    <h2 className='text-3xl font-bold text-gray-800 mb-8'>
                      💡 Strategic Improvements
                    </h2>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      {/* Product-Market Fit */}
                      <div className='space-y-4'>
                        <h3 className='text-xl font-semibold text-blue-800 flex items-center'>
                          🎯 Product-Market Fit
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.improvements.productMarketFit.map(
                            (item, index) => (
                              <li key={index} className='flex items-start'>
                                <span className='text-blue-500 mr-2'>▸</span>
                                <span className='text-gray-700'>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Branding */}
                      <div className='space-y-4'>
                        <h3 className='text-xl font-semibold text-purple-800 flex items-center'>
                          🎨 Branding & Positioning
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.improvements.branding.map((item, index) => (
                            <li key={index} className='flex items-start'>
                              <span className='text-purple-500 mr-2'>▸</span>
                              <span className='text-gray-700'>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pricing */}
                      <div className='space-y-4'>
                        <h3 className='text-xl font-semibold text-green-800 flex items-center'>
                          💰 Pricing Strategy
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.improvements.pricing.map((item, index) => (
                            <li key={index} className='flex items-start'>
                              <span className='text-green-500 mr-2'>▸</span>
                              <span className='text-gray-700'>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* MVP Features */}
                      <div className='space-y-4'>
                        <h3 className='text-xl font-semibold text-orange-800 flex items-center'>
                          🔧 MVP Features
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.improvements.mvpFeatures.map(
                            (item, index) => (
                              <li key={index} className='flex items-start'>
                                <span className='text-orange-500 mr-2'>▸</span>
                                <span className='text-gray-700'>{item}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Funding Strategy */}
                  <motion.div
                    className='bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    <h2 className='text-3xl font-bold text-indigo-800 mb-8'>
                      💎 Investment & Funding Strategy
                    </h2>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      {/* Investor Types */}
                      <div className='bg-white rounded-lg p-6'>
                        <h3 className='text-xl font-semibold text-indigo-700 mb-4'>
                          🎯 Target Investors
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.fundingStrategy.investorTypes.map(
                            (type, index) => (
                              <li key={index} className='flex items-start'>
                                <span className='text-indigo-500 mr-2'>•</span>
                                <span className='text-gray-700'>{type}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Specific Investors */}
                      <div className='bg-white rounded-lg p-6'>
                        <h3 className='text-xl font-semibold text-purple-700 mb-4'>
                          🏢 Recommended Investors
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.fundingStrategy.specificInvestors.map(
                            (investor, index) => {
                              if (typeof investor === 'string') {
                                return (
                                  <li key={index} className='flex items-start'>
                                    <span className='text-purple-500 mr-2'>
                                      •
                                    </span>
                                    <span className='text-gray-700'>
                                      {investor}
                                    </span>
                                  </li>
                                )
                              } else {
                                return null
                              }
                            }
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Pitch Outline */}
                    <div className='mt-8 bg-white rounded-lg p-6'>
                      <h3 className='text-xl font-semibold text-indigo-700 mb-4'>
                        📈 Pitch Deck Outline
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {analysis.fundingStrategy.pitchOutline.map(
                          (slide, index) => (
                            <div
                              key={index}
                              className='flex items-center p-3 bg-gray-50 rounded-lg'
                            >
                              <span className='bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3'>
                                {index + 1}
                              </span>
                              <span className='text-gray-700'>{slide}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Networking Tips */}
                    <div className='mt-8 bg-white rounded-lg p-6'>
                      <h3 className='text-xl font-semibold text-purple-700 mb-4'>
                        🤝 Networking Strategy
                      </h3>
                      <ul className='space-y-3'>
                        {analysis.fundingStrategy.networkingTips.map(
                          (tip, index) => (
                            <li key={index} className='flex items-start'>
                              <span className='text-purple-500 text-lg mr-3'>
                                💡
                              </span>
                              <span className='text-gray-700'>{tip}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Timeline */}
                    <div className='mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-6'>
                      <h3 className='text-xl font-semibold text-indigo-800 mb-4'>
                        ⏰ Funding Timeline
                      </h3>
                      <p className='text-indigo-700 text-lg'>
                        {typeof analysis.fundingStrategy.timeline === 'string'
                          ? analysis.fundingStrategy.timeline
                          : Array.isArray(analysis.fundingStrategy.timeline)
                          ? (
                              analysis.fundingStrategy.timeline as string[]
                            ).join(', ')
                          : analysis.fundingStrategy.timeline &&
                            typeof analysis.fundingStrategy.timeline ===
                              'object'
                          ? Object.entries(
                              analysis.fundingStrategy.timeline
                            ).map(([month, desc]) => (
                              <span key={month}>
                                <strong>{month}:</strong> {desc as string}
                              </span>
                            ))
                          : null}
                      </p>
                    </div>
                  </motion.div>

                  {/* Launch Plan */}
                  <motion.div
                    className='bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-xl p-8'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    <h2 className='text-3xl font-bold text-orange-800 mb-8'>
                      🚀 Launch & Growth Strategy
                    </h2>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                      {/* Early Adopters */}
                      <div className='bg-white rounded-lg p-6'>
                        <h3 className='text-xl font-semibold text-orange-700 mb-4'>
                          👥 Early Adopter Channels
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.launchPlan.earlyAdopters.map(
                            (channel, index) => (
                              <li key={index} className='flex items-start'>
                                <span className='text-orange-500 mr-2'>▸</span>
                                <span className='text-gray-700'>{channel}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Launch Platforms */}
                      <div className='bg-white rounded-lg p-6'>
                        <h3 className='text-xl font-semibold text-red-700 mb-4'>
                          📢 Launch Platforms
                        </h3>
                        <ul className='space-y-2'>
                          {analysis.launchPlan.launchPlatforms.map(
                            (platform, index) => (
                              <li key={index} className='flex items-start'>
                                <span className='text-red-500 mr-2'>▸</span>
                                <span className='text-gray-700'>
                                  {platform}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Community Building */}
                    <div className='mt-8 bg-white rounded-lg p-6'>
                      <h3 className='text-xl font-semibold text-orange-700 mb-4'>
                        🌟 Community Building
                      </h3>
                      <ul className='space-y-3'>
                        {analysis.launchPlan.communityBuilding.map(
                          (strategy, index) => (
                            <li key={index} className='flex items-start'>
                              <span className='text-orange-500 text-lg mr-3'>
                                🎯
                              </span>
                              <span className='text-gray-700'>{strategy}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Key Metrics */}
                    <div className='mt-8 bg-white rounded-lg p-6'>
                      <h3 className='text-xl font-semibold text-red-700 mb-4'>
                        📊 Key Metrics to Track
                      </h3>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {analysis.launchPlan.keyMetrics.map((metric, index) => (
                          <div
                            key={index}
                            className='flex items-center p-3 bg-gray-50 rounded-lg'
                          >
                            <span className='text-red-500 text-lg mr-3'>
                              📈
                            </span>
                            <span className='text-gray-700'>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 90-Day Plan */}
                    <div className='mt-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6'>
                      <h3 className='text-xl font-semibold text-orange-800 mb-6'>
                        📅 90-Day Action Plan
                      </h3>
                      <div className='space-y-4'>
                        {(
                          analysis.launchPlan.ninetyDayPlan as PlanAction[]
                        ).map((action, index) => {
                          if (typeof action === 'string') {
                            return (
                              <div
                                key={index}
                                className='flex items-start p-4 bg-white rounded-lg shadow-sm'
                              >
                                <span className='bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0'>
                                  {index + 1}
                                </span>
                                <span className='text-gray-700'>{action}</span>
                              </div>
                            )
                          }
                          if (isDetailed(action)) {
                            return (
                              <div
                                key={index}
                                className='flex flex-col items-start p-4 bg-white rounded-lg shadow-sm'
                              >
                                <span className='bg-orange-100 text-orange-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0'>
                                  {index + 1}
                                </span>
                                <span className='text-gray-700 font-semibold'>
                                  {action.timeline}
                                </span>
                                <span className='text-gray-500 text-sm'>
                                  {action.actions}
                                </span>
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Call to Action */}
                  <motion.div
                    className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl p-8 text-center'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                  >
                    <h2 className='text-3xl font-bold mb-4'>
                      🎉 Ready to Build Your Startup?
                    </h2>
                    <p className='text-xl mb-6'>
                      You now have a comprehensive roadmap to turn your idea
                      into a successful business. The journey of a thousand
                      miles begins with a single step! 🚀
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                      <button
                        onClick={() => {
                          setAnalysis(null)
                          setStartupIdea('')
                        }}
                        className='px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
                      >
                        🔄 Analyze Another Idea
                      </button>
                      <button
                        onClick={() => window.print()}
                        className='px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors cursor-pointer'
                      >
                        📄 Save This Analysis
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
