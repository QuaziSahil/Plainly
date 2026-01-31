import { useState, useMemo } from 'react'
import { Globe } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TimezoneConverter() {
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
    const [fromZone, setFromZone] = useState('America/New_York')
    const [toZone, setToZone] = useState('Europe/London')

    const timezones = [
        { value: 'America/New_York', label: 'New York (EST/EDT)' },
        { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
        { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
        { value: 'Europe/London', label: 'London (GMT/BST)' },
        { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
        { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
        { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
        { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
        { value: 'Asia/Kolkata', label: 'India (IST)' },
        { value: 'Asia/Dubai', label: 'Dubai (GST)' },
        { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
        { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
    ]

    const results = useMemo(() => {
        try {
            const [hours, minutes] = time.split(':').map(Number)
            const date = new Date()
            date.setHours(hours, minutes, 0, 0)

            const fromTime = date.toLocaleTimeString('en-US', {
                timeZone: fromZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })

            const toTime = date.toLocaleTimeString('en-US', {
                timeZone: toZone,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })

            return { fromTime, toTime }
        } catch {
            return { fromTime: '--:--', toTime: '--:--' }
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
            resultLabel="Converted Time"
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
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.toTime}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TimezoneConverter
