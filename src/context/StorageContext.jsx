import { createContext, useContext, useState, useEffect } from 'react'

const StorageContext = createContext(null)

const STORAGE_KEYS = {
    FAVORITES: 'plainly_favorites',
    HISTORY: 'plainly_history',
    RESULTS_CACHE: 'plainly_results_cache',
}

const MAX_HISTORY_ITEMS = 50 // Increased from 10 to store more history
const MAX_RESULTS_CACHE = 100 // Cache up to 100 calculation results

export function StorageProvider({ children }) {
    const [favorites, setFavorites] = useState([])
    const [history, setHistory] = useState([])
    const [resultsCache, setResultsCache] = useState({}) // { path: { result, timestamp } }

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES)
            const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY)
            const savedResults = localStorage.getItem(STORAGE_KEYS.RESULTS_CACHE)

            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites))
            }
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory))
            }
            if (savedResults) {
                setResultsCache(JSON.parse(savedResults))
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error)
        }
    }, [])

    // Save favorites to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites))
        } catch (error) {
            console.error('Error saving favorites:', error)
        }
    }, [favorites])

    // Save history to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history))
        } catch (error) {
            console.error('Error saving history:', error)
        }
    }, [history])

    // Save results cache to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.RESULTS_CACHE, JSON.stringify(resultsCache))
        } catch (error) {
            console.error('Error saving results cache:', error)
        }
    }, [resultsCache])

    const toggleFavorite = (calculatorPath) => {
        setFavorites(prev => {
            if (prev.includes(calculatorPath)) {
                return prev.filter(path => path !== calculatorPath)
            } else {
                return [...prev, calculatorPath]
            }
        })
    }

    const isFavorite = (calculatorPath) => {
        return favorites.includes(calculatorPath)
    }

    // Enhanced: Now stores result value, type (AI/calculator), and more details
    const addToHistory = (entry) => {
        // entry: { path, name, result, resultUnit, type, timestamp }
        // type can be: 'calculator', 'ai', 'converter'
        setHistory(prev => {
            // Remove duplicate if exists
            const filtered = prev.filter(item =>
                !(item.path === entry.path && item.result === entry.result)
            )
            // Add new entry at the beginning
            const updated = [{
                ...entry,
                timestamp: Date.now(),
                type: entry.type || 'calculator'
            }, ...filtered]
            // Keep only MAX_HISTORY_ITEMS
            return updated.slice(0, MAX_HISTORY_ITEMS)
        })

        // Also cache the result for this path
        if (entry.result) {
            setResultsCache(prev => {
                const updated = {
                    ...prev,
                    [entry.path]: {
                        result: entry.result,
                        resultUnit: entry.resultUnit,
                        name: entry.name,
                        timestamp: Date.now()
                    }
                }
                // Keep cache size limited
                const keys = Object.keys(updated)
                if (keys.length > MAX_RESULTS_CACHE) {
                    // Remove oldest entries
                    const sorted = keys.sort((a, b) =>
                        updated[a].timestamp - updated[b].timestamp
                    )
                    sorted.slice(0, keys.length - MAX_RESULTS_CACHE).forEach(key => {
                        delete updated[key]
                    })
                }
                return updated
            })
        }
    }

    // Get cached result for a specific tool
    const getCachedResult = (path) => {
        return resultsCache[path] || null
    }

    // Get history with stored results
    const getHistoryWithResults = () => {
        return history.map(item => ({
            ...item,
            cachedResult: resultsCache[item.path]
        }))
    }

    const clearHistory = () => {
        setHistory([])
        setResultsCache({})
    }

    const value = {
        favorites,
        history,
        resultsCache,
        toggleFavorite,
        isFavorite,
        addToHistory,
        getCachedResult,
        getHistoryWithResults,
        clearHistory,
    }

    return (
        <StorageContext.Provider value={value}>
            {children}
        </StorageContext.Provider>
    )
}

export function useStorage() {
    const context = useContext(StorageContext)
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider')
    }
    return context
}

export default StorageContext

