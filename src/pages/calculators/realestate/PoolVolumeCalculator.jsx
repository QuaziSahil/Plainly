import { useState, useMemo } from 'react'
import { Waves } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PoolVolumeCalculator() {
    const [shape, setShape] = useState('rectangular')
    const [length, setLength] = useState(30)
    const [width, setWidth] = useState(15)
    const [diameter, setDiameter] = useState(20)
    const [depthShallow, setDepthShallow] = useState(3)
    const [depthDeep, setDepthDeep] = useState(8)

    const results = useMemo(() => {
        const avgDepth = (depthShallow + depthDeep) / 2
        let volume = 0

        if (shape === 'rectangular') {
            volume = length * width * avgDepth
        } else if (shape === 'circular') {
            volume = Math.PI * (diameter / 2) ** 2 * avgDepth
        } else if (shape === 'oval') {
            volume = Math.PI * (length / 2) * (width / 2) * avgDepth
        }

        const gallons = volume * 7.48052
        const liters = gallons * 3.78541

        return { volume, gallons, liters, avgDepth }
    }, [shape, length, width, diameter, depthShallow, depthDeep])

    return (
        <CalculatorLayout
            title="Pool Volume Calculator"
            description="Calculate swimming pool volume"
            category="Real Estate"
            categoryPath="/calculators?category=Real%20Estate"
            icon={Waves}
            result={`${Math.round(results.gallons).toLocaleString()}`}
            resultLabel="Gallons"
        >
            <div className="input-group">
                <label className="input-label">Pool Shape</label>
                <select value={shape} onChange={(e) => setShape(e.target.value)}>
                    <option value="rectangular">Rectangular</option>
                    <option value="circular">Circular</option>
                    <option value="oval">Oval</option>
                </select>
            </div>
            {shape === 'circular' ? (
                <div className="input-group">
                    <label className="input-label">Diameter (ft)</label>
                    <input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} min={1} />
                </div>
            ) : (
                <div className="input-row">
                    <div className="input-group">
                        <label className="input-label">Length (ft)</label>
                        <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={1} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Width (ft)</label>
                        <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} />
                    </div>
                </div>
            )}
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Shallow Depth (ft)</label>
                    <input type="number" value={depthShallow} onChange={(e) => setDepthShallow(Number(e.target.value))} min={1} step={0.5} />
                </div>
                <div className="input-group">
                    <label className="input-label">Deep End (ft)</label>
                    <input type="number" value={depthDeep} onChange={(e) => setDepthDeep(Number(e.target.value))} min={1} step={0.5} />
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Average Depth</span>
                    <span className="result-detail-value">{results.avgDepth.toFixed(1)} ft</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Volume (cubic ft)</span>
                    <span className="result-detail-value">{results.volume.toFixed(1)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Gallons</span>
                    <span className="result-detail-value">{Math.round(results.gallons).toLocaleString()}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Liters</span>
                    <span className="result-detail-value">{Math.round(results.liters).toLocaleString()}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PoolVolumeCalculator
