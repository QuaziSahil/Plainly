import { useState, useMemo } from 'react'
import { Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ProbabilityCalculator() {
    const [favorable, setFavorable] = useState(1)
    const [total, setTotal] = useState(6)

    const results = useMemo(() => {
        const probability = favorable / total
        const percentage = probability * 100
        const odds = favorable / (total - favorable)
        const oddsAgainst = (total - favorable) / favorable

        return {
            probability,
            percentage,
            odds: isFinite(odds) ? odds : 0,
            oddsAgainst: isFinite(oddsAgainst) ? oddsAgainst : 0
        }
    }, [favorable, total])

    return (
        <CalculatorLayout
            title="Probability Calculator"
            description="Calculate probability and odds"
            category="Math"
            categoryPath="/math"
            icon={Percent}
            result={`${results.percentage.toFixed(2)}%`}
            resultLabel="Probability"
        >
            <div className="input-group">
                <label className="input-label">Favorable Outcomes</label>
                <input type="number" value={favorable} onChange={(e) => setFavorable(Number(e.target.value))} min={0} />
            </div>
            <div className="input-group">
                <label className="input-label">Total Possible Outcomes</label>
                <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} min={1} />
            </div>
            <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', textAlign: 'center', marginTop: '16px' }}>
                <code style={{ fontSize: '16px' }}>P(A) = {favorable}/{total} = {results.probability.toFixed(4)}</code>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Probability</span>
                    <span className="result-detail-value">{results.probability.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Percentage</span>
                    <span className="result-detail-value">{results.percentage.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Odds For</span>
                    <span className="result-detail-value">{results.odds.toFixed(2)} : 1</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Odds Against</span>
                    <span className="result-detail-value">{results.oddsAgainst.toFixed(2)} : 1</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ProbabilityCalculator
