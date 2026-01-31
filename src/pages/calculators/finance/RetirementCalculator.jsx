import { useState, useMemo } from 'react'
import { Landmark } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function RetirementCalculator() {
    const [currentAge, setCurrentAge] = useState(30)
    const [retirementAge, setRetirementAge] = useState(65)
    const [currentSavings, setCurrentSavings] = useState(50000)
    const [monthlyContribution, setMonthlyContribution] = useState(500)
    const [annualReturn, setAnnualReturn] = useState(7)
    const [inflationRate, setInflationRate] = useState(2.5)

    const results = useMemo(() => {
        const yearsToRetirement = retirementAge - currentAge
        const monthsToRetirement = yearsToRetirement * 12
        const monthlyReturn = annualReturn / 100 / 12
        const realReturn = (1 + annualReturn / 100) / (1 + inflationRate / 100) - 1

        if (yearsToRetirement <= 0) {
            return {
                totalSavings: currentSavings,
                totalContributions: 0,
                interestEarned: 0,
                inflationAdjusted: currentSavings,
                monthlyRetirementIncome: 0
            }
        }

        // Future value with monthly compounding
        let balance = currentSavings
        const totalContributed = monthlyContribution * monthsToRetirement

        for (let i = 0; i < monthsToRetirement; i++) {
            balance = balance * (1 + monthlyReturn) + monthlyContribution
        }

        const interestEarned = balance - currentSavings - totalContributed

        // Inflation adjusted value
        const inflationAdjusted = balance / Math.pow(1 + inflationRate / 100, yearsToRetirement)

        // Estimated monthly income (4% rule, over 25 years)
        const monthlyRetirementIncome = inflationAdjusted * 0.04 / 12

        return {
            totalSavings: balance,
            totalContributions: totalContributed,
            interestEarned,
            inflationAdjusted,
            monthlyRetirementIncome
        }
    }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, inflationRate])

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
            title="Retirement Calculator"
            description="Plan your retirement savings and estimate future income"
            category="Finance"
            categoryPath="/finance"
            icon={Landmark}
            result={formatCurrency(results.totalSavings)}
            resultLabel="Retirement Savings"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Age</label>
                    <input
                        type="number"
                        value={currentAge}
                        onChange={(e) => setCurrentAge(Number(e.target.value))}
                        min={18}
                        max={100}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Retirement Age</label>
                    <input
                        type="number"
                        value={retirementAge}
                        onChange={(e) => setRetirementAge(Number(e.target.value))}
                        min={currentAge}
                        max={100}
                    />
                </div>
            </div>

            <div className="input-group">
                <label className="input-label">Current Savings</label>
                <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
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

            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Annual Return (%)</label>
                    <input
                        type="number"
                        value={annualReturn}
                        onChange={(e) => setAnnualReturn(Number(e.target.value))}
                        min={0}
                        max={20}
                        step={0.1}
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Inflation Rate (%)</label>
                    <input
                        type="number"
                        value={inflationRate}
                        onChange={(e) => setInflationRate(Number(e.target.value))}
                        min={0}
                        max={10}
                        step={0.1}
                    />
                </div>
            </div>

            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Contributions</span>
                    <span className="result-detail-value">{formatCurrency(results.totalContributions)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Interest Earned</span>
                    <span className="result-detail-value">{formatCurrency(results.interestEarned)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Inflation Adjusted</span>
                    <span className="result-detail-value">{formatCurrency(results.inflationAdjusted)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Monthly Income (4% Rule)</span>
                    <span className="result-detail-value">{formatCurrency(results.monthlyRetirementIncome)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default RetirementCalculator
