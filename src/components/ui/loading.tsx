interface LoadingProps {
  currentStep: number
  totalSteps: number
  message?: string
}

const STEP_DESCRIPTIONS = [
  '🔍 Analyzing and validating your startup idea...',
  '📊 Scoring market potential and competitive landscape...',
  '💡 Generating strategic improvements and positioning...',
  '💰 Creating investment strategy and funding roadmap...',
  '🚀 Building launch plan and growth strategy...',
]

export function Loading({ currentStep, totalSteps, message }: LoadingProps) {
  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <div className='flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-inner'>
      <div className='relative mb-6'>
        <div className='w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600'></div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-3 h-3 bg-blue-600 rounded-full animate-pulse'></div>
        </div>
      </div>

      {/* Progress bar showing overall completion */}
      <div className='w-full max-w-md mb-4'>
        <div className='flex justify-between text-sm text-gray-600 mb-2'>
          <span>
            Processing Step {currentStep} of {totalSteps}
          </span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        {/* Animated progress bar with smooth transitions */}
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out'
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Current step description */}
      <div className='text-center'>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          {message || 'Processing your startup idea...'}
        </h3>
        <p className='text-gray-600 animate-pulse'>
          {STEP_DESCRIPTIONS[currentStep - 1] || 'Working on your analysis...'}
        </p>
      </div>

      {/* Additional context for user patience */}
      <div className='mt-4 text-sm text-gray-500 text-center max-w-md'>
        <p>
          Our AI is running a comprehensive analysis using advanced language
          models. This typically takes 30-60 seconds.
        </p>
      </div>
    </div>
  )
}
