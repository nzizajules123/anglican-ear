import { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface CalendarEvent {
  id: string
  title: string
  startDate: Date
  endDate: Date
  status?: string
  location?: string
  description?: string
  color?: string
}

export function useCalendarEvents(month: Date) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db) {
      setLoading(false)
      setError('Firebase not initialized')
      return
    }

    // Get first and last day of month
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0)

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'events'),
        where('startDate', '>=', firstDay),
        where('startDate', '<=', lastDay)
      ),
      (snapshot) => {
        const eventsList = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || 'Untitled',
            startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate),
            endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate),
            status: data.status,
            location: data.location,
            description: data.description,
            color: data.color || '#3b82f6',
          }
        })
        setEvents(eventsList)
        setError(null)
      },
      (err) => {
        console.error('Error fetching calendar events:', err)
        setError(err.message)
      }
    )

    setLoading(false)
    return unsubscribe
  }, [month])

  return { events, loading, error }
}

export function getDaysInMonth(date: Date): Date[] {
  const days: Date[] = []
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  // Add previous month's days to fill the first week
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  // Add all days from start to end of month
  const current = new Date(startDate)
  while (current <= lastDay) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return days
}

export function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(
    (event) =>
      event.startDate.toDateString() === date.toDateString() ||
      (event.startDate < date && event.endDate > date)
  )
}
