import { useState, useMemo } from 'react'
import { Divide } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function GCDLCMCalculator() {
    const [numbersInput, setNumbersInput] = useState('12, 18, 24')

    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b)
    const lcm = (a, b) => (a * b) / gcd(a, b)

    const results = useMemo(() => {
        const numbers = numbersInput
            .split(/[,\s]+/)
            .map(n => parseInt(n.trim()))
            .filter(n => !isNaN(n) && n > 0)

        if (numbers.length < 2) {
            return { gcd: 0, lcm: 0, numbers: [], valid: false }
        }

        let resultGCD = numbers[0]
        let resultLCM = numbers[0]

        for (let i = 1; i < numbers.length; i++) {
            resultGCD = gcd(resultGCD, numbers[i])
            resultLCM = lcm(resultLCM, numbers[i])
        }

        // Find factors
        const findFactors = (n) => {
            const factors = []
            for (let i = 1; i <= n; i++) {
                if (n % i === 0) factors.push(i)
            }
            return factors
        }

        return {
            gcd: resultGCD,
            lcm: resultLCM,
            numbers,
            factors: findFactors(resultGCD),
            valid: true
        }
    }, [numbersInput])

    return (
        <CalculatorLayout
            title="GCD & LCM Calculator"
            description="Find greatest common divisor and least common multiple"
            category="Math"
            categoryPath="/math"
            icon={Divide}
            result={results.valid ? `GCD: ${results.gcd}` : '—'}
            resultLabel="Result"
        >
            <div className="input-group">
                <label className="input-label">Numbers (comma or space separated)</label>
                <input
                    type="text"
                    value={numbersInput}
                    onChange={(e) => setNumbersInput(e.target.value)}
                    placeholder="12, 18, 24"
                />
            </div>
            {results.valid ? (
                <>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {results.numbers.map((n, i) => (
                            <span key={i} style={{
                                background: '#a78bfa20',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '14px'
                            }}>
                                {n}
                            </span>
                        ))}
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">GCD (Greatest Common Divisor)</span>
                            <span className="result-detail-value" style={{ color: '#10b981' }}>{results.gcd}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">LCM (Least Common Multiple)</span>
                            <span className="result-detail-value" style={{ color: '#a78bfa' }}>{results.lcm.toLocaleString()}</span>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>FACTORS OF GCD ({results.gcd})</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {results.factors.map((f, i) => (
                                <span key={i} style={{
                                    background: '#1a1a2e',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '13px'
                                }}>
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#f59e0b20',
                    padding: '12px',
                    borderRadius: '8px',
                    color: '#f59e0b',
                    fontSize: '14px'
                }}>
                    Enter at least 2 positive numbers
                </div>
            )}
        </CalculatorLayout>
    )
}

export default GCDLCMCalculator
