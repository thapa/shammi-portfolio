
import React, { useEffect, useRef } from 'react';
import '../../../html-styles.css';

export default function HtmlVersion() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Expandable services
    const serviceTriggers = containerRef.current.querySelectorAll('.service-trigger');
    const serviceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    serviceTriggers.forEach((trigger) => {
      const panel = containerRef.current.querySelector('#' + trigger.getAttribute('aria-controls'));

      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));

        if (isOpen) {
          panel.classList.remove('is-open');
          if (serviceMotionQuery.matches) {
            panel.hidden = true;
            return;
          }
          const hidePanel = () => {
            if (!panel.classList.contains('is-open')) panel.hidden = true;
          };
          panel.addEventListener('transitionend', hidePanel, { once: true });
          window.setTimeout(hidePanel, 380);
        } else {
          panel.hidden = false;
          requestAnimationFrame(() => panel.classList.add('is-open'));
        }
      });
    });

    // Scroll reveal (IntersectionObserver)
    const revealEls = containerRef.current.querySelectorAll('.reveal');
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => revealIO.observe(el));

    // Skill bars (trigger when in view)
    const bars = containerRef.current.querySelectorAll('.skill-bar-fill');
    const barIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          barIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    bars.forEach(b => barIO.observe(b));
    
  }, []);

  return (
    <div className="html-version-wrapper" ref={containerRef}>
      

{/*  HOME  */}
<section id="home">
  <div className="v1-field" aria-hidden="true">
    <span className="v1-m" style={{"--mx":"4%","--md":"0s"}}>+47% CVR</span>
    <span className="v1-m" style={{"--mx":"12%","--md":"-2s"}}>ROAS 4.2x</span>
    <span className="v1-m" style={{"--mx":"22%","--md":"-4.5s"}}>3.2% CR</span>
    <span className="v1-m" style={{"--mx":"32%","--md":"-1.5s"}}>CTR 6.8%</span>
    <span className="v1-m" style={{"--mx":"43%","--md":"-6s"}}>LTV $240</span>
    <span className="v1-m" style={{"--mx":"54%","--md":"-3s"}}>+12% uplift</span>
    <span className="v1-m" style={{"--mx":"64%","--md":"-7.5s"}}>AOV +$31</span>
    <span className="v1-m" style={{"--mx":"73%","--md":"-1s"}}>CPC &minus;22%</span>
    <span className="v1-m" style={{"--mx":"82%","--md":"-5s"}}>14% A/B win</span>
    <span className="v1-m" style={{"--mx":"90%","--md":"-3.5s"}}>ROAS 5.1x</span>
  </div>
  <div className="container">
    <p className="hero-eyebrow reveal">
      <span className="hero-dot" aria-hidden="true"></span>
      CRO Specialist. Shopify &amp; WordPress Developer. Available for projects.
    </p>
    <h1 className="hero-headline reveal reveal-delay-1">
      Conversions don't happen by <em>accident.</em>
    </h1>
    <p className="hero-sub reveal reveal-delay-2">
      I build Shopify stores, WordPress sites, and CRO programs that turn traffic into revenue. The work is part code, part psychology, and the only number I care about is the one on your dashboard.
    </p>
    <div className="hero-actions reveal reveal-delay-3">
      <a href="#contact" className="btn-primary">Start a project &rarr;</a>
      <a href="#work" className="btn-secondary">View selected work</a>
    </div>
  </div>
  <span className="hero-scroll" aria-hidden="true">Scroll</span>
</section>

{/*  LOGOS  */}
<section id="logos" aria-label="Technologies">
  <div className="logos-track">
    <div className="logos-group">
      <span className="logo-item">Shopify</span>
      <span className="logo-item">Wordpress</span>
      <span className="logo-item">Klaviyo</span>
      <span className="logo-item">reCharge</span>
      <span className="logo-item">Yotpo</span>
      <span className="logo-item">Webflow</span>
    </div>
    <div className="logos-group" aria-hidden="true">
      <span className="logo-item">Shopify</span>
      <span className="logo-item">Wordpress</span>
      <span className="logo-item">Klaviyo</span>
      <span className="logo-item">reCharge</span>
      <span className="logo-item">Yotpo</span>
      <span className="logo-item">Webflow</span>
    </div>
  </div>
</section>

{/*  ABOUT  */}
<section id="about">
  <div className="container">
    <p className="section-label reveal">About</p>
    <div className="about-grid">
      <div>
        <p className="about-text reveal reveal-delay-1">
          I'm a CRO specialist and full-stack web developer. Ten years in, what I do is pretty simple: I find where your store is leaking money, and I rebuild the parts that are causing it.
        </p>
        <p className="about-text reveal reveal-delay-2">
          Most "redesigns" I get called in to fix were beautiful and broken. Pretty homepages. Slow checkouts. Forms nobody finished. Most of the time, the fix isn't more design. It's reading the data and being willing to ship the unsexy version when the unsexy version wins.
        </p>
        <p className="about-text reveal reveal-delay-3">
          I've worked with brands in fashion, supplements, consumer goods, and SaaS. Some scrappy, some doing eight figures. Same approach either way: start with the funnel, find the leak, prove the fix.
        </p>
      </div>
      <div className="about-stats">
        <div className="stat-item reveal reveal-delay-1">
          <div className="stat-number">12<span>+</span></div>
          <div className="stat-label">Years building for the web</div>
        </div>
        <div className="stat-item reveal reveal-delay-2">
          <div className="stat-number">200<span>+</span></div>
          <div className="stat-label">Projects shipped</div>
        </div>
        <div className="stat-item reveal reveal-delay-3">
          <div className="stat-number">$48<span>M</span></div>
          <div className="stat-label">Revenue moved through work I've shipped</div>
        </div>
        <div className="stat-item reveal reveal-delay-4">
          <div className="stat-number">97<span>%</span></div>
          <div className="stat-label">Of clients come back</div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  SKILLS  */}
