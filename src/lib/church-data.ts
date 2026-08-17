import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from './firebase'

export type ChurchCollection = 'announcements' | 'events' | 'sermons' | 'ministries' | 'giving' | 'prayerRequests'

export type ChurchRecord = {
  id: string
  title: string
  description?: string
  date?: string
  status?: string
  amount?: number
  category?: string
  pastoralNotes?: string
  preacher?: string
  scripture?: string
  location?: string
  hymnNumber?: string
  leader?: string
  memberCount?: number
  createdAt?: unknown
}

export const collectionLabels: Record<ChurchCollection, string> = {
  announcements: 'Announcements',
  events: 'Events',
  sermons: 'Sermons',
  ministries: 'Ministries',
  giving: 'Giving',
  prayerRequests: 'Prayer requests',
}

// Authentic Anglican Church seed dataset for offline fallback & rich prototyping
export const anglicanSeedData: Record<ChurchCollection, ChurchRecord[]> = {
  announcements: [
    {
      id: 'ann-1',
      title: 'Parish Annual Harvest Thanksgiving Service',
      description: 'Join us for our Annual Parish Harvest & Thanksgiving Holy Communion service. Families are invited to bring agricultural produce, non-perishables, and thanksgiving offerings.',
      date: 'This Sunday, 9:00 AM',
      status: 'Published',
      category: 'Parish Notice',
    },
    {
      id: 'ann-2',
      title: 'Confirmation Classes & Baptism Preparation',
      description: 'Registration is now open for parish catechism and youth confirmation candidates with the Vicar. Classes commence next Saturday in the Lady Chapel.',
      date: 'Next Saturday',
      status: 'Published',
      category: 'Spiritual Formation',
    },
    {
      id: 'ann-3',
      title: 'Choral Evensong & St. Cecilia Organ Recital',
      description: 'The Parish Choir presents a festival Choral Evensong featuring works by Stanford, Gibbons, and John Rutter. All parishioners and guests are warmly welcome.',
      date: 'Next Sunday, 5:30 PM',
      status: 'Published',
      category: 'Music Ministry',
    },
    {
      id: 'ann-4',
      title: 'Anglican Youth Fellowship (AYF) Monthly Retreat',
      description: 'Theme: "Firmly Rooted in Christ: Colossians 2:6-7". Bible study, fellowship, and outdoor leadership workshop at the Parish Grounds.',
      date: 'Saturday, 10:00 AM',
      status: 'Published',
      category: 'Youth',
    },
  ],
  events: [
    {
      id: 'evt-1',
      title: 'Sunday Holy Eucharist (First Service)',
      description: 'Traditional Anglican Holy Communion with Book of Common Prayer liturgy and organ accompaniment.',
      date: '2026-08-23',
      location: 'Main Sanctuary',
      status: 'Scheduled',
      category: 'Worship',
    },
    {
      id: 'evt-2',
      title: 'Parish Sung Eucharist & Family Worship',
      description: 'Choral Holy Communion with full Parish Choir, sermon, Sunday School classes, and parish fellowship coffee hour.',
      date: '2026-08-23',
      location: 'Main Sanctuary & Memorial Hall',
      status: 'Scheduled',
      category: 'Worship',
    },
    {
      id: 'evt-3',
      title: 'Midweek Holy Communion & Intercession',
      description: 'Quiet communion service with healing prayers and litany of intercessions for our parish and nation.',
      date: '2026-08-26',
      location: 'St. Michael Chapel',
      status: 'Scheduled',
      category: 'Spiritual Life',
    },
    {
      id: 'evt-4',
      title: 'Choir Rehearsal & Hymnody Practice',
      description: 'Full choir rehearsal preparing Introits, Responsorial Psalms, and Anthem for upcoming Sunday service.',
      date: '2026-08-27',
      location: 'Choir Vestry',
      status: 'Scheduled',
      category: 'Music',
    },
    {
      id: 'evt-5',
      title: 'Parish Standing Committee / Vestry Meeting',
      description: 'Monthly administrative and financial oversight meeting with the Rector and Churchwardens.',
      date: '2026-08-29',
      location: 'Council Boardroom',
      status: 'Scheduled',
      category: 'Administration',
    },
  ],
  sermons: [
    {
      id: 'serm-1',
      title: 'The Unfailing Anchor of Hope',
      description: 'A study on finding enduring peace and purpose amidst life’s stormy seasons through Christ.',
      preacher: 'The Venerable Archdeacon / Rector',
      scripture: 'Hebrews 6:19-20',
      date: '2026-08-16',
      status: 'Published',
      category: 'Sunday Sermon',
    },
    {
      id: 'serm-2',
      title: 'Walking in the Spirit of Grace',
      description: 'Examining the transformative power of God’s grace in our daily relationships and community life.',
      preacher: 'Rev. Canon Assistant Priest',
      scripture: 'Galatians 5:22-26',
      date: '2026-08-09',
      status: 'Published',
      category: 'Sermon Series',
    },
    {
      id: 'serm-3',
      title: 'The Great Commission in Our Generation',
      description: 'How modern disciples can live out faith, hospitality, and evangelism in our local neighborhood.',
      preacher: 'The Rector',
      scripture: 'Matthew 28:18-20',
      date: '2026-08-02',
      status: 'Published',
      category: 'Mission & Outreach',
    },
  ],
  ministries: [
    {
      id: 'min-1',
      title: 'Anglican Parish Choir & Music Guild',
      description: 'Leads our liturgical singing, Choral Matins, Evensong, and festival anthems across four-part harmony (SATB).',
      leader: 'Choir President & Organist',
      memberCount: 38,
      status: 'Active',
    },
    {
      id: 'min-2',
      title: 'Anglican Youth Fellowship (AYF)',
      description: 'Engaging teens and young adults in biblical discipleship, community outreach, missions, and fellowship.',
      leader: 'Youth Ministry Director',
      memberCount: 64,
      status: 'Active',
    },
    {
      id: 'min-3',
      title: 'Mothers’ Union & Women’s Guild',
      description: 'Christian care for families, charity visitations, marriage enrichment, and parish welfare outreach.',
      leader: 'Mothers’ Union President',
      memberCount: 52,
      status: 'Active',
    },
    {
      id: 'min-4',
      title: 'Guild of St. Stephen (Altar Servers & Ushers)',
      description: 'Assisting clergy at the altar, cross-bearing, thurible, gospel procession, and sanctuary hospitality.',
      leader: 'Head Verger / Master of Ceremonies',
      memberCount: 26,
      status: 'Active',
    },
    {
      id: 'min-5',
      title: 'Media, Sound & Digital Broadcast Team',
      description: 'Managing sanctuary sound engineering, YouTube live-streaming, multimedia projection, and church archive.',
      leader: 'Media Coordinator',
      memberCount: 14,
      status: 'Active',
    },
  ],
  giving: [
    {
      id: 'giv-1',
      title: 'Sunday General Tithes & Offerings',
      description: 'Parish worship collections and digital bank transfers for regular church operations.',
      amount: 4850.00,
      date: '2026-08-16',
      status: 'Verified',
      category: 'General Tithe',
    },
    {
      id: 'giv-2',
      title: 'Organ Restoration & Cathedral Building Fund',
      description: 'Special pledge contributions dedicated to sanctuary pipe organ overhaul and roof maintenance.',
      amount: 2300.00,
      date: '2026-08-14',
      status: 'Verified',
      category: 'Building Fund',
    },
    {
      id: 'giv-3',
      title: 'Harvest Thanksgiving Firstfruits Pledges',
      description: 'Advance seed pledges towards parish welfare and diocesan mission quotas.',
      amount: 3750.00,
      date: '2026-08-10',
      status: 'Verified',
      category: 'Thanksgiving',
    },
    {
      id: 'giv-4',
      title: 'Parish Benevolence & Community Food Drive',
      description: 'Targeted fund for assisting vulnerable families and widows within our local community.',
      amount: 1200.00,
      date: '2026-08-08',
      status: 'Verified',
      category: 'Benevolence',
    },
  ],
  prayerRequests: [
    {
      id: 'pr-1',
      title: 'Healing for Sister Margaret after surgery',
      description: 'Please uphold Sister Margaret in prayer as she recovers from hip replacement surgery at St. Jude Hospital.',
      date: '2026-08-16',
      status: 'In Pastoral Prayer',
      category: 'Healing',
      pastoralNotes: 'Vicar visited on Tuesday. Recovery is progressing smoothly with physical therapy.',
    },
    {
      id: 'pr-2',
      title: 'Thanksgiving for baby Michael’s safe arrival',
      description: 'The Davies family gives glory to God for the safe birth of their healthy baby boy, Michael.',
      date: '2026-08-15',
      status: 'Answered & Praise',
      category: 'Thanksgiving',
      pastoralNotes: 'Baptism counseling scheduled with the parents for September.',
    },
    {
      id: 'pr-3',
      title: 'Bereavement comfort for the Okafor family',
      description: 'Praying for divine comfort and peace for the entire family following the passing of Elder Samuel Okafor.',
      date: '2026-08-14',
      status: 'In Pastoral Prayer',
      category: 'Bereavement',
      pastoralNotes: 'Funeral service set for Friday 28th. Pastoral care team delivering meals this week.',
    },
    {
      id: 'pr-4',
      title: 'Guidance and success for university entrance exams',
      description: 'Youth members preparing for entrance examinations and national matriculation this month.',
      date: '2026-08-12',
      status: 'Prayed & Followed Up',
      category: 'Youth & Guidance',
      pastoralNotes: 'AYF prayer vigil held on Friday. Continued encouragement sent by youth pastor.',
    },
  ],
}

