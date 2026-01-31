import { useState, useMemo } from 'react'
import { Globe } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TimezoneConverter() {
    const [time, setTime] = useState('12:00')
    const [fromZone, setFromZone] = useState('America/New_York')
    const [toZone, setToZone] = useState('Asia/Kolkata')

    const timezones = [
        { value: 'America/New_York', label: 'New York (EST/EDT)', offset: -5 },
        { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: -8 },
        { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: -6 },
        { value: 'Europe/London', label: 'London (GMT/BST)', offset: 0 },
        { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: 1 },
        { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: 1 },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
        { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: 8 },
        { value: 'Asia/Kolkata', label: 'India (IST)', offset: 5.5 },
        { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
        { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)', offset: 11 },
        { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)', offset: 13 },
    ]

    const results = useMemo(() => {
        try {
            const [hours, minutes] = time.split(':').map(Number)

            // Get timezone offsets
            const fromTz = timezones.find(tz => tz.value === fromZone)
            const toTz = timezones.find(tz => tz.value === toZone)

            if (!fromTz || !toTz) return { fromTime: '--:--', toTime: '--:--', nextDay: false, prevDay: false }

            // Calculate the difference in hours
            const offsetDiff = toTz.offset - fromTz.offset

            // Convert to minutes for easier calculation
            let totalMinutes = hours * 60 + minutes
            const offsetMinutes = offsetDiff * 60

            // Apply the offset
            let convertedMinutes = totalMinutes + offsetMinutes

            // Handle day overflow
            let nextDay = false
            let prevDay = false

            if (convertedMinutes >= 24 * 60) {
                convertedMinutes -= 24 * 60
                nextDay = true
            } else if (convertedMinutes < 0) {
                convertedMinutes += 24 * 60
                prevDay = true
            }

            // Convert back to hours and minutes
            const convertedHours = Math.floor(convertedMinutes / 60)
            const convertedMins = Math.round(convertedMinutes % 60)

            // Format times
            const formatTime = (h, m) => {
                const hour12 = h % 12 || 12
                const ampm = h >= 12 ? 'PM' : 'AM'
                return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`
            }

            const fromTime = formatTime(hours, minutes)
            const toTime = formatTime(convertedHours, convertedMins)

            // Calculate time difference
            const timeDiff = offsetDiff >= 0 ? `+${offsetDiff}` : `${offsetDiff}`

            return { fromTime, toTime, nextDay, prevDay, timeDiff }
        } catch {
            return { fromTime: '--:--', toTime: '--:--', nextDay: false, prevDay: false, timeDiff: '0' }
        }
    }, [time, fromZone, toZone])

    return (
        <CalculatorLayout
            title="Timezone Converter"
            description="Convert time between timezones"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Globe}
            result={results.toTime}
            resultLabel={results.nextDay ? '(Next Day)' : results.prevDay ? '(Previous Day)' : 'Converted Time'}
        >
            <div className="input-group">
                <label className="input-label">Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="input-group">
                <label className="input-label">From Timezone</label>
                <select value={fromZone} onChange={(e) => setFromZone(e.target.value)}>
                    {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">To Timezone</label>
                <select value={toZone} onChange={(e) => setToZone(e.target.value)}>
                    {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                </select>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Original Time</span>
                    <span className="result-detail-value">{results.fromTime}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Converted Time</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>
                        {results.toTime}
                        {results.nextDay && <span style={{ fontSize: '12px', opacity: 0.7 }}> (+1 day)</span>}
                        {results.prevDay && <span style={{ fontSize: '12px', opacity: 0.7 }}> (-1 day)</span>}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Time Difference</span>
                    <span className="result-detail-value">{results.timeDiff} hours</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TimezoneConverter

