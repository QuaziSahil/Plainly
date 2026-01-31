import { useState, useMemo } from 'react'
import { Globe } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WorldClock() {
    const [selectedTimezones, setSelectedTimezones] = useState([
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'Australia/Sydney'
    ])

    const timezones = [
        { id: 'America/New_York', name: 'New York', flag: '🇺🇸' },
        { id: 'America/Los_Angeles', name: 'Los Angeles', flag: '🇺🇸' },
        { id: 'America/Chicago', name: 'Chicago', flag: '🇺🇸' },
        { id: 'Europe/London', name: 'London', flag: '🇬🇧' },
        { id: 'Europe/Paris', name: 'Paris', flag: '🇫🇷' },
        { id: 'Europe/Berlin', name: 'Berlin', flag: '🇩🇪' },
        { id: 'Asia/Tokyo', name: 'Tokyo', flag: '🇯🇵' },
        { id: 'Asia/Shanghai', name: 'Shanghai', flag: '🇨🇳' },
        { id: 'Asia/Dubai', name: 'Dubai', flag: '🇦🇪' },
        { id: 'Asia/Kolkata', name: 'Mumbai', flag: '🇮🇳' },
        { id: 'Asia/Singapore', name: 'Singapore', flag: '🇸🇬' },
        { id: 'Australia/Sydney', name: 'Sydney', flag: '🇦🇺' },
        { id: 'Pacific/Auckland', name: 'Auckland', flag: '🇳🇿' }
    ]

    const [currentTime, setCurrentTime] = useState(new Date())

    // Update time every second
    useState(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    const getTimeForTimezone = (timezone) => {
        try {
            return currentTime.toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        } catch {
            return '--:--:--'
        }
    }

    const getDateForTimezone = (timezone) => {
        try {
            return currentTime.toLocaleDateString('en-US', {
                timeZone: timezone,
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return '--'
        }
    }

    const addTimezone = (tz) => {
        if (!selectedTimezones.includes(tz) && selectedTimezones.length < 6) {
            setSelectedTimezones([...selectedTimezones, tz])
        }
    }

    const removeTimezone = (tz) => {
        setSelectedTimezones(selectedTimezones.filter(t => t !== tz))
    }

    const localTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    return (
        <CalculatorLayout
            title="World Clock"
            description="View time across different timezones"
            category="Other"
            categoryPath="/other"
            icon={Globe}
            result={localTime}
            resultLabel="Local Time"
        >
            <div className="input-group">
                <label className="input-label">Add Timezone</label>
                <select onChange={(e) => addTimezone(e.target.value)} value="">
                    <option value="">Select timezone...</option>
                    {timezones.filter(tz => !selectedTimezones.includes(tz.id)).map(tz => (
                        <option key={tz.id} value={tz.id}>{tz.flag} {tz.name}</option>
                    ))}
                </select>
            </div>
            <div className="result-details">
                {selectedTimezones.map(tzId => {
                    const tz = timezones.find(t => t.id === tzId) || { name: tzId, flag: '🌍' }
                    return (
                        <div key={tzId} className="result-detail-row" style={{ padding: '12px 0' }}>
                            <div>
                                <span style={{ fontSize: '18px', marginRight: '8px' }}>{tz.flag}</span>
                                <span className="result-detail-label">{tz.name}</span>
                                <div style={{ fontSize: '11px', opacity: 0.6 }}>{getDateForTimezone(tzId)}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>
                                    {getTimeForTimezone(tzId)}
                                </span>
                                <button onClick={() => removeTimezone(tzId)} style={{
                                    background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px'
                                }}>✕</button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </CalculatorLayout>
    )
}

export default WorldClock
