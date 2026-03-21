import { useContent } from '../../../context/ContentContext'

const ProcessSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex flex-col items-start">
        <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse mb-6" />
        <div className="h-5 w-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-2" />
        <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse mt-1" />
      </div>
    ))}
  </div>
)

const Process = () => {
  const { processSteps, loading } = useContent()

  return (
    <section className="bg-neutral-50 dark:bg-neutral-900 py-24 md:py-32 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
              How I Work
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white leading-tight max-w-lg">
              A Methodical Process For Maximum Results
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-xs leading-relaxed">
            A proven five-step workflow that delivers quality, on time, every time.
          </p>
        </div>

        {loading ? (
          <ProcessSkeleton />
        ) : (
          <div className="relative">
            <div className="hidden md:block absolute top-8 left-8 right-8 h-px bg-neutral-200 dark:bg-neutral-800 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
              {processSteps.map((step) => (
                <div key={step.id} className="flex flex-col items-start">
                  <div className="w-16 h-16 rounded-full border-2 border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#0E0E0E] flex items-center justify-center mb-6 flex-shrink-0">
                    <span className="font-display text-sm font-bold text-neutral-900 dark:text-white">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Process
