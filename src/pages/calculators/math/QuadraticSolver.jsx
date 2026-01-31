import { useState, useMemo } from 'react'
import { Calculator } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function QuadraticSolver() {
    const [a, setA] = useState(1)
    const [b, setB] = useState(-5)
    const [c, setC] = useState(6)

    const results = useMemo(() => {
        const discriminant = b * b - 4 * a * c

        if (discriminant > 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a)
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a)
            return {
                type: 'real',
                x1,
                x2,
                discriminant,
                vertex: { x: -b / (2 * a), y: a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c }
            }
        } else if (discriminant === 0) {
            const x = -b / (2 * a)
            return {
                type: 'single',
                x,
                discriminant,
                vertex: { x: -b / (2 * a), y: a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c }
            }
        } else {
            const realPart = -b / (2 * a)
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a)
            return {
                type: 'complex',
                realPart,
                imaginaryPart,
                discriminant,
                vertex: { x: -b / (2 * a), y: a * Math.pow(-b / (2 * a), 2) + b * (-b / (2 * a)) + c }
            }
        }
    }, [a, b, c])

    const formatEquation = () => {
        let eq = ''
        if (a !== 0) eq += `${a === 1 ? '' : a === -1 ? '-' : a}x²`
        if (b !== 0) eq += `${b > 0 ? ' + ' : ' - '}${Math.abs(b) === 1 ? '' : Math.abs(b)}x`
        if (c !== 0) eq += `${c > 0 ? ' + ' : ' - '}${Math.abs(c)}`
        eq += ' = 0'
        return eq
    }

    return (
        <CalculatorLayout
            title="Quadratic Equation Solver"
            description="Solve ax² + bx + c = 0"
            category="Math"
            categoryPath="/math"
            icon={Calculator}
            result={results.type === 'real' ? `x = ${results.x1.toFixed(3)}, ${results.x2.toFixed(3)}` :
                results.type === 'single' ? `x = ${results.x.toFixed(3)}` :
                    'Complex roots'}
            resultLabel="Solution"
        >
            <div style={{
                background: '#1a1a2e',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '18px',
                marginBottom: '16px'
            }}>
                {formatEquation()}
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">a (x² coefficient)</label>
                    <input type="number" value={a} onChange={(e) => setA(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group">
                    <label className="input-label">b (x coefficient)</label>
                    <input type="number" value={b} onChange={(e) => setB(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group">
                    <label className="input-label">c (constant)</label>
                    <input type="number" value={c} onChange={(e) => setC(Number(e.target.value))} step="any" />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Discriminant (b² - 4ac)</span>
                    <span className="result-detail-value">{results.discriminant.toFixed(4)}</span>
                </div>
                {results.type === 'real' && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">x₁</span>
                            <span className="result-detail-value" style={{ color: '#10b981' }}>{results.x1.toFixed(6)}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">x₂</span>
                            <span className="result-detail-value" style={{ color: '#10b981' }}>{results.x2.toFixed(6)}</span>
                        </div>
                    </>
                )}
                {results.type === 'single' && (
                    <div className="result-detail-row">
                        <span className="result-detail-label">x (double root)</span>
                        <span className="result-detail-value" style={{ color: '#10b981' }}>{results.x.toFixed(6)}</span>
                    </div>
                )}
                {results.type === 'complex' && (
                    <>
                        <div className="result-detail-row">
                            <span className="result-detail-label">x₁</span>
                            <span className="result-detail-value" style={{ color: '#a78bfa' }}>
                                {results.realPart.toFixed(4)} + {results.imaginaryPart.toFixed(4)}i
                            </span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">x₂</span>
                            <span className="result-detail-value" style={{ color: '#a78bfa' }}>
                                {results.realPart.toFixed(4)} - {results.imaginaryPart.toFixed(4)}i
                            </span>
                        </div>
                    </>
                )}
                <div className="result-detail-row">
                    <span className="result-detail-label">Vertex</span>
                    <span className="result-detail-value">({results.vertex.x.toFixed(3)}, {results.vertex.y.toFixed(3)})</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default QuadraticSolver
