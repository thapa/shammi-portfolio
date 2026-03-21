import { useEffect, useRef } from 'react'
import { useContent } from '../../../context/ContentContext'
import { gsap, ScrollTrigger, SplitText } from '../../../lib/gsap'

const SkillSkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse"
        style={{ width: `${60 + (i % 3) * 20}px` }}
      />
    ))}
  </div>
)

const TimelineSkeleton = () => (
  <div className="flex flex-col">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className={`py-6 ${i !== 0 ? 'border-t border-neutral-200 dark:border-neutral-800' : ''}`}>
        <div className="flex justify-between mb-2">
          <div>
            <div className="h-5 w-40 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-1" />
            <div className="h-4 w-28 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="h-4 w-20 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse mt-2" />
      </div>
    ))}
  </div>
)

const About = () => {
  const { skills, experience, loading } = useContent()

  const sectionRef = useRef(null)
  const labelRef = useRef(null)
  const headingRef = useRef(null)
  const bioRef = useRef(null)
  const skillsLabelRef = useRef(null)
  const skillsRef = useRef(null)
  const expLabelRef = useRef(null)
  const expListRef = useRef(null)

  // Header + bio + labels — always present
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { start: 'top 82%', once: true }

      gsap.from(labelRef.current, {
        y: 16, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, ...st },
      })

      const split = new SplitText(headingRef.current, { type: 'words' })
      gsap.from(split.words, {
        y: 48, opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, ...st },
      })

      gsap.from(bioRef.current, {
        y: 24, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: bioRef.current, start: 'top 85%', once: true },
      })

      gsap.from([skillsLabelRef.current, expLabelRef.current], {
        y: 16, opacity: 0, duration: 0.5, stagger: 0, ease: 'power3.out',
        scrollTrigger: { trigger: skillsLabelRef.current, start: 'top 88%', once: true },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Skills + experience — wait for data
  useEffect(() => {
    if (loading) return

    const ctx = gsap.context(() => {
      const skillTags = skillsRef.current?.querySelectorAll('span')
      if (skillTags?.length) {
        gsap.from(skillTags, {
          y: 16, opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out',
          scrollTrigger: { trigger: skillsRef.current, start: 'top 88%', once: true },
        })
      }

      const expRows = expListRef.current?.children
      if (expRows?.length) {
        gsap.from(expRows, {
          x: -24, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: expListRef.current, start: 'top 85%', once: true },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [loading])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-neutral-50 dark:bg-neutral-900 py-24 md:py-32 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6">
        <p ref={labelRef} className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
          About Me
        </p>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: heading + bio + skills */}
          <div>
            <h2
              ref={headingRef}
              className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white leading-tight mb-8"
            >
              Crafting digital experiences since 2012
            </h2>
            <p ref={bioRef} className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-10">
              Full-stack web developer with{' '}
              <strong className="text-neutral-900 dark:text-white font-semibold">
                10+ years of experience
              </strong>
              . Freelancing since 2018 with{' '}
              <strong className="text-neutral-900 dark:text-white font-semibold">
                200+ projects
              </strong>{' '}
              delivered across WordPress, Shopify, Wix, and Webflow. I specialize
              in turning design mockups into fast, accessible, and pixel-perfect
              websites.
            </p>

            <div>
              <p ref={skillsLabelRef} className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">
                Skills &amp; Tech
              </p>
              {loading ? (
                <SkillSkeleton />
              ) : (
                <div ref={skillsRef} className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium px-3 py-1.5 rounded-full hover:border-primary hover:text-neutral-900 dark:hover:text-white transition-colors cursor-default"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: experience timeline */}
          <div>
            <p ref={expLabelRef} className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-6">
              Experience
            </p>
            {loading ? (
              <TimelineSkeleton />
            ) : (
              <div ref={expListRef} className="flex flex-col">
                {experience.map((t, i) => (
                  <div
                    key={t.id}
                    className={`py-6 ${i !== 0 ? 'border-t border-neutral-200 dark:border-neutral-800' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white">{t.role}</p>
                        <p className="text-sm text-primary font-medium">{t.company}</p>
                      </div>
                      <span className="text-xs text-neutral-400 dark:text-neutral-600 shrink-0 pt-0.5">
                        {t.period}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
