import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCalendarEvents, getDaysInMonth, getEventsForDate } from '../../hooks/useCalendarEvents'
import { Link } from 'react-router-dom'

interface EventCalendarProps {
  onSelectEvent?: (eventId: string) => void
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function EventCalendar({ onSelectEvent }: EventCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { events, loading, error } = useCalendarEvents(currentMonth)

  const days = getDaysInMonth(currentMonth)
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  return (
    <div className="milk-card rounded-lg p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-brand-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="rounded-lg border border-stone-300 p-2 hover:bg-stone-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="rounded-lg border border-stone-300 p-2 hover:bg-stone-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-900">
          Error loading events: {error}
        </div>
      )}

      <div className="mt-6">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-stone-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date) => {
            const dayEvents = getEventsForDate(events, date)
            const isCurrentDay = isCurrentMonth(date)
            const isTodayDate = isToday(date)

            return (
              <div
                key={date.toDateString()}
                className={`min-h-24 rounded-lg p-2 ${
                  isTodayDate
                    ? 'bg-brand-100 ring-2 ring-brand-500'
                    : isCurrentDay
                      ? 'bg-white border border-stone-200'
                      : 'bg-stone-50'
                }`}
              >
                <div className={`text-sm font-semibold ${isCurrentDay ? 'text-brand-900' : 'text-stone-400'}`}>
                  {date.getDate()}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.length > 0 && (
                    <>
                      {dayEvents.slice(0, 2).map((event) => (
                        <Link
                          key={event.id}
                          to={`/dashboard/events/${event.id}`}
                          onClick={() => onSelectEvent?.(event.id)}
                          className="block truncate rounded bg-blue-100 px-1 py-0.5 text-xs font-medium text-blue-900 hover:bg-blue-200"
                          title={event.title}
                        >
                          {event.title}
                        </Link>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-stone-500 px-1">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-brand-100 ring-2 ring-brand-500" />
          <span className="text-stone-600">Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-stone-200 bg-white" />
          <span className="text-stone-600">Event day</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-stone-50" />
          <span className="text-stone-600">Other month</span>
        </div>
      </div>
    </div>
  )
}
