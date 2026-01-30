import { useState, useMemo } from 'react'
import { CalendarDays } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AgeCalculator() {
    const today = new Date()
    const [birthDate, setBirthDate] = useState('1990-01-15')
    const [targetDate, setTargetDate] = useState(today.toISOString().split('T')[0])

    const results = useMemo(() => {
        const birth = new Date(birthDate)
        const target = new Date(targetDate)

        if (birth > target) return { years: 0, months: 0, days: 0, totalDays: 0, nextBirthday: 0 }

        let years = target.getFullYear() - birth.getFullYear()
        let months = target.getMonth() - birth.getMonth()
        let days = target.getDate() - birth.getDate()

        if (days < 0) {
            months -= 1
            const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
            days += prevMonth.getDate()
        }

        if (months < 0) {
            years -= 1
            months += 12
        }

        const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24))
        const totalWeeks = Math.floor(totalDays / 7)
        const totalMonths = years * 12 + months

        // Next birthday
        let nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
        if (nextBirthday <= target) {
            nextBirthday = new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate())
        }
        const daysUntilBirthday = Math.ceil((nextBirthday - target) / (1000 * 60 * 60 * 24))

        return { years, months, days, totalDays, totalWeeks, totalMonths, daysUntilBirthday }
    }, [birthDate, targetDate])

    return (
        <CalculatorLayout
            title="Age Calculator"
            subtitle="Calculate your exact age in years, months, and days"
            category="Other"
            categoryPath="/converter"
            icon={CalendarDays}
            result={`${results.years}`}
            resultLabel="Years Old"
        >
            <div className="input-group">
                <label className="input-label">Date of Birth</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Age at Date</label>
                <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Exact Age</span>
                    <span className="result-detail-value">
                        {results.years} years, {results.months} months, {results.days} days
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Months</span>
                    <span className="result-detail-value">{results.totalMonths?.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Weeks</span>
                    <span className="result-detail-value">{results.totalWeeks?.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Days</span>
                    <span className="result-detail-value">{results.totalDays?.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Days Until Birthday</span>
                    <span className="result-detail-value">{results.daysUntilBirthday}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default AgeCalculator
