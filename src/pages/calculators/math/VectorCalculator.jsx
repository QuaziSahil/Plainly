import { useState, useMemo } from 'react'
import { Atom } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function VectorCalculator() {
    const [mode, setMode] = useState('2d')
    const [v1x, setV1x] = useState(3)
    const [v1y, setV1y] = useState(4)
    const [v1z, setV1z] = useState(0)
    const [v2x, setV2x] = useState(1)
    const [v2y, setV2y] = useState(2)
    const [v2z, setV2z] = useState(0)

    const results = useMemo(() => {
        const is3D = mode === '3d'

        // Magnitudes
        const mag1 = Math.sqrt(v1x ** 2 + v1y ** 2 + (is3D ? v1z ** 2 : 0))
        const mag2 = Math.sqrt(v2x ** 2 + v2y ** 2 + (is3D ? v2z ** 2 : 0))

        // Addition
        const sumX = v1x + v2x
        const sumY = v1y + v2y
        const sumZ = is3D ? v1z + v2z : 0
        const sumMag = Math.sqrt(sumX ** 2 + sumY ** 2 + (is3D ? sumZ ** 2 : 0))

        // Subtraction
        const diffX = v1x - v2x
        const diffY = v1y - v2y
        const diffZ = is3D ? v1z - v2z : 0

        // Dot product
        const dot = v1x * v2x + v1y * v2y + (is3D ? v1z * v2z : 0)

        // Cross product (only for 3D)
        const crossX = v1y * v2z - v1z * v2y
        const crossY = v1z * v2x - v1x * v2z
        const crossZ = v1x * v2y - v1y * v2x

        // Angle between vectors
        const cosAngle = dot / (mag1 * mag2)
        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180 / Math.PI

        // Unit vectors
        const unit1 = { x: v1x / mag1, y: v1y / mag1, z: v1z / mag1 }
        const unit2 = { x: v2x / mag2, y: v2y / mag2, z: v2z / mag2 }

        return {
            mag1, mag2,
            sum: { x: sumX, y: sumY, z: sumZ, mag: sumMag },
            diff: { x: diffX, y: diffY, z: diffZ },
            dot,
            cross: { x: crossX, y: crossY, z: crossZ },
            angle,
            unit1, unit2
        }
    }, [mode, v1x, v1y, v1z, v2x, v2y, v2z])

    const formatVector = (x, y, z, show3D) => {
        if (show3D) return `(${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`
        return `(${x.toFixed(2)}, ${y.toFixed(2)})`
    }

    return (
        <CalculatorLayout
            title="Vector Calculator"
            description="Calculate vector operations"
            category="Math"
            categoryPath="/math"
            icon={Atom}
            result={formatVector(results.sum.x, results.sum.y, results.sum.z, mode === '3d')}
            resultLabel="Sum (A + B)"
        >
            <div className="input-group">
                <label className="input-label">Dimensions</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="2d">2D Vectors</option>
                    <option value="3d">3D Vectors</option>
                </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>VECTOR A</div>
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">X</label>
                        <input type="number" value={v1x} onChange={(e) => setV1x(Number(e.target.value))} step="any" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Y</label>
                        <input type="number" value={v1y} onChange={(e) => setV1y(Number(e.target.value))} step="any" />
                    </div>
                    {mode === '3d' && (
                        <div className="input-group">
                            <label className="input-label">Z</label>
                            <input type="number" value={v1z} onChange={(e) => setV1z(Number(e.target.value))} step="any" />
                        </div>
                    )}
                </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>VECTOR B</div>
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">X</label>
                        <input type="number" value={v2x} onChange={(e) => setV2x(Number(e.target.value))} step="any" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Y</label>
                        <input type="number" value={v2y} onChange={(e) => setV2y(Number(e.target.value))} step="any" />
                    </div>
                    {mode === '3d' && (
                        <div className="input-group">
                            <label className="input-label">Z</label>
                            <input type="number" value={v2z} onChange={(e) => setV2z(Number(e.target.value))} step="any" />
                        </div>
                    )}
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">|A| (Magnitude)</span>
                    <span className="result-detail-value">{results.mag1.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">|B| (Magnitude)</span>
                    <span className="result-detail-value">{results.mag2.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">A + B</span>
                    <span className="result-detail-value" style={{ color: '#22c55e' }}>{formatVector(results.sum.x, results.sum.y, results.sum.z, mode === '3d')}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">A - B</span>
                    <span className="result-detail-value">{formatVector(results.diff.x, results.diff.y, results.diff.z, mode === '3d')}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">A · B (Dot Product)</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.dot.toFixed(4)}</span>
                </div>
                {mode === '3d' && (
                    <div className="result-detail-row">
                        <span className="result-detail-label">A × B (Cross Product)</span>
                        <span className="result-detail-value">{formatVector(results.cross.x, results.cross.y, results.cross.z, true)}</span>
                    </div>
                )}
                <div className="result-detail-row">
                    <span className="result-detail-label">Angle Between</span>
                    <span className="result-detail-value">{results.angle.toFixed(2)}°</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default VectorCalculator