<section id="skills" className="skills-layout skills-layout--stacked">
  <div className="container">
    <div className="skills-grid">
      <div className="skills-intro">
        <p className="section-label reveal">Skills</p>
        <h2 className="section-heading reveal reveal-delay-1">Tools of the trade.</h2>
        <p className="skills-description reveal reveal-delay-2">
          Short, honest list. If it's here, I've used it on real work that real people paid for, not a weekend side project.
        </p>
      </div>
      <div className="skill-list">
        <div className="skill-item reveal">
          <span className="skill-name">Conversion Rate Optimization</span>
          <div className="skill-bar"><div className="skill-bar-fill" data-width="95"></div></div>
          <span className="skill-pct">95</span>
        </div>
        <div className="skill-item reveal reveal-delay-1">
          <span className="skill-name">Shopify &amp; Shopify Plus</span>
          <div className="skill-bar"><div className="skill-bar-fill" data-width="92"></div></div>
          <span className="skill-pct">92</span>
        </div>
        <div className="skill-item reveal reveal-delay-2">
          <span className="skill-name">WordPress &amp; PHP</span>
          <div className="skill-bar"><div className="skill-bar-fill" data-width="88"></div></div>
          <span className="skill-pct">88</span>
        </div>
        <div className="skill-item reveal reveal-delay-3">
          <span className="skill-name">A/B Testing &amp; Analytics</span>
          <div className="skill-bar"><div className="skill-bar-fill" data-width="90"></div></div>
          <span className="skill-pct">90</span>
        </div>
        <div className="skill-item reveal reveal-delay-4">
          <span className="skill-name">Landing Page Design</span>
          <div className="skill-bar"><div className="skill-bar-fill" data-width="87"></div></div>
          <span className="skill-pct">87</span>
        </div>
        <div className="skill-item reveal reveal-delay-5">
          <span className="skill-name">HTML / CSS / JavaScript</span>
          <div className="skill-bar"><div className="skill-bar-fill" data-width="94"></div></div>
          <span className="skill-pct">94</span>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  SERVICES  */}
