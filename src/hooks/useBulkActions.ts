import { useState } from 'react'
import { db } from '../lib/firebase'
import { doc, updateDoc, writeBatch, collection, getDocs, query, where } from 'firebase/firestore'

export interface BulkActionResult {
  success: number
  failed: number
  errors: string[]
}

export function useBulkActions(collectionName: string) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<BulkActionResult | null>(null)

  const updateStatus = async (ids: string[], newStatus: string): Promise<BulkActionResult> => {
    if (!db || ids.length === 0) {
      return { success: 0, failed: ids.length, errors: ['No IDs provided or Firebase not initialized'] }
    }

    setLoading(true)
    const results: BulkActionResult = { success: 0, failed: 0, errors: [] }

    try {
      const batch = writeBatch(db)

      for (const id of ids) {
        try {
          const docRef = doc(db, collectionName, id)
          batch.update(docRef, { status: newStatus, updatedAt: new Date() })
          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Failed to update ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      await batch.commit()
      setResult(results)
      return results
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      results.failed = ids.length
      results.errors.push(`Batch update failed: ${errorMsg}`)
      setResult(results)
      return results
    } finally {
      setLoading(false)
    }
  }

  const deleteItems = async (ids: string[]): Promise<BulkActionResult> => {
    if (!db || ids.length === 0) {
      return { success: 0, failed: ids.length, errors: ['No IDs provided or Firebase not initialized'] }
    }

    setLoading(true)
    const results: BulkActionResult = { success: 0, failed: 0, errors: [] }

    try {
      const batch = writeBatch(db)

      for (const id of ids) {
        try {
          const docRef = doc(db, collectionName, id)
          batch.delete(docRef)
          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Failed to delete ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      await batch.commit()
      setResult(results)
      return results
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      results.failed = ids.length
      results.errors.push(`Batch delete failed: ${errorMsg}`)
      setResult(results)
      return results
    } finally {
      setLoading(false)
    }
  }

  const updateField = async (ids: string[], fieldName: string, fieldValue: any): Promise<BulkActionResult> => {
    if (!db || ids.length === 0) {
      return { success: 0, failed: ids.length, errors: ['No IDs provided or Firebase not initialized'] }
    }

    setLoading(true)
    const results: BulkActionResult = { success: 0, failed: 0, errors: [] }

    try {
      const batch = writeBatch(db)

      for (const id of ids) {
        try {
          const docRef = doc(db, collectionName, id)
          batch.update(docRef, { [fieldName]: fieldValue, updatedAt: new Date() })
          results.success++
        } catch (error) {
          results.failed++
          results.errors.push(`Failed to update ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      await batch.commit()
      setResult(results)
      return results
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      results.failed = ids.length
      results.errors.push(`Batch update failed: ${errorMsg}`)
      setResult(results)
      return results
    } finally {
      setLoading(false)
    }
  }

  return {
    updateStatus,
    deleteItems,
    updateField,
    loading,
    result,
  }
}
