import { createContext, useContext, useState, useEffect } from 'react'

const StorageContext = createContext(null)

const STORAGE_KEYS = {
    FAVORITES: 'plainly_favorites',
    HISTORY: 'plainly_history',
}

const MAX_HISTORY_ITEMS = 10

export function StorageProvider({ children }) {
    const [favorites, setFavorites] = useState([])
    const [history, setHistory] = useState([])

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES)
            const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY)

            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites))
            }
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory))
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

    const addToHistory = (entry) => {
        // entry: { path, name, result, timestamp }
        setHistory(prev => {
            // Remove duplicate if exists
            const filtered = prev.filter(item => item.path !== entry.path)
            // Add new entry at the beginning
            const updated = [{ ...entry, timestamp: Date.now() }, ...filtered]
            // Keep only MAX_HISTORY_ITEMS
            return updated.slice(0, MAX_HISTORY_ITEMS)
        })
    }

    const clearHistory = () => {
        setHistory([])
    }

    const value = {
        favorites,
        history,
        toggleFavorite,
        isFavorite,
        addToHistory,
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
