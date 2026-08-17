export const roles = [
  'super_admin',
  'pastor',
  'secretary',
  'choir_president',
  'youth_leader',
  'finance',
  'media',
  'event_manager',
  'member',
] as const

export type Role = (typeof roles)[number]

export interface Choir {
  id: string
  name: string
  description?: string
  director?: string
  rehearsalTime?: string
  memberCount?: number
  createdAt?: unknown
}

export const defaultChoirs: Choir[] = [
  {
    id: 'choir-1',
    name: 'Anglican Cathedral Parish Choir (SATB)',
    description: 'Traditional liturgical choir leading Sunday Sung Eucharists, Choral Matins, and Evensong.',
    director: 'Dr. Julian Bennett (Choir Master & Organist)',
    rehearsalTime: 'Thursdays 6:30 PM & Sundays 8:00 AM',
    memberCount: 38,
  },
  {
    id: 'choir-2',
    name: 'St. Cecilia Youth & Children’s Choir',
    description: 'Youth vocal ensemble exploring contemporary Anglican anthems and festival hymns.',
    director: 'Sister Mary Catherine',
    rehearsalTime: 'Saturdays 3:00 PM',
    memberCount: 22,
  },
  {
    id: 'choir-3',
    name: 'St. Michael Evangelical Praise Guild',
    description: 'Contemporary liturgical gospel praise band with acoustic instruments and polyphony.',
    director: 'Brother David Mensah',
    rehearsalTime: 'Fridays 5:30 PM',
    memberCount: 18,
  },
  {
    id: 'choir-4',
    name: 'Grace Sanctuary Women’s Choral Ensemble',
    description: 'Mothers’ Union & Women’s Guild liturgical choir for special feast day services and weddings.',
    director: 'Mrs. Florence Nightingale-Smythe',
    rehearsalTime: 'Tuesdays 4:30 PM',
    memberCount: 26,
  },
]

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  phoneNumber: string
  role: Role
  requestedRole?: Role
  choirName?: string
  choirSection?: 'Soprano' | 'Alto' | 'Tenor' | 'Bass' | 'Organist / Director'
  choirStatus?: 'pending' | 'approved' | 'rejected'
  bio?: string
  notificationSettings?: {
    emailUpdates?: boolean
    prayerAlerts?: boolean
    choirReminders?: boolean
  }
}

export const roleLabels: Record<Role, string> = {
  super_admin: 'Super admin',
  pastor: 'Pastor',
  secretary: 'Secretary',
  choir_president: 'Choir president',
  youth_leader: 'Youth leader',
  finance: 'Finance',
  media: 'Media',
  event_manager: 'Event manager',
  member: 'Member',
}
