import { useState, useMemo } from 'react'
import { Square } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PressureConverter() {
    const [value, setValue] = useState(1)
    const [fromUnit, setFromUnit] = useState('atm')

    // All values relative to Pascal (Pa)
    const conversions = {
        pa: 1,
        kpa: 1000,
        mpa: 1000000,
        bar: 100000,
        atm: 101325,
        psi: 6894.76,
        mmhg: 133.322,
        inhg: 3386.39,
        torr: 133.322
    }

    const labels = {
        pa: 'Pascal (Pa)',
        kpa: 'Kilopascal (kPa)',
        mpa: 'Megapascal (MPa)',
        bar: 'Bar',
        atm: 'Atmosphere (atm)',
        psi: 'PSI',
        mmhg: 'mmHg',
        inhg: 'inHg',
        torr: 'Torr'
    }

    const results = useMemo(() => {
        const valueInPa = value * conversions[fromUnit]

        return Object.keys(conversions).reduce((acc, unit) => {
            acc[unit] = valueInPa / conversions[unit]
            return acc
        }, {})
    }, [value, fromUnit])

    const formatValue = (val) => {
        if (Math.abs(val) >= 1000000) return val.toExponential(3)
        if (Math.abs(val) < 0.0001 && val !== 0) return val.toExponential(3)
        if (Number.isInteger(val)) return val.toLocaleString()
        return val.toPrecision(5)
    }

    return (
        <CalculatorLayout
            title="Pressure Converter"
            description="Convert between pressure units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Square}
            result={`${formatValue(results.psi)} psi`}
            resultLabel="PSI"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        <optgroup label="Metric">
                            <option value="pa">Pascal (Pa)</option>
                            <option value="kpa">Kilopascal (kPa)</option>
                            <option value="mpa">Megapascal (MPa)</option>
                            <option value="bar">Bar</option>
                        </optgroup>
                        <optgroup label="Other">
                            <option value="atm">Atmosphere (atm)</option>
                            <option value="psi">PSI</option>
                            <option value="mmhg">mmHg</option>
                            <option value="inhg">inHg</option>
                            <option value="torr">Torr</option>
                        </optgroup>
                    </select>
                </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {Object.keys(conversions).map(unit => (
                    <div
                        key={unit}
                        style={{
                            background: unit === fromUnit ? '#a78bfa20' : '#1a1a2e',
                            padding: '10px',
                            borderRadius: '8px',
                            border: unit === fromUnit ? '1px solid #a78bfa40' : 'none',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigator.clipboard.writeText(results[unit].toString())}
                    >
                        <div style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px' }}>{labels[unit].toUpperCase()}</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'monospace' }}>{formatValue(results[unit])}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                Click any value to copy
            </div>
        </CalculatorLayout>
    )
}

export default PressureConverter
