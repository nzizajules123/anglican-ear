import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

const HERO_BACKGROUNDS = [
  'https://www.kingdombuilders.com/wp-content/uploads/2019/04/Church-Family.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJDdo2MdQBLGyAlPv7ODciuARhKVT2sirTdSxneIV36Q&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRauY24G9nS7ZyS7nMTm5mHBXZbfxx8caqMLJcg6DBt9fOs5qbZKjUx0zs&s=10',
  'https://apcstl.org/wp-content/uploads/2023/03/How-We-Worship-2023-Update-300x200.jpg',
]
  
const AUTO_ROTATE_MS = 8000

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setAutoRotate(!media.matches)
    const handleChange = (e: MediaQueryListEvent) => setAutoRotate(!e.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (!autoRotate) return
    timerRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_BACKGROUNDS.length)
    }, AUTO_ROTATE_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [autoRotate])

  function selectBackground(index: number) {
    setActiveIndex(index)
    setAutoRotate(false)
  }

  return <>
    <section className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="absolute inset-0 -z-20">
        {HERO_BACKGROUNDS.map((src, index) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
            style={{ backgroundImage: `url(${src})`, opacity: index === activeIndex ? 1 : 0 }}
            aria-hidden="true"
          />
        ))}
      </div>
      <div className="absolute inset-x-[-15%] top-[-13rem] -z-10 h-[37rem] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(214,234,173,.85),rgba(77,113,59,.75)_55%,rgba(35,57,28,.9))] blur-2xl" />
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-brand-700">Welcome home</p>
      <h1 className="mx-auto mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight text-brand-900 md:text-7xl">A softer place to grow <em className="font-normal">together.</em></h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-brand-900">Faith, family, and community for every generation—rooted in grace and open to you.</p>
      <Link to="/events" className="button-primary mt-8 inline-block px-6 py-3">Find an event</Link>

      <div className="mt-10 flex items-center justify-center gap-2">
        {HERO_BACKGROUNDS.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => selectBackground(index)}
            aria-label={`Show background ${index + 1}`}
            aria-current={index === activeIndex}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              index === activeIndex ? 'bg-brand-900' : 'bg-brand-900/30 hover:bg-brand-900/60'
            }`}
          />
        ))}
      </div>
    </section>
    <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
      {['Join us Sunday', 'Watch sermons', 'Serve with us'].map((title) => <article key={title} className="milk-card p-7"><div className="mb-6 h-10 w-10 rounded-full bg-brand-50" /><h2 className="font-serif text-2xl font-bold text-brand-900">{title}</h2><p className="mt-2 text-stone-600">Public content and ministry information will live here.</p></article>)}
    </section>
  </>
}