import { useState, useMemo } from 'react'
import { Scale } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function WeightConverter() {
    const [value, setValue] = useState(100)
    const [fromUnit, setFromUnit] = useState('lb')
    const [toUnit, setToUnit] = useState('kg')

    // All weights in grams
    const units = {
        mg: { name: 'Milligram', factor: 0.001 },
        g: { name: 'Gram', factor: 1 },
        kg: { name: 'Kilogram', factor: 1000 },
        oz: { name: 'Ounce', factor: 28.3495 },
        lb: { name: 'Pound', factor: 453.592 },
        st: { name: 'Stone', factor: 6350.29 },
        ton: { name: 'Metric Ton', factor: 1000000 },
        shortTon: { name: 'US Ton', factor: 907185 }
    }

    const results = useMemo(() => {
        const grams = value * units[fromUnit].factor
        const converted = grams / units[toUnit].factor

        return { converted, grams }
    }, [value, fromUnit, toUnit])

    return (
        <CalculatorLayout
            title="Weight Converter"
            description="Convert between weight units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Scale}
            result={results.converted.toFixed(4)}
            resultLabel={units[toUnit].name}
        >
            <div className="input-group">
                <label className="input-label">Value</label>
                <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" />
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">From</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        {Object.entries(units).map(([key, unit]) => (
                            <option key={key} value={key}>{unit.name}</option>
                        ))}
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">To</label>
                    <select value={toUnit} onChange={(e) => setToUnit(e.target.value)}>
                        {Object.entries(units).map(([key, unit]) => (
                            <option key={key} value={key}>{unit.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">{value} {units[fromUnit].name}</span>
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.converted.toFixed(6)} {units[toUnit].name}</span>
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>QUICK REFERENCE</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px' }}>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.grams / 1000).toFixed(4)} kg
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.grams / 453.592).toFixed(4)} lb
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.grams / 28.3495).toFixed(4)} oz
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {results.grams.toFixed(4)} g
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default WeightConverter
