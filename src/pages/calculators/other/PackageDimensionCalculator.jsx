import { useState, useMemo } from 'react'
import { Box } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PackageDimensionCalculator() {
    const [length, setLength] = useState(12)
    const [width, setWidth] = useState(10)
    const [height, setHeight] = useState(8)
    const [weight, setWeight] = useState(5)
    const [unit, setUnit] = useState('in')

    const results = useMemo(() => {
        // Dimensional weight factor (varies by carrier)
        const dimFactor = unit === 'in' ? 166 : 5000

        const volume = length * width * height
        const dimWeight = volume / dimFactor
        const billableWeight = Math.max(weight, dimWeight)

        // Girth calculation for shipping
        const sorted = [length, width, height].sort((a, b) => b - a)
        const longest = sorted[0]
        const girth = (sorted[1] + sorted[2]) * 2
        const lengthPlusGirth = longest + girth

        // Size classification
        let sizeClass
        if (unit === 'in') {
            if (lengthPlusGirth <= 84 && longest <= 22) sizeClass = 'Small'
            else if (lengthPlusGirth <= 108) sizeClass = 'Medium'
            else if (lengthPlusGirth <= 130) sizeClass = 'Large'
            else sizeClass = 'Oversize'
        } else {
            // Convert to cm thresholds
            if (lengthPlusGirth <= 213 && longest <= 56) sizeClass = 'Small'
            else if (lengthPlusGirth <= 274) sizeClass = 'Medium'
            else if (lengthPlusGirth <= 330) sizeClass = 'Large'
            else sizeClass = 'Oversize'
        }

        return {
            volume,
            dimWeight,
            billableWeight,
            girth,
            lengthPlusGirth,
            sizeClass,
            useDim: dimWeight > weight
        }
    }, [length, width, height, weight, unit])

    return (
        <CalculatorLayout
            title="Package Dimension Calculator"
            description="Calculate shipping dimensions & volume"
            category="Other"
            categoryPath="/calculators?category=Other"
            icon={Box}
            result={`${results.billableWeight.toFixed(1)} ${unit === 'in' ? 'lbs' : 'kg'}`}
            resultLabel="Billable Weight"
        >
            <div className="input-group">
                <label className="input-label">Units</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                    <option value="in">Inches / Pounds</option>
                    <option value="cm">Centimeters / Kilograms</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Length ({unit})</label>
                    <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Width ({unit})</label>
                    <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Height ({unit})</label>
                    <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Actual Weight ({unit === 'in' ? 'lbs' : 'kg'})</label>
                <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} min={0} step={0.1} />
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div style={{
                    flex: 1,
                    background: '#1a1a2e',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#a78bfa' }}>
                        {results.volume.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Volume ({unit}³)</div>
                </div>
                <div style={{
                    flex: 1,
                    background: results.sizeClass === 'Oversize' ? '#ef444420' : '#22c55e20',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '18px', fontWeight: 700 }}>{results.sizeClass}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>Size Class</div>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Actual Weight</span>
                    <span className="result-detail-value">{weight} {unit === 'in' ? 'lbs' : 'kg'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Dimensional Weight</span>
                    <span className="result-detail-value">{results.dimWeight.toFixed(1)} {unit === 'in' ? 'lbs' : 'kg'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Billable Weight</span>
                    <span className="result-detail-value" style={{ color: results.useDim ? '#f59e0b' : '#22c55e' }}>
                        {results.billableWeight.toFixed(1)} {unit === 'in' ? 'lbs' : 'kg'}
                        {results.useDim && ' (DIM)'}
                    </span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Girth</span>
                    <span className="result-detail-value">{results.girth} {unit}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Length + Girth</span>
                    <span className="result-detail-value">{results.lengthPlusGirth} {unit}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default PackageDimensionCalculator
