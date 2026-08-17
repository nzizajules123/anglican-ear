import { useEffect, useRef, useState } from 'react'
import { useUserManagement } from '../../hooks'
import { db } from '../../lib/firebase'

const roleLabels: Record<string, string> = {
  super_admin: 'Administrator',
  pastor: 'Pastor',
  secretary: 'Secretary',
  event_manager: 'Event Manager',
  media: 'Media Team',
  choir_president: 'Choir President',
  youth_leader: 'Youth Leader',
  finance: 'Finance',
}

/** Fades a block in and slides it up slightly the first time it enters the viewport. */
function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function AboutSection({
  eyebrow,
  title,
  text,
  imageSrc,
  imageAlt,
  reverse,
}: {
  eyebrow: string
  title: string
  text: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={`mt-16 grid items-center gap-10 md:grid-cols-2 ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}
    >
      <div
        className={`overflow-hidden rounded-2xl bg-stone-100 transition-all duration-700 ease-out ${
          visible ? 'translate-x-0 opacity-100' : `${reverse ? 'translate-x-8' : '-translate-x-8'} opacity-0`
        }`}
      >
        <img src={imageSrc} alt={imageAlt} className="h-72 w-full object-cover sm:h-96" />
      </div>
      <div
        className={`transition-all delay-150 duration-700 ease-out ${
          visible ? 'translate-x-0 opacity-100' : `${reverse ? '-translate-x-8' : 'translate-x-8'} opacity-0`
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-bold text-brand-900">{title}</h2>
        <p className="mt-4 text-stone-600">{text}</p>
      </div>
    </div>
  )
}

export function AboutPage() {
  const { users, loading } = useUserManagement()
  const leadership = users.filter((user) => user.role && user.role !== 'member')

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="eyebrow">Grace Community</p>
      <h1 className="page-title">About Us</h1>
      <p className="mt-5 max-w-2xl text-lg text-stone-600">
        Learn about our church, our beliefs, and the people who serve our parish.
      </p>

      {/* ---- Church info — edit text and image src directly ---- */}
      <AboutSection
        eyebrow="Our Story"
        title="A parish family for generations"
        text="Grace Community has served this parish for generations, gathering as a family of faith to worship, grow, and care for one another. Replace this paragraph with your church's actual history — when it was founded, key milestones, and what makes your congregation distinct."
        imageSrc="https://i.pinimg.com/1200x/fe/d9/48/fed9487f3af04032e851134b4da2985e.jpg"
        imageAlt="Our church"
      />

      <AboutSection
        eyebrow="Our Mission"
        title="Worship, community, and service"
        text="We exist to worship God, build a loving community, and serve our neighbors with compassion. Replace this paragraph with your church's actual mission statement or statement of faith."
        imageSrc="https://i.pinimg.com/736x/c9/cb/e4/c9cbe47f62d85c5a6fb77a5a74a1c6d9.jpg"
        imageAlt="Our mission"
        reverse
      />

      <AboutSection
        eyebrow="What We Believe"
        title="Rooted in faith"
        text="Replace this with a short summary of your core beliefs or values — e.g. Scripture, sacraments, worship style, or a link to a fuller statement of faith if you have one."
        imageSrc="https://i.pinimg.com/736x/99/d3/e1/99d3e1a3950d4055f3ea12fdc2c18889.jpg"
        imageAlt="What we believe"
      />

      {/* ---- Leadership team — live from Firestore ---- */}
      <h2 className="mt-20 font-serif text-3xl font-bold text-brand-900">Our Leadership</h2>
      <p className="mt-2 text-stone-600">Meet the pastors, staff, and ministry leaders who serve our parish.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leadership.map((user) => (
          <article key={user.uid} className="milk-card p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700">
              {user.displayName?.charAt(0).toUpperCase() || '?'}
            </div>
            <h3 className="mt-4 font-serif text-xl font-bold text-brand-900">{user.displayName}</h3>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-700">
              {roleLabels[user.role] || user.role}
            </p>
            {user.choirName && <p className="mt-1 text-sm text-stone-500">{user.choirName}</p>}
          </article>
        ))}
      </div>

      {!loading && db && !leadership.length && (
        <p className="mt-8 text-stone-600">Nothing has been shared here yet. Please check back soon.</p>
      )}
    </section>
  )
}