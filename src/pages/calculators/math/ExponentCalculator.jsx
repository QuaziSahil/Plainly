import { useState, useMemo } from 'react'
import { SquareFunction } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function ExponentCalculator() {
    const [base, setBase] = useState(2)
    const [exponent, setExponent] = useState(10)

    const results = useMemo(() => {
        const result = Math.pow(base, exponent)
        const inverse = Math.pow(base, -exponent)
        const sqrt = Math.sqrt(base)
        const cbrt = Math.cbrt(base)

        return {
            result,
            inverse,
            sqrt,
            cbrt,
            squared: base * base,
            cubed: base * base * base
        }
    }, [base, exponent])

    const formatNumber = (n) => {
        if (Math.abs(n) > 1e10 || (Math.abs(n) < 1e-10 && n !== 0)) {
            return n.toExponential(6)
        }
        return n.toLocaleString(undefined, { maximumFractionDigits: 10 })
    }

    return (
        <CalculatorLayout
            title="Exponent Calculator"
            description="Calculate powers and exponents"
            category="Math"
            categoryPath="/math"
            icon={SquareFunction}
            result={formatNumber(results.result)}
            resultLabel={`${base}^${exponent}`}
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Base</label>
                    <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Exponent</label>
                    <input type="number" value={exponent} onChange={(e) => setExponent(Number(e.target.value))} step={1} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">{base}^{exponent}</span>
                    <span className="result-detail-value">{formatNumber(results.result)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">{base}^(-{exponent})</span>
                    <span className="result-detail-value">{formatNumber(results.inverse)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">{base}²</span>
                    <span className="result-detail-value">{formatNumber(results.squared)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">{base}³</span>
                    <span className="result-detail-value">{formatNumber(results.cubed)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">√{base}</span>
                    <span className="result-detail-value">{formatNumber(results.sqrt)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">∛{base}</span>
                    <span className="result-detail-value">{formatNumber(results.cbrt)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default ExponentCalculator
