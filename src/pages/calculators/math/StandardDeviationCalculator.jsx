import { useState, useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function StandardDeviationCalculator() {
    const [dataInput, setDataInput] = useState('10, 20, 30, 40, 50')
    const [populationType, setPopulationType] = useState('sample')

    const results = useMemo(() => {
        // Parse input
        const numbers = dataInput
            .split(/[,\s]+/)
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n))

        if (numbers.length === 0) {
            return {
                count: 0,
                sum: 0,
                mean: 0,
                variance: 0,
                stdDev: 0,
                min: 0,
                max: 0,
                range: 0
            }
        }

        const count = numbers.length
        const sum = numbers.reduce((a, b) => a + b, 0)
        const mean = sum / count

        // Variance
        const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2))
        const sumSquaredDiffs = squaredDiffs.reduce((a, b) => a + b, 0)

        // Sample vs Population
        const divisor = populationType === 'sample' ? count - 1 : count
        const variance = divisor > 0 ? sumSquaredDiffs / divisor : 0
        const stdDev = Math.sqrt(variance)

        const min = Math.min(...numbers)
        const max = Math.max(...numbers)
        const range = max - min

        return {
            count,
            sum,
            mean,
            variance,
            stdDev,
            min,
            max,
            range
        }
    }, [dataInput, populationType])

    return (
        <CalculatorLayout
            title="Standard Deviation Calculator"
            description="Calculate standard deviation, variance, and statistics for a data set"
            category="Math"
            categoryPath="/math"
            icon={BarChart3}
            result={results.stdDev.toFixed(4)}
            resultLabel="Standard Deviation"
        >
            <div className="input-group">
                <label className="input-label">Data (comma or space separated)</label>
                <textarea
                    value={dataInput}
                    onChange={(e) => setDataInput(e.target.value)}
                    placeholder="Enter numbers: 1, 2, 3, 4, 5"
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: 'var(--space-4)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '16px',
                        color: 'var(--text-primary)',
                        resize: 'vertical'
                    }}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Type</label>
                <select value={populationType} onChange={(e) => setPopulationType(e.target.value)}>
                    <option value="sample">Sample (n-1)</option>
                    <option value="population">Population (n)</option>
                </select>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Count</span>
                    <span className="result-detail-value">{results.count}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Sum</span>
                    <span className="result-detail-value">{results.sum.toFixed(2)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Mean</span>
                    <span className="result-detail-value">{results.mean.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Variance</span>
                    <span className="result-detail-value">{results.variance.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Std Deviation</span>
                    <span className="result-detail-value">{results.stdDev.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Min / Max</span>
                    <span className="result-detail-value">{results.min} / {results.max}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Range</span>
                    <span className="result-detail-value">{results.range.toFixed(2)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default StandardDeviationCalculator
