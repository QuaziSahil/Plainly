import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ROICalculator() {
    const [initialInvestment, setInitialInvestment] = useState(10000)
    const [finalValue, setFinalValue] = useState(15000)
    const [years, setYears] = useState(3)

    const results = useMemo(() => {
        const netProfit = finalValue - initialInvestment
        const roi = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0
        const annualizedROI = initialInvestment > 0 && years > 0
            ? (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100
            : 0

        return { netProfit, roi, annualizedROI }
    }, [initialInvestment, finalValue, years])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="ROI Calculator"
            description="Calculate Return on Investment"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={`${results.roi.toFixed(2)}%`}
            resultLabel="Total ROI"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Initial Investment</label>
                    <input type="number" value={initialInvestment} onChange={(e) => setInitialInvestment(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Final Value</label>
                    <input type="number" value={finalValue} onChange={(e) => setFinalValue(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Investment Period (years)</label>
                <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} max={50} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Net Profit</span>
                    <span className="result-detail-value">{formatCurrency(results.netProfit)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total ROI</span>
                    <span className="result-detail-value">{results.roi.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Annualized ROI</span>
                    <span className="result-detail-value">{results.annualizedROI.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ROICalculator
