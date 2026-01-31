import { useState, useMemo } from 'react'
import { Baby } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PregnancyCalculator() {
    const [lastPeriodDate, setLastPeriodDate] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() - 60) // Default to ~8 weeks ago
        return date.toISOString().split('T')[0]
    })
    const [cycleLength, setCycleLength] = useState(28)

    const results = useMemo(() => {
        const lmpDate = new Date(lastPeriodDate)

        // Calculate due date (Naegele's rule: LMP + 280 days)
        const dueDate = new Date(lmpDate)
        dueDate.setDate(dueDate.getDate() + 280)

        // Adjust for cycle length (add days if cycle > 28, subtract if < 28)
        const cycleAdjustment = cycleLength - 28
        dueDate.setDate(dueDate.getDate() + cycleAdjustment)

        // Calculate conception date (approximately 14 days after LMP)
        const conceptionDate = new Date(lmpDate)
        conceptionDate.setDate(conceptionDate.getDate() + 14 + cycleAdjustment)

        // Calculate current pregnancy progress
        const today = new Date()
        const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24))
        const weeksPregnant = Math.floor(daysSinceLMP / 7)
        const daysExtra = daysSinceLMP % 7

        // Calculate days until due
        const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))

        // Trimester
        let trimester = 1
        if (weeksPregnant >= 13 && weeksPregnant < 27) trimester = 2
        else if (weeksPregnant >= 27) trimester = 3

        const formatDate = (date) => date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        return {
            dueDate: formatDate(dueDate),
            conceptionDate: formatDate(conceptionDate),
            weeksPregnant,
            daysExtra,
            daysUntilDue,
            trimester,
            progress: Math.min(100, (daysSinceLMP / 280) * 100)
        }
    }, [lastPeriodDate, cycleLength])

    return (
        <CalculatorLayout
            title="Pregnancy Calculator"
            description="Calculate your due date and track pregnancy progress"
            category="Health"
            categoryPath="/health"
            icon={Baby}
            result={results.dueDate}
            resultLabel="Due Date"
        >
            <div className="input-group">
                <label className="input-label">First Day of Last Period</label>
                <input
                    type="date"
                    value={lastPeriodDate}
                    onChange={(e) => setLastPeriodDate(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Average Cycle Length (days)</label>
                <input
                    type="number"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    min={21}
                    max={45}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Current Week</span>
                    <span className="result-detail-value">{results.weeksPregnant} weeks, {results.daysExtra} days</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Trimester</span>
                    <span className="result-detail-value">{results.trimester}{results.trimester === 1 ? 'st' : results.trimester === 2 ? 'nd' : 'rd'} Trimester</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Days Until Due</span>
                    <span className="result-detail-value">{results.daysUntilDue} days</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Conception Date</span>
                    <span className="result-detail-value">{results.conceptionDate}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Progress</span>
                    <span className="result-detail-value">{results.progress.toFixed(1)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PregnancyCalculator
