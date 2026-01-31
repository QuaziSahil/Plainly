import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CompoundGrowthCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(8)
    const [years, setYears] = useState(10)
    const [compoundFrequency, setCompoundFrequency] = useState(12)

    const results = useMemo(() => {
        const n = compoundFrequency
        const r = rate / 100
        const t = years

        const finalAmount = principal * Math.pow(1 + r / n, n * t)
        const totalInterest = finalAmount - principal
        const effectiveRate = (Math.pow(1 + r / n, n) - 1) * 100

        // Year by year breakdown
        const yearlyBreakdown = []
        for (let i = 1; i <= years; i++) {
            const amount = principal * Math.pow(1 + r / n, n * i)
            yearlyBreakdown.push({ year: i, amount })
        }

        return { finalAmount, totalInterest, effectiveRate, yearlyBreakdown }
    }, [principal, rate, years, compoundFrequency])

    return (
        <CalculatorLayout
            title="Compound Growth Calculator"
            description="Calculate compound interest growth"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={`$${Math.round(results.finalAmount).toLocaleString()}`}
            resultLabel="Final Amount"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Principal ($)</label>
                    <input type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Rate (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} min={0} step={0.5} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Years</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={50} />
                </div>
                <div className="input-group">
                    <label className="input-label">Compound Frequency</label>
                    <select value={compoundFrequency} onChange={(e) => setCompoundFrequency(Number(e.target.value))}>
                        <option value={1}>Annually</option>
                        <option value={2}>Semi-annually</option>
                        <option value={4}>Quarterly</option>
                        <option value={12}>Monthly</option>
                        <option value={365}>Daily</option>
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Final Amount</span>
                    <span className="result-detail-value" style={{ color: '#10b981' }}>${Math.round(results.finalAmount).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Interest Earned</span>
                    <span className="result-detail-value">${Math.round(results.totalInterest).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Effective Annual Rate</span>
                    <span className="result-detail-value">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Growth Multiple</span>
                    <span className="result-detail-value">{(results.finalAmount / principal).toFixed(2)}x</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CompoundGrowthCalculator
