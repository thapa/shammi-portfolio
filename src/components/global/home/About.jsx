import { useEffect, useRef } from 'react'
import { useContent } from '../../../context/ContentContext'
import { gsap, ScrollTrigger, SplitText } from '../../../lib/gsap'

const SkillSkeleton = () => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="h-8 animate-pulse"
        style={{
          width: `${60 + (i % 3) * 20}px`,
          background: 'var(--ds-bg-elevated)',
        }}
      />
    ))}
  </div>
)

const TimelineSkeleton = () => (
  <div className="flex flex-col">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="py-6" style={{ borderTop: i !== 0 ? '1px solid var(--ds-border)' : 'none' }}>
        <div className="flex justify-between mb-2">
          <div>
            <div className="h-5 w-40 animate-pulse mb-1" style={{ background: 'var(--ds-bg-elevated)' }} />
            <div className="h-4 w-28 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
          </div>
          <div className="h-4 w-20 animate-pulse" style={{ background: 'var(--ds-bg-elevated)' }} />
        </div>
        <div className="h-4 w-full animate-pulse mt-2" style={{ background: 'var(--ds-bg-elevated)' }} />
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

  // Header + bio + labels
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
        gsap.fromTo(skillTags, 
          { y: 16, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: 'power2.out',
            scrollTrigger: { 
              trigger: sectionRef.current, 
              start: 'top 80%', 
              once: true 
            },
          }
        )
      }

      const expRows = expListRef.current?.children
      if (expRows?.length) {
        gsap.fromTo(expRows, 
          { x: -24, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power3.out',
            scrollTrigger: { 
              trigger: sectionRef.current, 
              start: 'top 80%', 
              once: true 
            },
          }
        )
      }
    }, sectionRef)

    // Force a refresh after a small delay to catch layout changes from previous sections
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => {
      ctx.revert()
      clearTimeout(timeout)
    }
  }, [loading])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden py-24 md:py-32 transition-colors duration-300"
      style={{ background: 'var(--ds-bg)', borderTop: '1px solid var(--ds-border)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <p ref={labelRef} className="section-label mb-6">
          About
        </p>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: heading + bio + skills */}
          <div>
            <h2
              ref={headingRef}
              className="section-heading mb-8"
            >
              About
            </h2>
            <div
              ref={bioRef}
              className="body-text flex flex-col gap-5 mb-10"
            >
              <p>
                I'm a CRO specialist and full-stack web developer. Ten years in, what I do is pretty simple: I find where your store is leaking money, and I rebuild the parts that are causing it.
              </p>
              <p>
                Most "redesigns" I get called in to fix were beautiful and broken. Pretty homepages. Slow checkouts. Forms nobody finished. Most of the time, the fix isn't more design. It's reading the data and being willing to ship the unsexy version when the unsexy version wins.
              </p>
              <p>
                I've worked with brands in fashion, supplements, consumer goods, and SaaS. Some scrappy, some doing eight figures. Same approach either way: start with the funnel, find the leak, prove the fix.
              </p>
            </div>

            <div>
              <p ref={skillsLabelRef} className="section-label mb-3">
                Skills &amp; Tech
              </p>
              {loading ? (
                <SkillSkeleton />
              ) : (
                <div ref={skillsRef} className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="text-sm font-medium px-3 py-1.5 transition-all duration-200 cursor-default"
                      style={{
                        border: '1px solid var(--ds-border)',
                        color: 'var(--ds-text-2)',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = 'var(--ds-accent)'
                        e.target.style.color = 'var(--ds-accent)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = 'var(--ds-border)'
                        e.target.style.color = 'var(--ds-text-2)'
                      }}
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
            <p ref={expLabelRef} className="section-label mb-6">
              Experience
            </p>
            {loading ? (
              <TimelineSkeleton />
            ) : (
              <div ref={expListRef} className="flex flex-col">
                {experience.map((t, i) => (
                  <div
                    key={t.id}
                    className="py-6"
                    style={{ borderTop: i !== 0 ? '1px solid var(--ds-border)' : 'none' }}
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <p className="font-medium" style={{ color: 'var(--ds-text-1)' }}>{t.role}</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--ds-accent)' }}>{t.company}</p>
                      </div>
                      <span
                        className="text-xs shrink-0 pt-0.5 tabular-nums"
                        style={{ color: 'var(--ds-text-3)' }}
                      >
                        {t.period}
                      </span>
                    </div>
                    <p
                      className="body-text"
                    >
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
