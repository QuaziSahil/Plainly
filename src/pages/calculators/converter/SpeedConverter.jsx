import { useState, useMemo } from 'react'
import { Gauge } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function SpeedConverter() {
    const [value, setValue] = useState(60)
    const [fromUnit, setFromUnit] = useState('mph')
    const [toUnit, setToUnit] = useState('kph')

    // All speeds in meters per second
    const units = {
        mps: { name: 'Meters/Second', factor: 1 },
        kph: { name: 'Kilometers/Hour', factor: 0.277778 },
        mph: { name: 'Miles/Hour', factor: 0.44704 },
        fps: { name: 'Feet/Second', factor: 0.3048 },
        knot: { name: 'Knots', factor: 0.514444 },
        mach: { name: 'Mach', factor: 343 }
    }

    const results = useMemo(() => {
        const mps = value * units[fromUnit].factor
        const converted = mps / units[toUnit].factor

        return { converted, mps }
    }, [value, fromUnit, toUnit])

    return (
        <CalculatorLayout
            title="Speed Converter"
            description="Convert between speed units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Gauge}
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
                    <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.converted.toFixed(4)} {units[toUnit].name}</span>
                </div>
            </div>
            <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>ALL CONVERSIONS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px' }}>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.mps / units.mph.factor).toFixed(2)} mph
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.mps / units.kph.factor).toFixed(2)} km/h
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {results.mps.toFixed(2)} m/s
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.mps / units.knot.factor).toFixed(2)} knots
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default SpeedConverter
