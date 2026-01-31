import { useState, useMemo } from 'react'
import { Landmark } from 'lucide-react'
import CalculatorLayout from '../../../components/Calculator/CalculatorLayout'

function Calculator401k() {
    const [currentAge, setCurrentAge] = useState(30)
    const [retirementAge, setRetirementAge] = useState(65)
    const [currentBalance, setCurrentBalance] = useState(50000)
    const [annualContribution, setAnnualContribution] = useState(10000)
    const [employerMatch, setEmployerMatch] = useState(3)
    const [salary, setSalary] = useState(80000)
    const [expectedReturn, setExpectedReturn] = useState(7)

    const results = useMemo(() => {
        const years = retirementAge - currentAge
        const annualMatch = (employerMatch / 100) * salary
        const totalAnnualContribution = annualContribution + annualMatch
        const rate = expectedReturn / 100

        let balance = currentBalance
        for (let i = 0; i < years; i++) {
            balance = balance * (1 + rate) + totalAnnualContribution
        }

        const totalContributions = currentBalance + (totalAnnualContribution * years)
        const totalEarnings = balance - totalContributions

        return { finalBalance: balance, totalContributions, totalEarnings, monthlyIncome: balance * 0.04 / 12 }
    }, [currentAge, retirementAge, currentBalance, annualContribution, employerMatch, salary, expectedReturn])

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', maximumFractionDigits: 0
    }).format(val)

    return (
        <CalculatorLayout
            title="401k Calculator"
            description="Project your 401k retirement savings"
            category="Finance"
            categoryPath="/finance"
            icon={Landmark}
            result={formatCurrency(results.finalBalance)}
            resultLabel="Projected Balance"
        >
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Age</label>
                    <input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} min={18} max={80} />
                </div>
                <div className="input-group">
                    <label className="input-label">Retirement Age</label>
                    <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} min={50} max={90} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Current Balance</label>
                    <input type="number" value={currentBalance} onChange={(e) => setCurrentBalance(Number(e.target.value))} min={0} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Contribution</label>
                    <input type="number" value={annualContribution} onChange={(e) => setAnnualContribution(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-row">
                <div className="input-group">
                    <label className="input-label">Employer Match (%)</label>
                    <input type="number" value={employerMatch} onChange={(e) => setEmployerMatch(Number(e.target.value))} min={0} max={10} step={0.5} />
                </div>
                <div className="input-group">
                    <label className="input-label">Annual Salary</label>
                    <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} min={0} />
                </div>
            </div>
            <div className="input-group">
                <label className="input-label">Expected Return (%/year)</label>
                <input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} min={0} max={15} step={0.5} />
            </div>
            <div className="result-details">
                <div className="result-detail-row">
                    <span className="result-detail-label">Total Contributions</span>
                    <span className="result-detail-value">{formatCurrency(results.totalContributions)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Investment Earnings</span>
                    <span className="result-detail-value">{formatCurrency(results.totalEarnings)}</span>
                </div>
                <div className="result-detail-row">
                    <span className="result-detail-label">Est. Monthly Income (4%)</span>
                    <span className="result-detail-value">{formatCurrency(results.monthlyIncome)}</span>
                </div>
            </div>
        </CalculatorLayout>
    )
}

export default Calculator401k
