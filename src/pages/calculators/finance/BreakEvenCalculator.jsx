import { useState, useMemo } from 'react'
import { Target } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BreakEvenCalculator() {
    const [fixedCosts, setFixedCosts] = useState(10000)
    const [pricePerUnit, setPricePerUnit] = useState(50)
    const [variableCostPerUnit, setVariableCostPerUnit] = useState(30)

    const results = useMemo(() => {
        const contributionMargin = pricePerUnit - variableCostPerUnit
        const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0
        const breakEvenRevenue = breakEvenUnits * pricePerUnit
        const contributionMarginRatio = pricePerUnit > 0 ? (contributionMargin / pricePerUnit) * 100 : 0

        return { breakEvenUnits, breakEvenRevenue, contributionMargin, contributionMarginRatio }
    }, [fixedCosts, pricePerUnit, variableCostPerUnit])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="Break Even Calculator"
            description="Calculate break-even point for your business"
            category="Finance"
            categoryPath="/finance"
            icon={Target}
            result={Math.ceil(results.breakEvenUnits).toLocaleString()}
            resultLabel="Break-Even Units"
        >
            <div className="input-group">
                <label className="input-label">Fixed Costs</label>
                <input type="number" value={fixedCosts} onChange={(e) => setFixedCosts(Number(e.target.value))} min={0} />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Price Per Unit</label>
                    <input type="number" value={pricePerUnit} onChange={(e) => setPricePerUnit(Number(e.target.value))} min={0} step={0.01} />
                </div>
                <div className="input-group">
                    <label className="input-label">Variable Cost/Unit</label>
                    <input type="number" value={variableCostPerUnit} onChange={(e) => setVariableCostPerUnit(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Break-Even Units</span>
                    <span className="result-detail-value">{Math.ceil(results.breakEvenUnits).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Break-Even Revenue</span>
                    <span className="result-detail-value">{formatCurrency(results.breakEvenRevenue)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Contribution Margin</span>
                    <span className="result-detail-value">{formatCurrency(results.contributionMargin)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">CM Ratio</span>
                    <span className="result-detail-value">{results.contributionMarginRatio.toFixed(1)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default BreakEvenCalculator
