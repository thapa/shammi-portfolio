import { HiArrowRight } from 'react-icons/hi'
import { useContent } from '../../../context/ContentContext'

const ServiceSkeleton = () => (
  <div className="border-t border-neutral-200 dark:border-neutral-800">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="border-b border-neutral-200 dark:border-neutral-800 py-8 grid md:grid-cols-[64px,1fr,auto] gap-6 items-start px-6"
      >
        <div className="h-4 w-8 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        <div>
          <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-3" />
          <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse mb-1" />
          <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse mb-4" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-6 w-20 bg-neutral-100 dark:bg-neutral-800 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
      </div>
    ))}
  </div>
)

const Services = () => {
  const { services, loading } = useContent()

  return (
    <section
      id="services"
      className="bg-white dark:bg-[#0E0E0E] py-24 md:py-32 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
              What I Do
            </p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
              My Services
            </h2>
          </div>
          <p className="text-neutral-500 dark:text-neutral-500 text-sm max-w-xs leading-relaxed">
            End-to-end web development solutions tailored to your business needs.
          </p>
        </div>

        {loading ? (
          <ServiceSkeleton />
        ) : (
          <div className="border-t border-neutral-200 dark:border-neutral-800">
            {services.map((s) => (
              <div
                key={s.id}
                className="group border-b border-neutral-200 dark:border-neutral-800 py-8 grid md:grid-cols-[64px,1fr,auto] gap-6 items-start -mx-6 px-6 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-default"
              >
                <span className="font-display text-sm font-bold text-neutral-300 dark:text-neutral-700 pt-1">
                  {s.num}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-neutral-500 dark:text-neutral-500 text-sm leading-relaxed mb-4">
                    {s.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-1 w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:border-primary group-hover:text-[#0E0E0E] transition-all flex-shrink-0">
                  <HiArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Services
