import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CAGRCalculator() {
    const [beginningValue, setBeginningValue] = useState(10000)
    const [endingValue, setEndingValue] = useState(25000)
    const [years, setYears] = useState(5)

    const results = useMemo(() => {
        const cagr = (Math.pow(endingValue / beginningValue, 1 / years) - 1) * 100
        const totalReturn = endingValue - beginningValue
        const totalReturnPercent = ((endingValue - beginningValue) / beginningValue) * 100
        const absoluteReturn = totalReturnPercent / years

        return { cagr, totalReturn, totalReturnPercent, absoluteReturn }
    }, [beginningValue, endingValue, years])

    return (
        <CalculatorLayout
            title="CAGR Calculator"
            description="Compound Annual Growth Rate"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={`${results.cagr.toFixed(2)}%`}
            resultLabel="CAGR"
        >
            <div className="input-group">
                <label className="input-label">Beginning Value ($)</label>
                <input type="number" value={beginningValue} onChange={(e) => setBeginningValue(Number(e.target.value))} min={1} />
            </div>
            <div className="input-group">
                <label className="input-label">Ending Value ($)</label>
                <input type="number" value={endingValue} onChange={(e) => setEndingValue(Number(e.target.value))} min={1} />
            </div>
            <div className="input-group">
                <label className="input-label">Number of Years</label>
                <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} min={1} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">CAGR</span>
                    <span className="result-detail-value" style={{ color: results.cagr >= 0 ? '#10b981' : '#ef4444' }}>
                        {results.cagr.toFixed(2)}%
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Return</span>
                    <span className="result-detail-value">${results.totalReturn.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Return %</span>
                    <span className="result-detail-value">{results.totalReturnPercent.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Avg. Annual Return</span>
                    <span className="result-detail-value">{results.absoluteReturn.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CAGRCalculator
