import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function InterestRateCalculator() {
    const [presentValue, setPresentValue] = useState(10000)
    const [futureValue, setFutureValue] = useState(15000)
    const [years, setYears] = useState(5)
    const [compounding, setCompounding] = useState('yearly')

    const results = useMemo(() => {
        if (presentValue <= 0 || futureValue <= 0 || years <= 0) {
            return {
                annualRate: 0,
                effectiveRate: 0,
                totalGain: 0,
                percentGain: 0
            }
        }

        let n = 1
        switch (compounding) {
            case 'daily': n = 365; break
            case 'weekly': n = 52; break
            case 'monthly': n = 12; break
            case 'quarterly': n = 4; break
            case 'semi-annually': n = 2; break
            default: n = 1
        }

        // Calculate rate: FV = PV * (1 + r/n)^(n*t)
        // r = n * ((FV/PV)^(1/(n*t)) - 1)
        const ratio = futureValue / presentValue
        const exponent = 1 / (n * years)
        const nominalRate = n * (Math.pow(ratio, exponent) - 1)

        // Effective annual rate: (1 + r/n)^n - 1
        const effectiveRate = Math.pow(1 + nominalRate / n, n) - 1

        // Simple growth metrics
        const totalGain = futureValue - presentValue
        const percentGain = ((futureValue - presentValue) / presentValue) * 100

        return {
            annualRate: nominalRate * 100,
            effectiveRate: effectiveRate * 100,
            totalGain,
            percentGain
        }
    }, [presentValue, futureValue, years, compounding])

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
            title="Interest Rate Calculator"
            description="Calculate the interest rate needed to reach your financial goal"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={`${results.annualRate.toFixed(2)}%`}
            resultLabel="Annual Interest Rate"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Starting Amount</label>
                    <input
                        type="number"
                        value={presentValue}
                        onChange={(e) => setPresentValue(Number(e.target.value))}
                        min={0}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Target Amount</label>
                    <input
                        type="number"
                        value={futureValue}
                        onChange={(e) => setFutureValue(Number(e.target.value))}
                        min={0}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Time Period (Years)</label>
                    <input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        min={1}
                        max={100}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Compounding</label>
                    <select value={compounding} onChange={(e) => setCompounding(e.target.value)}>
                        <option value="yearly">Yearly</option>
                        <option value="semi-annually">Semi-Annually</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                    </select>
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Nominal Rate</span>
                    <span className="result-detail-value">{results.annualRate.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Effective Annual Rate</span>
                    <span className="result-detail-value">{results.effectiveRate.toFixed(2)}%</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Gain</span>
                    <span className="result-detail-value">{formatCurrency(results.totalGain)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Percent Gain</span>
                    <span className="result-detail-value">{results.percentGain.toFixed(2)}%</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default InterestRateCalculator
