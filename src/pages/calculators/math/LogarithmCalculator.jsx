import { useState, useMemo } from 'react'
import { SquareFunction } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function LogarithmCalculator() {
    const [value, setValue] = useState(100)
    const [base, setBase] = useState(10)
    const [mode, setMode] = useState('log')

    const results = useMemo(() => {
        if (mode === 'log') {
            // Calculate log
            if (value <= 0 || base <= 0 || base === 1) {
                return { error: 'Invalid input' }
            }
            const result = Math.log(value) / Math.log(base)
            return {
                result,
                log10: Math.log10(value),
                ln: Math.log(value),
                log2: Math.log2(value)
            }
        } else {
            // Calculate antilog (base^value)
            const result = Math.pow(base, value)
            return {
                result,
                exp10: Math.pow(10, value),
                expE: Math.exp(value),
                exp2: Math.pow(2, value)
            }
        }
    }, [value, base, mode])

    const formatNumber = (n) => {
        if (n > 1e10 || n < 1e-10) return n.toExponential(6)
        return n.toLocaleString(undefined, { maximumFractionDigits: 6 })
    }

    return (
        <CalculatorLayout
            title="Logarithm Calculator"
            description="Calculate logarithms and antilogarithms"
            category="Math"
            categoryPath="/math"
            icon={SquareFunction}
            result={results.error ? 'Error' : formatNumber(results.result)}
            resultLabel={mode === 'log' ? `log₍${base}₎(${value})` : `${base}^${value}`}
        >
            <div className="input-group">
                <label className="input-label">Mode</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="log">Logarithm (log)</option>
                    <option value="antilog">Antilogarithm (power)</option>
                </select>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">{mode === 'log' ? 'Value' : 'Exponent'}</label>
                    <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} step={0.1} />
                </div>
                <div className="input-group">
                    <label className="input-label">Base</label>
                    <input type="number" value={base} onChange={(e) => setBase(Number(e.target.value))} min={0.1} step={0.1} />
                </div>
            </div>
            {!results.error && (
                <div className="result-details">
                    {mode === 'log' ? (
                        <>
                            <div className="result-detail-row">
                                <span className="result-detail-label">log₍{base}₎({value})</span>
                                <span className="result-detail-value">{formatNumber(results.result)}</span>
                            </div>
                            <div className="result-detail-row">
                                <span className="result-detail-label">log₁₀({value})</span>
                                <span className="result-detail-value">{formatNumber(results.log10)}</span>
                            </div>
                            <div className="result-detail-row">
                                <span className="result-detail-label">ln({value})</span>
                                <span className="result-detail-value">{formatNumber(results.ln)}</span>
                            </div>
                            <div className="result-detail-row">
                                <span className="result-detail-label">log₂({value})</span>
                                <span className="result-detail-value">{formatNumber(results.log2)}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="result-detail-row">
                                <span className="result-detail-label">{base}^{value}</span>
                                <span className="result-detail-value">{formatNumber(results.result)}</span>
                            </div>
                            <div className="result-detail-row">
                                <span className="result-detail-label">10^{value}</span>
                                <span className="result-detail-value">{formatNumber(results.exp10)}</span>
                            </div>
                            <div className="result-detail-row">
                                <span className="result-detail-label">e^{value}</span>
                                <span className="result-detail-value">{formatNumber(results.expE)}</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </CalculatorLayout>
    )
}

export default LogarithmCalculator