<section id="services">
  <div className="container">
    <div className="services-header">
      <div>
        <p className="section-label reveal">Services</p>
        <h2 className="section-heading reveal reveal-delay-1">What I do.</h2>
      </div>
      <p className="services-tagline reveal reveal-delay-2">
        Every engagement starts with one question: what is stopping your visitors from buying? Then we go answer it.
      </p>
    </div>
    <div className="service-list">
      <div className="service-item reveal">
        <button className="service-trigger" type="button" aria-expanded="false" aria-controls="service-panel-1">
          <span className="service-num">01</span>
          <span>
            <span className="service-name">CRO Audit</span>
            <span className="service-desc">A full forensic review of your funnel: heatmaps, session recordings, form analytics, and exit data, synthesized into a prioritized roadmap of high-impact fixes.</span>
            <span className="service-tags">
              <span className="service-tag">Heatmaps</span>
              <span className="service-tag">Session Recording</span>
              <span className="service-tag">A/B Testing</span>
              <span className="service-tag">GA4</span>
            </span>
          </span>
          <span className="service-arrow" aria-hidden="true">?</span>
        </button>
        <div className="service-panel" id="service-panel-1" hidden>
          <div className="service-panel-inner">
            <div className="service-expanded">
              <div className="service-expanded-body">
                <p className="service-detail-text">The audit isolates where qualified visitors lose confidence, momentum, or clarity. You get a ranked backlog with impact, effort, evidence, and the exact page-level changes needed for testing or implementation.</p>
                <div>
                  <span className="service-detail-label">Includes</span>
                  <ul className="service-detail-list">
                    <li>Analytics review across acquisition, product, cart, checkout, and lead capture flows.</li>
                    <li>Session-pattern analysis with recurring objections and friction points grouped by page.</li>
                    <li>Prioritized experiment roadmap with copy, layout, and measurement recommendations.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="service-item reveal reveal-delay-1">
        <button className="service-trigger" type="button" aria-expanded="false" aria-controls="service-panel-2">
          <span className="service-num">02</span>
          <span>
            <span className="service-name">CRO Strategy &amp; Testing</span>
            <span className="service-desc">An ongoing testing program for stores with enough traffic to learn from. Hypotheses, builds, QA, and post-test analysis run end to end.</span>
            <span className="service-tags">
              <span className="service-tag">A/B Testing</span>
              <span className="service-tag">VWO</span>
              <span className="service-tag">Optimizely</span>
              <span className="service-tag">Hypothesis Design</span>
            </span>
          </span>
          <span className="service-arrow" aria-hidden="true">?</span>
        </button>
        <div className="service-panel" id="service-panel-2" hidden>
          <div className="service-panel-inner">
            <div className="service-expanded">
              <div className="service-expanded-body">
                <p className="service-detail-text">I run tests when there is a real question worth answering, not to keep the dashboard busy. Each test ships with a written hypothesis, a sample-size target, and a decision rule, so the result is something you can act on the day it closes.</p>
                <div>
                  <span className="service-detail-label">Includes</span>
                  <ul className="service-detail-list">
                    <li>Quarterly test roadmap built from audit findings and live performance data.</li>
                    <li>Hypothesis design, variant build, and QA across desktop, mobile, and tablet.</li>
                    <li>Statistical readout with winner rationale, segment breakdowns, and follow-up tests queued up.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="service-item reveal reveal-delay-2">
        <button className="service-trigger" type="button" aria-expanded="false" aria-controls="service-panel-3">
          <span className="service-num">03</span>
          <span>
            <span className="service-name">Shopify Development</span>
            <span className="service-desc">Custom Shopify and Shopify Plus builds tuned for conversion: clean Liquid, fast pages, and PDP and checkout flows that move real volume.</span>
            <span className="service-tags">
              <span className="service-tag">Shopify Themes</span>
              <span className="service-tag">Liquid</span>
              <span className="service-tag">Checkout</span>
              <span className="service-tag">Conversion Flows</span>
            </span>
          </span>
          <span className="service-arrow" aria-hidden="true">?</span>
        </button>
        <div className="service-panel" id="service-panel-3" hidden>
          <div className="service-panel-inner">
            <div className="service-expanded">
              <div className="service-expanded-body">
                <p className="service-detail-text">I build for stores that already make money and want to make more, not for vanity metrics. Performance is treated as a conversion lever from day one, not a separate audit you have to commission later.</p>
                <div>
                  <span className="service-detail-label">Includes</span>
                  <ul className="service-detail-list">
                    <li>Custom theme development with reusable sections and merchandising controls editors can actually use.</li>
                    <li>PDP, cart, and checkout optimization on Shopify Plus, including checkout extensibility work.</li>
                    <li>Core Web Vitals, image pipelines, and third-party script load tightened up before launch.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="service-item reveal reveal-delay-3">
        <button className="service-trigger" type="button" aria-expanded="false" aria-controls="service-panel-4">
          <span className="service-num">04</span>
          <span>
            <span className="service-name">WordPress Development</span>
            <span className="service-desc">Fast, well-structured WordPress builds with content models that hold up six months and three editors later.</span>
            <span className="service-tags">
              <span className="service-tag">Custom Themes</span>
              <span className="service-tag">ACF</span>
              <span className="service-tag">Core Web Vitals</span>
              <span className="service-tag">WooCommerce</span>
            </span>
          </span>
          <span className="service-arrow" aria-hidden="true">?</span>
        </button>
        <div className="service-panel" id="service-panel-4" hidden>
          <div className="service-panel-inner">
            <div className="service-expanded">
              <div className="service-expanded-body">
                <p className="service-detail-text">ACF Pro, custom blocks, and a clean Gutenberg editing experience for the team that has to update the site every week. Accessibility and SEO are part of the build, not a phase two.</p>
                <div>
                  <span className="service-detail-label">Includes</span>
                  <ul className="service-detail-list">
                    <li>Custom theme development with ACF Pro, custom blocks, and reusable patterns.</li>
                    <li>WooCommerce builds covering product, cart, and checkout customization for real catalogs.</li>
                    <li>Performance, accessibility, and on-page SEO shipped on the same release as the design.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="service-item reveal reveal-delay-4">
        <button className="service-trigger" type="button" aria-expanded="false" aria-controls="service-panel-5">
          <span className="service-num">05</span>
          <span>
            <span className="service-name">Landing Page Design</span>
            <span className="service-desc">Standalone landing pages designed for paid traffic and built to be tested. Hand-coded, lightweight, and ready to plug into your testing stack.</span>
            <span className="service-tags">
              <span className="service-tag">Conversion Copy</span>
              <span className="service-tag">A/B Variants</span>
              <span className="service-tag">HTML / CSS</span>
              <span className="service-tag">Analytics</span>
            </span>
          </span>
          <span className="service-arrow" aria-hidden="true">?</span>
        </button>
        <div className="service-panel" id="service-panel-5" hidden>
          <div className="service-panel-inner">
            <div className="service-expanded">
              <div className="service-expanded-body">
                <p className="service-detail-text">Pages start at the smallest viable version and earn complexity through evidence. Copy, layout, and offer are treated as variables, not fixed assets.</p>
                <div>
                  <span className="service-detail-label">Includes</span>
                  <ul className="service-detail-list">
                    <li>Conversion copy and layout built around a single primary action per page.</li>
                    <li>A/B variant production for headline, hero, social proof, and CTA placement.</li>
                    <li>Event tracking, scroll depth, and form analytics wired up at launch, not after the first campaign.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  WORK  */}
