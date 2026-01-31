import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function EMICalculator() {
    const [principal, setPrincipal] = useState(500000)
    const [rate, setRate] = useState(10)
    const [tenure, setTenure] = useState(24)

    const results = useMemo(() => {
        const monthlyRate = rate / 12 / 100
        const n = tenure

        if (monthlyRate === 0) {
            return { emi: principal / n, totalPayment: principal, totalInterest: 0 }
        }

        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, n) /
            (Math.pow(1 + monthlyRate, n) - 1)
        const totalPayment = emi * n
        const totalInterest = totalPayment - principal

        return { emi, totalPayment, totalInterest }
    }, [principal, rate, tenure])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="EMI Calculator"
            description="Calculate Equated Monthly Installments for loans"
            category="Finance"
            categoryPath="/finance"
            icon={Calculator}
            result={formatCurrency(results.emi)}
            resultLabel="Monthly EMI"
        >
            <div className="input-group">
                <label className="input-label">Loan Amount</label>
                <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} min={0} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Interest Rate (%/year)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} min={0} max={50} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Tenure (months)</label>
                    <input type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} min={1} max={360} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Principal Amount</span>
                    <span className="result-detail-value">{formatCurrency(principal)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Interest</span>
                    <span className="result-detail-value">{formatCurrency(results.totalInterest)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Payment</span>
                    <span className="result-detail-value">{formatCurrency(results.totalPayment)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default EMICalculator
