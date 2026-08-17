import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { subscribeToAnnouncements, isForAudience, type Announcement } from '../lib/announcements'
import { useAuth } from '../features/auth/AuthProvider'
import { useNotifications } from './useNotifications'

function readKey(uid: string) {
  return `announcements-read:${uid}`
}

function loadRead(uid: string): string[] {
  try {
    return JSON.parse(window.localStorage.getItem(readKey(uid)) || '[]') as string[]
  } catch {
    return []
  }
}

/**
 * Live announcements for the signed-in user, filtered to their audience,
 * with per-user read state and a toast for anything that arrives while
 * they have the app open.
 */
export function useAnnouncementFeed() {
  const { user, profile } = useAuth()
  const { info } = useNotifications()
  const [all, setAll] = useState<Announcement[]>([])
  const [readIds, setReadIds] = useState<string[]>([])
  const seededRef = useRef(false)
  const seenRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    setReadIds(user ? loadRead(user.uid) : [])
    seededRef.current = false
    seenRef.current = new Set()
  }, [user])

  useEffect(() => subscribeToAnnouncements(setAll), [])

  const visible = useMemo(
    () => all.filter((item) => isForAudience(item, profile?.role)),
    [all, profile?.role]
  )

  useEffect(() => {
    if (!visible.length) return
    if (!seededRef.current) {
      visible.forEach((item) => seenRef.current.add(item.id))
      seededRef.current = true
      return
    }
    visible.forEach((item) => {
      if (seenRef.current.has(item.id)) return
      seenRef.current.add(item.id)
      info(item.message || '', 7000, item.title)
    })
  }, [visible, info])

  const markRead = useCallback(
    (ids: string[]) => {
      if (!user) return
      setReadIds((previous) => {
        const next = Array.from(new Set([...previous, ...ids]))
        try {
          window.localStorage.setItem(readKey(user.uid), JSON.stringify(next.slice(-300)))
        } catch {
          /* storage unavailable */
        }
        return next
      })
    },
    [user]
  )

  const markAllRead = useCallback(() => markRead(visible.map((item) => item.id)), [markRead, visible])

  const unread = visible.filter((item) => !readIds.includes(item.id))

  return { announcements: visible, unread, unreadCount: unread.length, markRead, markAllRead }
}
