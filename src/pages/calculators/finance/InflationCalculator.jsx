import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function InflationCalculator() {
    const [amount, setAmount] = useState(1000)
    const [inflationRate, setInflationRate] = useState(3)
    const [years, setYears] = useState(10)
    const [mode, setMode] = useState('future') // 'future' or 'past'

    const results = useMemo(() => {
        const rate = inflationRate / 100

        if (mode === 'future') {
            // What will today's money be worth in the future
            const futureValue = amount / Math.pow(1 + rate, years)
            const purchasingPowerLoss = amount - futureValue
            const percentLoss = (purchasingPowerLoss / amount) * 100

            return {
                adjustedValue: futureValue,
                difference: purchasingPowerLoss,
                percentChange: percentLoss,
                description: `${amount.toLocaleString()} today will have the purchasing power of`
            }
        } else {
            // What would past money be worth today
            const presentValue = amount * Math.pow(1 + rate, years)
            const difference = presentValue - amount
            const percentIncrease = (difference / amount) * 100

            return {
                adjustedValue: presentValue,
                difference,
                percentChange: percentIncrease,
                description: `${amount.toLocaleString()} from ${years} years ago is equivalent to`
            }
        }
    }, [amount, inflationRate, years, mode])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Inflation Calculator"
            description="Calculate how inflation affects purchasing power over time"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={formatCurrency(results.adjustedValue)}
            resultLabel="Adjusted Value"
        >
            <div className="input-group">
                <label className="input-label">Calculation Type</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="future">Future Value (Today → Future)</option>
                    <option value="past">Past Value (Past → Today)</option>
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Amount ($)</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={0}
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Inflation Rate (%)</label>
                    <input
                        type="number"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(Number(e.target.value))}
                        min={0}
                        max={50}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Years</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        min={1}
                        max={100}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Original Amount</span>
                    <span className="result-detail-value">{formatCurrency(amount)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Adjusted Value</span>
                    <span className="result-detail-value">{formatCurrency(results.adjustedValue)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Difference</span>
                    <span className="result-detail-value">{formatCurrency(results.difference)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Percent Change</span>
                    <span className="result-detail-value">{results.percentChange.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default InflationCalculator
