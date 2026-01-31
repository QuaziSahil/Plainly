import { useState, useMemo } from 'react'
import { Home } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function HomeAffordabilityCalculator() {
    const [annualIncome, setAnnualIncome] = useState(80000)
    const [monthlyDebts, setMonthlyDebts] = useState(500)
    const [downPayment, setDownPayment] = useState(50000)
    const [interestRate, setInterestRate] = useState(6.5)
    const [loanTerm, setLoanTerm] = useState(30)

    const results = useMemo(() => {
        const monthlyIncome = annualIncome / 12
        const maxPayment28 = monthlyIncome * 0.28 // Front-end ratio
        const maxPayment36 = (monthlyIncome * 0.36) - monthlyDebts // Back-end ratio
        const maxMonthlyPayment = Math.min(maxPayment28, maxPayment36)

        // Calculate max loan amount
        const monthlyRate = interestRate / 100 / 12
        const numPayments = loanTerm * 12
        const maxLoan = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate)

        const maxHomePrice = maxLoan + downPayment
        const downPaymentPercent = (downPayment / maxHomePrice) * 100

        return { maxMonthlyPayment, maxLoan, maxHomePrice, downPaymentPercent }
    }, [annualIncome, monthlyDebts, downPayment, interestRate, loanTerm])

    return (
        <CalculatorLayout
            title="Home Affordability"
            description="Calculate how much home you can afford"
            category="Finance"
            categoryPath="/finance"
            icon={Home}
            result={`$${Math.round(results.maxHomePrice).toLocaleString()}`}
            resultLabel="Max Home Price"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Annual Income ($)</label>
                    <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Monthly Debts ($)</label>
                    <input type="number" value={monthlyDebts} onChange={(e) => setMonthlyDebts(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Down Payment ($)</label>
                <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} min={0} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Interest Rate (%)</label>
                    <input type="number" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} min={0} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Loan Term</label>
                    <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}>
                        <option value={15}>15 years</option>
                        <option value={20}>20 years</option>
                        <option value={30}>30 years</option>
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Max Home Price</span>
                    <span className="result-detail-value">${Math.round(results.maxHomePrice).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Max Loan Amount</span>
                    <span className="result-detail-value">${Math.round(results.maxLoan).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Max Monthly Payment</span>
                    <span className="result-detail-value">${results.maxMonthlyPayment.toFixed(0)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Down Payment %</span>
                    <span className="result-detail-value">{results.downPaymentPercent.toFixed(1)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default HomeAffordabilityCalculator
