import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, Query, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

export interface FilterOptions {
  searchTerm?: string
  status?: string
  dateFrom?: Date
  dateTo?: Date
  createdBy?: string
  sortBy?: 'newest' | 'oldest' | 'alphabetical'
}

export interface SearchResult {
  id: string
  title: string
  description?: string
  type: string
  collectionName: string
  status?: string
  createdAt?: Date
  createdBy?: string
}

export function useAdvancedSearch(collectionName: string, filters: FilterOptions) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!db || !collectionName) {
      setResults([])
      setLoading(false)
      return
    }

    const buildQuery = () => {
      let constraints: any[] = []

      // Add status filter if provided
      if (filters.status) {
        constraints.push(where('status', '==', filters.status))
      }

      // Add date range filters
      if (filters.dateFrom) {
        constraints.push(where('createdAt', '>=', filters.dateFrom))
      }
      if (filters.dateTo) {
        constraints.push(where('createdAt', '<=', filters.dateTo))
      }

      // Add creator filter
      if (filters.createdBy) {
        constraints.push(where('createdBy', '==', filters.createdBy))
      }

      // Add sorting
      const sortOrder = filters.sortBy === 'oldest' ? 'asc' : 'desc'
      constraints.push(orderBy('createdAt', sortOrder))

      return constraints
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const constraints = buildQuery()
        
        const q = constraints.length > 0 
          ? query(collection(db, collectionName), ...constraints)
          : query(collection(db, collectionName), orderBy('createdAt', 'desc'))

        const snapshot = await getDocs(q)
        let items = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title || doc.data().name || 'Untitled',
          description: doc.data().description,
          type: collectionName,
          collectionName,
          status: doc.data().status,
          createdAt: doc.data().createdAt?.toDate?.(),
          createdBy: doc.data().createdBy,
        }))

        // Apply text search if needed
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          items = items.filter(
            (item) =>
              item.title.toLowerCase().includes(searchLower) ||
              item.description?.toLowerCase().includes(searchLower)
          )
        }

        // Apply alphabetical sorting if needed
        if (filters.sortBy === 'alphabetical') {
          items.sort((a, b) => a.title.localeCompare(b.title))
        }

        setResults(items)
        setError(null)
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'Search failed')
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collectionName, filters])

  return { results, loading, error }
}
