import { useState, useMemo } from 'react'
import { Percent } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function InterestCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(5)
    const [time, setTime] = useState(5)
    const [compounding, setCompounding] = useState('yearly')

    const results = useMemo(() => {
        const r = rate / 100
        let n = 1

        switch (compounding) {
            case 'daily': n = 365; break
            case 'weekly': n = 52; break
            case 'monthly': n = 12; break
            case 'quarterly': n = 4; break
            case 'semi-annually': n = 2; break
            default: n = 1
        }

        // Simple Interest
        const simpleInterest = principal * r * time
        const simpleTotal = principal + simpleInterest

        // Compound Interest
        const compoundTotal = principal * Math.pow(1 + r / n, n * time)
        const compoundInterest = compoundTotal - principal

        return {
            simpleInterest,
            simpleTotal,
            compoundInterest,
            compoundTotal
        }
    }, [principal, rate, time, compounding])

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
            title="Interest Calculator"
            description="Calculate simple and compound interest on your investments"
            category="Finance"
            categoryPath="/finance"
            icon={Percent}
            result={formatCurrency(results.compoundTotal)}
            resultLabel="Compound Total"
        >
            <div className="input-group">
                <label className="input-label">Principal Amount</label>
                <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    min={0}
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Interest Rate (%)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        min={0}
                        max={100}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Time (Years)</label>
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        min={1}
                        max={50}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Compounding Frequency</label>
                <select value={compounding} onChange={(e) => setCompounding(e.target.value)}>
                    <option value="yearly">Yearly</option>
                    <option value="semi-annually">Semi-Annually</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                </select>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Simple Interest</span>
                    <span className="result-detail-value">{formatCurrency(results.simpleInterest)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Simple Total</span>
                    <span className="result-detail-value">{formatCurrency(results.simpleTotal)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Compound Interest</span>
                    <span className="result-detail-value">{formatCurrency(results.compoundInterest)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Compound Total</span>
                    <span className="result-detail-value">{formatCurrency(results.compoundTotal)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default InterestCalculator