// Contact form submissions
export type ContactSubmission = {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  status?: 'new' | 'replied' | 'archived'
  category?: string
  createdAt?: unknown
}

export const seedContactSubmissions: ContactSubmission[] = [
  {
    id: 'cnt-1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.org',
    subject: 'Inquiry regarding Infant Holy Baptism',
    message: 'Good day Father. My husband and I recently moved into the parish and would love to arrange Holy Baptism for our 4-month-old daughter. Could you please advise on dates and baptismal preparation classes?',
    status: 'new',
    category: 'Sacramental Request',
  },
  {
    id: 'cnt-2',
    name: 'David K. Mensah',
    email: 'david.mensah@example.com',
    subject: 'Joining the Anglican Parish Choir (Tenor)',
    message: 'Hello, I have been attending Sunday services for two months and used to sing tenor in my previous cathedral choir. I would love to audition or join the choir rehearsals.',
    status: 'new',
    category: 'Choir & Music',
  },
  {
    id: 'cnt-3',
    name: 'Grace Thompson',
    email: 'grace.t@example.net',
    subject: 'Parish Hall Booking for Wedding Reception',
    message: 'We are inquiring about the availability of the Memorial Parish Hall on Saturday, November 14th for an afternoon reception. Please share rental guidelines and fees.',
    status: 'replied',
    category: 'Hall Booking',
  },
]