<section id="work">

  <div className="container">
    <div className="work-header">
      <div>
        <p className="section-label reveal">Selected Work</p>
        <h2 className="section-heading reveal reveal-delay-1">Projects that convert.</h2>
      </div>
      <span className="work-count reveal reveal-delay-2">04 Projects</span>
    </div>

    <div className="work-featured reveal">
      <div className="work-img">
        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80"
             alt="Hartley and Co furniture store redesign on Shopify"
             loading="lazy" />
        <div className="work-overlay">
          <span className="work-overlay-label">View project</span>
          <span className="work-overlay-name">Hartley &amp; Co, Furniture Store</span>
        </div>
      </div>
      <div className="work-info">
        <div>
          <p className="work-proj-num">01 / Featured</p>
          <h3 className="work-proj-title">Hartley &amp; Co Furniture Store Redesign</h3>
          <p className="work-proj-desc">Complete Shopify rebuild and CRO overhaul for a mid-market furniture brand. Redesigned product discovery, checkout, and mobile experience from scratch.</p>
        </div>
        <div className="work-metric">
          <div className="work-metric-num">+34%</div>
          <div className="work-metric-label">Conversion rate improvement over 90 days</div>
        </div>
      </div>
    </div>

    <div className="work-secondary">
      <div className="work-sec-item reveal reveal-delay-1">
        <div className="work-img">
          <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
               alt="Kova Analytics SaaS landing page"
               loading="lazy" />
          <div className="work-overlay">
            <span className="work-overlay-label">View project</span>
            <span className="work-overlay-name">Kova Analytics</span>
          </div>
        </div>
        <div className="work-sec-info">
          <h3 className="work-sec-title">Kova Analytics: SaaS Landing</h3>
          <p className="work-sec-metric">+47% trial signups</p>
        </div>
      </div>
      <div className="work-sec-item reveal reveal-delay-2">
        <div className="work-img">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80"
               alt="Marlow D2C checkout flow optimization"
               loading="lazy" />
          <div className="work-overlay">
            <span className="work-overlay-label">View project</span>
            <span className="work-overlay-name">Marlow D2C</span>
          </div>
        </div>
        <div className="work-sec-info">
          <h3 className="work-sec-title">Marlow D2C Checkout Flow</h3>
          <p className="work-sec-metric">+28% completion rate</p>
        </div>
      </div>
      <div className="work-sec-item reveal reveal-delay-3">
        <div className="work-img">
          <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
               alt="Thera Wellness WordPress brand site"
               loading="lazy" />
          <div className="work-overlay">
            <span className="work-overlay-label">View project</span>
            <span className="work-overlay-name">Thera Wellness</span>
          </div>
        </div>
        <div className="work-sec-info">
          <h3 className="work-sec-title">Thera Wellness WordPress Site</h3>
          <p className="work-sec-metric">3&times; revenue in 6 months</p>
        </div>
      </div>
    </div>
  </div>

