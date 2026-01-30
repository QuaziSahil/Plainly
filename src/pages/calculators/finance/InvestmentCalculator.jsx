import { useState, useMemo } from 'react'
import { PiggyBank } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function InvestmentCalculator() {
    const [initialInvestment, setInitialInvestment] = useState(10000)
    const [monthlyContribution, setMonthlyContribution] = useState(500)
    const [expectedReturn, setExpectedReturn] = useState(8)
    const [investmentPeriod, setInvestmentPeriod] = useState(20)

    const results = useMemo(() => {
        const r = expectedReturn / 100 / 12
        const n = investmentPeriod * 12

        const futureValueInitial = initialInvestment * Math.pow(1 + r, n)
        const futureValueContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r)

        const totalValue = futureValueInitial + futureValueContributions
        const totalContributions = initialInvestment + (monthlyContribution * n)
        const totalGains = totalValue - totalContributions

        return { totalValue, totalContributions, totalGains }
    }, [initialInvestment, monthlyContribution, expectedReturn, investmentPeriod])

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
            title="Investment Calculator"
            subtitle="Project your investment growth over time"
            category="Finance"
            categoryPath="/finance"
            icon={PiggyBank}
            result={formatCurrency(results.totalValue)}
            resultLabel="Future Value"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Initial Investment</label>
                    <input
                        type="number"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        min={0}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Monthly Contribution</label>
                    <input
                        type="number"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        min={0}
                    />
                </div>
            </div>

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Expected Return (%)</label>
                    <input
                        type="number"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(Number(e.target.value))}
                        min={0}
                        max={50}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Investment Period (Years)</label>
                    <input
                        type="number"
                        value={investmentPeriod}
                        onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                        min={1}
                        max={50}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Contributions</span>
                    <span className="result-detail-value">{formatCurrency(results.totalContributions)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Gains</span>
                    <span className="result-detail-value">{formatCurrency(results.totalGains)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default InvestmentCalculator
