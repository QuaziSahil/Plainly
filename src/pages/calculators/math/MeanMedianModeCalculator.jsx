import { useState, useMemo } from 'react'
import { BarChart3 } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function MeanMedianModeCalculator() {
    const [numbers, setNumbers] = useState('1, 2, 3, 4, 5, 5, 6, 7, 8, 9')

    const results = useMemo(() => {
        const nums = numbers.split(',')
            .map(n => parseFloat(n.trim()))
            .filter(n => !isNaN(n))
            .sort((a, b) => a - b)

        if (nums.length === 0) return { mean: 0, median: 0, mode: [], range: 0, count: 0, sum: 0 }

        const sum = nums.reduce((a, b) => a + b, 0)
        const mean = sum / nums.length

        let median
        const mid = Math.floor(nums.length / 2)
        if (nums.length % 2 === 0) {
            median = (nums[mid - 1] + nums[mid]) / 2
        } else {
            median = nums[mid]
        }

        const frequency = {}
        let maxFreq = 0
        nums.forEach(n => {
            frequency[n] = (frequency[n] || 0) + 1
            maxFreq = Math.max(maxFreq, frequency[n])
        })
        const mode = Object.keys(frequency)
            .filter(n => frequency[n] === maxFreq)
            .map(Number)

        const range = nums[nums.length - 1] - nums[0]

        return { mean, median, mode, range, count: nums.length, sum }
    }, [numbers])

    return (
        <CalculatorLayout
            title="Mean, Median, Mode"
            description="Calculate statistical measures"
            category="Math"
            categoryPath="/math"
            icon={BarChart3}
            result={results.mean.toFixed(2)}
            resultLabel="Mean"
        >
            <div className="input-group">
                <label className="input-label">Enter Numbers (comma-separated)</label>
                <textarea
                    value={numbers}
                    onChange={(e) => setNumbers(e.target.value)}
                    placeholder="1, 2, 3, 4, 5"
                    rows={3}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                />
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
                    <span className="result-detail-label">Mean (Average)</span>
                    <span className="result-detail-value">{results.mean.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Median</span>
                    <span className="result-detail-value">{results.median.toFixed(4)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Mode</span>
                    <span className="result-detail-value">{results.mode.join(', ') || 'None'}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Range</span>
                    <span className="result-detail-value">{results.range.toFixed(4)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default MeanMedianModeCalculator
