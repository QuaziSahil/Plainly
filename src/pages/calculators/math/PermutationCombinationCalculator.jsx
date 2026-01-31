import { useState, useMemo } from 'react'
import { Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function PermutationCombinationCalculator() {
    const [n, setN] = useState(10)
    const [r, setR] = useState(3)

    const results = useMemo(() => {
        const factorial = (num) => {
            if (num <= 1) return 1
            let result = 1
            for (let i = 2; i <= num; i++) result *= i
            return result
        }

        if (r > n || n < 0 || r < 0) {
            return { error: 'r cannot be greater than n' }
        }

        // nPr = n! / (n-r)!
        const permutation = factorial(n) / factorial(n - r)

        // nCr = n! / (r! * (n-r)!)
        const combination = factorial(n) / (factorial(r) * factorial(n - r))

        // With repetition
        const permWithRep = Math.pow(n, r)
        const combWithRep = factorial(n + r - 1) / (factorial(r) * factorial(n - 1))

        return { permutation, combination, permWithRep, combWithRep }
    }, [n, r])

    const formatNumber = (num) => {
        if (num > 1e15) return num.toExponential(4)
        return num.toLocaleString()
    }

    return (
        <CalculatorLayout
            title="Permutation & Combination"
            description="Calculate nPr and nCr"
            category="Math"
            categoryPath="/math"
            icon={Percent}
            result={results.error ? 'Error' : formatNumber(results.combination)}
            resultLabel={`${n}C${r}`}
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">n (total items)</label>
                    <input type="number" value={n} onChange={(e) => setN(Number(e.target.value))} min={0} max={20} />
                </div>
                <div className="input-group">
                    <label className="input-label">r (items to choose)</label>
                    <input type="number" value={r} onChange={(e) => setR(Number(e.target.value))} min={0} max={20} />
                </div>
            </div>
            {!results.error && (
                <div className="result-details">
                    <div className="result-detail-row">
                        <span className="result-detail-label">{n}P{r} (Permutation)</span>
                        <span className="result-detail-value">{formatNumber(results.permutation)}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">{n}C{r} (Combination)</span>
                        <span className="result-detail-value">{formatNumber(results.combination)}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Perm. (w/ repetition)</span>
                        <span className="result-detail-value">{formatNumber(results.permWithRep)}</span>
                    </div>
                    <div className="result-detail-row">
                        <span className="result-detail-label">Comb. (w/ repetition)</span>
                        <span className="result-detail-value">{formatNumber(results.combWithRep)}</span>
                    </div>
                </div>
            )}
        </CalculatorLayout>
    )
}

export default PermutationCombinationCalculator
