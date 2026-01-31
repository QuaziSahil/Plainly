import { useState, useMemo } from 'react'
import { PiggyBank } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SavingsGoalCalculator() {
    const [goalAmount, setGoalAmount] = useState(10000)
    const [currentSavings, setCurrentSavings] = useState(0)
    const [monthsToGoal, setMonthsToGoal] = useState(24)
    const [interestRate, setInterestRate] = useState(4)

    const results = useMemo(() => {
        const remaining = goalAmount - currentSavings
        const monthlyRate = interestRate / 100 / 12

        // Monthly savings needed (with interest)
        let monthlyNeeded
        if (monthlyRate > 0) {
            monthlyNeeded = remaining / ((Math.pow(1 + monthlyRate, monthsToGoal) - 1) / monthlyRate)
        } else {
            monthlyNeeded = remaining / monthsToGoal
        }

        const weeklyNeeded = monthlyNeeded / 4.33
        const dailyNeeded = monthlyNeeded / 30.44
        const totalContributions = monthlyNeeded * monthsToGoal
        const interestEarned = goalAmount - currentSavings - totalContributions
        const percentComplete = (currentSavings / goalAmount) * 100

        return {
            monthlyNeeded,
            weeklyNeeded,
            dailyNeeded,
            totalContributions,
            interestEarned,
            percentComplete,
            remaining
        }
    }, [goalAmount, currentSavings, monthsToGoal, interestRate])

    return (
        <CalculatorLayout
            title="Savings Goal Calculator"
            description="Calculate how much to save monthly"
            category="Finance"
            categoryPath="/finance"
            icon={PiggyBank}
            result={`$${Math.round(results.monthlyNeeded).toLocaleString()}`}
            resultLabel="Monthly Savings"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Goal Amount ($)</label>
                    <input type="number" value={goalAmount} onChange={(e) => setGoalAmount(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Current Savings ($)</label>
                    <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Months to Goal</label>
                    <input type="number" value={monthsToGoal} onChange={(e) => setMonthsToGoal(Number(e.target.value))} min={1} max={360} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Interest Rate (%)</label>
                    <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} min={0} step={0.5} />
                </div>
            </div>
            <div style={{ background: '#333', borderRadius: '8px', padding: '4px', marginBottom: '16px' }}>
                <div style={{
                    background: '#a78bfa',
                    height: '8px',
                    borderRadius: '6px',
                    width: `${Math.min(100, results.percentComplete)}%`,
                    transition: 'width 0.3s ease'
                }} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Remaining to Save</span>
                    <span className="result-detail-value">${Math.round(results.remaining).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Savings Needed</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>${Math.round(results.monthlyNeeded).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Weekly Savings Needed</span>
                    <span className="result-detail-value">${Math.round(results.weeklyNeeded).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Daily Savings Needed</span>
                    <span className="result-detail-value">${results.dailyNeeded.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Interest Earned</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>${Math.round(results.interestEarned).toLocaleString()}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SavingsGoalCalculator
