import { useCallback } from 'react'
import { SearchResult } from '../hooks/useAdvancedSearch'

export function useExport() {
  const exportToCSV = useCallback((data: any[], filename: string) => {
    // Convert data to CSV format
    if (data.length === 0) {
      alert('No data to export')
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map((item) =>
        headers
          .map((header) => {
            const value = item[header]
            if (value === null || value === undefined) {
              return ''
            }
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value)
            return stringValue.includes(',')
              ? `"${stringValue.replace(/"/g, '""')}"`
              : stringValue
          })
          .join(',')
      ),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }, [])

  const exportSearchResultsToCSV = useCallback(
    (results: SearchResult[], filename: string = 'search-results') => {
      const data = results.map((result) => ({
        Title: result.title,
        Type: result.type,
        Status: result.status || 'N/A',
        'Created By': result.createdBy || 'N/A',
        'Created At': result.createdAt ? result.createdAt.toLocaleDateString() : 'N/A',
        Description: result.description || '',
      }))

      exportToCSV(data, filename)
    },
    [exportToCSV]
  )

  const exportToJSON = useCallback((data: any[], filename: string) => {
    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }, [])

  return {
    exportToCSV,
    exportToJSON,
    exportSearchResultsToCSV,
  }
}
