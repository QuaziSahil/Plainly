import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function QuadraticCalculator() {
    const [a, setA] = useState(1)
    const [b, setB] = useState(-5)
    const [c, setC] = useState(6)

    const results = useMemo(() => {
        if (a === 0) {
            return { error: 'Coefficient "a" cannot be zero', x1: null, x2: null }
        }

        const discriminant = b * b - 4 * a * c
        const vertex = { x: -b / (2 * a), y: a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c }

        if (discriminant < 0) {
            const realPart = -b / (2 * a)
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a)
            return {
                discriminant,
                x1: `${realPart.toFixed(3)} + ${imaginaryPart.toFixed(3)}i`,
                x2: `${realPart.toFixed(3)} - ${imaginaryPart.toFixed(3)}i`,
                type: 'Complex Roots',
                vertex
            }
        } else if (discriminant === 0) {
            const x = -b / (2 * a)
            return {
                discriminant,
                x1: x.toFixed(3),
                x2: x.toFixed(3),
                type: 'One Real Root',
                vertex
            }
        } else {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
            return {
                discriminant,
                x1: x1.toFixed(3),
                x2: x2.toFixed(3),
                type: 'Two Real Roots',
                vertex
            }
        }
    }, [a, b, c])

    return (
        <CalculatorLayout
            title="Quadratic Equation Solver"
            description="Solve ax² + bx + c = 0"
            category="Math"
            categoryPath="/math"
            icon={Calculator}
            result={results.error ? 'Error' : results.x1}
            resultLabel={results.error ? results.error : 'Root x₁'}
        >
            <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '16px', opacity: 0.8 }}>
                {a}x² + {b >= 0 ? '+' : ''}{b}x + {c >= 0 ? '+' : ''}{c} = 0
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">a (x² coefficient)</label>
                    <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">b (x coefficient)</label>
                    <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} step={0.1} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">c (constant)</label>
                <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} step={0.1} />
            </div>
            {!results.error && (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">Root x₁</span>
                        <span className="result-detail-value">{results.x1}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Root x₂</span>
                        <span className="result-detail-value">{results.x2}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Discriminant</span>
                        <span className="result-detail-value">{results.discriminant}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Type</span>
                        <span className="result-detail-value">{results.type}</span>
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default QuadraticCalculator
