import { useState, useMemo } from 'react'
import { Ruler } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function AreaConverter() {
    const [value, setValue] = useState(1)
    const [fromUnit, setFromUnit] = useState('acre')
    const [toUnit, setToUnit] = useState('sqm')

    // All areas in square meters
    const units = {
        sqmm: { name: 'Square Millimeter', factor: 0.000001 },
        sqcm: { name: 'Square Centimeter', factor: 0.0001 },
        sqm: { name: 'Square Meter', factor: 1 },
        sqkm: { name: 'Square Kilometer', factor: 1000000 },
        sqin: { name: 'Square Inch', factor: 0.00064516 },
        sqft: { name: 'Square Foot', factor: 0.092903 },
        sqyd: { name: 'Square Yard', factor: 0.836127 },
        acre: { name: 'Acre', factor: 4046.86 },
        hectare: { name: 'Hectare', factor: 10000 },
        sqmi: { name: 'Square Mile', factor: 2589988.11 }
    }

    const results = useMemo(() => {
        const sqMeters = value * units[fromUnit].factor
        const converted = sqMeters / units[toUnit].factor

        return { converted, sqMeters }
    }, [value, fromUnit, toUnit])

    return (
        <CalculatorLayout
            title="Area Converter"
            description="Convert between area units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Ruler}
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
                        {results.sqMeters.toFixed(4)} m²
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.sqMeters / 0.092903).toFixed(4)} ft²
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.sqMeters / 4046.86).toFixed(6)} acres
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.sqMeters / 10000).toFixed(6)} ha
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default AreaConverter
