import { useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DateCalculator() {
    const today = new Date().toISOString().split('T')[0]
    const [mode, setMode] = useState('difference')
    const [startDate, setStartDate] = useState(today)
    const [endDate, setEndDate] = useState(today)
    const [daysToAdd, setDaysToAdd] = useState(30)

    const results = useMemo(() => {
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (mode === 'difference') {
            const diffTime = end - start
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            const diffWeeks = Math.floor(Math.abs(diffDays) / 7)
            const remainingDays = Math.abs(diffDays) % 7

            const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
            const diffYears = Math.floor(diffMonths / 12)

            return {
                days: diffDays,
                weeks: diffWeeks,
                remainingDays,
                months: Math.abs(diffMonths),
                years: Math.abs(diffYears)
            }
        } else {
            const resultDate = new Date(start)
            resultDate.setDate(resultDate.getDate() + daysToAdd)
            return {
                resultDate: resultDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                days: daysToAdd
            }
        }
    }, [mode, startDate, endDate, daysToAdd])

    const resultDetails = (
        <>
            {mode === 'difference' ? (
                <>
                    <div className="result-row">
                        <span className="result-row-label">Years</span>
                        <span className="result-row-value">{results.years}</span>
                    </div>
                    <div className="result-row">
                        <span className="result-row-label">Months</span>
                        <span className="result-row-value">{results.months}</span>
                    </div>
                    <div className="result-row">
                        <span className="result-row-label">Weeks</span>
                        <span className="result-row-value">{results.weeks} weeks, {results.remainingDays} days</span>
                    </div>
                    <div className="result-row highlight">
                        <span className="result-row-label">Total Days</span>
                        <span className="result-row-value">{results.days}</span>
                    </div>
                </>
            ) : (
                <div className="result-row">
                    <span className="result-row-label">Result</span>
                    <span className="result-row-value">{results.resultDate}</span>
                </div>
            )}
        </>
    )

    return (
        <CalculatorLayout
            title="Date Calculator"
            description="Find the difference between dates or add/subtract days"
            category="Other"
            categoryPath="/converter"
            icon={Calendar}
            result={mode === 'difference' ? `${results.days}` : results.resultDate}
            resultLabel={mode === 'difference' ? 'Days' : 'Result Date'}
            resultDetails={resultDetails}
        >
            <div className="input-group">
                <label className="input-label">Calculation Type</label>
                <select
                    className="select-field"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value="difference">Difference Between Dates</option>
                    <option value="addDays">Add/Subtract Days</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">{mode === 'difference' ? 'Start Date' : 'Starting Date'}</label>
                <input
                    className="input-field"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            {mode === 'difference' ? (
                <div className="input-group">
                    <label className="input-label">End Date</label>
                    <input
                        className="input-field"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            ) : (
                <div className="input-group">
                    <label className="input-label">Days to Add (use negative to subtract)</label>
                    <input
                        className="input-field"
                        type="number"
                        value={daysToAdd}
                        onChange={(e) => setDaysToAdd(Number(e.target.value))}
                    />
                </div>
            )}
        </CalculatorLayout>
    )
}

export default DateCalculator
