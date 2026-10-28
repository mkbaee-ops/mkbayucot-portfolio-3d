import { MotionConfig } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { profile } from './data/profile'
import { useQuality } from './lib/device'
import { About } from './sections/About'
import { Automations } from './sections/Automations'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Hero } from './sections/Hero'
import { TechStack } from './sections/TechStack'
import { WebProjects } from './sections/WebProjects'

const BackgroundScene = lazy(() => import('./three/BackgroundScene'))
const YEAR = new Date().getFullYear()

/**
 * Waits until the page has loaded and the main thread is idle, so 3D never delays first paint.
 * On phones / low-power devices (`deferToInteraction`) it also waits for the first scroll or touch,
 * so parsing three.js never competes with the initial load.
 */
function useAfterLoad(deferToInteraction: boolean) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200))
    const start = () => idle(() => setReady(true), { timeout: 2000 })
    const events = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const
    const onInteract = () => {
      events.forEach((e) => window.removeEventListener(e, onInteract))
      start()
    }
    const go = () => {
      if (deferToInteraction) events.forEach((e) => window.addEventListener(e, onInteract, { once: true, passive: true }))
      else start()
    }
    if (document.readyState === 'complete') go()
    else window.addEventListener('load', go, { once: true })
    return () => events.forEach((e) => window.removeEventListener(e, onInteract))
  }, [deferToInteraction])
  return ready
}

export default function App() {
  const quality = useQuality()
  const ready = useAfterLoad(quality === 'lite')
  const [sceneShown, setSceneShown] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      <a href="#about" className="sr-only z-[60] rounded-full bg-cyan px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>

      {/* Fixed backdrop: static gradient always, 3D scene fades in on top when allowed */}
      <div aria-hidden="true" className="static-backdrop pointer-events-none fixed inset-0 z-0">
        {quality !== 'static' && ready && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${sceneShown ? 'opacity-100' : 'opacity-0'}`}>
            <Suspense fallback={null}>
              <BackgroundScene quality={quality} onReady={() => setSceneShown(true)} />
            </Suspense>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <About />
          <Automations quality={quality} />
          <WebProjects />
          <TechStack quality={quality} />
          <Experience />
          <Contact />
        </main>
        <footer className="border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              © {YEAR} {profile.name} · {profile.title}
            </p>
            <p>Built with React, Three.js and Claude Code.</p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
