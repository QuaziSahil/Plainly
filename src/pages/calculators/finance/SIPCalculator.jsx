import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SIPCalculator() {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000)
    const [expectedReturn, setExpectedReturn] = useState(12)
    const [years, setYears] = useState(10)

    const results = useMemo(() => {
        const monthlyRate = expectedReturn / 12 / 100
        const months = years * 12
        const totalInvested = monthlyInvestment * months

        const futureValue = monthlyInvestment *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
            (1 + monthlyRate)

        const wealthGained = futureValue - totalInvested

        return { futureValue, totalInvested, wealthGained }
    }, [monthlyInvestment, expectedReturn, years])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="SIP Calculator"
            description="Calculate returns on Systematic Investment Plan"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={formatCurrency(results.futureValue)}
            resultLabel="Future Value"
        >
            <div className="input-group">
                <label className="input-label">Monthly Investment</label>
                <input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(Number(e.target.value))} min={0} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Expected Return (%/year)</label>
                    <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} min={0} max={50} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Time Period (years)</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={50} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Invested</span>
                    <span className="result-detail-value">{formatCurrency(results.totalInvested)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Wealth Gained</span>
                    <span className="result-detail-value">{formatCurrency(results.wealthGained)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Maturity Value</span>
                    <span className="result-detail-value">{formatCurrency(results.futureValue)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SIPCalculator
