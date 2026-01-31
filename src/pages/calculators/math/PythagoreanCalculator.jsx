import { useState, useMemo } from 'react'
import { Triangle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PythagoreanCalculator() {
    const [mode, setMode] = useState('hypotenuse')
    const [sideA, setSideA] = useState(3)
    const [sideB, setSideB] = useState(4)
    const [hypotenuse, setHypotenuse] = useState(5)

    const results = useMemo(() => {
        let result = 0
        let label = ''

        if (mode === 'hypotenuse') {
            result = Math.sqrt(sideA ** 2 + sideB ** 2)
            label = 'Hypotenuse (c)'
        } else if (mode === 'sideA') {
            result = Math.sqrt(hypotenuse ** 2 - sideB ** 2)
            label = 'Side A'
        } else {
            result = Math.sqrt(hypotenuse ** 2 - sideA ** 2)
            label = 'Side B'
        }

        const area = (sideA * sideB) / 2
        const perimeter = sideA + sideB + (mode === 'hypotenuse' ? result : hypotenuse)

        return { result: isNaN(result) ? 0 : result, label, area, perimeter }
    }, [mode, sideA, sideB, hypotenuse])

    return (
        <CalculatorLayout
            title="Pythagorean Theorem"
            description="Calculate triangle sides using a² + b² = c²"
            category="Math"
            categoryPath="/math"
            icon={Triangle}
            result={results.result.toFixed(4)}
            resultLabel={results.label}
        >
            <div className="input-group">
                <label className="input-label">Calculate</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="hypotenuse">Hypotenuse (c)</option>
                    <option value="sideA">Side A</option>
                    <option value="sideB">Side B</option>
                </select>
            </div>
            {mode !== 'sideA' && (
                <div className="input-group">
                    <label className="input-label">Side A</label>
                    <input type="number" value={sideA} onChange={(e) => setSideA(Number(e.target.value))} min={0} step={0.1} />
                </div>
            )}
            {mode !== 'sideB' && (
                <div className="input-group">
                    <label className="input-label">Side B</label>
                    <input type="number" value={sideB} onChange={(e) => setSideB(Number(e.target.value))} min={0} step={0.1} />
                </div>
            )}
            {mode !== 'hypotenuse' && (
                <div className="input-group">
                    <label className="input-label">Hypotenuse (c)</label>
                    <input type="number" value={hypotenuse} onChange={(e) => setHypotenuse(Number(e.target.value))} min={0} step={0.1} />
                </div>
            )}
            <div style={{ background: '#1a1a2e', padding: '16px', borderRadius: '8px', textAlign: 'center', marginTop: '16px' }}>
                <code style={{ fontSize: '16px' }}>a² + b² = c²</code>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">{results.label}</span>
                    <span className="result-detail-value">{results.result.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Triangle Area</span>
                    <span className="result-detail-value">{results.area.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PythagoreanCalculator
