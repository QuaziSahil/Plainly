import { useState, useMemo } from 'react'
import { CalendarDays } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WorkdaysCalculator() {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    const [excludeWeekends, setExcludeWeekends] = useState(true)

    const results = useMemo(() => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { totalDays: 0, workdays: 0, weekends: 0 }
        }

        let totalDays = 0
        let workdays = 0
        let weekends = 0

        const current = new Date(start)
        while (current <= end) {
            totalDays++
            const day = current.getDay()
            if (day === 0 || day === 6) {
                weekends++
            } else {
                workdays++
            }
            current.setDate(current.getDate() + 1)
        }

        const effectiveDays = excludeWeekends ? workdays : totalDays

        return { totalDays, workdays, weekends, effectiveDays }
    }, [startDate, endDate, excludeWeekends])

    return (
        <CalculatorLayout
            title="Workdays Calculator"
            description="Calculate business days between dates"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={CalendarDays}
            result={results.workdays.toString()}
            resultLabel="Workdays"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="input-group">
                    <label className="input-label">End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
            </div>
            <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={excludeWeekends} onChange={(e) => setExcludeWeekends(e.target.checked)} />
                    Exclude weekends
                </label>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Days</span>
                    <span className="result-detail-value">{results.totalDays}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Workdays (Mon-Fri)</span>
                    <span className="result-detail-value">{results.workdays}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weekend Days</span>
                    <span className="result-detail-value">{results.weekends}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weeks</span>
                    <span className="result-detail-value">{(results.totalDays / 7).toFixed(1)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default WorkdaysCalculator
