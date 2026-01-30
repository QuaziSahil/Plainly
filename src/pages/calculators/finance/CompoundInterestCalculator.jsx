import { useState, useMemo } from 'react'
import { TrendingUp } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function CompoundInterestCalculator() {
    const [principal, setPrincipal] = useState(10000)
    const [rate, setRate] = useState(7)
    const [time, setTime] = useState(10)
    const [compound, setCompound] = useState(12)
    const [contribution, setContribution] = useState(100)

    const results = useMemo(() => {
        const r = rate / 100
        const n = compound
        const t = time

        // A = P(1 + r/n)^(nt) + PMT × (((1 + r/n)^(nt) - 1) / (r/n))
        const compoundFactor = Math.pow(1 + r / n, n * t)
        const futureValue = principal * compoundFactor
        const contributionValue = contribution * ((compoundFactor - 1) / (r / n))

        const totalValue = futureValue + contributionValue
        const totalContributions = principal + (contribution * n * t)
        const totalInterest = totalValue - totalContributions

        return { totalValue, totalInterest, totalContributions }
    }, [principal, rate, time, compound, contribution])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value)
    }

    return (
        <CalculatorLayout
            title="Compound Interest"
            subtitle="Watch your money grow with compound interest"
            category="Finance"
            categoryPath="/finance"
            icon={TrendingUp}
            result={formatCurrency(results.totalValue)}
            resultLabel="Future Value"
        >
            <div className="input-group">
                <label className="input-label">Initial Investment</label>
                <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(Number(e.target.value))}
                    min={0}
                />
            </div>

            <div className="input-group">
                <label className="input-label">Monthly Contribution</label>
                <input
                    type="number"
                    value={contribution}
                    onChange={(e) => setContribution(Number(e.target.value))}
                    min={0}
                />
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Annual Rate (%)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        min={0}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Years</label>
                    <input
                        type="number"
                        value={time}
                        onChange={(e) => setTime(Number(e.target.value))}
                        min={1}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Compound Frequency</label>
                <select
                    value={compound}
                    onChange={(e) => setCompound(Number(e.target.value))}
                >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={365}>Daily</option>
                </select>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Contributions</span>
                    <span className="result-detail-value">{formatCurrency(results.totalContributions)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Interest Earned</span>
                    <span className="result-detail-value">{formatCurrency(results.totalInterest)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default CompoundInterestCalculator