</section>

{/*  REVIEWS  */}
<section id="reviews">
  <div className="container">
    <div className="reviews-header">
      <p className="section-label reveal">Testimonials</p>
      <h2 className="section-heading reveal reveal-delay-1">Clients say.</h2>
    </div>
    <div className="review-list">
      <div className="review-item reveal">
        <span className="review-num">01</span>
        <div>
          <blockquote className="review-quote">
            "Shammi rebuilt our Shopify store from the ground up and stayed on to run A/B tests for three months. Our conversion rate went from 1.4% to 2.3%. For a store doing our volume, that is not a small number."
          </blockquote>
          <div className="review-author">
            <div className="review-avatar" aria-hidden="true">CN</div>
            <div>
              <p className="review-name">Client name</p>
              <p className="review-role">Founder, Brand</p>
            </div>
          </div>
        </div>
      </div>
      <div className="review-item reveal reveal-delay-1">
        <span className="review-num">02</span>
        <div>
          <blockquote className="review-quote">
            "We brought Shammi in for a pre-rebuild CRO audit expecting the usual list of recommendations. We got a real diagnosis with test hypotheses sized by expected impact. Three months in, every test that has run has moved the needle."
          </blockquote>
          <div className="review-author">
            <div className="review-avatar" aria-hidden="true">CN</div>
            <div>
              <p className="review-name">Client name</p>
              <p className="review-role">Head of Growth, Brand</p>
            </div>
          </div>
        </div>
      </div>
      <div className="review-item reveal reveal-delay-2">
        <span className="review-num">03</span>
        <div>
          <blockquote className="review-quote">
            "What stands out is the combination. Shammi understands the business logic, not just the code. The new site came in fast, accessible, and immediately outperformed the old one on every metric we tracked."
          </blockquote>
          <div className="review-author">
            <div className="review-avatar" aria-hidden="true">CN</div>
            <div>
              <p className="review-name">Client name</p>
              <p className="review-role">CMO, Brand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

{/*  CONTACT  */}
<section id="contact">
  <div className="container">
    <div className="contact-grid">
      <div>
        <p className="section-label reveal">Contact</p>
        <form className="contact-form reveal reveal-delay-1" id="contactForm" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input className="form-input" type="text" id="name" name="name" placeholder="Your name" required autoComplete="name" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input" type="email" id="email" name="email" placeholder="your@email.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="message">Message</label>
            <textarea className="form-textarea" id="message" name="message" placeholder="Tell me about your project..." required></textarea>
          </div>
          <div className="form-submit">
            <button type="submit" className="btn-primary">Send message &rarr;</button>
          </div>
        </form>
        <div className="form-success" id="formSuccess" role="status" aria-live="polite">
          <div className="form-success-check" aria-hidden="true">&#10003;</div>
          <p className="form-success-title">Message received.</p>
          <p className="form-success-body">I'll get back to you within 24 hours.</p>
        </div>
      </div>
      <div className="contact-info reveal reveal-delay-2">
        <h2 className="contact-heading">Let's work together.</h2>
        <p className="contact-sub">Currently taking on new projects. I reply within 24 hours.</p>
        <a href="mailto:hello@shammithapa.com" className="contact-email">hello@shammithapa.com &rarr;</a>
        <div className="contact-socials">
          <a href="#" className="contact-social">LinkedIn</a>
          <a href="#" className="contact-social">Twitter</a>
          <a href="#" className="contact-social">GitHub</a>
        </div>
      </div>
    </div>
  </div>
</section>


    </div>
  );
}
