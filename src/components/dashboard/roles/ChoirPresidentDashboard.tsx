import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../features/auth/AuthProvider'
import {
  Music,
  Calendar,
  Users,
  FileText,
  Volume2,
  CheckCircle,
  Copy,
  Plus,
  Clock,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react'

interface HymnItem {
  part: string
  number: string
  title: string
  tune?: string
  key?: string
}

export function ChoirPresidentDashboard() {
  const { profile } = useAuth()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [copiedLiturgy, setCopiedLiturgy] = useState(false)

  // Sunday Service Liturgical Music Order
  const [musicOrder, setMusicOrder] = useState<HymnItem[]>([
    { part: 'Introit', number: 'Cathedral Anthem', title: 'I Was Glad (Psalm 122)', tune: 'C.H.H. Parry', key: 'B-flat major' },
    { part: 'Processional Hymn', number: 'A&M #390', title: 'Praise to the Lord, the Almighty', tune: 'Lobe den Herren', key: 'G major' },
    { part: 'Responsorial Psalm', number: 'Psalm 23', title: 'The Lord is My Shepherd', tune: 'Anglican Chant (Walford Davies)', key: 'F major' },
    { part: 'Gospel Acclamation', number: 'Celtic Alleluia', title: 'Alleluia, Alleluia, Speak Lord', tune: 'Fintan O’Carroll', key: 'D major' },
    { part: 'Offertory Anthem', number: 'Festival Anthem', title: 'The Lord Bless You and Keep You', tune: 'John Rutter', key: 'F major' },
    { part: 'Communion Motet', number: 'A&M #278', title: 'Panis Angelicus / Bread of the World', tune: 'César Franck', key: 'A major' },
    { part: 'Recessional Hymn', number: 'A&M #412', title: 'Crown Him with Many Crowns', tune: 'Diademata', key: 'D major' },
  ])

  const [editingMusic, setEditingMusic] = useState(false)

  // SATB Attendance Tracker State
  const [satbRoster, setSatbRoster] = useState([
    { section: 'Soprano', count: 12, lead: 'Clara Oswald', confirmed: 11 },
    { section: 'Alto', count: 9, lead: 'Eleanor Vance', confirmed: 9 },
    { section: 'Tenor', count: 7, lead: 'David Mensah', confirmed: 6 },
    { section: 'Bass', count: 10, lead: 'Arthur Sterling', confirmed: 10 },
  ])

  // Rehearsals State
  const [rehearsals, setRehearsals] = useState([
    {
      title: 'Midweek Full Choir Rehearsal',
      date: 'Thursday, 6:30 PM – 8:30 PM',
      location: 'Choir Vestry & Nave',
      focus: 'Sunday Anthem & Choral Evensong Stanford in C',
    },
    {
      title: 'Sunday Morning Warm-Up & Vesting',
      date: 'Sunday, 8:00 AM – 8:45 AM',
      location: 'Choir Vestry',
      focus: 'Vocal warmups, processional pacing & sound check',
    },
    {
      title: 'Sectional Practice: Tenors & Basses',
      date: 'Saturday, 4:00 PM – 5:15 PM',
      location: 'Lady Chapel',
      focus: 'Parry’s "I Was Glad" polyphony & diction',
    },
  ])

  // Practice Audio & Sheet Music Repository
  const sheetMusicVault = [
    { title: 'I Was Glad - C.H.H. Parry (SATB Score)', type: 'PDF Sheet Music', pages: '12 pages', audio: 'MP3 Vocal Track' },
    { title: 'Stanford in C - Magnificat & Nunc Dimittis', type: 'PDF Score', pages: '8 pages', audio: 'Organ & Voice Guide' },
    { title: 'The Lord Bless You and Keep You - Rutter', type: 'PDF Score', pages: '4 pages', audio: 'Rehearsal Track' },
    { title: 'Anglican Chant Psalter - Psalms 23 & 121', type: 'Liturgical Chant', pages: '2 pages', audio: 'Tone 1 Practice' },
  ]

  const handleCopyMusicOrder = () => {
    const header = `ANGLICAN PARISH CHOIR - SUNDAY SERVICE MUSIC ORDER\nService: Sung Holy Eucharist & Sermon\nOrganist & Choir Master: ${profile?.displayName || 'Choir President'}\n========================================\n\n`
    const list = musicOrder
      .map((item) => `[${item.part.toUpperCase()}]\n${item.number}: ${item.title}\nTune/Composer: ${item.tune || 'Traditional'} | Key: ${item.key || 'N/A'}\n`)
      .join('\n')

    navigator.clipboard.writeText(header + list)
    setCopiedLiturgy(true)
    setFeedback('Sunday Hymn & Anthem sheet copied for organist & clergy!')
    setTimeout(() => {
      setCopiedLiturgy(false)
      setFeedback(null)
    }, 4000)
  }

  const handleToggleAttendance = (sectionIndex: number) => {
    setSatbRoster((prev) =>
      prev.map((sec, idx) =>
        idx === sectionIndex
          ? { ...sec, confirmed: sec.confirmed < sec.count ? sec.confirmed + 1 : sec.count - 2 }
          : sec
      )
    )
    setFeedback('Updated section headcount.')
    setTimeout(() => setFeedback(null), 2500)
  }

  const totalSingers = satbRoster.reduce((sum, s) => sum + s.count, 0)
  const totalConfirmed = satbRoster.reduce((sum, s) => sum + s.confirmed, 0)

  return (
    <section className="space-y-8">
      {/* Liturgical Choir Banner */}
      <div className="rounded-3xl border border-brand-500/20 bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Music size={13} /> Anglican Cathedral & Parish Choir
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-brand-100">
                Director of Music & Liturgy
              </span>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white md:text-4xl">
              Choir & Liturgical Music Ministry
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-brand-100">
              Welcome, <span className="font-semibold text-white">{profile?.displayName || 'Choir President & Master'}</span>. Guiding sacred Anglican choral worship, hymnody, psalmody, and SATB rehearsals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMusicOrder}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-stone-900 shadow-md transition hover:bg-amber-300 active:scale-95"
            >
              {copiedLiturgy ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copiedLiturgy ? 'Music Sheet Copied!' : 'Copy Sunday Hymn Sheet'}
            </button>
            <Link
              to="/dashboard/announcements"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
            >
              <Plus size={16} />
              Choir Notice
            </Link>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-900 border border-amber-200 shadow-sm animate-fade-in">
          <Sparkles size={18} className="text-amber-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Choir Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Parish Choir Roster</p>
          <p className="mt-1 font-serif text-3xl font-bold text-brand-900">{totalSingers}</p>
          <p className="mt-1 text-[11px] text-brand-700">Four-part choir (SATB)</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Sunday Service Turnout</p>
          <p className="mt-1 font-serif text-3xl font-bold text-emerald-700">{totalConfirmed}</p>
          <p className="mt-1 text-[11px] text-emerald-700">Confirmed singing this Sunday</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Sunday Hymns & Anthems</p>
          <p className="mt-1 font-serif text-3xl font-bold text-amber-700">{musicOrder.length}</p>
          <p className="mt-1 text-[11px] text-amber-700">Full liturgical music order</p>
        </div>
        <div className="milk-card p-5">
          <p className="text-xs font-semibold text-stone-500">Weekly Rehearsals</p>
          <p className="mt-1 font-serif text-3xl font-bold text-blue-700">{rehearsals.length}</p>
          <p className="mt-1 text-[11px] text-blue-700">Practices scheduled</p>
        </div>
      </div>

      {/* Sunday Liturgical Music Order */}
      <div className="milk-card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen size={20} className="text-amber-700" />
              <h2 className="font-serif text-2xl font-bold text-brand-900">
                Next Sunday's Liturgical Music Order
              </h2>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              Hymns, Psalmody, and Anthems for the Sung Holy Eucharist. Distributed to Rector, Organist & Choir.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditingMusic(!editingMusic)}
              className="rounded-xl border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-bold text-stone-800 hover:bg-stone-50"
            >
              {editingMusic ? 'Done Editing' : 'Edit Repertoire'}
            </button>
            <button
              onClick={handleCopyMusicOrder}
              className="rounded-xl bg-brand-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-800"
            >
              Copy for Bulletin
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs min-w-[560px]">
            <thead className="bg-amber-50/70 text-amber-950 font-bold">
              <tr>
                <th className="p-3">Liturgical Part</th>
                <th className="p-3">Hymnal / Source</th>
                <th className="p-3">Hymn / Anthem Title</th>
                <th className="p-3">Tune / Composer</th>
                <th className="p-3">Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 bg-white">
              {musicOrder.map((item, idx) => (
                <tr key={item.part} className="hover:bg-stone-50/80 transition">
                  <td className="p-3 font-bold text-brand-900">{item.part}</td>
                  <td className="p-3 font-semibold text-amber-800">
                    {editingMusic ? (
                      <input
                        value={item.number}
                        onChange={(e) => {
                          const updated = [...musicOrder]
                          updated[idx].number = e.target.value
                          setMusicOrder(updated)
                        }}
                        className="rounded border border-stone-200 px-2 py-1 text-xs w-24"
                      />
                    ) : (
                      item.number
                    )}
                  </td>
                  <td className="p-3 font-serif font-bold text-stone-900 text-sm">
                    {editingMusic ? (
                      <input
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...musicOrder]
                          updated[idx].title = e.target.value
                          setMusicOrder(updated)
                        }}
                        className="rounded border border-stone-200 px-2 py-1 text-xs w-full"
                      />
                    ) : (
                      item.title
                    )}
                  </td>
                  <td className="p-3 text-stone-600">
                    {editingMusic ? (
                      <input
                        value={item.tune || ''}
                        onChange={(e) => {
                          const updated = [...musicOrder]
                          updated[idx].tune = e.target.value
                          setMusicOrder(updated)
                        }}
                        className="rounded border border-stone-200 px-2 py-1 text-xs w-36"
                      />
                    ) : (
                      item.tune || 'Traditional'
                    )}
                  </td>
                  <td className="p-3 text-stone-500 font-mono text-[11px]">{item.key || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SATB Voice Sections & Practice Roster Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SATB Voice Sections */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-brand-900">SATB Voice Sections & Attendance</h2>
              <p className="text-xs text-stone-600">Track choir member confirmations for Sunday service.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              {totalConfirmed} / {totalSingers} Present
            </span>
          </div>

          <div className="space-y-3">
            {satbRoster.map((sec, idx) => (
              <div
                key={sec.section}
                className="flex items-center justify-between rounded-xl border border-stone-200/80 bg-white/80 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-stone-900">{sec.section}</span>
                    <span className="text-[11px] text-stone-500">• Section Lead: {sec.lead}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 w-32 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-brand-700 rounded-full"
                        style={{ width: `${(sec.confirmed / sec.count) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-brand-900">
                      {sec.confirmed} / {sec.count}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAttendance(idx)}
                  className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Adjust Count
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rehearsal Schedule */}
        <div className="milk-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-brand-900">Choir Rehearsal Schedule</h2>
            <span className="text-xs font-bold text-amber-800">Weekly Practices</span>
          </div>

          <div className="space-y-3">
            {rehearsals.map((r, i) => (
              <div key={i} className="rounded-xl border border-stone-200/80 bg-white/80 p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    {r.location}
                  </span>
                  <span className="text-[11px] font-semibold text-brand-800 flex items-center gap-1">
                    <Clock size={12} /> {r.date}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-base font-bold text-brand-900">{r.title}</h3>
                <p className="mt-1 text-xs text-stone-600">Repertoire: {r.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sheet Music & Audio Practice Vault */}
      <div className="milk-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-900">Sheet Music & Audio Practice Vault</h2>
            <p className="text-xs text-stone-600">Choral scores, anthem parts, and audio training tracks.</p>
          </div>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-800">
            {sheetMusicVault.length} Liturgical Pieces
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sheetMusicVault.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-stone-200/80 bg-white/90 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold text-stone-500">
                  <span className="rounded bg-brand-50 px-2 py-0.5 text-brand-800">{item.type}</span>
                  <span>{item.pages}</span>
                </div>
                <h3 className="mt-3 font-serif text-sm font-bold text-brand-900">{item.title}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <Volume2 size={13} /> {item.audio}
                </span>
                <button
                  onClick={() => {
                    setFeedback(`Opening sheet music for "${item.title}"`)
                    setTimeout(() => setFeedback(null), 3000)
                  }}
                  className="font-bold text-brand-700 hover:underline"
                >
                  View Score
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
