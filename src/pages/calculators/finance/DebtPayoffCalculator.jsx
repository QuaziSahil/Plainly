import { useState, useMemo } from 'react'
import { CreditCard } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DebtPayoffCalculator() {
    const [balance, setBalance] = useState(5000)
    const [interestRate, setInterestRate] = useState(18)
    const [monthlyPayment, setMonthlyPayment] = useState(200)

    const results = useMemo(() => {
        const monthlyRate = interestRate / 100 / 12
        let remaining = balance
        let months = 0
        let totalInterest = 0
        const maxMonths = 600

        while (remaining > 0 && months < maxMonths) {
            const interest = remaining * monthlyRate
            totalInterest += interest
            remaining = remaining + interest - monthlyPayment
            months++
            if (monthlyPayment <= remaining * monthlyRate) {
                return { error: 'Payment too low to pay off debt' }
            }
        }

        const years = Math.floor(months / 12)
        const remainingMonths = months % 12
        const totalPaid = balance + totalInterest

        return { months, years, remainingMonths, totalInterest, totalPaid }
    }, [balance, interestRate, monthlyPayment])

    return (
        <CalculatorLayout
            title="Debt Payoff Calculator"
            description="Calculate time to pay off debt"
            category="Finance"
            categoryPath="/finance"
            icon={CreditCard}
            result={results.error ? '∞' : `${results.months} mo`}
            resultLabel="Time to Payoff"
        >
            <div className="input-group">
                <label className="input-label">Current Balance ($)</label>
                <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} min={0} />
            </div>
            <div className="input-group">
                <label className="input-label">Interest Rate (%)</label>
                <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} min={0} step={0.1} />
            </div>
            <div className="input-group">
                <label className="input-label">Monthly Payment ($)</label>
                <input type="number" value={monthlyPayment} onChange={(e) => setMonthlyPayment(Number(e.target.value))} min={1} />
            </div>
            {results.error ? (
                <div style={{ background: '#ef444420', padding: '12px', borderRadius: '8px', color: '#ef4444' }}>
                    {results.error}
                </div>
            ) : (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">Payoff Time</span>
                        <span className="result-detail-value">{results.years}y {results.remainingMonths}m</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Total Interest</span>
                        <span className="result-detail-value">${results.totalInterest.toFixed(2)}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Total Paid</span>
                        <span className="result-detail-value">${results.totalPaid.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default DebtPayoffCalculator