// Firestore helper functions with undefined sanitizer
function stripUndefined<T extends Record<string, unknown>>(values: T): Partial<T> {
  const result: Partial<T> = {}
  for (const key of Object.keys(values) as (keyof T)[]) {
    if (values[key] !== undefined) result[key] = values[key]
  }
  return result
}

export function subscribeToCollection(name: ChurchCollection, callback: (items: ChurchRecord[]) => void) {
  if (!db) {
    callback(anglicanSeedData[name] || [])
    return () => undefined
  }
  return onSnapshot(
    query(collection(db, name), orderBy('createdAt', 'desc')),
    (snapshot) => {
      if (snapshot.empty) {
        callback(anglicanSeedData[name] || [])
      } else {
        callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ChurchRecord)))
      }
    },
    (err) => {
      console.warn(`Firestore read error on ${name}, using seed data:`, err)
      callback(anglicanSeedData[name] || [])
    }
  )
}

export async function createRecord(name: ChurchCollection, values: Omit<ChurchRecord, 'id' | 'createdAt'>) {
  if (!db) {
    console.log(`[Demo/Offline] Created record in ${name}:`, values)
    return { id: `local-${Date.now()}` }
  }
  return addDoc(collection(db, name), { ...stripUndefined(values), createdAt: serverTimestamp() })
}

export async function editRecord(name: ChurchCollection, id: string, values: Partial<Omit<ChurchRecord, 'id' | 'createdAt'>>) {
  if (!db) {
    console.log(`[Demo/Offline] Updated record ${id} in ${name}:`, values)
    return
  }
  return updateDoc(doc(db, name, id), stripUndefined(values))
}

export async function removeRecord(name: ChurchCollection, id: string) {
  if (!db) {
    console.log(`[Demo/Offline] Removed record ${id} from ${name}`)
    return
  }
  return deleteDoc(doc(db, name, id))
}

export async function submitContactForm(values: Omit<ContactSubmission, 'id' | 'createdAt'>) {
  if (!db) {
    console.log('[Demo/Offline] Contact form submitted:', values)
    return { id: `local-cnt-${Date.now()}` }
  }
  return addDoc(collection(db, 'contactSubmissions'), { ...stripUndefined(values), createdAt: serverTimestamp() })
}

export function subscribeToContactSubmissions(callback: (items: ContactSubmission[]) => void) {
  if (!db) {
    callback(seedContactSubmissions)
    return () => undefined
  }
  return onSnapshot(
    query(collection(db, 'contactSubmissions'), orderBy('createdAt', 'desc')),
    (snapshot) => {
      if (snapshot.empty) {
        callback(seedContactSubmissions)
      } else {
        callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as ContactSubmission)))
      }
    },
    (err) => {
      console.warn('Firestore read error on contactSubmissions, using seed data:', err)
      callback(seedContactSubmissions)
    }
  )
}

export async function removeContactSubmission(id: string) {
  if (!db) {
    console.log(`[Demo/Offline] Removed contact submission ${id}`)
    return
  }
  return deleteDoc(doc(db, 'contactSubmissions', id))
}