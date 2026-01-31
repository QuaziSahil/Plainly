import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ProfitMarginCalculator() {
    const [cost, setCost] = useState(100)
    const [revenue, setRevenue] = useState(150)
    const [mode, setMode] = useState('margin')

    const results = useMemo(() => {
        const profit = revenue - cost
        const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0
        const markup = cost > 0 ? (profit / cost) * 100 : 0
        const grossProfit = profit

        return { profit, profitMargin, markup, grossProfit }
    }, [cost, revenue])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(val)

    return (
        <CalculatorLayout
            title="Profit Margin Calculator"
            description="Calculate profit margin and markup percentages"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={`${results.profitMargin.toFixed(2)}%`}
            resultLabel="Profit Margin"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Cost Price</label>
                    <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} min={0} step={0.01} />
                </div>
                <div className="input-group">
                    <label className="input-label">Selling Price</label>
                    <input type="number" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} min={0} step={0.01} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Profit</span>
                    <span className="result-detail-value">{formatCurrency(results.profit)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Profit Margin</span>
                    <span className="result-detail-value">{results.profitMargin.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Markup</span>
                    <span className="result-detail-value">{results.markup.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ProfitMarginCalculator
