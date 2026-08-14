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

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  phoneNumber: string
  role: Role
  requestedRole?: Role
  choirName?: string
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
