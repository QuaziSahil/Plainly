import { useState, useMemo } from 'react'
import { Hash } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RomanNumeralConverter() {
    const [mode, setMode] = useState('toRoman')
    const [arabicNumber, setArabicNumber] = useState(2024)
    const [romanInput, setRomanInput] = useState('MMXXIV')

    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ]

    const results = useMemo(() => {
        if (mode === 'toRoman') {
            let num = arabicNumber
            let result = ''
            for (const { value, numeral } of romanNumerals) {
                while (num >= value) {
                    result += numeral
                    num -= value
                }
            }
            return { output: result || 'N/A', valid: arabicNumber > 0 && arabicNumber <= 3999 }
        } else {
            const romanMap = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
            let result = 0
            const upper = romanInput.toUpperCase()
            for (let i = 0; i < upper.length; i++) {
                const curr = romanMap[upper[i]]
                const next = romanMap[upper[i + 1]]
                if (!curr) return { output: 'Invalid', valid: false }
                if (next && curr < next) {
                    result -= curr
                } else {
                    result += curr
                }
            }
            return { output: result.toString(), valid: result > 0 }
        }
    }, [mode, arabicNumber, romanInput])

    return (
        <CalculatorLayout
            title="Roman Numeral Converter"
            description="Convert between Arabic and Roman numerals"
            category="Math"
            categoryPath="/math"
            icon={Hash}
            result={results.output}
            resultLabel={mode === 'toRoman' ? 'Roman Numeral' : 'Arabic Number'}
        >
            <div className="input-group">
                <label className="input-label">Conversion Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="toRoman">Arabic → Roman</option>
                    <option value="toArabic">Roman → Arabic</option>
                </select>
            </div>
            {mode === 'toRoman' ? (
                <div className="input-group">
                    <label className="input-label">Arabic Number (1-3999)</label>
                    <input type="number" value={arabicNumber} onChange={(e) => setArabicNumber(Number(e.target.value))} min={1} max={3999} />
                </div>
            ) : (
                <div className="input-group">
                    <label className="input-label">Roman Numeral</label>
                    <input type="text" value={romanInput} onChange={(e) => setRomanInput(e.target.value.toUpperCase())} placeholder="MMXXIV" />
                </div>
            )}
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Result</span>
                    <span className="result-detail-value" style={{ color: results.valid ? 'inherit' : '#ef4444' }}>
                        {results.output}
                    </span>
                </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '12px', opacity: 0.6 }}>
                I=1, V=5, X=10, L=50, C=100, D=500, M=1000
            </div>
        </CalculatorLayout>
    )
}

export default RomanNumeralConverter
