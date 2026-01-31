import { useState, useMemo } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FactorialCalculator() {
    const [number, setNumber] = useState(5)

    const results = useMemo(() => {
        const factorial = (n) => {
            if (n < 0) return NaN
            if (n === 0 || n === 1) return 1
            let result = 1
            for (let i = 2; i <= n; i++) {
                result *= i
            }
            return result
        }

        const fact = factorial(number)
        const digitCount = fact.toString().length

        return { factorial: fact, digitCount }
    }, [number])

    return (
        <CalculatorLayout
            title="Factorial Calculator"
            description="Calculate n! (n factorial)"
            category="Math"
            categoryPath="/math"
            icon={Hash}
            result={results.factorial > 1e15 ? results.factorial.toExponential(4) : results.factorial.toLocaleString()}
            resultLabel={`${number}!`}
        >
            <div className="input-group">
                <label className="input-label">Enter Number (n)</label>
                <input type="number" value={number} onChange={(e) => setNumber(Math.min(170, Math.max(0, Number(e.target.value))))} min={0} max={170} />
                <span style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>Maximum: 170</span>
            </div>
            <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', textAlign: 'center', marginTop: '16px' }}>
                <code style={{ fontSize: '16px' }}>{number}! = {number} × {Math.max(1, number - 1)} × ... × 1</code>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Factorial</span>
                    <span className="result-detail-value" style={{ fontSize: results.factorial > 1e10 ? '12px' : 'inherit' }}>
                        {results.factorial > 1e15 ? results.factorial.toExponential(6) : results.factorial.toLocaleString()}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Number of Digits</span>
                    <span className="result-detail-value">{results.digitCount}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FactorialCalculator
