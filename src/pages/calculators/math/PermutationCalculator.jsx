import { useState, useMemo } from 'react'
import { Shuffle } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PermutationCalculator() {
    const [n, setN] = useState(10)
    const [r, setR] = useState(3)
    const [mode, setMode] = useState('permutation')

    // Factorial function with BigInt for large numbers
    const factorial = (num) => {
        if (num < 0) return BigInt(0)
        if (num <= 1) return BigInt(1)
        let result = BigInt(1)
        for (let i = 2; i <= num; i++) {
            result *= BigInt(i)
        }
        return result
    }

    const results = useMemo(() => {
        if (n < 0 || r < 0 || r > n) {
            return { valid: false, error: 'r must be ≤ n and both non-negative' }
        }

        // Permutation: P(n,r) = n! / (n-r)!
        const permutation = factorial(n) / factorial(n - r)

        // Combination: C(n,r) = n! / (r!(n-r)!)
        const combination = factorial(n) / (factorial(r) * factorial(n - r))

        // Permutation with repetition: n^r
        const permRep = BigInt(n) ** BigInt(r)

        // Combination with repetition: C(n+r-1, r)
        const combRep = factorial(n + r - 1) / (factorial(r) * factorial(n - 1))

        // Format large numbers
        const formatBigInt = (val) => {
            const str = val.toString()
            if (str.length > 20) {
                return `${str.slice(0, 5)}...${str.slice(-5)} (${str.length} digits)`
            }
            return Number(val).toLocaleString()
        }

        return {
            valid: true,
            permutation: formatBigInt(permutation),
            combination: formatBigInt(combination),
            permRep: formatBigInt(permRep),
            combRep: formatBigInt(combRep),
            nFactorial: formatBigInt(factorial(n)),
            rFactorial: formatBigInt(factorial(r))
        }
    }, [n, r])

    const mainResult = results.valid
        ? (mode === 'permutation' ? results.permutation : results.combination)
        : 'Invalid'

    const formulaDisplay = mode === 'permutation'
        ? `P(${n},${r}) = ${n}! / (${n}-${r})!`
        : `C(${n},${r}) = ${n}! / (${r}! × (${n}-${r})!)`

    return (
        <CalculatorLayout
            title="Permutation & Combination"
            description="Calculate arrangements and selections"
            category="Math"
            categoryPath="/math"
            icon={Shuffle}
            result={mainResult}
            resultLabel={mode === 'permutation' ? 'Permutations' : 'Combinations'}
        >
            <div className="input-group">
                <label className="input-label">Calculate</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="permutation">Permutation (order matters)</option>
                    <option value="combination">Combination (order doesn't matter)</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">n (total items)</label>
                    <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} min={0} max={100} />
                </div>
                <div className="input-group">
                    <label className="input-label">r (items to select)</label>
                    <input type="number" value={r} onChange={(e) => setR(Number(e.target.value))} min={0} max={n} />
                </div>
            </div>
            {results.valid ? (
                <>
                    <div style={{
                        background: '#1a1a2e',
                        padding: '16px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginBottom: '16px',
                        fontFamily: 'monospace'
                    }}>
                        <div style={{ fontSize: '13px', opacity: 0.6, marginBottom: '8px' }}>{formulaDisplay}</div>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: '#a78bfa' }}>
                            {mainResult}
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                        <div style={{
                            background: mode === 'permutation' ? '#a78bfa20' : '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: mode === 'permutation' ? '1px solid #a78bfa40' : 'none'
                        }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>Permutation P({n},{r})</div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{results.permutation}</div>
                        </div>
                        <div style={{
                            background: mode === 'combination' ? '#a78bfa20' : '#1a1a2e',
                            padding: '12px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: mode === 'combination' ? '1px solid #a78bfa40' : 'none'
                        }}>
                            <div style={{ fontSize: '11px', opacity: 0.6 }}>Combination C({n},{r})</div>
                            <div style={{ fontSize: '14px', fontWeight: 600 }}>{results.combination}</div>
                        </div>
                    </div>
                    <div className="result-details">
                        <div className="result-detail-row">
                            <span className="result-detail-label">Perm with Repetition</span>
                            <span className="result-detail-value">{results.permRep}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">Comb with Repetition</span>
                            <span className="result-detail-value">{results.combRep}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">{n}!</span>
                            <span className="result-detail-value">{results.nFactorial}</span>
                        </div>
                        <div className="result-detail-row">
                            <span className="result-detail-label">{r}!</span>
                            <span className="result-detail-value">{results.rFactorial}</span>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{
                    background: '#ef444420',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    ⚠️ {results.error}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default PermutationCalculator
