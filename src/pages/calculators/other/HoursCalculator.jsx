import { useState, useMemo } from 'react'
import { Clock3 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function HoursCalculator() {
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('17:30')
    const [breakMinutes, setBreakMinutes] = useState(30)
    const [hourlyRate, setHourlyRate] = useState(25)

    const results = useMemo(() => {
        const [startH, startM] = startTime.split(':').map(Number)
        const [endH, endM] = endTime.split(':').map(Number)

        let startMinutes = startH * 60 + startM
        let endMinutes = endH * 60 + endM

        // Handle overnight shifts
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60
        }

        const totalMinutes = endMinutes - startMinutes - breakMinutes
        const totalHours = totalMinutes / 60
        const earnings = totalHours * hourlyRate

        const wholeHours = Math.floor(totalHours)
        const remainingMinutes = Math.round((totalHours - wholeHours) * 60)

        return {
            totalMinutes: Math.max(0, totalMinutes),
            totalHours: Math.max(0, totalHours),
            wholeHours,
            remainingMinutes,
            earnings: Math.max(0, earnings),
            formatted: `${wholeHours}h ${remainingMinutes}m`
        }
    }, [startTime, endTime, breakMinutes, hourlyRate])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Hours Calculator"
            description="Calculate work hours and earnings from time entries"
            category="Other"
            categoryPath="/other"
            icon={Clock3}
            result={results.formatted}
            resultLabel="Total Hours"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Break (minutes)</label>
                    <input
                        type="number"
                        value={breakMinutes}
                        onChange={(e) => setBreakMinutes(Number(e.target.value))}
                        min={0}
                        max={480}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Hourly Rate ($)</label>
                    <input
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        min={0}
                        step={0.5}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Minutes</span>
                    <span className="result-detail-value">{results.totalMinutes}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Decimal Hours</span>
                    <span className="result-detail-value">{results.totalHours.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Formatted</span>
                    <span className="result-detail-value">{results.formatted}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Earnings</span>
                    <span className="result-detail-value">{formatCurrency(results.earnings)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default HoursCalculator
