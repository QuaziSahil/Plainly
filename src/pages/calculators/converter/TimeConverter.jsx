import { useState, useMemo } from 'react'
import { Clock } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function TimeConverter() {
    const [value, setValue] = useState(24)
    const [fromUnit, setFromUnit] = useState('hours')

    const conversions = {
        milliseconds: 1,
        seconds: 1000,
        minutes: 60000,
        hours: 3600000,
        days: 86400000,
        weeks: 604800000,
        months: 2628000000,
        years: 31536000000
    }

    const labels = {
        milliseconds: 'Milliseconds',
        seconds: 'Seconds',
        minutes: 'Minutes',
        hours: 'Hours',
        days: 'Days',
        weeks: 'Weeks',
        months: 'Months (avg)',
        years: 'Years'
    }

    const results = useMemo(() => {
        const valueInMs = value * conversions[fromUnit]

        return Object.keys(conversions).reduce((acc, unit) => {
            acc[unit] = valueInMs / conversions[unit]
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
            title="Time Converter"
            description="Convert between time units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Clock}
            result={`${formatValue(results.hours)} hrs`}
            resultLabel="Hours"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Value</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step="any" />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                    <label className="input-label">Unit</label>
                    <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}>
                        <option value="milliseconds">Milliseconds</option>
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
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

export default TimeConverter
