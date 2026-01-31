import { useState, useMemo } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LCMGCDCalculator() {
    const [number1, setNumber1] = useState(12)
    const [number2, setNumber2] = useState(18)

    const results = useMemo(() => {
        const a = Math.abs(Math.floor(number1))
        const b = Math.abs(Math.floor(number2))

        if (a === 0 || b === 0) {
            return { gcd: Math.max(a, b), lcm: 0 }
        }

        // Calculate GCD using Euclidean algorithm
        const gcd = (x, y) => y === 0 ? x : gcd(y, x % y)
        const gcdResult = gcd(a, b)

        // LCM = (a * b) / GCD
        const lcmResult = (a * b) / gcdResult

        // Find common factors
        const commonFactors = []
        for (let i = 1; i <= gcdResult; i++) {
            if (a % i === 0 && b % i === 0) {
                commonFactors.push(i)
            }
        }

        return {
            gcd: gcdResult,
            lcm: lcmResult,
            commonFactors,
            product: a * b
        }
    }, [number1, number2])

    return (
        <CalculatorLayout
            title="LCM & GCD Calculator"
            description="Calculate Least Common Multiple and Greatest Common Divisor"
            category="Math"
            categoryPath="/math"
            icon={Hash}
            result={results.lcm.toLocaleString()}
            resultLabel="LCM"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">First Number</label>
                    <input type="number" value={number1} onChange={(e) => setNumber1(Number(e.target.value))} min={1} max={100000} />
                </div>
                <div className="input-group">
                    <label className="input-label">Second Number</label>
                    <input type="number" value={number2} onChange={(e) => setNumber2(Number(e.target.value))} min={1} max={100000} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">LCM (Least Common Multiple)</span>
                    <span className="result-detail-value">{results.lcm.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">GCD (Greatest Common Divisor)</span>
                    <span className="result-detail-value">{results.gcd.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Product</span>
                    <span className="result-detail-value">{results.product.toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Common Factors</span>
                    <span className="result-detail-value">{results.commonFactors?.join(', ')}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default LCMGCDCalculator
