import { useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function OvulationCalculator() {
    const [lastPeriodDate, setLastPeriodDate] = useState(new Date().toISOString().split('T')[0])
    const [cycleLength, setCycleLength] = useState(28)

    const results = useMemo(() => {
        const lastPeriod = new Date(lastPeriodDate)

        // Ovulation typically occurs 14 days before the next period
        const ovulationDay = new Date(lastPeriod)
        ovulationDay.setDate(ovulationDay.getDate() + cycleLength - 14)

        // Fertile window is typically 5 days before ovulation + day of ovulation
        const fertileStart = new Date(ovulationDay)
        fertileStart.setDate(fertileStart.getDate() - 5)

        const fertileEnd = new Date(ovulationDay)
        fertileEnd.setDate(fertileEnd.getDate() + 1)

        const nextPeriod = new Date(lastPeriod)
        nextPeriod.setDate(nextPeriod.getDate() + cycleLength)

        const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

        return {
            ovulationDate: formatDate(ovulationDay),
            fertileStart: formatDate(fertileStart),
            fertileEnd: formatDate(fertileEnd),
            nextPeriod: formatDate(nextPeriod),
            fertileWindow: `${formatDate(fertileStart)} - ${formatDate(fertileEnd)}`
        }
    }, [lastPeriodDate, cycleLength])

    return (
        <CalculatorLayout
            title="Ovulation Calculator"
            description="Calculate your ovulation and fertile window"
            category="Health"
            categoryPath="/health"
            icon={Calendar}
            result={results.ovulationDate}
            resultLabel="Estimated Ovulation"
        >
            <div className="input-group">
                <label className="input-label">First Day of Last Period</label>
                <input type="date" value={lastPeriodDate} onChange={(e) => setLastPeriodDate(e.target.value)} />
            </div>
            <div className="input-group">
                <label className="input-label">Average Cycle Length (days)</label>
                <input type="number" value={cycleLength} onChange={(e) => setCycleLength(Number(e.target.value))} min={21} max={40} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Ovulation Date</span>
                    <span className="result-detail-value">{results.ovulationDate}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Fertile Window</span>
                    <span className="result-detail-value">{results.fertileWindow}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Next Period</span>
                    <span className="result-detail-value">{results.nextPeriod}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default OvulationCalculator
