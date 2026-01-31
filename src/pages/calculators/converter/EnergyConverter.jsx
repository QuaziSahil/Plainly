import { useState, useMemo } from 'react'
import { Power } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function EnergyConverter() {
    const [value, setValue] = useState(1000)
    const [fromUnit, setFromUnit] = useState('cal')
    const [toUnit, setToUnit] = useState('kj')

    // All energy in joules
    const units = {
        j: { name: 'Joule', factor: 1 },
        kj: { name: 'Kilojoule', factor: 1000 },
        cal: { name: 'Calorie', factor: 4.184 },
        kcal: { name: 'Kilocalorie', factor: 4184 },
        wh: { name: 'Watt-hour', factor: 3600 },
        kwh: { name: 'Kilowatt-hour', factor: 3600000 },
        btu: { name: 'BTU', factor: 1055.06 },
        ev: { name: 'Electronvolt', factor: 1.602e-19 },
        ftlb: { name: 'Foot-pound', factor: 1.35582 }
    }

    const results = useMemo(() => {
        const joules = value * units[fromUnit].factor
        const converted = joules / units[toUnit].factor

        return { converted, joules }
    }, [value, fromUnit, toUnit])

    return (
        <CalculatorLayout
            title="Energy Converter"
            description="Convert between energy units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Power}
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
                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>COMMON CONVERSIONS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '13px' }}>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.joules / 1000).toFixed(4)} kJ
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.joules / 4184).toFixed(4)} kcal
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.joules / 1055.06).toFixed(4)} BTU
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.joules / 3600).toFixed(4)} Wh
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default EnergyConverter
