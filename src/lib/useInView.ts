import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element is near the viewport.
 * `seen` latches true the first time (use it to lazy-mount), `visible` follows live (use it to pause rendering).
 */
export function useInView<T extends Element>(rootMargin = '200px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setSeen(true)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return { ref, visible, seen }
}
