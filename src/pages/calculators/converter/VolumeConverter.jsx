import { useState, useMemo } from 'react'
import { Beaker } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function VolumeConverter() {
    const [value, setValue] = useState(1)
    const [fromUnit, setFromUnit] = useState('gallon')
    const [toUnit, setToUnit] = useState('liter')

    // All volumes in liters
    const units = {
        ml: { name: 'Milliliter', factor: 0.001 },
        liter: { name: 'Liter', factor: 1 },
        cubicm: { name: 'Cubic Meter', factor: 1000 },
        tsp: { name: 'Teaspoon', factor: 0.00492892 },
        tbsp: { name: 'Tablespoon', factor: 0.0147868 },
        floz: { name: 'Fluid Ounce', factor: 0.0295735 },
        cup: { name: 'Cup', factor: 0.236588 },
        pint: { name: 'Pint', factor: 0.473176 },
        quart: { name: 'Quart', factor: 0.946353 },
        gallon: { name: 'Gallon', factor: 3.78541 },
        cubicft: { name: 'Cubic Foot', factor: 28.3168 }
    }

    const results = useMemo(() => {
        const liters = value * units[fromUnit].factor
        const converted = liters / units[toUnit].factor

        return { converted, liters }
    }, [value, fromUnit, toUnit])

    return (
        <CalculatorLayout
            title="Volume Converter"
            description="Convert between volume units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Beaker}
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
                        {results.liters.toFixed(4)} L
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.liters * 1000).toFixed(2)} mL
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.liters / 3.78541).toFixed(4)} gal
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.liters / 0.0295735).toFixed(2)} fl oz
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default VolumeConverter
