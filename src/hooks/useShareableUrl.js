import { useEffect, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Custom hook for shareable tool URLs with pre-filled inputs
 * 
 * Usage:
 * const { values, setValues, shareUrl, copyShareUrl } = useShareableUrl({
 *   weight: 70,
 *   height: 170
 * })
 * 
 * This hook:
 * 1. Reads URL query params on mount and sets initial values
 * 2. Provides a shareUrl with current values encoded
 * 3. Provides copyShareUrl function to copy to clipboard
 */
export function useShareableUrl(defaultValues) {
    const location = useLocation()
    const navigate = useNavigate()
    const [values, setValues] = useState(defaultValues)
    const [copied, setCopied] = useState(false)

    // Read URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const urlValues = {}
        let hasParams = false

        Object.keys(defaultValues).forEach(key => {
            const paramValue = params.get(key)
            if (paramValue !== null) {
                hasParams = true
                // Try to parse as number, otherwise keep as string
                const numValue = Number(paramValue)
                urlValues[key] = isNaN(numValue) ? paramValue : numValue
            }
        })

        if (hasParams) {
            setValues(prev => ({ ...prev, ...urlValues }))
        }
    }, []) // Only run on mount

    // Generate shareable URL
    const shareUrl = useCallback(() => {
        const baseUrl = window.location.origin + location.pathname
        const params = new URLSearchParams()

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.set(key, String(value))
            }
        })

        const queryString = params.toString()
        return queryString ? `${baseUrl}?${queryString}` : baseUrl
    }, [location.pathname, values])

    // Copy share URL to clipboard
    const copyShareUrl = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareUrl())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            return true
        } catch (err) {
            console.error('Failed to copy share URL:', err)
            return false
        }
    }, [shareUrl])

    // Update URL without navigation (optional)
    const updateUrl = useCallback(() => {
        const url = shareUrl()
        window.history.replaceState(null, '', url)
    }, [shareUrl])

    return {
        values,
        setValues,
        setValue: (key, value) => setValues(prev => ({ ...prev, [key]: value })),
        shareUrl: shareUrl(),
        copyShareUrl,
        copied,
        updateUrl
    }
}

export default useShareableUrl
