import { useState, useMemo } from 'react'
import { Divide } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function FractionCalculator() {
    const [num1, setNum1] = useState(1)
    const [den1, setDen1] = useState(2)
    const [num2, setNum2] = useState(1)
    const [den2, setDen2] = useState(4)
    const [operation, setOperation] = useState('add')

    const gcd = (a, b) => {
        a = Math.abs(a)
        b = Math.abs(b)
        while (b) {
            let t = b
            b = a % b
            a = t
        }
        return a
    }

    const simplify = (num, den) => {
        if (den === 0) return { num: 0, den: 1 }
        const g = gcd(num, den)
        return { num: num / g, den: den / g }
    }

    const results = useMemo(() => {
        let resultNum, resultDen

        switch (operation) {
            case 'add':
                resultNum = num1 * den2 + num2 * den1
                resultDen = den1 * den2
                break
            case 'subtract':
                resultNum = num1 * den2 - num2 * den1
                resultDen = den1 * den2
                break
            case 'multiply':
                resultNum = num1 * num2
                resultDen = den1 * den2
                break
            case 'divide':
                resultNum = num1 * den2
                resultDen = den1 * num2
                break
            default:
                resultNum = num1
                resultDen = den1
        }

        const simplified = simplify(resultNum, resultDen)
        const decimal = simplified.den !== 0 ? simplified.num / simplified.den : 0

        return {
            num: simplified.num,
            den: simplified.den,
            decimal: decimal.toFixed(6),
            mixed: getMixed(simplified.num, simplified.den)
        }
    }, [num1, den1, num2, den2, operation])

    const getMixed = (num, den) => {
        if (den === 0) return '0'
        if (Math.abs(num) < Math.abs(den)) return `${num}/${den}`
        const whole = Math.floor(Math.abs(num) / Math.abs(den))
        const remainder = Math.abs(num) % Math.abs(den)
        const sign = (num < 0) !== (den < 0) ? '-' : ''
        if (remainder === 0) return `${sign}${whole}`
        return `${sign}${whole} ${remainder}/${Math.abs(den)}`
    }

    const getOperationSymbol = () => {
        switch (operation) {
            case 'add': return '+'
            case 'subtract': return '−'
            case 'multiply': return '×'
            case 'divide': return '÷'
            default: return '+'
        }
    }

    return (
        <CalculatorLayout
            title="Fraction Calculator"
            subtitle="Add, subtract, multiply, and divide fractions"
            category="Math"
            categoryPath="/math"
            icon={Divide}
            result={`${results.num}/${results.den}`}
            resultLabel="Result"
        >
            <div className="input-group">
                <label className="input-label">Operation</label>
                <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                    <option value="add">Add (+)</option>
                    <option value="subtract">Subtract (−)</option>
                    <option value="multiply">Multiply (×)</option>
                    <option value="divide">Divide (÷)</option>
                </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {/* Fraction 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <input
                        type="number"
                        value={num1}
                        onChange={(e) => setNum1(Number(e.target.value))}
                        style={{ width: '80px', textAlign: 'center' }}
                    />
                    <div style={{ width: '80px', height: '2px', background: 'var(--text-primary)' }} />
                    <input
                        type="number"
                        value={den1}
                        onChange={(e) => setDen1(Number(e.target.value))}
                        style={{ width: '80px', textAlign: 'center' }}
                    />
                </div>

                {/* Operator */}
                <span style={{ fontSize: 'var(--font-size-h2)', color: 'var(--accent-primary)' }}>
                    {getOperationSymbol()}
                </span>

                {/* Fraction 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <input
                        type="number"
                        value={num2}
                        onChange={(e) => setNum2(Number(e.target.value))}
                        style={{ width: '80px', textAlign: 'center' }}
                    />
                    <div style={{ width: '80px', height: '2px', background: 'var(--text-primary)' }} />
                    <input
                        type="number"
                        value={den2}
                        onChange={(e) => setDen2(Number(e.target.value))}
                        style={{ width: '80px', textAlign: 'center' }}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Simplified</span>
                    <span className="result-detail-value">{results.num}/{results.den}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Mixed Number</span>
                    <span className="result-detail-value">{results.mixed}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Decimal</span>
                    <span className="result-detail-value">{results.decimal}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default FractionCalculator
