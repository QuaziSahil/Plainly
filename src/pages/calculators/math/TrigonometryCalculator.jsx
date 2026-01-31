import { useState, useMemo } from 'react'
import { Pi } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TrigonometryCalculator() {
    const [angle, setAngle] = useState(45)
    const [unit, setUnit] = useState('degrees')

    const results = useMemo(() => {
        const angleRad = unit === 'degrees' ? (angle * Math.PI / 180) : angle
        const angleDeg = unit === 'radians' ? (angle * 180 / Math.PI) : angle

        const sin = Math.sin(angleRad)
        const cos = Math.cos(angleRad)
        const tan = Math.tan(angleRad)
        const cot = 1 / tan
        const sec = 1 / cos
        const csc = 1 / sin

        return { sin, cos, tan, cot, sec, csc, angleRad, angleDeg }
    }, [angle, unit])

    return (
        <CalculatorLayout
            title="Trigonometry Calculator"
            description="Calculate sin, cos, tan and more"
            category="Math"
            categoryPath="/math"
            icon={Pi}
            result={`sin(${results.angleDeg.toFixed(0)}°) = ${results.sin.toFixed(4)}`}
            resultLabel="Result"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Angle</label>
                    <input type="number" value={angle} onChange={(e) => setAngle(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Unit</label>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                        <option value="degrees">Degrees</option>
                        <option value="radians">Radians</option>
                    </select>
                </div>
            </div>
            <div style={{ marginBottom: '16px', padding: '12px', background: '#1a1a2e', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ opacity: 0.6 }}>{results.angleDeg.toFixed(2)}° = </span>
                <span style={{ color: '#a78bfa' }}>{results.angleRad.toFixed(4)} rad</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>SIN</div>
                    <div style={{ fontSize: '16px', fontFamily: 'monospace' }}>{results.sin.toFixed(6)}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>COS</div>
                    <div style={{ fontSize: '16px', fontFamily: 'monospace' }}>{results.cos.toFixed(6)}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>TAN</div>
                    <div style={{ fontSize: '16px', fontFamily: 'monospace' }}>{isFinite(results.tan) ? results.tan.toFixed(6) : 'undefined'}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>COT</div>
                    <div style={{ fontSize: '16px', fontFamily: 'monospace' }}>{isFinite(results.cot) ? results.cot.toFixed(6) : 'undefined'}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>SEC</div>
                    <div style={{ fontSize: '16px', fontFamily: 'monospace' }}>{isFinite(results.sec) ? results.sec.toFixed(6) : 'undefined'}</div>
                </div>
                <div style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>CSC</div>
                    <div style={{ fontSize: '16px', fontFamily: 'monospace' }}>{isFinite(results.csc) ? results.csc.toFixed(6) : 'undefined'}</div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default TrigonometryCalculator
