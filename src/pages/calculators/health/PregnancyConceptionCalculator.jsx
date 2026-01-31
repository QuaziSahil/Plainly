import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PregnancyConceptionCalculator() {
    const [dueDate, setDueDate] = useState(() => {
        const date = new Date()
        date.setDate(date.getDate() + 200) // Default to ~28 weeks from now
        return date.toISOString().split('T')[0]
    })

    const results = useMemo(() => {
        const due = new Date(dueDate)

        // Conception is approximately 266 days (38 weeks) before due date
        // Or LMP is 280 days before due
        const conceptionDate = new Date(due)
        conceptionDate.setDate(conceptionDate.getDate() - 266)

        // LMP date
        const lmpDate = new Date(due)
        lmpDate.setDate(lmpDate.getDate() - 280)

        // Conception window (5 days before to 1 day after ovulation)
        const conceptionWindowStart = new Date(conceptionDate)
        conceptionWindowStart.setDate(conceptionWindowStart.getDate() - 5)

        const conceptionWindowEnd = new Date(conceptionDate)
        conceptionWindowEnd.setDate(conceptionWindowEnd.getDate() + 1)

        const formatDate = (date) => date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })

        const formatShort = (date) => date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })

        return {
            conceptionDate: formatDate(conceptionDate),
            lmpDate: formatDate(lmpDate),
            conceptionWindow: `${formatShort(conceptionWindowStart)} - ${formatShort(conceptionWindowEnd)}`,
            conceptionWindowStart: formatDate(conceptionWindowStart),
            conceptionWindowEnd: formatDate(conceptionWindowEnd)
        }
    }, [dueDate])

    return (
        <CalculatorLayout
            title="Conception Calculator"
            description="Estimate conception date from your due date"
            category="Health"
            categoryPath="/health"
            icon={Heart}
            result={results.conceptionDate}
            resultLabel="Conception Date"
        >
            <div className="input-group">
                <label className="input-label">Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Estimated Conception</span>
                    <span className="result-detail-value">{results.conceptionDate}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Conception Window</span>
                    <span className="result-detail-value">{results.conceptionWindow}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Last Menstrual Period</span>
                    <span className="result-detail-value">{results.lmpDate}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PregnancyConceptionCalculator
