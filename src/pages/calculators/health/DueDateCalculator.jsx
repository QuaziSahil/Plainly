import { useState, useMemo } from 'react'
import { Calendar } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DueDateCalculator() {
    const [calculationType, setCalculationType] = useState('lmp')
    const [lmpDate, setLmpDate] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() - 60)
        return date.toISOString().split('T')[0]
    })
    const [conceptionDate, setConceptionDate] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() - 46)
        return date.toISOString().split('T')[0]
    })
    const [ultrasoundDate, setUltrasoundDate] = useState(() => {
        const date = new Date()
        return date.toISOString().split('T')[0]
    })
    const [ultrasoundWeeks, setUltrasoundWeeks] = useState(8)
    const [ultrasoundDays, setUltrasoundDays] = useState(0)

    const results = useMemo(() => {
        let dueDate

        if (calculationType === 'lmp') {
            // Naegele's rule: LMP + 280 days
            dueDate = new Date(lmpDate)
            dueDate.setDate(dueDate.getDate() + 280)
        } else if (calculationType === 'conception') {
            // Conception + 266 days
            dueDate = new Date(conceptionDate)
            dueDate.setDate(dueDate.getDate() + 266)
        } else {
            // Ultrasound: calculate from gestational age
            const totalDays = ultrasoundWeeks * 7 + ultrasoundDays
            const remainingDays = 280 - totalDays
            dueDate = new Date(ultrasoundDate)
            dueDate.setDate(dueDate.getDate() + remainingDays)
        }

        // Calculate weeks remaining
        const today = new Date()
        const daysUntilDue = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24))
        const weeksRemaining = Math.floor(daysUntilDue / 7)

        // First, second, third trimester end dates
        const firstTrimesterEnd = new Date(dueDate)
        firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() - 280 + 13 * 7)

        const secondTrimesterEnd = new Date(dueDate)
        secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() - 280 + 27 * 7)

        const formatDate = (date) => date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        return {
            dueDate: formatDate(dueDate),
            daysUntilDue,
            weeksRemaining,
            firstTrimesterEnd: formatDate(firstTrimesterEnd),
            secondTrimesterEnd: formatDate(secondTrimesterEnd)
        }
    }, [calculationType, lmpDate, conceptionDate, ultrasoundDate, ultrasoundWeeks, ultrasoundDays])

    return (
        <CalculatorLayout
            title="Due Date Calculator"
            description="Calculate pregnancy due date using multiple methods"
            category="Health"
            categoryPath="/health"
            icon={Calendar}
            result={results.dueDate}
            resultLabel="Due Date"
        >
            <div className="input-group">
                <label className="input-label">Calculation Method</label>
                <select value={calculationType} onChange={(e) => setCalculationType(e.target.value)}>
                    <option value="lmp">Last Menstrual Period</option>
                    <option value="conception">Conception Date</option>
                    <option value="ultrasound">Ultrasound</option>
                </select>
            </div>

            {calculationType === 'lmp' && (
                <div className="input-group">
                    <label className="input-label">First Day of Last Period</label>
                    <input
                        type="date"
                        value={lmpDate}
                        onChange={(e) => setLmpDate(e.target.value)}
                    />
                </div>
            )}

            {calculationType === 'conception' && (
                <div className="input-group">
                    <label className="input-label">Conception Date</label>
                    <input
                        type="date"
                        value={conceptionDate}
                        onChange={(e) => setConceptionDate(e.target.value)}
                    />
                </div>
            )}

            {calculationType === 'ultrasound' && (
                <>
                    <div className="input-group">
                        <label className="input-label">Ultrasound Date</label>
                        <input
                            type="date"
                            value={ultrasoundDate}
                            onChange={(e) => setUltrasoundDate(e.target.value)}
                        />
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label className="input-label">Weeks</label>
                            <input
                                type="number"
                                value={ultrasoundWeeks}
                                onChange={(e) => setUltrasoundWeeks(Number(e.target.value))}
                                min={1}
                                max={42}
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Days</label>
                            <input
                                type="number"
                                value={ultrasoundDays}
                                onChange={(e) => setUltrasoundDays(Number(e.target.value))}
                                min={0}
                                max={6}
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Days Until Due</span>
                    <span className="result-detail-value">{results.daysUntilDue} days</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weeks Remaining</span>
                    <span className="result-detail-value">{results.weeksRemaining} weeks</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">1st Trimester Ends</span>
                    <span className="result-detail-value">{results.firstTrimesterEnd}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">2nd Trimester Ends</span>
                    <span className="result-detail-value">{results.secondTrimesterEnd}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default DueDateCalculator
