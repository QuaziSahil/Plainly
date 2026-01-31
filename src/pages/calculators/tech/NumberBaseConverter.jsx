import { useState, useMemo } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function NumberBaseConverter() {
    const [value, setValue] = useState('255')
    const [fromBase, setFromBase] = useState(10)

    const results = useMemo(() => {
        try {
            const decimal = parseInt(value, fromBase)
            if (isNaN(decimal)) return null

            return {
                decimal: decimal,
                binary: decimal.toString(2),
                octal: decimal.toString(8),
                hex: decimal.toString(16).toUpperCase(),
                base32: decimal.toString(32).toUpperCase(),
                base36: decimal.toString(36).toUpperCase()
            }
        } catch (e) {
            return null
        }
    }, [value, fromBase])

    const copyValue = (val) => {
        navigator.clipboard.writeText(val)
    }

    return (
        <CalculatorLayout
            title="Number Base Converter"
            description="Convert between number bases"
            category="Tech"
            categoryPath="/calculators?category=Tech"
            icon={Hash}
            result={results?.decimal?.toString() || '—'}
            resultLabel="Decimal"
        >
            <div className="input-row">
                <div className="input-group" style={{ flex: 2 }}>
                    <label className="input-label">Input Value</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value.toUpperCase())}
                        placeholder="Enter value"
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">From Base</label>
                    <select value={fromBase} onChange={(e) => setFromBase(Number(e.target.value))}>
                        <option value={2}>Binary (2)</option>
                        <option value={8}>Octal (8)</option>
                        <option value={10}>Decimal (10)</option>
                        <option value={16}>Hex (16)</option>
                        <option value={32}>Base-32</option>
                        <option value={36}>Base-36</option>
                    </select>
                </div>
            </div>
            {results && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div
                        onClick={() => copyValue(results.binary)}
                        style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>BINARY (2)</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all' }}>{results.binary}</div>
                    </div>
                    <div
                        onClick={() => copyValue(results.octal)}
                        style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>OCTAL (8)</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{results.octal}</div>
                    </div>
                    <div
                        onClick={() => copyValue(results.decimal.toString())}
                        style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>DECIMAL (10)</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{results.decimal}</div>
                    </div>
                    <div
                        onClick={() => copyValue(results.hex)}
                        style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>HEX (16)</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{results.hex}</div>
                    </div>
                    <div
                        onClick={() => copyValue(results.base32)}
                        style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>BASE-32</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{results.base32}</div>
                    </div>
                    <div
                        onClick={() => copyValue(results.base36)}
                        style={{ background: '#1a1a2e', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <div style={{ fontSize: '11px', opacity: 0.6, marginBottom: '4px' }}>BASE-36</div>
                        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>{results.base36}</div>
                    </div>
                </div>
            )}
            {!results && value && (
                <div style={{ background: '#ef444420', padding: '12px', borderRadius: '8px', color: '#ef4444' }}>
                    Invalid input for the selected base
                </div>
            )}
            <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.5, textAlign: 'center' }}>
                Click any value to copy
            </div>
        </CalculatorLayout>
    )
}

export default NumberBaseConverter
