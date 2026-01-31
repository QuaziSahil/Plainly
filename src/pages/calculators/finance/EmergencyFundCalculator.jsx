import { useState, useMemo } from 'react'
import { PiggyBank } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function EmergencyFundCalculator() {
    const [monthlyExpenses, setMonthlyExpenses] = useState(3000)
    const [monthsCoverage, setMonthsCoverage] = useState(6)
    const [currentSavings, setCurrentSavings] = useState(5000)
    const [monthlyContribution, setMonthlyContribution] = useState(500)

    const results = useMemo(() => {
        const targetFund = monthlyExpenses * monthsCoverage
        const amountNeeded = Math.max(0, targetFund - currentSavings)
        const monthsToGoal = monthlyContribution > 0 ? Math.ceil(amountNeeded / monthlyContribution) : Infinity
        const percentComplete = Math.min(100, (currentSavings / targetFund) * 100)

        return { targetFund, amountNeeded, monthsToGoal, percentComplete }
    }, [monthlyExpenses, monthsCoverage, currentSavings, monthlyContribution])

    return (
        <CalculatorLayout
            title="Emergency Fund Calculator"
            description="Plan your emergency savings"
            category="Finance"
            categoryPath="/finance"
            icon={PiggyBank}
            result={`$${results.targetFund.toLocaleString()}`}
            resultLabel="Target Fund"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Monthly Expenses ($)</label>
                    <input type="number" value={monthlyExpenses} onChange={(e) => setMonthlyExpenses(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Months Coverage</label>
                    <select value={monthsCoverage} onChange={(e) => setMonthsCoverage(Number(e.target.value))}>
                        <option value={3}>3 months</option>
                        <option value={6}>6 months</option>
                        <option value={9}>9 months</option>
                        <option value={12}>12 months</option>
                    </select>
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Savings ($)</label>
                    <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Monthly Contribution ($)</label>
                    <input type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div style={{ background: '#333', borderRadius: '8px', padding: '4px', marginBottom: '16px' }}>
                <div style={{
                    background: results.percentComplete >= 100 ? '#10b981' : '#a78bfa',
                    height: '8px',
                    borderRadius: '6px',
                    width: `${Math.min(100, results.percentComplete)}%`,
                    transition: 'width 0.3s ease'
                }} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Target Fund</span>
                    <span className="result-detail-value">${results.targetFund.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Still Needed</span>
                    <span className="result-detail-value">${results.amountNeeded.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Progress</span>
                    <span className="result-detail-value" style={{ color: results.percentComplete >= 100 ? '#10b981' : 'inherit' }}>
                        {results.percentComplete.toFixed(1)}%
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Months to Goal</span>
                    <span className="result-detail-value">
                        {results.monthsToGoal === Infinity ? '—' : `${results.monthsToGoal} months`}
                    </span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default EmergencyFundCalculator
