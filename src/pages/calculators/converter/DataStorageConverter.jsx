import { useState, useMemo } from 'react'
import { Binary } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function DataStorageConverter() {
    const [value, setValue] = useState(1)
    const [fromUnit, setFromUnit] = useState('gb')
    const [toUnit, setToUnit] = useState('mb')

    // All sizes in bytes
    const units = {
        bit: { name: 'Bit', factor: 0.125 },
        byte: { name: 'Byte', factor: 1 },
        kb: { name: 'Kilobyte (KB)', factor: 1024 },
        mb: { name: 'Megabyte (MB)', factor: 1048576 },
        gb: { name: 'Gigabyte (GB)', factor: 1073741824 },
        tb: { name: 'Terabyte (TB)', factor: 1099511627776 },
        pb: { name: 'Petabyte (PB)', factor: 1125899906842624 },
        kib: { name: 'Kibibyte (KiB)', factor: 1024 },
        mib: { name: 'Mebibyte (MiB)', factor: 1048576 },
        gib: { name: 'Gibibyte (GiB)', factor: 1073741824 }
    }

    const results = useMemo(() => {
        const bytes = value * units[fromUnit].factor
        const converted = bytes / units[toUnit].factor

        return { converted, bytes }
    }, [value, fromUnit, toUnit])

    return (
        <CalculatorLayout
            title="Data Storage Converter"
            description="Convert between data storage units"
            category="Converter"
            categoryPath="/calculators?category=Converter"
            icon={Binary}
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
                        {(results.bytes / units.kb.factor).toFixed(2)} KB
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.bytes / units.mb.factor).toFixed(4)} MB
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.bytes / units.gb.factor).toFixed(6)} GB
                    </div>
                    <div style={{ background: '#1a1a2e', padding: '8px', borderRadius: '6px' }}>
                        {(results.bytes / units.tb.factor).toFixed(8)} TB
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default DataStorageConverter
