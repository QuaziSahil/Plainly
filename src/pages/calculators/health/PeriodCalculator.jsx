import { useState, useMemo } from 'react'
import { CalendarDays } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PeriodCalculator() {
    const [lastPeriodDate, setLastPeriodDate] = useState(new Date().toISOString().split('T')[0])
    const [cycleLength, setCycleLength] = useState(28)
    const [periodLength, setPeriodLength] = useState(5)

    const results = useMemo(() => {
        const lastPeriod = new Date(lastPeriodDate)
        const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

        const predictions = []
        for (let i = 1; i <= 6; i++) {
            const startDate = new Date(lastPeriod)
            startDate.setDate(startDate.getDate() + (cycleLength * i))

            const endDate = new Date(startDate)
            endDate.setDate(endDate.getDate() + periodLength - 1)

            predictions.push({
                month: startDate.toLocaleDateString('en-US', { month: 'long' }),
                start: formatDate(startDate),
                end: formatDate(endDate)
            })
        }

        const nextPeriod = new Date(lastPeriod)
        nextPeriod.setDate(nextPeriod.getDate() + cycleLength)

        const today = new Date()
        const daysUntil = Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24))

        return { predictions, nextPeriod: formatDate(nextPeriod), daysUntil }
    }, [lastPeriodDate, cycleLength, periodLength])

    return (
        <CalculatorLayout
            title="Period Calculator"
            description="Track and predict your menstrual cycle"
            category="Health"
            categoryPath="/health"
            icon={CalendarDays}
            result={results.daysUntil > 0 ? `${results.daysUntil} days` : 'Today'}
            resultLabel="Next Period In"
        >
            <div className="input-group">
                <label className="input-label">First Day of Last Period</label>
                <input type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Cycle Length (days)</label>
                    <input type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} min={21} max={40} />
                </div>
                <div className="input-group">
                    <label className="input-label">Period Length (days)</label>
                    <input type="number" value={periodLength} onChange={(e) => setPeriodLength(Number(e.target.value))} min={2} max={10} />
                </div>
            </div>
            <div className="result-details">
                <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '12px' }}>Upcoming Periods:</div>
                {results.predictions.slice(0, 4).map((p, i) => (
                    <div className="result-detail-row" key={i}>
                        <span className="result-detail-label">{p.month}</span>
                        <span className="result-detail-value">{p.start} - {p.end}</span>
                    </div>
                ))}
            </div>
        </CalculatorLayout>
    )
}

export default PeriodCalculator
