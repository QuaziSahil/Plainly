import { useState, useMemo } from 'react'
import { Ruler } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LengthConverter() {
    const [value, setValue] = useState(100)
    const [fromUnit, setFromUnit] = useState('cm')

    const conversions = {
        mm: 1,
        cm: 10,
        m: 1000,
        km: 1000000,
        inch: 25.4,
        foot: 304.8,
        yard: 914.4,
        mile: 1609344
    }

    const labels = {
        mm: 'Millimeters',
        cm: 'Centimeters',
        m: 'Meters',
        km: 'Kilometers',
        inch: 'Inches',
        foot: 'Feet',
        yard: 'Yards',
        mile: 'Miles'
    }

    const results = useMemo(() => {
        const valueInMm = value * conversions[fromUnit]

        return Object.keys(conversions).reduce((acc, unit) => {
            acc[unit] = valueInMm / conversions[unit]
            return acc
        }, {})
    }, [value, fromUnit])

    const formatValue = (val) => {
        if (Math.abs(val) >= 1000000) return val.toExponential(2)
        if (Math.abs(val) < 0.001 && val !== 0) return val.toExponential(2)
        if (Number.isInteger(val)) return val.toLocaleString()
        return val.toFixed(val < 1 ? 4 : 2)
    }

    return (
        <CalculatorLayout
            title="Length Converter"
            description="Convert between length units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Ruler}
            result={`${formatValue(results.m)} m`}
            resultLabel="Meters"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">From</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        <optgroup label="Metric">
                            <option value="mm">Millimeters</option>
                            <option value="cm">Centimeters</option>
                            <option value="m">Meters</option>
                            <option value="km">Kilometers</option>
                        </optgroup>
                        <optgroup label="Imperial">
                            <option value="inch">Inches</option>
                            <option value="foot">Feet</option>
                            <option value="yard">Yards</option>
                            <option value="mile">Miles</option>
                        </optgroup>
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {Object.keys(conversions).map(unit => (
                    <div
                        key={unit}
                        style={{
                            background: unit === fromUnit ? '#a78bfa20' : '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            border: unit === fromUnit ? '1px solid #a78bfa40' : 'none',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigator.clipboard.writeText(results[unit].toString())}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>{labels[unit].toUpperCase()}</div>
                        <div style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{formatValue(results[unit])}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                Click any value to copy
            </div>
        </CalculatorLayout>
    )
}

export default LengthConverter
