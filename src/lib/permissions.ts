import type { Role, UserProfile } from '../types/roles'

/**
 * Single source of truth for "who can do what".
 * The UI reads this map, and firestore.rules mirrors it server-side —
 * keep the two in sync whenever a list changes.
 */
export const permissions = {
  manageEvents: ['super_admin', 'pastor', 'secretary', 'event_manager'] as Role[],
  uploadMedia: ['super_admin', 'pastor', 'secretary', 'event_manager', 'media'] as Role[],
  postAnnouncements: ['super_admin', 'pastor', 'secretary', 'event_manager'] as Role[],
  previewRoles: ['super_admin', 'pastor'] as Role[],
  siteWideAnalytics: ['super_admin', 'pastor'] as Role[],
  choirChat: ['super_admin', 'pastor', 'choir_president', 'media'] as Role[],
}

export type Permission = keyof typeof permissions

export function can(role: Role | undefined | null, permission: Permission): boolean {
  return Boolean(role && permissions[permission].includes(role))
}

/**
 * Choir chat is open to the roles above, plus any approved member of a choir.
 */
export function canUseChoirChat(profile: UserProfile | null | undefined): boolean {
  if (!profile) return false
  if (can(profile.role, 'choirChat')) return true
  return Boolean(profile.choirName && profile.choirStatus === 'approved')
}

export function canPreviewRoles(profile: UserProfile | null | undefined): boolean {
  return can(profile?.role, 'previewRoles')
}
