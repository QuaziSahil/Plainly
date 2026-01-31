import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

const STORAGE_KEY = 'plainly_settings'

const DEFAULT_SETTINGS = {
    theme: 'dark',       // dark, light, sepia, rose
    decimalPlaces: 2,    // 2, 4, 6
    currency: 'USD',     // USD, EUR, GBP, INR
    unitSystem: 'metric' // metric, imperial
}

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved) {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) })
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }, [])

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme)
    }, [settings.theme])

    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }, [settings])

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }))
    }

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS)
    }

    const openSettings = () => setIsSettingsOpen(true)
    const closeSettings = () => setIsSettingsOpen(false)

    const value = {
        settings,
        updateSetting,
        resetSettings,
        isSettingsOpen,
        openSettings,
        closeSettings
    }

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}

export default SettingsContext
