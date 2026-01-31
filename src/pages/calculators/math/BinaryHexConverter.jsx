import { useState, useMemo } from 'react'
import { Binary } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function BinaryHexConverter() {
    const [value, setValue] = useState('255')
    const [fromBase, setFromBase] = useState('decimal')

    const results = useMemo(() => {
        try {
            let decimalValue

            switch (fromBase) {
                case 'binary':
                    decimalValue = parseInt(value, 2)
                    break
                case 'octal':
                    decimalValue = parseInt(value, 8)
                    break
                case 'decimal':
                    decimalValue = parseInt(value, 10)
                    break
                case 'hexadecimal':
                    decimalValue = parseInt(value, 16)
                    break
                default:
                    decimalValue = 0
            }

            if (isNaN(decimalValue)) {
                return { error: 'Invalid input' }
            }

            return {
                binary: decimalValue.toString(2),
                octal: decimalValue.toString(8),
                decimal: decimalValue.toString(10),
                hexadecimal: decimalValue.toString(16).toUpperCase()
            }
        } catch {
            return { error: 'Invalid input' }
        }
    }, [value, fromBase])

    return (
        <CalculatorLayout
            title="Binary/Hex Converter"
            description="Convert between binary, octal, decimal, and hexadecimal"
            category="Math"
            categoryPath="/math"
            icon={Binary}
            result={results.error ? 'Error' : results.hexadecimal}
            resultLabel="Hexadecimal"
        >
            <div className="input-group">
                <label className="input-label">Input Base</label>
                <select value={fromBase} onChange={(e) => setFromBase(e.target.value)}>
                    <option value="binary">Binary (Base 2)</option>
                    <option value="octal">Octal (Base 8)</option>
                    <option value="decimal">Decimal (Base 10)</option>
                    <option value="hexadecimal">Hexadecimal (Base 16)</option>
                </select>
            </div>
            <div className="input-group">
                <label className="input-label">Value</label>
                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" style={{ fontFamily: 'monospace' }} />
            </div>
            {!results.error && (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">Binary (Base 2)</span>
                        <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.binary}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Octal (Base 8)</span>
                        <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.octal}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Decimal (Base 10)</span>
                        <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.decimal}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Hexadecimal (Base 16)</span>
                        <span className="result-detail-value" style={{ fontFamily: 'monospace' }}>{results.hexadecimal}</span>
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default BinaryHexConverter
