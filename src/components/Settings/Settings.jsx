import { useSettings } from '../../context/SettingsContext'
import { useStorage } from '../../context/StorageContext'
import { X, Moon, Sun, Palette, Hash, DollarSign, Ruler, Trash2, RotateCcw } from 'lucide-react'
import './Settings.css'

const THEMES = [
    { id: 'dark', name: 'Dark', icon: Moon, color: '#0a0a0a' },
    { id: 'light', name: 'Light', icon: Sun, color: '#f5f5f0' },
    { id: 'sepia', name: 'Sepia', icon: Palette, color: '#f4ecd8' },
    { id: 'rose', name: 'Rosé', icon: Palette, color: '#1a1215' }
]

const DECIMAL_OPTIONS = [
    { value: 2, label: '2 digits' },
    { value: 4, label: '4 digits' },
    { value: 6, label: '6 digits' }
]

const CURRENCY_OPTIONS = [
    { value: 'USD', label: '$ USD', symbol: '$' },
    { value: 'EUR', label: '€ EUR', symbol: '€' },
    { value: 'GBP', label: '£ GBP', symbol: '£' },
    { value: 'INR', label: '₹ INR', symbol: '₹' }
]

const UNIT_OPTIONS = [
    { value: 'metric', label: 'Metric (kg, km, °C)' },
    { value: 'imperial', label: 'Imperial (lb, mi, °F)' }
]

function Settings() {
    const { settings, updateSetting, resetSettings, isSettingsOpen, closeSettings } = useSettings()
    const { clearHistory, favorites } = useStorage()

    if (!isSettingsOpen) return null

    const handleClearHistory = () => {
        if (confirm('Clear all recent calculations?')) {
            clearHistory()
        }
    }

    const handleResetAll = () => {
        if (confirm('Reset all settings to defaults?')) {
            resetSettings()
        }
    }

    return (
        <div className="settings-overlay" onClick={closeSettings}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="settings-header">
                    <h2>Settings</h2>
                    <button className="settings-close" onClick={closeSettings}>
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {/* Theme Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <Palette size={16} />
                            Appearance
                        </h3>
                        <div className="theme-grid">
                            {THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`theme-option ${settings.theme === theme.id ? 'active' : ''}`}
                                    onClick={() => updateSetting('theme', theme.id)}
                                    style={{ '--theme-preview': theme.color }}
                                >
                                    <div className="theme-preview"></div>
                                    <span>{theme.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Precision Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <Hash size={16} />
                            Decimal Precision
                        </h3>
                        <div className="option-row">
                            {DECIMAL_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`option-btn ${settings.decimalPlaces === option.value ? 'active' : ''}`}
                                    onClick={() => updateSetting('decimalPlaces', option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <DollarSign size={16} />
                            Default Currency
                        </h3>
                        <div className="option-row">
                            {CURRENCY_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`option-btn ${settings.currency === option.value ? 'active' : ''}`}
                                    onClick={() => updateSetting('currency', option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Units Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <Ruler size={16} />
                            Unit System
                        </h3>
                        <div className="option-row">
                            {UNIT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    className={`option-btn wide ${settings.unitSystem === option.value ? 'active' : ''}`}
                                    onClick={() => updateSetting('unitSystem', option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="settings-section">
                        <h3 className="settings-section-title">
                            <Trash2 size={16} />
                            Data Management
                        </h3>
                        <div className="data-actions">
                            <button className="data-btn" onClick={handleClearHistory}>
                                <Trash2 size={16} />
                                Clear History
                            </button>
                            <button className="data-btn danger" onClick={handleResetAll}>
                                <RotateCcw size={16} />
                                Reset All Settings
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="settings-footer">
                    <p>Data is stored locally and never leaves your device.</p>
                </div>
            </div>
        </div>
    )
}

export default Settings
